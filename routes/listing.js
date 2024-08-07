const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing, preprocessListingData} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,  preprocessListingData, upload.single('Listing[image]'), wrapAsync(listingController.createListing));

  //new route
  router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));


router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner, upload.single('Listing[image]'), validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

  //edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;