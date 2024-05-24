import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async (req,res) => {
    //get user detail from front end
    //validation
    //check if user already exist: username and email
    //check for images, avtar
    //upload them on cloudinary
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation

    const { fullname, email, username, password } = req.body
    console.log(`fullname: ${fullname}, email: ${email}, usename: ${username}, password: ${password} `)

    //checking if entered credential are not empty

    //to check individually
    // if (fullname === ""){
    //     throw new ApiError(400, "fullname is required")
    // }

    //to check all at once

    if(
        [fullname, email, username, password].some((field) => field?.trim() === "")//here we use some() this provides a call back which used trim funtion to trim the entered value, then check if after triming the field is empty or not if empty then it return true
    ){
        throw new ApiError(400, "All field are required")
    }

    //if a user already exits with the provided username and email, it return it
    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser){
        throw new ApiError(409, "user with email or username already exists")
    }

    console.log(req.files?.avatar[0]?.path);
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" //this removes the password and refreshToken 
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

export {registerUser};