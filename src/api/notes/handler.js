class NotesHandler {
    constructor(service) {
        this._service = service;
        this.postNoteHandler = this.postNoteHandler.bind(this);
        this.getNotesHandler = this.getNotesHandler.bind(this);
        this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
        this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
        this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
        //Fungsi bind adalah member dari Function.prototype di mana setiap function JavaScript dapat mengakses fungsi ini. Fungsi bind berfungsi untuk mengikat implementasi function agar ia tetap memiliki konteks sesuai nilai yang ditetapkan pada argumen yang diberikan pada fungsi bind tersebut.
        //Jadi dengan menuliskan kode di atas, itu berarti kita mengikat konteks this agar tetap bernilai instance dari NotesHandler (ini dilakukan karena keyword this digunakan di constructor di mana ia masih bernilai instance NotesHandler).

        //kalau tidak menggunakan bind, maka this._service menjadi instance dari objek handler di routes dan menyebabkan error
    }
    postNoteHandler(request, h){
        try {
            const {title = 'untitled', body, tags} = request.payload;

            const noteID = this._service.addNote({title, body, tags});

            const response = h.response({
                status: 'success',
                message: 'Catatan berhasil ditambahkan',
                data: {
                    noteID,
                },
            });
            response.code(201);
            return response
        } catch (error) {
           const response = h.response({
            status: 'fail',
            message: error.message,
           }) 
           response.code(400);
           return response
        }
    }
    getNotesHandler(){
        const notes = this._service.getNotes();
        return {
            status: 'success',
            data: {
                notes,
            },
        };
    }
    getNoteByIdHandler(request, h){
        try {
            const {id} = request.params;
            const note = this._service.getNoteById(id);
            return {
                status: 'success',
                data: {
                    note,
                },
            };
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(404);
            return response;
        }
    }
    putNoteByIdHandler(request, h){
        try {
            const {id} = request.params;
            this._service.editNoteById(id, request.payload); //request.payload = {title, body, tags}
            return {
                status: 'success',
                message: 'Catatan berhasil diperbarui',
            };
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(404);
            return response;
        }
    }
    deleteNoteByIdHandler(request, h){
        try {
            const {id} = request.params;
            this._service.deleteNoteById(id);
            return {
                status: 'success',
                message: 'Catatan berhasil dihapus',
            };  
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            })
            response.code(404);
            return response;
        }
    }
}
module.exports = NotesHandler;