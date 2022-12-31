const APP_START_TIME = Date.now();
const asyncHandler = require('../middleware/async');
const users = require('./user');
const admin = require('./admin');
const ErrorResponse = require('../utils/errorResponse');

const API_ROUTE_MAP = {
    "/users": users,
    "/admin": admin
};

function addApiRoutes(app) {
    app.get(
        "/",
        asyncHandler(async (req, res) => {
            return res.json({
                msg: "OK",
                uptime: Date.now() - APP_START_TIME,
            })
        })
    );
    Object.keys(API_ROUTE_MAP).forEach(route => {
        const apiRoute = `${route}`;
        app.use(apiRoute, API_ROUTE_MAP[route]);
    });
    app.use(
        asyncHandler(async (req, res, next) => {
            next(new ErrorResponse("Not Found", 404))
        })
    );
}
module.exports = addApiRoutes;
