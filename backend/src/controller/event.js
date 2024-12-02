import {AppDataSource} from "../data/connection.js";
import {CustomError} from "../middleware/CustomError.js";

const eventRepository = AppDataSource.getRepository("Event");
const userRepository = AppDataSource.getRepository("User");

export async function events(){
    return await eventRepository.find();
}

export async function eventByID(eventId){
    return await eventRepository.findOne({
        where: {
            id: eventId
        }
    });
}

export function createEvent(userEmail, eventTitle, eventDescription, eventStart, eventEnd, eventPlace, eventCategory, allDay){

    let user = userRepository.findOne({
        where : {
            email: userEmail
        }
    });

    if(user){
        let event = {
        title: eventTitle,
        description: eventDescription,
        start: eventStart,
        end: eventEnd,
        place: eventPlace,
        category: eventCategory,
        allDay: allDay,
        email: userEmail
        };

    eventRepository
        .save(event)
        .then(function(){
            console.log('>>> INFO : Event successfully created.');
        });
    }else{
        throw new CustomError(400, "controller/event.js - createEvent - Can't find matching User for email '" + userEmail + "'.");
    }
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