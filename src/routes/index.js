const APP_START_TIME = Date.now();
const asyncHandler = require('../middleware/async');
const auth = require('./auth');
const admin = require('./admin');
const tour = require('./tour');
const ErrorResponse = require('../utils/ErrorResponse');

const API_ROUTE_MAP = {
    "/admin": admin,
    "/auth": auth,
    "/tour": tour
};

function addApiRoutes(app) {
    app.get(
        "/",
        asyncHandler(async (req, res) => {
            return res.json({
                uptime: Date.now() - APP_START_TIME,
                apiDocs: 'https://documenter.getpostman.com/view/11141903/2s8Z6zzC3Y'
            })
        })
    );
    Object.keys(API_ROUTE_MAP).forEach(route => {
        const apiRoute = `${route}`;
        app.use(apiRoute, API_ROUTE_MAP[route]);
    });
    app.use(
        asyncHandler(async (req, res, next) => {
            return next(new ErrorResponse("Not Found", 404))
        })
    );
}
module.exports = addApiRoutes;