import { DataSource } from 'typeorm';
import {User} from './entity/User.js';
import {Event} from './entity/Event.js';
import {Suggestion} from './entity/Suggestion.js';
import {Comment} from './entity/Comment.js';

export const AppDataSource = new DataSource({
	type: 'sqlite',
	database: './src/data/db.sqlite',  // Path to your SQLite database
	synchronize: true,        // Automatically sync schema changes (useful for development)
	logging: true,
	entities: [User, Event, Suggestion, Comment],
});