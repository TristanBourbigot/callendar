import express from 'express';
import {AppDataSource} from './data/connection.js';
import {userRouter} from "./router/user.js";
import cors from 'cors';

const app = express();
const port = 2999;

// Don't forget your bag, Daniel.
// I won't, Herbert.
app.use(express.json());

AppDataSource.initialize().then(async() => {
   console.log(">>> INFO : Connected to Database.");
}).catch((error) => {
   console.error('>>> ERROR : Failed to connect to Database.');
   console.error(error);
});

app.use(cors({
   origin: 'http://localhost:3000',
   credentials: true
 }));

app.get('/', function(req, res){
   // @TODO
});

app.use("/api/v1/user", userRouter);

console.log(`>>> INFO : Listening on port ${port}`);
app.listen(port);