import mongoose from 'mongoose';

const bookingRangeSchema = new mongoose.Schema(
  {
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
  },
  { _id: false }
);

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide property title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide property description'],
    },
    propertyType: {
      type: String,
      required: [true, 'Please select property type'],
      enum: ['House', 'Flat', 'Guest House', 'Hotel', 'Villa', 'Cottage'],
      default: 'House',
    },
    roomType: {
      type: String,
      enum: ['Entire place', 'Private room', 'Shared room'],
      default: 'Entire place',
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Please specify price per night'],
      min: [0, 'Price cannot be negative'],
    },
    cleaningFee: {
      type: Number,
      default: 500,
    },
    serviceFee: {
      type: Number,
      default: 300,
    },
    address: {
      type: String,
      required: [true, 'Please provide street address'],
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true,
      index: true,
    },
    state: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: 'India',
    },
    location: {
      lat: {
        type: Number,
        required: [true, 'Latitude coordinate is required for Leaflet map'],
        default: 18.922,
      },
      lng: {
        type: Number,
        required: [true, 'Longitude coordinate is required for Leaflet map'],
        default: 72.834,
      },
    },
    bedrooms: {
      type: Number,
      default: 1,
      min: 1,
    },
    bathrooms: {
      type: Number,
      default: 1,
      min: 1,
    },
    maxGuests: {
      type: Number,
      required: [true, 'Please specify maximum guests allowed'],
      default: 2,
      min: 1,
    },
    amenities: {
      type: [String],
      default: ['Wifi', 'Air conditioning', 'Kitchen'],
    },
    images: {
      type: [String],
      default: [],
    },
    checkInTime: {
      type: String,
      default: '14:00',
    },
    checkOutTime: {
      type: String,
      default: '11:00',
    },
    houseRules: {
      type: [String],
      default: ['No smoking indoors', 'Quiet hours after 10 PM', 'Pets allowed on request'],
    },
    // Double Booking tracking: push dates into property.currentBookings as per presentation
    currentBookings: [bookingRangeSchema],
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Method to verify if a date range clashes with any currentBookings
// Overlap formula: existing.checkInDate < myCheckOutDate && existing.checkOutDate > myCheckInDate
propertySchema.methods.hasDateOverlap = function (requestedCheckIn, requestedCheckOut) {
  const checkIn = new Date(requestedCheckIn);
  const checkOut = new Date(requestedCheckOut);

  return this.currentBookings.some((booking) => {
    const existingStart = new Date(booking.checkInDate);
    const existingEnd = new Date(booking.checkOutDate);

    return existingStart < checkOut && existingEnd > checkIn;
  });
};

const Property = mongoose.model('Property', propertySchema);
export default Property;
