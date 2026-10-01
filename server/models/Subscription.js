import mongoose from 'mongoose'
const schema=new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},account:{type:String,enum:['personal','business'],default:'personal'},name:{type:String,required:true},amount:{type:Number,required:true,min:0},billingCycle:{type:String,enum:['monthly','yearly'],default:'monthly'},nextBillingDate:{type:Date,required:true},category:{type:String,default:'Subscription'},active:{type:Boolean,default:true},lastAddedMonth:{type:String,default:''}},{timestamps:true})
export default mongoose.model('Subscription',schema)
