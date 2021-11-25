import moment from "moment";

const date = moment.utc();
console.log(date.add(3, "days").format("dddd, DD MMMM YYYY"));
console.log(date.add(3, "days").format("HH:mm"));
console.log(date.format());
console.log(moment()); // gives local time, not UTC!
console.log(moment('2022-01-01').format("dddd, DD MMMM YYYY")); // pass the string from frontend into the moment() function
