import express from 'express';
import {CustomError} from "../middleware/CustomError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {checkDates} from "../middleware/dates.js";
import {
    approveSuggestion,
    createSuggestion,
    deleteSuggestion,
    suggestionByID,
    suggestions
} from "../controller/suggestion.js";
import {auth} from "../middleware/auth.js";

export const suggestionRouter = express.Router();

suggestionRouter.use(auth);

suggestionRouter.get('/', asyncHandler(async(req, res) => {
    let suggestionsList = await suggestions();
    res.status(200).json(suggestionsList);
}));

suggestionRouter.get('/id/:id', asyncHandler(async (req, res) => {
    if(req.params.id){
        let suggestion = await suggestionByID(req.params.id);
        res.status(200).json(suggestion);
    }else{
        throw new CustomError(400, "router/suggestion.js - GET - /id/:id - Missing Suggestion ID.");
    }
}));

suggestionRouter.post('/createSuggestion/', asyncHandler(async(req, res) => {
    if(req.user[0].email){
        if(req.body.title){
            if(req.body.description){
                if(req.body.start){
                    if(req.body.end){
                        if(checkDates(req.body.start, req.body.end)){
                            if(req.body.place){
                                if(req.body.category){
                                    if(req.body.allDay){
                                        if(req.body.maximalApprovalDate){
                                            if(checkDates(req.body.maximalApprovalDate, req.body.start)){
                                                let result = await createSuggestion(req.user[0].email, req.body.title, req.body.description, req.body.start, req.body.end, req.body.place, req.body.category, req.body.allDay, req.body.maximalApprovalDate);
                                                res.status(200).json(result);
                                            }else{
                                                throw new CustomError(400, "router/suggestion.js - POST - /createSuggestion/ - The maximal approval date of the suggestion must be earlier than the beginning of the suggestion.");
                                            }
                                        }else{
                                            throw new CustomError(400, "router/suggetion.js - POST - /createSuggestion/ - Missing MaximalApprovalDate for the suggestion.")
                                        }
                                    }else{
                                        throw new CustomError(400, "router/suggetion.js - POST - /createSuggestion/ - Missing AllDay for the suggestion.");
                                    }
                                }else{
                                    throw new CustomError(400, "router/suggetion.js - POST - /createSuggestion/ - Missing category for the suggestion.")
                                }
                            }else{
                                throw new CustomError(400, "router/suggetion.js - POST - /createSuggestion/ - Missing place for the suggestion.");
                            }
                        }else{
                            throw new CustomError(400, "router/suggestion.js - POST - /createSuggestion/ - The end of the suggestion must be later than the beginning of the suggestion.");
                        }
                    }
                }else{
                    throw new CustomError(400, "router/suggetion.js - POST - /createSuggestion/ - Missing start time for the suggestion.");
                }
            }else{
                throw new CustomError(400, "router/suggetion.js - POST - /createSuggestion/ - Missing description for the event.");
            }
        }else{
            throw new CustomError(400, "router/suggetion.js - POST - /createSuggestion/ - Missing title for the event.");
        }
    }else{
        throw new CustomError(400, "router/suggetion.js - POST - /createSuggestion/ - Can't get User email.");
    }
}));

suggestionRouter.post('/approveSuggestion/:id/', asyncHandler(async (req, res) => {
    if(req.params.id){
        await approveSuggestion(req.params.id);
        res.status(200);
    }
}));

suggestionRouter.delete('/deleteEvent/:id', asyncHandler(async(req, res) => {
    if(req.params.id){
        let result = await deleteSuggestion(req.params.id);
        res.status(200).json(result);
    }
}));