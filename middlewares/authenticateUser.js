import jwt from 'jsonwebtoken'
const authenticateUser = async(req,res,next)=>{
    let token = req.headers['authorization']

    if(!token){
        return res.status(400).json({errors : 'token not provided'})
    }

    token = token.split(' ')[1]
    try{
        const tokenData = await jwt.verify(token, process.env.SECRET_KEY)
        req.currentUser = {userId : tokenData.userId}
        next()
    }catch(err){
        res.status(401).json({errors : 'invalid token'})
    }
}
export default authenticateUser