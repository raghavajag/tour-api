const express = require('express');

const User = require('../models/User');
const Logger = require('../utils/Logger');

const router = express.Router();


// Route to register Tour Guides and User 
router.post('/register', async (req, res) => {
    try {
        let guideRoles = null;
        const { name, email, password, role } = req.body;

        // check if the user provides a product key
        const productKey = req.body.productKey;
        if (productKey) {
            const decoded = jwt.verify(productKey, process.env.JWT_SECRET);
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
            console.log(token);
            res.status(201).json({ message: 'User created successfully', token });
        } catch (err) {
            Logger.error(error.message);
            // Logger.error(err);
            res.status(400).json({ error: err.message });
        }
    } catch (error) {
        Logger.error(error.message)
        return res.status(400).json({ error: error.message });
    }

})

module.exports = router;
