const hapi = require("@hapi/hapi");
const notes = require("./api/notes");
const NotesService = require("./services/postgres/NotesService");
const NotesValidator = require("./validator/notes");
require('dotenv').config();

const init = async () => {
    const notesService = new NotesService();
    const server = hapi.server({
        port: process.env.PORT,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        //If you want a wider scope, alias CORS is enabled for all routes on the server, you can specify CORS in the configuration when you want to create a server by adding the routes.cors property. Examples like this:
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });
    //daftarkan plugin notes dengan options.service bernilai notesService menggunakan perintah await server.register tepat sebelum kode await server.start().
    //Pada Hapi server, kita dapat mendaftarkan banyak plugin sekaligus atau satu per satu melalui method await server.register(). Bila Anda hanya mendaftarkan satu plugin saja, cukup gunakan method tersebut dengan memberikan parameter objek yang memiliki properti plugin dan options.
    await server.register({
        plugin: notes,
        options: {
            service: notesService,
            validator: NotesValidator,
        },
    });
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};
init();