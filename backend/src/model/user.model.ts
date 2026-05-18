import mongoose from 'mongoose';
import {Schema} from 'mongoose';
import bcrypt from "bcrypt";

export enum UserRole{
    ADMIN="admin",
    EMPLOYEE="employee",
}

export interface IUser extends Document {
    emailId: string;
    name: string;
    role: UserRole;
    password: string;
    number: string;
    comparePassword(userPassword: string): Promise<boolean>;
}

const userSchema=new Schema({
    emailId:{
        type:String,
        required:true,
        index:true,
        unique:true,
    },
    name:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:Object.values(UserRole),
        default:UserRole.EMPLOYEE,
        required:true,
    },
    password:{
        type:String,
        required:true,
        select:false,
    },
    number:{
        type:String,
        required:true,
    },
    isValidated:{
        type:Boolean,
        required:true,
        default:0,
    }
},{timestamps:true});

userSchema.pre('save',async function(){
    try{
        var user=this;
        const salt=await(bcrypt.genSalt(10));
        const hashpass=await bcrypt.hash(user.password,salt);
        user.password=hashpass
    }
    catch(err){
        throw err;
    }
})

userSchema.methods.comparePassword = async function (userPassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(userPassword, this.password);
    } catch (err) {
        throw err;
    }
};
const User = mongoose.model<IUser>('user', userSchema);
export default User;