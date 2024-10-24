const AppDataSource = require('./data/connection.js');
const express = require('express');
const {userRouter} = require("./router/user");

const app = express();
const port = 3000;

// Don't forget your bag, Daniel.
// I won't, Herbert.
app.use(express.json());

AppDataSource.initialize().then(async() => {
   console.log(">>> INFO : Connected to Database.");
}).catch((error) => {
   console.error('>>> ERROR : Failed to connect to Database.');
   console.error(error);
});

app.get('/', function(req, res){
   res.send("Hello world!");
});

app.use("/api/v1/user", userRouter);

console.log(`>>> INFO : Listening on port ${port}`);
app.listen(port);