const {EntitySchema} = require("typeorm");
const User = require("./User")

module.exports = new EntitySchema ({
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
        moment: {
            type: 'varchar',
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