import express from "express"
import cors from "cors"
import 'dotenv/config'

const port = process.env.PORT || 5000

const app = express();

app.use(cors());
app.use(express.json());


// --------------- connect to database ----------------

import { MongoClient } from 'mongodb';

const client = new MongoClient(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@nhims.gtpblyz.mongodb.net/`);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const database = await connectToMongoDB();

const db = client.db("nhims_db");
const doctorCollection = db.collection("doctor");


app.get("/" , (req,res) =>{
    res.send("testing");
})


// ------------ doctor application -------------

app.post("/doctor", async(req , res) =>{
  
  try{
     const doctorData = req.body;
   const createAt = new Date();
   const status = "pending";
   doctorData.createAt = createAt;
   doctorData.status = status;

   const result = await doctorCollection.insertOne(doctorData);

   if(result.acknowledged){
    res.send({success:true , message:"Doctor application submitted successfully"});
   }else{
    res.send({success:false, message:"Doctor application submission failed"});
   }
   


   
  }catch(err){
    console.log(err);
  }



})


app.listen(port , ()=>{
    console.log("server is running");
})