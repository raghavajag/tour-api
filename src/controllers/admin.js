const jwt = require('jsonwebtoken');
const Logger = require('../utils/Logger');

exports.getProductkey = async function (req, res, next) {
    const productKey = jwt.sign({ email: req.body.email, role: req.body.role }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_PRODUCT_KEY,
    });
    Logger.logToDb("productKey_created", `${req.user.name} ${req.user.email}`, req.user.id);

    return res.json({ token: productKey });
} 