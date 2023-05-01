//karena menggunakan plugin, kita akan menggunakan pendekatan yang berbeda. Kita tidak akan menggunakan fungsi-fungsi handler dari hasil impor secara langsung, melainkan handler yang akan digunakan pada route kali ini dimasukkan sebagai parameter fungsi.
const routes = (handler) => [
    {
        method: 'POST',
        path: '/notes',
        handler: handler.postNoteHandler,
        //With Hapi, CORS can be set on specific routes by adding the options.cors property in the route configuration. Examples like this:
        // options: {
        //     cors: {
        //         origin: ['*'],
        //     },
        // },
        options: { //to protect the resource we add authentication process in this routes
            auth: 'notesapp_jwt',
        }
    },
    {
        method: 'GET',
        path: '/notes',
        handler: handler.getNotesHandler,
        options: {
            auth: 'notesapp_jwt',
        }
    },
    {
        method: 'GET',
        path: '/notes/{id}',
        handler: handler.getNoteByIdHandler,
        options: {
            auth: 'notesapp_jwt',
        }
    },
    {
        method: 'PUT',
        path: '/notes/{id}',
        handler: handler.putNoteByIdHandler,
        options: {
            auth: 'notesapp_jwt',
        }
    },
    {
        method: 'DELETE',
        path: '/notes/{id}',
        handler: handler.deleteNoteByIdHandler,
        options: {
            auth: 'notesapp_jwt',
        }
    },
];
module.exports = routes;