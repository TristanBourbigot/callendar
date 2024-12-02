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
        },
    },
});