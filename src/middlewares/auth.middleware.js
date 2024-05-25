import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";


export const  verifyJWT = asyncHandler (async (req, _, next) => {  //if any thing is not being used like here res, you can replace this by _
   try {
     const token = req.cookies?.accessToken ||req.header("Authorization")?.replace("Bearer ","")
 
 
     if(!tokken){
         throw new ApiError(401,"Unauthorized request")
     }
 
     const decodeTokken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
     const user = await User.findById(decodeTokken?._id).select("-password -refreshToken")
 
     if(!user){
         throw new ApiError(401, "Invalid Access Token")
     }
 
     req.user = user;
     next();
 
   } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access Token")
   }
})