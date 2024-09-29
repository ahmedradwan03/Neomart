const express = require('express');
const reviewController = require('./../controllers/review.controller');
const isAuthenticate = require('./../middleware/authentication.middleware');
const { allowedTo } = require('./../middleware/allowedTo.middleware');
const { validation } = require('./../middleware/validation.middleware');
const reviewValidation = require('./../validation/review.validation');

const router = express.Router({ mergeParams: true });

// Middlewares
router.use(isAuthenticate, allowedTo('user'));

// add review
router.post('/:productId', validation(reviewValidation.addReview), reviewController.addReview);

// update review
router.patch('/:productId/:id', validation(reviewValidation.updateReview), reviewController.updateReview);

// delete review
router.delete('/:productId/:id', validation(reviewValidation.deleteReview), reviewController.deleteReview);

module.exports = router;