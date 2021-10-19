const { validationResult } = require("express-validator");

const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req).array();
    if(errors.length == 0){
        next();
    }
    else{
        return res.status(400).json({   
            message: "Some required fileds are missing",
            errors
        })
    }
}


module.exports = validationMiddleware