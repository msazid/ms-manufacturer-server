const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mscluster.5wkvp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async () => {
    try {
        await client.connect()
        const itemCollection = client.db('msDB').collection('product');
        const reviewCollection = client.db('msDB').collection('reviews');
        app.get('/item',async(req,res)=>{
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })
        app.get('/review',async(req,res)=>{
            const query = {};
            const cursor = reviewCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })
        app.get('/item/:id',async(req,res)=>{
            const id = req.params;
            const query = {_id:ObjectId(id)}
            const result = await itemCollection.findOne(query);
            res.send(result);
        })
    }
    finally {}
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`listening to port ${port}`)
})