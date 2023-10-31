const mongoose=require("mongoose");
let dataSchema=new mongoose.Schema({
    'temp':{
        required:true,
        type:Number

    },
    'humidity':{
        required:true,
        type:Number

    },
    'pressure':{
        required:true,
        type:Number

    },
    'altitude':{
        required:true,
        type:Number
    },
    'fl':{
        required:true,
        type:Number
    },
    'dp':{
        required:true,
        type:Number
    },
    'time':{
        required:true,
        type: String
    },
    'date':{
        required:true,
        type: String
    },
    'timeStamp':{
        required:true,
        type: Date
    }

}
);
module.exports =mongoose.model("node_js",dataSchema)