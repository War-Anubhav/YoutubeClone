import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    subscriber:{
        type: Schema.Types.ObjectId, //one who is subscribing
        ref:"User"
    },
    channel:{
        type: Schema.Types.ObjectId, //one to whome we are subscribing
        ref:"User"
    },
    },
    {timestamps:true}
)


export const Subscription = mongoose.model("Subscription",subscriptionSchema)