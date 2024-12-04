import {EntitySchema} from 'typeorm';

export const Suggestion = new EntitySchema({
    name: 'Suggestion',
    tableName: 'suggestions',
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
        maximalApprovalDate: {
            type: 'varchar'
        }
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