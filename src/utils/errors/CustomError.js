export default class CustomError{
    static createError({name,cause,message,code}){
        const e = new Error(message,{cause})
        e.name = name
        e.code = code
        throw e
    }
}