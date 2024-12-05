import { DataSource } from 'typeorm';
import {User} from './entity/User.js';
import {Event} from './entity/Event.js';
import {Suggestion} from './entity/Suggestion.js';
import {Groups} from './entity/Groups.js';

export const AppDataSource = new DataSource({
	type: 'sqlite',
	database: './src/data/db.sqlite',
	synchronize: true,
	logging: true,
	entities: [User, Event, Suggestion, Groups],
});