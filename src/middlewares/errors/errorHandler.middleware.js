import eErrors from "../../services/errors/list.error.js";

export default (error,req,res,next)=>{
    req.logger.error(error.cause)
    switch (error.code) {
        case eErrors.INVALID_PARAM_ERROR:
            res.status(400).send({status: "error",error: error.name})
            break
        case eErrors.INVALID_TYPES_ERROR:
            res.status(400).send({status: "error",error: error.name})
            break
        default:
            res.status(400).send({status: "error", error: "Unhandled error"})
            break
    }
}