import express from 'express';
import { CustomError } from "../middleware/CustomError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    createGroup,
    addUserToGroup,
    removeUserFromGroup,
    getGroupsByUser,
    getAllGroups,
    getGroupById,
    updateGroup
} from "../controller/groups.js";
import { auth } from "../middleware/auth.js";

export const groupRouter = express.Router();

groupRouter.use(auth);

groupRouter.post('/', asyncHandler(async (req, res) => {
    const { groupName } = req.body;
    const creatorEmail = req.user[0]?.email;

    if (!creatorEmail) {
        throw new CustomError(400, "Can't get User email.");
    }
    if (!groupName) {
        throw new CustomError(400, "Missing Group Name.");
    }

    const newGroup = await createGroup(groupName, creatorEmail);
    res.status(201).json(newGroup);
}));

groupRouter.post('/:groupId/users', asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const { userEmail } = req.body;

    if (!groupId) {
        throw new CustomError(400, "Missing Group ID.");
    }
    if (!userEmail) {
        throw new CustomError(400, "Missing User Email.");
    }

    const updatedGroup = await addUserToGroup(userEmail, groupId);
    res.status(200).json(updatedGroup);
}));

groupRouter.delete('/:groupId/users', asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const { userEmail } = req.body;

    if (!groupId) {
        throw new CustomError(400, "Missing Group ID.");
    }
    if (!userEmail) {
        throw new CustomError(400, "Missing User Email.");
    }

    const updatedGroup = await removeUserFromGroup(userEmail, groupId);
    res.status(200).json(updatedGroup);
}));

groupRouter.get('/user', asyncHandler(async (req, res) => {
    const userEmail = req.user[0]?.email;

    if (!userEmail) {
        throw new CustomError(400, "Can't get User email.");
    }

    const userGroups = await getGroupsByUser(userEmail);
    res.status(200).json(userGroups);
}));

groupRouter.get('/', asyncHandler(async (req, res) => {
    const groups = await getAllGroups();
    res.status(200).json(groups);
}));

groupRouter.get('/:groupId', asyncHandler(async (req, res) => {
    const { groupId } = req.params;

    if (!groupId) {
        throw new CustomError(400, "Missing Group ID.");
    }

    const group = await getGroupById(groupId);
    res.status(200).json(group);
}));


groupRouter.patch('/:groupId', asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const updates = req.body;

    if (!groupId) {
        throw new CustomError(400, "Missing Group ID.");
    }

    const updatedGroup = await updateGroup(groupId, updates);
    res.status(200).json(updatedGroup);
}));
