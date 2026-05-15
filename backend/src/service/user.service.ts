import UserModel, { UserRole } from "../model/user.model.js";
import jwt from "jsonwebtoken";
class UserService{
    static async registerUser(name:String,emailId:String,password:String,role:UserRole){
        try{
            const createUser=new UserModel({name,emailId,password,role});
            return await createUser.save();
        }
        catch(err){
            throw err;
        }
    }
    static async checkUser(email: string) {
        try {
            return await UserModel.findOne({ emailId: email }).select('+password');
        }
        catch (err) {
            throw err;
        }
    }
    static async generateToken(tokenData:any,secretKey:string,jwt_expire:any){
        return jwt.sign(tokenData,secretKey,{expiresIn:jwt_expire});
    }
    static async checkExistingUser(id:string){
        try{
            const checkUser=await UserModel.findById(id);
            return checkUser;
        }
        catch(err){
            throw err;
        }
    }
    static async updateUser(id:string,name:string,role:UserRole){
        try{
            return await UserModel.findOneAndUpdate(
                {_id:id},
                {name:name,role:role},
                {new:true},
            )
        }
        catch(err){
            throw err;
        }
    }
    static async checkRole(id:string){
        try{
            const user=await UserModel.findById(id).select('role');
            return user ? user.role:null;
        }
        catch(err){
            throw err;
        }
    }
    static async getUser(id:string){
        try{
            return await UserModel.findById(id);
        }
        catch(err){
            throw err;
        }
    }
    static async getAllUser(){
        try{
            return await UserModel.find({});
        }
        catch(err){
            throw err;
        }
    }
    static async deleteUser(email:string){
        try{
            return await UserModel.deleteOne({emailId:email});
        }
        catch(err){
            throw err;
        }
    }
    static async deleteUserWithId(id:string){
        try{
            return await UserModel.deleteOne({_id:id});
        }
        catch(err){
            throw err;
        }
    }
}

export default UserService;