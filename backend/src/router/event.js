import express from 'express';
import {CustomError} from "../middleware/CustomError";
import {asyncHandler} from "../utils/asyncHandler";
import {events, eventByID, createEvent, deleteEvent} from "../controller/event.js";

export const eventRouter = express.Router();

eventRouter.get('/', (req, res) => {
    const eventsList = events();
    res.status(200).json(eventsList);
});

eventRouter.get('/id/:id', asyncHandler (async(req, res) => {
    if(req.params.id){
        const event = eventByID(req.params.id);
        res.status(200).json(event);
    }else{
        throw new CustomError(400, "router/events.js - GET - /id/:id - Missing Event id.");
    }
}));

eventRouter.post('/createEvent/', asyncHandler (async(req, res) => {
    if(req.user.dataValues.email){
        if(req.body.title){
            if(req.body.description){
                if(req.body.start){
                    if(req.body.end && req.body.end > req.body.start){
                        if(req.body.place){
                            if(req.body.category){
                                if(req.body.allDay){
                                    await createEvent(req.user.dataValues.email, req.body.title, req.body.description, req.body.start, req.body.end, req.body.place, req.body.category, req.body.allDay);
                                    res.status(200);
                                }else{
                                    throw new CustomError(400, "router/events.js - POST - /createEvent/ - Missing AllDay for the event.")
                                }
                            }else{
                                throw new CustomError(400, "router/events.js - POST - /createEvent/ - Missing category for the event.")
                            }
                        }else{
                            throw new CustomError(400, "router/events.js - POST - /createEvent/ - Missing place for the event.");
                        }
                    }
                }else{
                    throw new CustomError(400, "router/events.js - POST - /createEvent/ - Missing moment for the event.");
                }
            }else{
                throw new CustomError(400, "router/events.js - POST - /createEvent/ - Missing description for the event.");
            }
        }else{
            throw new CustomError(400, "router/events.js - POST - /createEvent/ - Missing title for the event.");
        }
    }else{
        throw new CustomError(400, "router/event.js - POST - /createEvent/ - Can't get User email.");
    }

}));

eventRouter.delete('/deleteEvent/:eventId', asyncHandler(async (req,res) => {
    if(req.params.eventId){
        await deleteEvent(req.params.id);
        res.status(200);
    }else{
        throw new CustomError(400, "router/event.js - DELETE - /deleteEvent/:eventId - Missing event ID.");
    }
}))