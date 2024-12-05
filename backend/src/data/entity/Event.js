import {EntitySchema} from 'typeorm';

export const Event = new EntitySchema({
    name: 'Event',
    tableName: 'events',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true
        },
        title: {
            type: 'varchar',
        },
        description: {
            type: 'text',
            nullable: true
        },
        start: {
            type: 'varchar',
        },
        end: {
            type: 'varchar',
        },
        place: {
            type: 'varchar',
        },
        category: {
            type: 'varchar',
        },
        allDay: {
            type: 'boolean',
        }
    },
    relations: {
        group: {
            type: 'many-to-one',
            target: 'Groups',
            joinColumn: {
                name: 'group_id',
                referencedColumnName: 'id'
            },
            nullable: true
        }
    }
});