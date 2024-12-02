import {AppDataSource} from "../data/connection.js";
import {CustomError} from "../middleware/CustomError.js";

const eventRepository = AppDataSource.getRepository("Event");
const suggestionRepository = AppDataSource.getRepository("Suggestion");

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

export function createEvent(eventTitle, eventDescription, eventStart, eventEnd, eventPlace, eventCategory, allDay){
    let event = {
        title: eventTitle,
        description: eventDescription,
        start: eventStart,
        end: eventEnd,
        place: eventPlace,
        category: eventCategory,
        allDay: allDay,
    };

    eventRepository
        .save(event)
        .then(function(){
            console.log('>>> INFO : Event successfully created.');
        });
}

export async function castSuggestionToEvent(suggestionId){
    let suggestion = await suggestionRepository.findOne({
        where: {id: suggestionId}
    });

    if(suggestion){
        let event = {
            title: suggestion.title,
            description: suggestion.description,
            start: suggestion.start,
            end: suggestion.end,
            place: suggestion.place,
            category: suggestion.category,
            allDay: suggestion.allDay,
        };

        eventRepository
            .save(event)
            .then(function(){
                console.log('>>> INFO : Event successfully created.');
            });

    }else{
        throw new CustomError(400, "controller/event.js - Can't find a matching suggestion.");
    }
}