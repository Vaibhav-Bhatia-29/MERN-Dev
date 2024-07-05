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
    const year = parseInt(req.query.year) || null; // Filter by year
    const fuelType = req.query.fuelType === 'true'; // Filter by fuel type
    const transmissionType = req.query.transmissionType === 'true'; // Filter by transmission type
    const minPrice = parseInt(req.query.minPrice) || 0; // Minimum price filter
    const maxPrice = parseInt(req.query.maxPrice) || Infinity; // Maximum price filter
    const searchTerm = req.query.searchTerm || ''; // Search term filter

    const sort = req.query.sort || 'createdAt'; // Sort listings by field
    const order = req.query.order === 'asc' ? 1 : -1; // Sort order (ascending or descending)

    // Build query object
    const query = {
      brand: { $regex: brand, $options: 'i' }, // Case-insensitive brand filter
      variant: { $regex: searchTerm, $options: 'i' }, // Case-insensitive variant filter
      askingPrice: { $gte: minPrice, $lte: maxPrice }, // Price range filter
    };

    if (year) query.year = year; // Add year filter if specified
    if (req.query.fuelType !== undefined) query.fuelType = fuelType; // Add fuel type filter if specified
    if (req.query.transmissionType !== undefined) query.transmissionType = transmissionType; // Add transmission type filter if specified

    const listings = await Listing.find(query)
      .sort({ [sort]: order }) // Sort listings
      .limit(limit) // Limit the number of listings
      .skip(startIndex); // Skip listings for pagination

    return res.status(200).json(listings); // Send the listings as response
  } catch (error) {
    next(error); // Pass error to the error handler
  }
};
