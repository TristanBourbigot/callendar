import { EntitySchema } from 'typeorm';

export const Groups = new EntitySchema({
    name: 'Groups',
    tableName: 'groups',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true
        },
        name: {
            type: 'varchar',
        }
    },
    relations: {
        users: {
            type: 'many-to-many',
            target: 'User',
            inverseSide: 'groups',
            joinTable: {
                name: 'user_groups',
                joinColumn: {
                    name: 'group_id',
                    referencedColumnName: 'id'
                },
                inverseJoinColumn: {
                    name: 'user_email',
                    referencedColumnName: 'email'
                }
            }
        },
        events: {
            type: 'one-to-many',
            target: 'Event',
            inverseSide: 'group'
        }
    }
});