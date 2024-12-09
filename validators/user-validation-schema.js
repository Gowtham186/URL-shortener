import User from "../models/user-model.js"

export const userRegisterValidation = {
    username : {
        in:['body'],
        trim:true,
        exists:{errorMessage : 'username is required'},
        notEmpty: {errorMessage : 'username should not be empty'},
        custom:{
            options: async function(value){
                const user = await User.findOne({username : value})
                if(user){
                    throw new Error('username already exists')
                }
                return true
            }
        }
    },
    password:{
        in:['body'],
        trim:true,
        exists:{errorMessage : 'password is required'},
        notEmpty:{errorMessage : 'password should not be empty'},
        isStrongPassword:{
            options:{
                minLength:8,
                minUppercase : 1,
                minLowercase : 1,
                minSymbol : 1,
                maxLength : 20
            },errorMessage : 'password containe atleast 1 lowercase 1 uppercase 1 symbol and 8 to 20 characters long'
        }
    }
}

export const userLoginValidation = {
    username : {
        in:['body'],
        trim:true,
        exists:{errorMessage : 'username is required'},
        notEmpty: {errorMessage : 'username should not be empty'},
    },
    password:{
        in:['body'],
        trim:true,
        exists:{errorMessage : 'password is required'},
        notEmpty:{errorMessage : 'password should not be empty'},
        isStrongPassword:{
            options:{
                minLength:8,
                minUppercase : 1,
                minLowercase : 1,
                minSymbol : 1,
                maxLength : 20
            },errorMessage : 'password containe atleast 1 lowercase 1 uppercase 1 symbol and 8 to 20 characters long'
        }
    }
}