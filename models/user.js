const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const userSchema  = mongoose.Schema({
    name:{

        type:String,
        maxlength:50
    },
    email:{
        type:String,
        unique: 1,
        trim:true
    },
    password: {
        type:String,
        minglength:5
    },
    lastname: {
        type:String,
        maxlength: 50
    },
    role: {
        type:Number,
        default:0
    },
    token: {
        type:String
    },
    tokenExp: {
        type:Number
    }
})

userSchema.pre('save',function(next ){
    var user = this
    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {
               if(err) return next(err) 
               user.password = hash
            });
    })
    
}else {
    next()
}
})

userSchema.methods.comparePassword = function (plainPassword,cb){
    bcrypt.compare(plainPassword, this.pass, function(err, isMatch) {
        if (err) cb(err)
        cb(null,isMatch) 
    })

}

userSchema.methods.generateToken = function(cb) {
    var user = this
    var token = jwt.sign(user._id.toHexString(),'secret')
    user.token = token
    user.save(function (err,user){
        if(err) return cb(err)
        cb(null,user)
    })
}

const User = mongoose.model("User",userSchema)
module.exports = {User}