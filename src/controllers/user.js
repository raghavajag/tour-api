const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Logger = require('../utils/Logger');
const jwt = require('jsonwebtoken');

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
    // Save the user to the database
    try {
        await user.save();
        const token = user.getSignedJwtToken();
        res.status(201).json({ message: 'User created successfully', token });
        Logger.logToDb("user_created", `${name} ${email}`, user.id);

    } catch (err) {
        next(new ErrorResponse(err.message, 400))
    }
}


exports.login = async function (req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        next(new ErrorResponse("Invalid Password", 401));
    }
    sendTokenResponse(user, 200, res);

}

const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    return res.status(statusCode).json({
        success: true,
        token,
    });
};