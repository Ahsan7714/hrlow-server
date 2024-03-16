const jwt = require('jsonwebtoken')

const verifyUser = (req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.json({Error:"user not authenticated"})
    } else{
        jwt.verify(token,'jwt-secret-key',(err,decoded)=>{
            if(err){
                return res.json({Error : 'invalid token'})
            }
            req.email = decoded.email;
            req.id = decoded.id;
            next();
        })
    }
}

module.exports = verifyUser