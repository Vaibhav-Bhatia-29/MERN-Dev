import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    brand: { // Dropdown
      type: String,
      required: true,
    },
    variant: { 
        type: String,
        required: true,
      },
    year: { 
      type: Number,
      required: true,
    },
    fuelType: { // true->Petrol , false->Diesel 
      type: Boolean,
      required: true,
    },
    transmissionType: { // true->Automatic, false->Manual
      type: Boolean,
      required: true,
    },
    kmsDriven: { 
      type: Number,
      required: true,
    },
    askingPrice: {
      type: Number,
      required: true,
    },
    condition: { // Rating from 1-5
        type: Number,
        required: true,
      },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: { // For multiple listings of a single user
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;