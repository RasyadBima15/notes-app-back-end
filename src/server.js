const hapi = require("@hapi/hapi");
const Jwt = require('@hapi/jwt');
const notes = require("./api/notes");
const NotesService = require("./services/postgres/NotesService");
const NotesValidator = require("./validator/notes");
require('dotenv').config();
const users = require('./api/users');
const UserService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users/')
const authentications = require('./api/authentications');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsService = require("./services/postgres/AuthenticationsService");
const AuthenticationsValidator = require("./validator/authentications");

const init = async () => {
    const notesService = new NotesService();
    const usersService = new UserService();
    const authencationsService = new AuthenticationsService();
    const server = hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        //If you want a wider scope, alias CORS is enabled for all routes on the server, you can specify CORS in the configuration when you want to create a server by adding the routes.cors property. Examples like this:
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });
    //registrasi plugin eksternal
    await server.register([
        {
            plugin: Jwt,
        }
    ]);

    //mendefiniskan strategi autentikasi jwt
    server.auth.strategy('notesapp_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });
    //daftarkan plugin notes dengan options.service bernilai notesService menggunakan perintah await server.register tepat sebelum kode await server.start().
    //Pada Hapi server, kita dapat mendaftarkan banyak plugin sekaligus atau satu per satu melalui method await server.register(). Bila Anda hanya mendaftarkan satu plugin saja, cukup gunakan method tersebut dengan memberikan parameter objek yang memiliki properti plugin dan options.
    await server.register([
        {
        plugin: notes,
        options: {
            service: notesService,
            validator: NotesValidator,
            },
        },
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator,
            }
        },
        {
            plugin: authentications,
            options: {
                authenticationsService: authencationsService,
                usersService: usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            }
        },
    ]);
    
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};
init();