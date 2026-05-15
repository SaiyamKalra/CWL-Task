import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import route from './routes/user.routes.js';
import cors from 'cors';
dotenv.config({ path: './src/.env' });

const app=express();
app.use(express.json());
app.use(cors());
app.use('/',route);
const atlasURI=process.env.MONGO_URI;

mongoose.connect(atlasURI!)
  .then(() => {
    console.log("Connected to Atlas via Environment Variable!");
  })
  .catch(err => {
    console.error("Connection error: ", err);
  });

app.listen(process.env.PORT,()=>{
    console.log(`Server running at port ${process.env.PORT}`);
})