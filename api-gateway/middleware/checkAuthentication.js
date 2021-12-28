const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        // TODO: Call to user service to check the token
        // const decoded = jwt.verify(token, process.env.JWT_KEY);
        // res.locals.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Authentication failed.'
        });
    }
};