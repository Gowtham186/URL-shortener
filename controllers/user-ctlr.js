import User from "../models/user-model.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validationResult } from "express-validator";

const userCtlr = {}

userCtlr.register = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }

    const body = req.body
    try{
        const salt = await bcryptjs.genSalt()
        const hash = await bcryptjs.hash(body.password, salt)
        body.password = hash
        const user = new User(body)
        
        await user.save()

        const tokenData = jwt.sign({userId : user._id}, process.env.SECRET_KEY, {expiresIn : '7d'})

        res.json({token : `Bearer ${tokenData}`})
    }catch(err){
        console.log(err)    
        res.status(500).json({errors : 'something went wrong'})
    }
}

userCtlr.login = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const body = req.body
    try{
        const user = await User.findOne({username : body.username})
        if(!user){
            return res.status(400).json({errors: 'invalid username'})
        }

        const isVerified = await bcryptjs.compare(body.password, user.password)
        if(!isVerified){
            return res.status(400).json({errors: 'invalid passeord'})
        }

        const tokenData = await jwt.sign({userId : user._id}, process.env.SECRET_KEY, {expiresIn:'7d'})
        //console.log(tokenData)

        res.json({token : `Bearer ${ tokenData}`})

    }catch(err){
        res.status(500).json({errors: 'something went wrong'})

    }
}

userCtlr.profile = async(req,res)=>{
    try{
        const user = await User.findById(req.currentUser.userId)
        if(!user){
            return res.status(404).json({errors : 'record not found'})
        }
        res.json(user)
    }catch(err){
        res.status(500).json({errors : 'something went wrong'})
    }
}

export default userCtlr