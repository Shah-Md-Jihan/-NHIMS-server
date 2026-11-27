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

   const doctorExits = await doctorCollection.findOne({userId: doctorData.userId});

   if(!doctorExits){

   const result = await doctorCollection.insertOne(doctorData);

   if(result.acknowledged){
    res.send({success:true , message:"Doctor application submitted successfully"});
   }else{
    res.send({success:false, message:"Doctor application submission failed"});
   }
  }
  else{
    res.send({success:false, message:"Doctor application already submitted"});
  }
   
  }catch(err){
    console.log(err);
  }

})

// doctor application data

app.get("/doctors-applications", async(req , res) =>{

  try{

    const findResult = await doctorCollection.find().toArray();
    res.send({success:true, data:findResult});

  }catch(err){
    res.send({success:false, message:"Failed to fetch doctor applications"});
  }

})


app.listen(port , ()=>{
    console.log("server is running");
})