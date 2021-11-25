import faker from "faker";
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
		const randomStartTime = getRandom(0, 5);

		// Event instance is created
		const event = await Event.create({
			name: faker.random.words(7),
			address: `${faker.address.streetAddress()}, ${faker.address.zipCode()}, Berlin`,
			category: randomCategory,
			summary: faker.random.words(7),
			description: faker.random.words(75),
			start_date: randomDate.format("dddd, DD MMMM YYYY"),
			end_date: randomDate.format("dddd, DD MMMM YYYY"),
			start_time: randomDate.add(randomStartTime, "hours").startOf("hour").format("HH:mm"),
			end_time: randomDate.add(randomStartTime + 2, "hours").startOf("hour").format("HH:mm"),
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
