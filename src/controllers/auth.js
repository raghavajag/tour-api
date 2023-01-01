const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Logger = require('../utils/Logger');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

exports.register = async function (req, res, next) {
    let guideRoles = null;
    const { name, email, password, role } = req.body;

    // check if the user provides a product key
    const productKey = req.body.productKey;
    if (productKey) {
        const decoded = jwt.verify(productKey, process.env.JWT_SECRET);
        if (decoded.email != email) {
            Logger.logToDb("email_not_matched", `${email} ${decoded.email}[Provided by Admin]`, "")
            return next(new ErrorResponse("Email does not match", 400));
        }
        guideRoles = decoded.role;

    }
    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role: guideRoles ? guideRoles : role
    });
    const confirmEmailToken = user.generateEmailConfirmToken();

    // Create reset url
    const confirmEmailURL = `${req.protocol}://${req.get(
        'host',
    )}/auth/confirmemail?token=${confirmEmailToken}`;
    const message = `You are receiving this email because you need to confirm your email address. Please make a GET request to: \n\n ${confirmEmailURL}`;

    // Save the user to the database
    try {
        user.save({ validateBeforeSave: false });
        await sendEmail({
            email: user.email,
            subject: 'Email confirmation token',
            message,
        });
        Logger.logToDb("user_created", `${name} ${email}`, user.id);
        return sendTokenResponse(user, 200, res);
    } catch (err) {
        next(new ErrorResponse(err.message, 400))
    }
}


exports.login = async function (req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        Logger.logToDb("invalid_logins", `${user.email}`, user.id);
        return next(new ErrorResponse("Invalid Email/Password", 401));
    }
    if (!user.isEmailVerified) {
        Logger.logToDb("verify_email", `${user.email}`, user.id);
        return next(new ErrorResponse("Please Verify your Email", 400));
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        Logger.logToDb("invalid_password", `${user.email}`, user.id);
        return next(new ErrorResponse("Invalid Password", 401));
    }
    return sendTokenResponse(user, 200, res);

}
exports.confirmEmail = async function (req, res, next) {
    // grab token from email
    const { token } = req.query;

    if (!token) {
        return next(new ErrorResponse('Invalid Token', 400));
    }

    const splitToken = token.split('.')[0];
    const confirmEmailToken = crypto
        .createHash('sha256')
        .update(splitToken)
        .digest('hex');

    // get user by token
    const user = await User.findOne({
        confirmEmailToken,
        isEmailVerified: false,
    });

    if (!user) {
        return next(new ErrorResponse('Invalid Token', 400));
    }

    // update confirmed to true
    user.confirmEmailToken = undefined;
    user.isEmailVerified = true;

    // save
    user.save({ validateBeforeSave: false });

    Logger.logToDb("email_confirmed", `${user.email}`, user.id);

    // return token
    return sendTokenResponse(user, 200, res);
}
exports.updatePassword = async function (req, res, next) {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Password is incorrect', 401));
    }
    user.password = req.body.newPassword;
    await user.save();
    Logger.logToDb("password_updated", `${user.email}`, user.id);
    sendTokenResponse(user, 200, res);
}
exports.forgotPassword = async function (req, res, next) {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorResponse('There is no user with that email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
        'host',
    )}/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message,
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse('Email could not be sent', 500));
    }
};


exports.resetPassword = async function (req, res, next) {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorResponse('Invalid token', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    Logger.logToDb("reset_password", `${user.email}`, user.id);
    sendTokenResponse(user, 200, res);
};

const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
        success: true,
        token,
    });
};