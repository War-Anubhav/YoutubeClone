import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrpyt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique:true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique:true,
        lowercase: true,
        trim: true,
    },
    fullname:{
        type: String,
        required: true,
        trim:true,
        index:true,
    },
    avtar:{
        type: String, //cloudinary url
        required: true,
    },
    coverImage:{
        type: String,  //cloudinary url
    },
    watchHistory: [{
        type:Schema.Types.ObjectId,
        ref:"Video"
    }],
    password:{
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    }
},{timestamps:true})

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();

    this.password = bcrpyt.hash(this.password, 10)
    next()
})//dont use the arrow fun in pre callback as arrow fun dont have access to this kieyword and it is important here to know thw context of data being save for which we need this

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrpyt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)