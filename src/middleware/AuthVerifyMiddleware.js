const {expressjwt} = require('express-jwt');
const UserModel = require('../models/user/User');

exports.AuthVerifyMiddleware = expressjwt({
    secret: process.env.TOKEN_SECRET,
    algorithms: ["HS256"]
})

exports.isSuperAdmin = async (req, res, next)=>{
    try {

        const id = req.auth?._id;
      const user = await UserModel.findById(id);

      if (user.role !== 'superadmin'){
          return res.status(403).json({
              error: "You can't access"
          })
      }
      next();

    }catch (e) {
        res.status(403).json({
            error: "Server error occurred"
        })
    }
}

exports.isAdmin = async (req, res, next)=>{
    try {

        const id = req.auth?._id;
        const user = await UserModel.findById(id);

        if (user.role !== 'admin'){
            return res.status(403).json({
                error: "You can't access"
            })
        }
        next();

    }catch (e) {
        res.status(403).json({
            error: "Server error occurred"
        })
    }
}