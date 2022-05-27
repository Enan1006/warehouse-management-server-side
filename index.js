const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k2t5c.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const phonesCollection = client.db('eSmartInventory').collection('phones');
        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = phonesCollection.find(query);
            const inventories = await cursor.toArray();
            res.send(inventories);
        });
        //? get inventory item by id
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const inventory = await phonesCollection.findOne(query);
            res.send(inventory);
        });

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    console.log('e-smart-inventory server is running');
})

app.listen(port, () => {
    console.log('Server is running on port', port);
})