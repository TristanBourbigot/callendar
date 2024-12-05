import express from 'express';
import { CustomError } from "../middleware/CustomError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { 
    events, 
    eventByID, 
    createEvent, 
    deleteEvent, 
    getEventsByGroup, 
    updateEvent 
} from "../controller/event.js";
import { checkDates } from "../middleware/dates.js";
import { auth } from "../middleware/auth.js";

export const eventRouter = express.Router();

eventRouter.use(auth);

eventRouter.get('/', asyncHandler(async (req, res) => {
    const eventsList = await events();
    res.status(200).json(eventsList);
}));

eventRouter.get('/:id', asyncHandler(async (req, res) => {
    const eventId = req.params.id;
    if (!eventId) {
        throw new CustomError(400, "Missing Event ID.");
    }
    const event = await eventByID(eventId);
    res.status(200).json(event);
}));

eventRouter.post('/', asyncHandler(async (req, res) => {
    const { groupId, title, description, start, end, place, category, allDay } = req.body;
    const userEmail = req.user[0]?.email;

    if (!userEmail) {
        throw new CustomError(400, "Can't get User email.");
    }
    if (!title || !description || !start || !end || !place || !category || allDay === undefined) {
        throw new CustomError(400, "Missing required fields for event creation.");
    }
    if (!checkDates(start, end)) {
        throw new CustomError(400, "The end of the event must be after the start.");
    }
    const newEvent = await createEvent(
        groupId, 
        userEmail, 
        title, 
        description, 
        start, 
        end, 
        place, 
        category, 
        allDay
    );
    res.status(201).json(newEvent);
}));

eventRouter.delete('/:id', asyncHandler(async (req, res) => {
    const eventId = req.params.id;
    const userEmail = req.user[0]?.email;

    if (!eventId) {
        throw new CustomError(400, "Missing Event ID.");
    }
    if (!userEmail) {
        throw new CustomError(400, "Can't get User email.");
    }
    const deletedEvent = await deleteEvent(eventId, userEmail);
    res.status(200).json(deletedEvent);
}));

eventRouter.get('/group/:groupId', asyncHandler(async (req, res) => {
    const groupId = req.params.groupId;
    if (!groupId) {
        throw new CustomError(400, "Missing Group ID.");
    }
    const groupEvents = await getEventsByGroup(groupId);
    res.status(200).json(groupEvents);
}));

eventRouter.put('/:id', asyncHandler(async (req, res) => {
    const eventId = req.params.id;
    const userEmail = req.user[0]?.email;
    const eventData = req.body;

    if (!eventId) {
        throw new CustomError(400, "Missing Event ID.");
    }
    if (!userEmail) {
        throw new CustomError(400, "Can't get User email.");
    }
    const updatedEvent = await updateEvent(eventId, userEmail, eventData);
    res.status(200).json(updatedEvent);
}));
