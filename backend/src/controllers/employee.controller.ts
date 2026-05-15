import {Request,Response,NextFunction} from "express";
import UserService from "../service/user.service.js";
import { UserRole } from "../model/user.model.js";
export const createUser=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {emailId,name,password,role}=req.body;
        const foundUser=await UserService.registerUser(name,emailId,password,role);
        res.status(200).send("Inserted successfully");
    }
    catch (error){
        console.log("Not an Admin");
        next(error);
    }
}

export const loginUser=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {emailId,password}=req.body;
        const checkEmail=await UserService.checkUser(emailId);
        if(!checkEmail){
            return res.status(404).json({message:"user does not exist"});
        }
        const checkPassword=await checkEmail.comparePassword(password);

        if(!checkPassword){
            return res.status(401).json({message:"Invalid password"});
        }

        return res.status(200).json({message:"Login successful", user:checkEmail});
    }
    catch(err){
        console.error(err);
        return res.status(500).send("Internal server Error");
    }
}
export const updateUser=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const id=req.params.id as string;
        const {name,role}=req.body;
        const checkUser=await UserService.checkExistingUser(id);
        if(!checkUser){
            return res.status(404).json({
                error:"user not found",
            })
        }
        if(!name){
            return res.status(400).json({
                error:"New name is not given",
            })
        }
        const successUpdate=await UserService.updateUser(id,name,role);
        
        if(!successUpdate){
            return res.status(500).json({
                error:"internal error",
            })
        }
         return res.status(200).json({
            status:true,
            message:'data updated successfully',
            user:{role:successUpdate.role,username:successUpdate.name},
        })
    }
    catch(err){
        return res.status(500).send("internal server error");
    }
}

export const getSingleUserDetails=async(req:Request,res:Response)=>{
    try{
        const id=req.params.id as string;
        
        const getUser=await UserService.getUser(id);
        if(!getUser) {
            return res.status(404).json({
                error: "user not found",
            });
        }
        return res.status(200).json({
            name:getUser.name,
            email:getUser.emailId,
            role:getUser.role,
        })
    }
    catch(err){
        return res.status(500).json({
            error:"Internal server error",
        })
    }
}

export const getAllUserDetails=async(req:Request,res:Response)=>{
    try{
        const id=req.params.id as string;
        const role=await UserService.checkRole(id);
        if (!role) {
            return res.status(404).json({ error: "Role not found" });
        }
        if(role!=UserRole.ADMIN){
            return res.status(400).json({
                "message":"You cant access this",
            })
        }
        const getUser=await UserService.getAllUser();
        return res.status(200).json({getUser});
    }
    catch(err){
        return res.status(500).json({
            error:"Internal server error",
        })
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const adminId= req.params.adminId as string;
        const targetId=req.params.targetId as string;

        const role = await UserService.checkRole(adminId);
        
        if (!role || role !== UserRole.ADMIN) {
            return res.status(403).json({ message: "Unauthorized: Only admins can delete users" });
        }

        const result = await UserService.deleteUserWithId(targetId);

        if (!result || result.deletedCount === 0) {
            return res.status(404).json({ message: "User to delete was not found" });
        }

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
};
