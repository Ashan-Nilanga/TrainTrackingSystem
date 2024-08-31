const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());

let corsOptions = {
  origin : ['http://localhost:3000', 'https://train-tracking-system-1dka.vercel.app'],
}

app.use(cors(corsOptions))

const mongourl ="mongodb+srv://ashanliyanage324:IcU3CKKivH3HAjP3@cluster0.uxqez.mongodb.net/TrainTrackingSystem?retryWrites=true&w=majority&appName=Cluster0";
//mongodb+srv://ashanliyanage324:IcU3CKKivH3HAjP3@cluster0.uxqez.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
mongoose
  .connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Atlas connection established");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB Atlas", err);
  });

const positionEndpoints = require("./endpoints/positionEndpoints");
app.use("/api", positionEndpoints);

app.get('/', (req, res) => {
  res.send("Welcome to Server..!")
})

const SERVER_PORT = process.env.PORT || 3000;
app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}`);
});
