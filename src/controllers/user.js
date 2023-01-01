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
    )}/users/confirmemail?token=${confirmEmailToken}`;
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
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
        success: true,
        token,
    });
};