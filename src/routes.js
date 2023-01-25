const {addNoteHandler, getAllNotesHandler, getNoteByIdHandler,editNoteByIdHandler,deleteNoteByIdHandler} = require("./handler")
const routes = [
    {
        method: 'POST',
        path: '/notes',
        handler: addNoteHandler,
        //With Hapi, CORS can be set on specific routes by adding the options.cors property in the route configuration. Examples like this:
        // options: {
        //     cors: {
        //         origin: ['*'],
        //     },
        // },
    },
    {
        method: 'GET',
        path: '/notes',
        handler: getAllNotesHandler,
    },
    {
        method: 'GET',
        path: '/notes/{id}',
        handler: getNoteByIdHandler,
    },
    {
        method: 'PUT',
        path: '/notes/{id}',
        handler: editNoteByIdHandler,
    },
    {
        method: 'DELETE',
        path: '/notes/{id}',
        handler: deleteNoteByIdHandler,
    },
];
module.exports = routes;