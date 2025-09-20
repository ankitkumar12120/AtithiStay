require('dotenv').config();
const mongoose = require('mongoose')
const Listing = require('../models/listing.js')
const initData = require('./data.js')
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

const init = async () => {
  await Listing.deleteMany({})
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "67f8c8c6e23d29737e24a4f1",
    geometry: obj.geometry || {
      type: "Point",
      coordinates: [77.2088, 28.6139] // Default coordinates, replace as needed
    },
    categories: obj.categories || "Trending" // <-- Add this line
  }));
  await Listing.insertMany(initData.data)
  console.log("Data inserted")
}

init();