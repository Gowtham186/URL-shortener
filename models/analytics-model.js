import { Schema, model } from "mongoose";

const analyticsSchema = new Schema({
    clicks:Number,
    url:{
        type: Schema.Types.ObjectId,
        ref : 'Url'
    },
    devices : {
        mobile : { type : Number},
        desktop : { type : Number}
    },
    countries : {
        type : Object,
        default : {}
    }
})
const Analytics = model('Analytics', analyticsSchema)
export default Analytics