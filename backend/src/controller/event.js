import { AppDataSource } from "../data/connection.js";
import { CustomError } from "../middleware/CustomError.js";
import { Event } from "../data/entity/Event.js";
import { Groups } from "../data/entity/Groups.js";
import { User } from "../data/entity/User.js";

const eventRepository = AppDataSource.getRepository("Event");
const groupRepository = AppDataSource.getRepository("Groups");
const userRepository = AppDataSource.getRepository("User");

export async function events(){
    let events = await eventRepository.find({
        relations: ['group']
    });
    console.log(events);
    return events;
}

export async function eventByID(eventId){
    return await eventRepository.findOne({
        where: {
            id: eventId
        },
        relations: ['group']
    });
}

export async function createEvent(
    groupId, 
    userEmail, 
    eventTitle, 
    eventDescription, 
    eventStart, 
    eventEnd, 
    eventPlace, 
    eventCategory, 
    allDay
){
    // Vérifier si le groupe existe
    const group = await groupRepository.findOne({
        where: { id: groupId }
    });

    if (!group) {
        throw new CustomError(400, `Group with ID ${groupId} not found`);
    }

    const user = await userRepository.findOne({
        where: { email: userEmail },
        relations: ['groups']
    });

    if (!user) {
        throw new CustomError(404, `User with email ${userEmail} not found`);
    }

    const isUserInGroup = user.groups?.some(g => g.id === groupId);
    if (!isUserInGroup) {
        throw new CustomError(403, `User is not a member of the group`);
    }

    const event = eventRepository.create({
        title: eventTitle,
        description: eventDescription,
        start: eventStart,
        end: eventEnd,
        place: eventPlace,
        category: eventCategory,
        allDay: allDay,
        group: group 
    });

    let e = await eventRepository.save(event);
    return e;
}

export async function deleteEvent(eventId, userEmail){
    let event = await eventRepository.findOne({
        where: {
            id: eventId
        },
        relations: ['group']
    });

    if(!event){
        throw new CustomError(400, `Can't find a matching event for the id '${eventId}'`);
    }

    const user = await userRepository.findOne({
        where: { email: userEmail },
        relations: ['groups']
    });

    if (!user) {
        throw new CustomError(404, `User with email ${userEmail} not found`);
    }

    const isUserInGroup = user.groups?.some(g => g.id === event.group?.id);
    if (!isUserInGroup) {
        throw new CustomError(403, `User is not authorized to delete this event`);
    }

    return await eventRepository.remove(event);
}

export async function getEventsByGroup(groupId){
    return await eventRepository.find({
        where: { 
            group: { id: groupId } 
        },
        relations: ['group']
    });
}

export async function updateEvent(
    eventId, 
    userEmail, 
    eventData
){
    let event = await eventRepository.findOne({
        where: {
            id: eventId
        },
        relations: ['group']
    });

    if(!event){
        throw new CustomError(400, `Can't find a matching event for the id '${eventId}'`);
    }

    const user = await userRepository.findOne({
        where: { email: userEmail },
        relations: ['groups']
    });

    if (!user) {
        throw new CustomError(404, `User with email ${userEmail} not found`);
    }

    const isUserInGroup = user.groups?.some(g => g.id === event.group?.id);
    if (!isUserInGroup) {
        throw new CustomError(403, `User is not authorized to update this event`);
    }

    Object.assign(event, eventData);
    return await eventRepository.save(event);
}