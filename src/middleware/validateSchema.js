const validateBody = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        console.log(error);
        if (error) {
            const errors = error.details.map((errorDetail) => ({
                field: errorDetail.path.join('.'),
                message: errorDetail.message,
            }));

            return res.status(400).json({
                errors,
                success: false
            });
        }

        return next();
    };
};
const validateParams = (schema) => {
    return (req, res, next) => {
        console.log(req.query);
        const { error } = schema.validate(req.params, { abortEarly: false });
        console.log(error);
        if (error) {
            const errors = error.details.map((errorDetail) => ({
                field: errorDetail.path.join('.'),
                message: errorDetail.message,
            }));

            return res.status(400).json({
                errors,
                success: false
            });
        }

        return next();
    };
};

module.exports = { validateBody, validateParams };