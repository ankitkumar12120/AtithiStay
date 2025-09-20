const express = require('express')
const router = express.Router()
const Review = require('../models/review.js')
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const { postReview, deleteReview } = require('../controllers/review.js');

// Reviews route
//Post review route 

router.post('/', isLoggedIn, validateReview, wrapAsync(postReview))

// delete review route 
router.delete('/:id/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(deleteReview))

module.exports = router;