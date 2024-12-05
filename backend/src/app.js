import express from 'express';
import cors from 'cors';
import {AppDataSource} from './data/connection.js';
import {userRouter} from "./router/user.js";
import {eventRouter} from "./router/event.js";
import {suggestionRouter} from "./router/suggestion.js";
import {groupRouter} from "./router/groups.js";

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
app.use("/api/v1/event", eventRouter);
app.use("/api/v1/suggestion", suggestionRouter);
app.use("/api/v1/groups", groupRouter)

console.log(`>>> INFO : Listening on port ${port}`);
app.listen(port);