const Hapi = require("@hapi/hapi");
const routes = require("./routes");

const init = async () => {
    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
        //If you want a wider scope, alias CORS is enabled for all routes on the server, you can specify CORS in the configuration when you want to create a server by adding the routes.cors property. Examples like this:
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });
    server.route(routes);
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};
init();