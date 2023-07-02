const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const usersRoutes = require('./routes/usersRoutes.js');
const productsRoutes = require('./routes/productsRoutes.js');
const ordersRoutes = require('./routes/ordersRoutes.js');
const fileRoutes = require('./routes/fileRoutes.js');
const messagesRoutes = require('./routes/messagesRoutes.js');

const authRouter = require('./routes/oauth.js');
const requestRouter = require('./routes/request.js');
const htmlAuthRouter = require('./routes/htmlAuth.js');
const htmlFileRouter = require('./routes/htmlResponse.js');

const port = 3000;
dotenv.config(); 

mongoose.connect(process.env.CLIENT_DATABSE, {
    useNewUrlParser:true,
    useUnifiedTopology: true
})

let db = mongoose.connection;

db.on("error", console.error.bind(console, "Network problem"));

db.once("open", () => console.log('Connected to the cloud server'));

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use('/users', usersRoutes);
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/file', fileRoutes);
app.use('/oauth', authRouter);
app.use('/request', requestRouter);
app.use('/htmlAuth',htmlAuthRouter);
app.use('/htmlResponse',htmlFileRouter);
app.use('/messages',messagesRoutes);


app.listen(port, () => {console.log(`The server is running at port:${port}.`)})