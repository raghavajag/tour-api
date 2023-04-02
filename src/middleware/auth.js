const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/ErrorResponse');
const redisClient = require('../utils/connectRedis');

async function getToken(id) {
    try {
        return redisClient.get(id.toString())

    } catch (error) {
        console.log(error);
    }
}
// Protect routes
exports.protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new ErrorResponse("Not Authorized", 401));
    }
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        req.token = token;
        try {
            const data = await getToken('BL_' + req.user.id.toString());
            if (data && data === token) return res.status(401).json({ success: false, message: "blacklisted token." });
        } catch (error) {
            console.log(error);
        }
        next();
    } catch (err) {
        return next(new ErrorResponse("Not Authorized", 401));
    }
};

exports.verifyRefreshToken = async function (req, res, next) {
    const token = req.body.token;
    if (token === null) return res.status(401).json({ success: false, message: "Invalid request." });
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        req.user = { id: decoded.id, role: decoded.role };
        let data = await getToken(req.user.id);
        data = JSON.parse(data);
        if (data.token != token) return res.status(401).json({ success: false, message: "Invalid request. Token is not same in store." });
        next();
    } catch (error) {
        return res.status(401).json({ success: true, message: "Your session is not valid.", data: error });
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role '${req.user.role}' is not authorized to access this route`, 401));
        }
        next();
    };
};