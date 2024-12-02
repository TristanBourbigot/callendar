const {EntitySchema} = require('typeorm');

module.exports = new EntitySchema({
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