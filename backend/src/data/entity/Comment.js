const {EntitySchema} = require("typeorm");
const User = require("./User")
const Event = require("./Event")
const Suggestion = require("./Suggestion")

module.exports = new EntitySchema ({
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