import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    checkInDate: {
      type: Date,
      required: [true, 'Please provide check-in date'],
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Please provide check-out date'],
    },
    nights: {
      type: Number,
      required: true,
      min: 1,
    },
    guests: {
      type: Number,
      required: true,
      default: 1,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    cleaningFee: {
      type: Number,
      default: 500,
    },
    serviceFee: {
      type: Number,
      default: 300,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    guestDetails: {
      fullName: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      governmentId: {
        type: String,
        trim: true,
      },
      purposeOfStay: {
        type: String,
        trim: true,
      },
      specialRequests: {
        type: String,
        trim: true,
      },
    },
    paymentInfo: {
      id: {
        type: String,
        default: () => `PAY_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      },
      status: {
        type: String,
        default: 'Paid',
      },
      method: {
        type: String,
        default: 'Card / UPI',
      },
    },
    orderStatus: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    cancellationReason: {
      type: String,
      trim: true,
      default: null,
    },
    cancelledBy: {
      type: String,
      enum: ['guest', 'host', 'admin'],
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
