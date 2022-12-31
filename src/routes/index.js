const APP_START_TIME = Date.now();
// const API_ROUTE_MAP = {
//     "/users": users,
// };

function addApiRoutes(app) {
    app.get(
        "/",
        async (req, res) => {
            return res.json({
                uptime: Date.now() - APP_START_TIME,
            });
        }
    );
    // _.each(API_ROUTE_MAP, (router, route) => {
    //     const apiRoute = `${BASE_ROUTE}${route}`;
    //     app.use(apiRoute, router);
    // });

}
module.exports = addApiRoutes;