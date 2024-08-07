// Description: This file contains all the middleware functions used in the application.

const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema, userSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    //console.log(req, "..", req.path, "..", req.originalUrl);
    req.session.redirectUrl = req.originalUrl;//passport reset session after autentication
    if (!req.isAuthenticated()) {
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if ((req.session.redirectUrl)) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.preprocessListingData = (req, res, next) => {
    const removeEmptyStrings = (obj) => {
      for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          removeEmptyStrings(obj[key]);
        } else if (obj[key] === '') {
          obj[key] = undefined; // Convert empty strings to undefined
        }
      }
    };
    removeEmptyStrings(req.body);
    next();
};
  
  
module.exports.validateListing = (req, res, next) => {
    let { error, value } = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);  
    } else {
      req.body = value;
      next();
    }
  };

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if ( error ) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);  
    } else {
      next();
    }
  }

  module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the author of this review!");
      return res.redirect(`/listings/${id}`);
    }
    next();
  }

  module.exports.validateUser = (req, res, next) => {
    let { error } = userSchema.validate(req.body);
    if ( error ) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);  
    } else {
      next();
    }
}