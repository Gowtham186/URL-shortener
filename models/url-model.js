import { Schema, model } from "mongoose";

const urlSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    longUrl : String,
    shortUrl : String,
    expireDate : Date
},{timestamps : true})
const Url = model('Url', urlSchema)
export default Url