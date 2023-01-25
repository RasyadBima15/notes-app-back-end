const { nanoid } = require("nanoid");
const notes = require("./notes");

const addNoteHandler = (request,h) => {
    const {title, tags, body} = request.payload;
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const newNote = {
        title, tags, body, id, createdAt, updatedAt,
    };
    notes.push(newNote);
    //Then, how to determine whether newNote is included in the notes array? Easy! We can use the filter() method based on the record id to find out.
    const isSuccess = notes.filter((note) => note.id === id).length > 0;
    //Then, we use isSuccess to determine the response the server gave us. If isSuccess evaluates to true, then give a success response. If false, then give a failure response.
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteID: id,
            },
        });
        // response.header('Access-Control-Allow-Origin', 'http://notesapp-v1.dicodingacademy.com');
        //On the web server, we only need to provide the header value 'Access-Control-Allow-Origin' with an external origin value that will consume the data (client application).
        response.code(201);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
    });
    // response.header('Access-Control-Allow-Origin', '*');
    //Or you can use an * in the origin value to allow data to be consumed by all origins.
    response.code(500);
    return response

};
const getAllNotesHandler = (request,h) => {
    //Create a function called getAllNotesHandler and return data with the value notes in it.
    return {
        status: 'success',
        data: {
            notes,
        },
    };
};
const getNoteByIdHandler = (request,h) => {
    //Inside this function we have to return a specific record object based on the id used by the path parameter.
    //First, we get the id value from request.params.
    const {id} = request.params;
    const note = notes.filter((n) => n.id === id)[0];
    //After getting the id value, get the note object with that id from the notes array object. Take advantage of the array filter() method to get the object.

    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }
    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    });
    response.code(404);
    return response
};
const editNoteByIdHandler = (request,h) => {
    const {id} = request.params;
    const {title, tags, body} = request.payload;
    const updatedAt = new Date().toISOString();
    //it's time to replace the old records with the latest data. We will change it by using the indexing array, please use another technique if you think it's better.
    //First, first get the array index on the record object according to the specified id. To do this, use the findIndex() array method.
    const index = notes.findIndex((note) => note.id === id);
    //If the note with the id you are looking for is found, index will be the array index of the note object you are looking for. But if not found, then the index is worth -1. So, we can determine whether or not the request failed from the index value using an if else.
    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            //The spread operator in the code above is used to preserve the notes[index] value which doesn't need to be changed.
            title,
            tags,
            body,
            updatedAt,
        };
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbarui',
        })
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};
const deleteNoteByIdHandler = (request,h) => {
    const {id} = request.params;
    const index = notes.findIndex((note) => note.id === id );
    if (index !== -1) {
        //Check the index value, make sure the value is not -1 if you want to delete the record. Now, to delete data in an array based on index, use the array splice() method.
        notes.splice(index,1);
        const response = h.response({
            status: 'success',
            message:  'Catatan berhasil dihapus'
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
};
module.exports = {addNoteHandler,getAllNotesHandler,getNoteByIdHandler,editNoteByIdHandler,deleteNoteByIdHandler};
//Then to export this handler function, we use object literals. This is intended to make it easy to export more than one value in a single JavaScript file.