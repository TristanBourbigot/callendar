const {EntitySchema} = require("typeorm");

module.exports = new EntitySchema({
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
        moment: {
            type: 'varchar',
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