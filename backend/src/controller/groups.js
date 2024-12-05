import { Groups } from '../data/entity/Groups.js';
import { User } from '../data/entity/User.js';
import { AppDataSource } from '../data/connection.js';
import { CustomError } from "../middleware/CustomError.js";

const groupRepository = AppDataSource.getRepository("Groups");
const userRepository = AppDataSource.getRepository("User");

export async function createGroup(groupName, creatorEmail) {
    try {
        const creator = await userRepository.findOne({
            where: { email: creatorEmail }
        });

        if (!creator) {
            throw new CustomError(404, 'controller/groups.js - createGroup - User not found');
        }

        let group = {
            name: groupName
        };

        const savedGroup = await groupRepository.save(group);

        await addUserToGroup(creatorEmail, savedGroup.id);

        console.log('>>> INFO : Group successfully created.');
        return savedGroup;
    } catch (e) {
        console.error('>>> ERROR : Error while creating the group.');
        throw new CustomError(400, 'controller/groups.js - createGroup - ' + e.message);
    }
}

export async function addUserToGroup(userEmail, groupId) {
    try {
        const user = await userRepository.findOne({
            where: { email: userEmail },
            relations: ['groups']
        });

        if (!user) {
            throw new CustomError(404, 'controller/groups.js - addUserToGroup - User not found');
        }

        const group = await groupRepository.findOne({
            where: { id: groupId },
            relations: ['users']
        });

        if (!group) {
            throw new CustomError(404, 'controller/groups.js - addUserToGroup - Group not found');
        }

        const isUserInGroup = group.users?.some(u => u.email === userEmail);
        
        if (isUserInGroup) {
            throw new CustomError(400, 'controller/groups.js - addUserToGroup - User is already in the group');
        }

        group.users = [...(group.users || []), user];
        await groupRepository.save(group);

        console.log(`>>> INFO : User ${userEmail} added to group ${group.name}`);
        return group;
    } catch (e) {
        console.error('>>> ERROR : Error while adding user to group.');
        throw new CustomError(400, 'controller/groups.js - addUserToGroup - ' + e.message);
    }
}

export async function removeUserFromGroup(userEmail, groupId) {
    try {
        const group = await groupRepository.findOne({
            where: { id: groupId },
            relations: ['users']
        });

        if (!group) {
            throw new CustomError(404, 'controller/groups.js - removeUserFromGroup - Group not found');
        }

        group.users = group.users.filter(user => user.email !== userEmail);
        
        await groupRepository.save(group);

        console.log(`>>> INFO : User ${userEmail} removed from group ${group.name}`);
        return group;
    } catch (e) {
        console.error('>>> ERROR : Error while removing user from group.');
        throw new CustomError(400, 'controller/groups.js - removeUserFromGroup - ' + e.message);
    }
}

export async function getGroupsByUser(userEmail) {
    try {
        const user = await userRepository.findOne({
            where: { email: userEmail },
            relations: ['groups']
        });

        if (!user) {
            throw new CustomError(404, 'controller/groups.js - getGroupsByUser - User not found');
        }

        return user.groups || [];
    } catch (e) {
        console.error('>>> ERROR : Error while fetching user groups.');
        throw new CustomError(400, 'controller/groups.js - getGroupsByUser - ' + e.message);
    }
}

export async function getAllGroups() {
    try {
        return await groupRepository.find({
            relations: ['users']
        });
    } catch (e) {
        console.error('>>> ERROR : Error while fetching all groups.');
        throw new CustomError(400, 'controller/groups.js - getAllGroups - ' + e.message);
    }
}

export async function getGroupById(groupId) {
    try {
        const group = await groupRepository.findOne({
            where: { id: groupId },
            relations: ['users', 'events']
        });

        if (!group) {
            throw new CustomError(404, 'controller/groups.js - getGroupById - Group not found');
        }

        return group;
    } catch (e) {
        console.error('>>> ERROR : Error while fetching group by ID.');
        throw new CustomError(400, 'controller/groups.js - getGroupById - ' + e.message);
    }
}


export async function updateGroup(groupId, updates) {
    try {
        const group = await groupRepository.findOne({
            where: { id: groupId },
        });

        if (!group) {
            throw new CustomError(404, 'controller/groups.js - updateGroup - Group not found');
        }

        if (updates.name) {
            group.name = updates.name;
        }

        const updatedGroup = await groupRepository.save(group);

        console.log(`>>> INFO : Group ${groupId} successfully updated.`);
        return updatedGroup;
    } catch (e) {
        console.error('>>> ERROR : Error while updating the group.');
        throw new CustomError(400, 'controller/groups.js - updateGroup - ' + e.message);
    }
}
