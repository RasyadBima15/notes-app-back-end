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
    },
    {
        method: 'GET',
        path: '/notes',
        handler: handler.getNotesHandler,
    },
    {
        method: 'GET',
        path: '/notes/{id}',
        handler: handler.getNoteByIdHandler,
    },
    {
        method: 'PUT',
        path: '/notes/{id}',
        handler: handler.putNoteByIdHandler,
    },
    {
        method: 'DELETE',
        path: '/notes/{id}',
        handler: handler.deleteNoteByIdHandler,
    },
];
module.exports = routes;