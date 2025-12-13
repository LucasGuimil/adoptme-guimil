import listError from "../../services/errors/list.error.js";

export default (error, req, res, next) => {
    req.logger.warning(error.message)
    switch (error.code) {
        case listError.INVALID_TYPES_ERROR:
            res.status(400).send({ status: "error", error: error.message })
            break
        case listError.INVALID_REQUEST:
            res.status(404).send({ status: "error", error: error.message })
            break
        default:
            res.status(400).send({ status: "error", error: "Unhandled error" })
            break
    }
}