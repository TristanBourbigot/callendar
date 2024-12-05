import {EntitySchema} from 'typeorm';

export const User = new EntitySchema({
    name: 'User',
    tableName: 'users',
    columns: {
        email: {
            primary: true,
            type: 'varchar',
        },
        firstName: {
            type: 'varchar',
        },
        lastName: {
            type: 'varchar',
        },
        password: {
            type: 'varchar',
        }
    },
    relations: {
        groups: {
            type: 'many-to-many',
            target: 'Groups',
            inverseSide: 'users',
            joinTable: {
                name: 'user_groups',
                joinColumn: {
                    name: 'user_email',
                    referencedColumnName: 'email'
                },
                inverseJoinColumn: {
                    name: 'group_id',
                    referencedColumnName: 'id'
                }
            }
        }
    }
});