import faker from "faker";
import Event from "../models/event.js";

export default async function seed() {
    // Firstly delete all fake events 
    await Event.deleteMany({});

    const fakeEvents = [];
    const categories = ["Free", "Music", "Workshop", "Film", "Family", "Market", "Exhibition", "Party", "Performing Arts", "Opening", "Food", "Reading"];
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }


    for ( let i = 16; --i; ) {
        const event = await Event.create({
            name: faker.lorem.words(75),
            address: `${faker.address.streetAddress}, ${faker.address.zipCode}, Berlin`,
            category: categories[getRandom(0, categories.length - 2)],

        });
        fakeEvents.push(event);
    }
}