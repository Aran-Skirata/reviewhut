const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const express = require("express");
const router = express.Router();
const { isLoggedIn, verifyOwner, validatePlace } = require("../middleware");
const placeControllers = require('../controllers/places');

router.route('/')
  .get(
    asyncErrorHandler(placeControllers.index)
  )
  .post(
    isLoggedIn,
    validatePlace,
    asyncErrorHandler(placeControllers.createPlace)
  )

router.get("/new", isLoggedIn, placeControllers.renderNewForm
);

router.route("/:id")
  .get(
  asyncErrorHandler(placeControllers.renderPlaceDetails)
  )
  .patch(
    validatePlace,
    isLoggedIn,
    verifyOwner,
    asyncErrorHandler(placeControllers.updatePlace)
  )
  .delete(
  isLoggedIn,
  verifyOwner,
  asyncErrorHandler(placeControllers.deletePlace)
  )

router.get(
  "/:id/edit",
  isLoggedIn,
  verifyOwner,
  asyncErrorHandler(placeControllers.renderPlaceEditForm)
);

module.exports = router;
