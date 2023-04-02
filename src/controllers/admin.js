const jwt = require('jsonwebtoken');

exports.getProductkey = async function (req, res, next) {
    const productKey = jwt.sign({ email: req.body.email, role: req.body.role }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_PRODUCT_KEY,
    });

    return res.json({ token: productKey });
} 