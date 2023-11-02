require('dotenv').config()
const express=require ("express")
const cors=require ("cors")
const port=process.env.PORT || 5000;
const app=express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//middleware
app.use(express.json());
app.use(cors());

//basic method

app.get('/', (req,res)=>{
res.send("Server is Working")
})
app.listen(port,()=>{
  console.log(`Server Port is : ${port}`)
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4cq5wgq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

const adminCollection=client.db("esraqify").collection("adminpanel")
const serviceCollection=client.db("esraqify").collection("services")
const teamCollection=client.db("esraqify").collection("teams")

//admin get metehod
app.get("/user/admin/:email",async (req,res)=>{
  try {
    const email=req.params.email
    const query={email:email}
    const result= await adminCollection.findOne(query);
    res.send(result)
  } catch (error) {
    console.log(error)
  }
})
// service card data added to data base

app.post("/services" , async (req,res)=>{
  try {
    const serviceCardData=req.body;
    const result=await serviceCollection.insertOne(serviceCardData);
    res.send(result)
  } catch (error) {
    console.log(error)
  }
})

// service card getting from databsae

app.get('/get/services', async (req,res)=>{
  try {
    const result = await serviceCollection.find().toArray();
    res.send(result)
  } catch (error) {
    console.log(error)
  }
})
// service card deleting from databsae
// team card data added to data base

app.post("/teams" , async (req,res)=>{
  try {
    const teamCardData=req.body;
    const result=await teamCollection.insertOne(teamCardData);
    res.send(result)
  } catch (error) {
    console.log(error)
  }
})

// team card getting from databsae

app.get('/get/teams', async (req,res)=>{
  try {
    const result = await teamCollection.find().toArray();
    res.send(result)
  } catch (error) {
    console.log(error)
  }
})
// team card deleting from databsae
app.delete('/delete/teams/:id', async (req,res)=>{
  try {
    const teamCardDataId = req.params.id;
    const query={_id: new ObjectId(teamCardDataId)};
    const result=await teamCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    console.log(error)
  }
})
// team card getting from databsae by id

app.get('/get/teams/:id', async (req,res)=>{
  try {
    const id=req.params.id;
    const query={_id:new ObjectId(id)}
    const result=await teamCollection.findOne(query);
    res.send(result)
  } catch (error) {
    console.log(error)
  }
})
// patch method

app.patch('/patch/teams/:id',async(req,res)=>{
  try {
    const id=req.params.id;
  const filter={_id:new ObjectId(id)}
  const option={upsert: true}
  const updating=req.body;
  const teamCardInfo={
    $set:{
   name: updating.name,
   designation1:updating.designation1,
   designation2:updating.designation2,
   age:updating.age,
   expert:updating.expert,
   photo_url:updating.photo_url,
   
  }};
  const result= await teamCollection.updateOne(filter,teamCardInfo,option);
  res.send(result)
  } catch (error) {
    console.log(error)
  }
})
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


