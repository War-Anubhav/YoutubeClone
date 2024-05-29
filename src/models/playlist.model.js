import mongoose, { Schema } from "mongoose";

const playlistScema = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        videos:[{
            type:Schema.Types.ObjectId,
            ref: "Video"
        }],
        description:{
            type:String,
            required:true
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref: "User"
        },
    },
    {timestamps:true}
)

export const Playlist = mongoose.model("Playlist",playlistScema)