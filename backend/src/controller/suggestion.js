import {AppDataSource} from "../data/connection.js";
import {Suggestion} from "../data/entity/Suggestion.js";
import {CustomError} from "../middleware/CustomError.js";

const suggestionRepository = AppDataSource.getRepository("Suggestion");
const eventRepository = AppDataSource.getRepository("Event");

export async function suggestions(){
    return await suggestionRepository.find();
}

export async function suggestionByID(suggestionID) {
    return await suggestionRepository.findOne({
        where: {
            id: suggestionID
        }
    });
}

export async function createSuggestion(userEmail, suggestionTitle, suggestionDescription, suggestionStart, suggestionEnd, suggestionPlace, suggestionCategory, suggestionAllDay, suggestionMaximumApprovalDate){
    let suggestion = {
        title: suggestionTitle,
        description: suggestionDescription,
        start: suggestionStart,
        end: suggestionEnd,
        place: suggestionPlace,
        category: suggestionCategory,
        allDay: suggestionAllDay,
        maximalApprovalDate: suggestionMaximumApprovalDate,
        email: userEmail
    };

    suggestionRepository
        .save(suggestion)
        .then(function (){
            console.log('>>> INFO : Suggestion successfully inserted.');
        });

}

export async function approveSuggestion(suggestionID){
    let suggestion = await suggestionRepository.findOne({
        where: {id: suggestionID}
    });

    if(suggestion){
        let currentDate = new Date();
        if(suggestion.maximalApprovalDate <= currentDate){
            let event = {
                title: suggestion.title,
                description: suggestion.description,
                start: suggestion.start,
                end: suggestion.end,
                place: suggestion.place,
                category: suggestion.category,
                allDay: suggestion.allDay,
                email: suggestion.email
            };

            eventRepository
                .save(event)
                .then(function(){
                    console.log('>>> INFO : Event successfully created.');
                });

            await AppDataSource
                .createQueryBuilder()
                .delete()
                .from(Suggestion)
                .where("id = :id", { id: suggestionID })
                .execute()
                .then(function(){
                    console.log('>>> INFO : Suggestion successfully deleted.')
                });
        }else{
            throw new CustomError(400, "controller/suggestion.js - approveSuggestion - Can't approve given suggestion. It is too late to approve it.")
        }
    }else{
        throw new CustomError(400, "controller/suggestion.js - approveSuggestion - Can't find a matching suggestion for the id '" + suggestionID + "'.");
    }
}

export async function deleteSuggestion(suggestionID){
    let suggestion = suggestionRepository.findOne({
        where: {
            id: suggestionID
        }
    });

    if(suggestion){
        await AppDataSource
            .createQueryBuilder()
            .delete()
            .from(Suggestion)
            .where("id = :id", {id: suggestionID})
            .execute()
            .then(function(){
                console.log('>>> INFO : Suggestion successfully deleted.')
            });
    }else{
        throw new CustomError(400, "controller/suggestion.js - deleteSuggestion - Can't find a suggestion for the ID '" + suggestionID + "'.");
    }
}