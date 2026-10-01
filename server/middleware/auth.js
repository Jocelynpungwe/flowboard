import jwt from 'jsonwebtoken'
export const protect=(req,res,next)=>{const token=req.headers.authorization?.startsWith('Bearer ')?req.headers.authorization.split(' ')[1]:null;if(!token)return res.status(401).json({message:'Not authorized'});try{req.user=jwt.verify(token,process.env.JWT_SECRET).id;next()}catch{return res.status(401).json({message:'Invalid token'})}}
