require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const api = require('./routes/api');
const { mongoConnect } = require('./services/mongo');

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.use('/v1', api);

app.get('/', (req, res) => {
    res.json('server is working!');
})

async function startServer() {
    await mongoConnect();

    app.listen(PORT, () => {
        console.log('app listening on port: ', PORT)
    });
}

startServer();
