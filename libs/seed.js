import faker from "faker";
import { database } from "faker/locale/de_CH";
import moment from "moment";
import Event from "../models/event.js";

export default async function seed() {
	// Firstly delete all fake events
	await Event.deleteMany({});

	// Helper arrays and functions
	const categories = [
		"Free",
		"Music",
		"Workshop",
		"Film",
		"Family",
		"Market",
		"Exhibition",
		"Party",
		"Performing Arts",
		"Opening",
		"Food",
		"Reading",
	];
	function getRandom(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	// Array to hold the fake events
	const fakeEvents = [];

	// Create 15 fake events
	for (let i = 16; --i; ) {
		// Helper variables
		const randomCategory = categories[getRandom(0, categories.length - 1)];
		const randomDate = moment.utc().add(getRandom(3, 120), "days");
		const randomStartTime = getRandom(10, 23);

		// Event instance is created
		const event = await Event.create({
			name: faker.lorem.words(75),
			address: `${faker.address.streetAddress()}, ${faker.address.zipCode()}, Berlin`,
			category: randomCategory,
			summary: faker.lorem.words(80),
			description: faker.lorem.sentences(8),
			start_date: randomDate.format("dddd, DD MMMM YYYY"),
			end_date: randomDate.format("dddd, DD MMMM YYYY"),
			start_time: randomDate.add(randomStartTime, "hours").format("HH:mm"),
			end_time: randomDate.add(randomStartTime + 2, "hours"),
			happens_once: 1,
			free_event: 1,
			booking_required: 0,
			website: faker.internet.url(),
			email: faker.internet.email(),
			phone: faker.phone.phoneNumber(),
			image: faker.image.image(),
		});

		fakeEvents.push(event);
	}
}
