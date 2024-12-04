import {EntitySchema} from 'typeorm';
import {User} from "./User.js";

export const Event = new EntitySchema ({
    name: 'Event',
    tableName: 'events',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        title: {
            type: 'varchar',
        },
        description: {
            type: 'text',
        },
        place: {
            type: 'varchar',
        },
        start: {
            type: 'varchar',
        },
        end: {
            type: 'varchar',
        },
        category: {
            type: 'varchar'
        },
        allDay: {
            type: 'boolean'
        },
    },
    relations: {
        users: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: {name: 'email'},
            onDelete: 'CASCADE'
        }
    }
});