import Listing from '../models/listing.model.js'; 
import { errorHandler } from '../utils/error.js'; 


export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body); // Create a new listing with request body data
    return res.status(201).json(listing); 
  } catch (error) {
    next(error); 
  }
};


export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id); // Find listing by ID

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!')); 
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!')); 
  }

  try {
    await Listing.findByIdAndDelete(req.params.id); // Delete the listing
    res.status(200).json('Listing has been deleted!'); 
  } catch (error) {
    next(error); 
  }
};


export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id); 
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!')); 
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!')); 
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body, // Update listing with request body data
      { new: true } 
    );
    res.status(200).json(updatedListing); // Send the updated listing as response
  } catch (error) {
    next(error);
  }
};


export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id); 
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!')); 
    }
    res.status(200).json(listing); 
  } catch (error) {
    next(error); 
  }
};


export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9; // Limit the number of listings per page
    const startIndex = parseInt(req.query.startIndex) || 0; // Start index of page

    const brand = req.query.brand || ''; // Filter by brand
    const variant = req.query.variant || ''; // Filter by variant
    const fuelType = req.query.fuelType || ''; // Filter by fuel type
    const transmissionType = req.query.transmissionType || ''; // Filter by transmission type

    let sortField = 'createdAt'; // Default sort field
    let sortOrder = -1; // Default sort order (descending)

    if (req.query.sort === 'Price low to high') {
      sortField = 'askingPrice';
      sortOrder = 1;
    } else if (req.query.sort === 'Price high to low') {
      sortField = 'askingPrice';
      sortOrder = -1;
    } else if (req.query.sort === 'Latest') {
      sortField = 'createdAt';
      sortOrder = -1;
    } else if (req.query.sort === 'Oldest') {
      sortField = 'createdAt';
      sortOrder = 1;
    }

    // Log parsed values for debugging
    console.log({ sortField, sortOrder, limit, startIndex });

    // Build query object
    const query = {
      brand: { $regex: brand, $options: 'i' }, // Case-insensitive brand filter
      variant: { $regex: variant, $options: 'i' }, // Case-insensitive variant filter
    };

    if (fuelType) query.fuelType = fuelType; // Add fuel type filter if specified
    if (transmissionType) query.transmissionType = transmissionType; // Add transmission type filter if specified

    const listings = await Listing.find(query)
      .sort({ [sortField]: sortOrder }) // Sort listings
      .limit(limit) // Limit the number of listings
      .skip(startIndex); // Skip listings for pagination

    return res.status(200).json(listings); // Send the listings as response
  } catch (error) {
    next(error); // Pass error to the error handler
  }
};
