import { Schema, model } from "mongoose";

const userSchema = new Schema({
    username: String,
    password : String
},{timestamps: true})

const User = model('User', userSchema)
export default User