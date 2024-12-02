import {EntitySchema} from 'typeorm';
import {User} from "./User.js";
import {Event} from "./Event.js";
import {Suggestion} from "./Suggestion.js";

export const Comment =  new EntitySchema ({
    name: 'Comment',
    tableName: 'comments',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        content: {
            type: 'text',
        },
    },
    relations: {
        users: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: {name: 'email'},
            onDelete: 'CASCADE'
        },
        events: {
            type: 'many-to-one',
            target: 'Event',
            joinColumn: {name: 'id'},
            onDelete: 'CASCADE'
        },
        suggestions: {
            type: 'many-to-one',
            target: 'Suggestion',
            joinColumn: {name: 'id'},
            onDelete: 'CASCADE'
        },
    }
});