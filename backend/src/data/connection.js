const { DataSource } = require('typeorm');
const User = require('./entity/User');
const Event = require('./entity/Event');
const Suggestion = require('./entity/Suggestion');
const Comment = require('./entity/Comment');

module.exports = new DataSource({
	type: 'sqlite',
	database: './backend/src/data/db.sqlite',  // Path to your SQLite database
	synchronize: true,        // Automatically sync schema changes (useful for development)
	logging: true,
	entities: [User, Event, Suggestion, Comment],
});