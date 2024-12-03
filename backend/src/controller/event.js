import {AppDataSource} from "../data/connection.js";
import {CustomError} from "../middleware/CustomError.js";
import {Event} from "../data/entity/Event.js";

const eventRepository = AppDataSource.getRepository("Event");

export async function events(){
    let events = await eventRepository.find();
    console.log(events);
    return events;
}

export async function eventByID(eventId){
    return await eventRepository.findOne({
        where: {
            id: eventId
        }
    });
}

export async function createEvent(userEmail, eventTitle, eventDescription, eventStart, eventEnd, eventPlace, eventCategory, allDay){

    const event = eventRepository.create({
        title: eventTitle,
        description: eventDescription,
        start: eventStart,
        end: eventEnd,
        place: eventPlace,
        category: eventCategory,
        allDay: allDay,
        email: userEmail
    });

    await eventRepository.insert(event);
}

export async function deleteEvent(eventId){
    let event = eventRepository.findOne({
        where: {
            id: eventId
        }
    });

    if(event){
        await AppDataSource
            .createQueryBuilder()
            .delete()
            .from(Event)
            .where("id = :id", {id: eventId})
            .execute();
    }else{
        throw new CustomError(400, "controller/event.js - Can't find a matching event for the id '" + eventId + "'.")
    }
}