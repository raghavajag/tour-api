const APP_START_TIME = Date.now();
// const Logger = require('../utils/Logger');
const users = require('./user');

const API_ROUTE_MAP = {
    "/users": users,
};

function addApiRoutes(app) {
    app.get(
        "/",
        async (req, res) => {
            // Logger.logToDb(
            //     "/ root route", "testing logger", Date.now() - APP_START_TIME
            // );
            return res.json({
                uptime: Date.now() - APP_START_TIME,
            });
        }
    );
    Object.keys(API_ROUTE_MAP).forEach(route => {
        const apiRoute = `${route}`;
        app.use(apiRoute, API_ROUTE_MAP[route]);
    });

}
module.exports = addApiRoutes;
