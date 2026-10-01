import Task from '../models/Task.js'
export const list=async(req,res)=>{const q={user:req.user};if(req.query.workspace)q.workspace=req.query.workspace;res.json(await Task.find(q).sort({dueDate:1}))}
export const add=async(req,res)=>res.status(201).json(await Task.create({...req.body,user:req.user}))
export const update=async(req,res)=>{const data={...req.body};if(typeof data.completed==='boolean')data.completedAt=data.completed?new Date():null;const t=await Task.findOneAndUpdate({_id:req.params.id,user:req.user},data,{new:true,runValidators:true});res.json(t)}
export const remove=async(req,res)=>{await Task.deleteOne({_id:req.params.id,user:req.user});res.json({message:'Deleted'})}
