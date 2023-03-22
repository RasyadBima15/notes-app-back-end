const NotesHandler = require("./handler");
const routes = require("./routes");

//pluginnya sendiri akan disimpan pada index.js
module.exports = {
    name: 'notes',
    version: '1.0.0',
    //Fungsi register ini akan dijalankan ketika plugin dipasang pada Hapi server.
    register: async (server, {service}) => {
        const notesHandler =  new NotesHandler(service);
        server.route(routes(notesHandler)) //Selanjutnya, daftarkan routes yang sudah kita buat pada server Hapi
    }
}