// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();
 
const hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');
 
// notes
const notes = require('./api/notes');
const NotesService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');
 
// users
const users = require('./api/users');
const UserService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');
 
// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');
 
// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');


// Exports
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

// uploads
const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

const init = async () => {
    const collaborationsService = new CollaborationsService();
    const notesService = new NotesService(collaborationsService);
    const usersService = new UserService();
    const authenticationsService = new AuthenticationsService();
    const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));
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
        },
        {
            plugin: Inert,
        },
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
                authenticationsService: authenticationsService,
                usersService: usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            }
        },
        {
            plugin: collaborations,
            options: {
              collaborationsService,
              notesService,
              validator: CollaborationsValidator,
            },
        },
        {
            plugin: _exports,
            options: {
              service: ProducerService,
              validator: ExportsValidator,
            },
        },
        {
            plugin: uploads,
            options: {
              service: storageService,
              validator: UploadsValidator,
            },
        },
    ]);
    
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};
init();