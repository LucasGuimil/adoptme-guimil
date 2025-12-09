export default class CustomError extends Error{
    constructor(message, name, code, cause){
        super(message)
        this.name = name
        this.code= code
        this.cause = cause
        Error.captureStackTrace(this, this.constructor)
    }
}