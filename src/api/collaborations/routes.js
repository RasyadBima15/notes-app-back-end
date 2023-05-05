const routes = (handler) => [
    {
        method: 'POST',
        path: '/collaborations',
        handler: handler.postCollaborationHandler,
        options: {
            auth: 'notesapp_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/collaborations',
        handler: handler.deleteCollaboratorHandler,
        options: {
            auth: 'notesapp_jwt',
        },
    },
];
module.exports = routes;