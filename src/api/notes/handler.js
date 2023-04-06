const ClientError = require("../../exceptions/ClientError");

class NotesHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
        this.postNoteHandler = this.postNoteHandler.bind(this);
        this.getNotesHandler = this.getNotesHandler.bind(this);
        this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
        this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
        this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
        //Fungsi bind adalah member dari Function.prototype di mana setiap function JavaScript dapat mengakses fungsi ini. Fungsi bind berfungsi untuk mengikat implementasi function agar ia tetap memiliki konteks sesuai nilai yang ditetapkan pada argumen yang diberikan pada fungsi bind tersebut.
        //Jadi dengan menuliskan kode di atas, itu berarti kita mengikat konteks this agar tetap bernilai instance dari NotesHandler (ini dilakukan karena keyword this digunakan di constructor di mana ia masih bernilai instance NotesHandler).

        //kalau tidak menggunakan bind, maka this._service menjadi instance dari objek handler di routes dan menyebabkan error
    }
    async postNoteHandler(request, h){ //Karena operasi CRUD dari NotesService kini berjalan secara asynchronous, maka kita perlu sedikit melakukan perubahan pada fungsi handler yang menggunakan service tersebut.
        try {
            this._validator.validateNotePayload(request.payload);
            const {title = 'untitled', body, tags} = request.payload;

            const noteID = await this._service.addNote({title, body, tags});

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
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                }) 
                response.code(error.statusCode);
                return response
            }

            //Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.log(error); //Maka dari itu, pada server error, kita bisa log error tersebut menggunakan console.error() sebelum mengembalikan response agar error yang terjadi bisa kita lihat pada Terminal proyek.
            return response;
        }
    }
    async getNotesHandler(){
        const notes = await this._service.getNotes();
        return {
            status: 'success',
            data: {
                notes,
            },
        };
    }
    async getNoteByIdHandler(request, h){
        try {
            const {id} = request.params;
            const note = await this._service.getNoteById(id);
            return {
                status: 'success',
                data: {
                    note,
                },
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                  status: 'fail',
                  message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
    async putNoteByIdHandler(request, h){
        try {
            this._validator.validateNotePayload(request.payload);
            const {id} = request.params;
            await this._service.editNoteById(id, request.payload); //request.payload = {title, body, tags}
            return {
                status: 'success',
                message: 'Catatan berhasil diperbarui',
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                  status: 'fail',
                  message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
    async deleteNoteByIdHandler(request, h){
        try {
            const {id} = request.params;
            await this._service.deleteNoteById(id);
            return {
                status: 'success',
                message: 'Catatan berhasil dihapus',
            };  
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                  status: 'fail',
                  message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
}
module.exports = NotesHandler;