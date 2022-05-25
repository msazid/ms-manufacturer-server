const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const { ObjectID } = require('bson');
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mscluster.5wkvp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async () => {
    try {
        await client.connect()
        const itemCollection = client.db('msDB').collection('product');
        const reviewCollection = client.db('msDB').collection('reviews');
        const orderCollection = client.db('msDB').collection('orders');
        const profileCollection = client.db('msDB').collection('users');

        app.get('/item', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })
        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })
        app.get('/item/:id', async (req, res) => {
            const id = req.params;
            const query = { _id: ObjectId(id) }
            const result = await itemCollection.findOne(query);
            res.send(result);
        })
        app.get('/ordered', async (req, res) => {
            const query = {};
            const result = await orderCollection.find(query).toArray();
            res.send(result);

        })
        app.put('/item/:id', async (req, res) => {
            const id = req.params;
            const updateProduct = req.body;
            const filter = { _id: ObjectId(id) }
            const updateDoc = {
                $set: {
                    quantity: updateProduct.quantity,
                },
            }
            const result = await itemCollection.updateOne(filter, updateDoc);
            res.send(result);
        })
        app.get('/ordered', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await orderCollection.findOne(query).toArray();
            res.send(result)
        })
        app.delete('/ordered/:id', async (req, res) => {
            const id = req.params;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query)
            res.send(result);
        })
        app.post('/ordered', async (req, res) => {
            const ordered = req.body;
            const result = await orderCollection.insertOne(ordered)
            res.send(result);
        })


        app.get('/users', async (req, res) => {
            const users = await profileCollection.find().toArray()
            res.send(users)
        })
        //user put
        app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await profileCollection.updateOne(filter, updateDoc, options);
            //const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ result});
        })
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const cursor = profileCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });
    }
    finally { }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`listening to port ${port}`)
})