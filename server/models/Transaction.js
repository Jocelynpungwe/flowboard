import mongoose from 'mongoose'
const schema=new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},type:{type:String,enum:['income','expense'],required:true},account:{type:String,enum:['personal','business'],default:'personal'},amount:{type:Number,required:true,min:0},category:{type:String,required:true,trim:true},description:{type:String,trim:true},date:{type:Date,default:Date.now},subscription:{type:mongoose.Schema.Types.ObjectId,ref:'Subscription',default:null}},{timestamps:true})
export default mongoose.model('Transaction',schema)
