const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const express = require("express");
const router = express.Router();
const { isLoggedIn, verifyOwner, validatePlace } = require("../middleware");
const placeControllers = require('../controllers/places');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage, limits: {fileSize: 5000000, files: 5} })


router.route('/')
  .get(
    asyncErrorHandler(placeControllers.index)
  )
  .post(
    isLoggedIn,
    upload.array('images'),
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
    isLoggedIn,
    verifyOwner,
    upload.array('images'),
    validatePlace,
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
