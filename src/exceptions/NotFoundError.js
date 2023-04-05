const ClientError = require("./ClientError");

class NotFoundError extends ClientError {
    constructor(message){
        super(message, 404); //404 sebagai status code
        this.name = 'NotFoundError';
    }
}
module.exports = NotFoundError;