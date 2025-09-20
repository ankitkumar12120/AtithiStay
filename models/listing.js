const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review.js')
const user = require('./users.js');

const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    filename: String,
    url: String,
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: Review
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: user
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  categories: {
    type: String,
    enum: ["Trending", "Rooms", "Iconic Cities", "Mountain", "Castle", "Amazing Pool", "Camping", "Farms", "Arctic"],
    required: true
  }
})

listingSchema.post("findByIdAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.review } })
  }
})

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;