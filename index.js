const express= require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app= express();
const port = process.env.PORT || 5000;

//middlware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kvzsn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
try{
    await client.connect()
    const database = client.db('Travelmate')
    const offerCollection = database.collection('offers')
    const detailsCollection = database.collection('details')
    const usersCollection= database.collection('users')
    const orderCollection = database.collection("orders");

     //get api
     app.get('/offers',async(req,res)=>{
        const cursor=offerCollection.find({})
        const products = await cursor.toArray()
            res.send(products)
    })


//find user
 // find a specific user
 app.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const user = await usersCollection.findOne(query);
    console.log('load user with id: ', id);
    res.send(user);
})


   //get api
   app.get('/details',async(req,res)=>{
    const cursor=detailsCollection.find({})
    const details = await cursor.toArray()
        res.send(details)
})


//add new user
app.post('/users', async (req, res) => {
    const newUser = req.body;
    const result = await usersCollection.insertOne(newUser);
    console.log('got new user', req.body);
    console.log('added user', result);
    res.json(result);
})

   
   //update user
    app.put('/users/:id', async (req, res) => {
        const id = req.params.id;
        const updatedUser = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                name: updatedUser.name,
                email: updatedUser.email
            },
        };
        const result = await usersCollection.updateOne(filter, updateDoc, options)
        console.log('updating', id)
        res.json(result)
    })

// add new service

app.post('/details', async (req, res) => {
    const newUser = req.body;
    const result = await detailsCollection.insertOne(newUser);
    console.log('got new user', req.body);
    console.log('added user', result);
    res.json(result);
})

   
   //update service
    app.put('/details/:id', async (req, res) => {
        const id = req.params.id;
        const updatedUser = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
       
        const result = await detailsCollection.updateOne(filter, options)
        console.log('updating', id)
        res.json(result)
    })




  // get api
  app.get('/users', async (req, res) => {
    const cursor = usersCollection.find({});
    const users = await cursor.toArray();
    res.send(users);
})


//delete api
 // delete api
 app.delete('/users/:id', async (req, res) => {
    const id = req.params.id;
    // res.json(1);
    const query = { _id: ObjectId(id) };
    const result = await usersCollection.deleteOne(query);
    console.log(result);
    res.json(result);
})


app.delete('/users/:id', async (req, res) => {
    const id = req.params.id;
    // res.json(1);
    const query = { _id: ObjectId(id) };
    const result = await usersCollection.deleteOne(query);
    console.log(result);
    res.json(result);
})


}


finally{

}
}

run().catch(console.dir)

app.get('/' , (req,res)=>{
    res.send('Running travelmate server:')
})

app.listen(port, ()=>{
    console.log('Running on ', port)
})

