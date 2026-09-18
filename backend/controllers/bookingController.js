import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import Notification from '../models/Notification.js';

// @desc    Create a new booking with strict double-booking & date-overlap guard
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res, next) => {
  try {
    const {
      propertyId,
      checkInDate,
      checkOutDate,
      guests,
      guestDetails,
      paymentInfo,
    } = req.body;

    if (!propertyId || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide propertyId, checkInDate, and checkOutDate',
      });
    }

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid check-in or check-out date format',
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be strictly after check-in date',
      });
    }

    // Retrieve property
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Capacity check
    if (guests && guests > property.maxGuests) {
      return res.status(400).json({
        success: false,
        message: `Maximum allowed guests for this property is ${property.maxGuests}`,
      });
    }

    // DATE OVERLAP CHECK (Challenges Faced & Solutions - Slide 8 & 9)
    // Clash = existing start < my check-out AND existing end > my check-in
    const hasOverlap = property.hasDateOverlap(start, end);

    if (hasOverlap) {
      return res.status(400).json({
        success: false,
        message:
          'These dates are already booked by another traveler. Please choose different dates.',
      });
    }

    // Calculate nights & pricing
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const cleaningFee = property.cleaningFee || 500;
    const serviceFee = property.serviceFee || 300;
    const totalPrice = nights * property.pricePerNight + cleaningFee + serviceFee;

    // 1. Create Booking record
    const booking = await Booking.create({
      property: property._id,
      user: req.user.id,
      checkInDate: start,
      checkOutDate: end,
      nights,
      guests: guests || 1,
      guestDetails: {
        fullName: guestDetails?.fullName?.trim() || req.user.name,
        email: guestDetails?.email?.trim() || req.user.email,
        phone: guestDetails?.phone?.trim() || req.user.phone || '',
        governmentId: guestDetails?.governmentId?.trim() || '',
        purposeOfStay: guestDetails?.purposeOfStay?.trim() || 'Leisure / Vacation',
        specialRequests: guestDetails?.specialRequests?.trim() || '',
      },
      pricePerNight: property.pricePerNight,
      cleaningFee,
      serviceFee,
      totalPrice,
      paymentInfo: paymentInfo || {
        id: `TXN_${Date.now()}_${Math.floor(Math.random() * 90000 + 10000)}`,
        status: 'Paid',
        method: 'Mock Card / UPI',
      },
      orderStatus: 'confirmed',
    });

    // 2. Double Booking Prevention: $push dates into property.currentBookings (Slide 8 & 9)
    property.currentBookings.push({
      checkInDate: start,
      checkOutDate: end,
      bookingId: booking._id,
    });
    await property.save();

    // 3. Instant Notification Generation
    const formattedIn = start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedOut = end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    // Notification for Guest: Booking Confirmed
    await Notification.create({
      recipient: req.user.id,
      title: 'Booking Confirmed! ✈️',
      message: `Your reservation for "${property.title}" in ${property.city} from ${formattedIn} to ${formattedOut} (${nights} night${nights > 1 ? 's' : ''}) is confirmed!`,
      type: 'booking_confirmed',
      booking: booking._id,
      property: property._id,
    });

    // Notification for Host: Detailed Guest & Reservation Notification
    if (property.owner) {
      const guestName = guestDetails?.fullName?.trim() || req.user.name || 'A traveler';
      const guestEmail = guestDetails?.email?.trim() || req.user.email || 'N/A';
      const guestPhone = guestDetails?.phone?.trim() || req.user.phone || '';
      const guestsCount = guests || 1;

      await Notification.create({
        recipient: property.owner,
        title: `New Booking: ${guestName} reserved your stay! 💰`,
        message: `Guest ${guestName} (${guestEmail}) has reserved "${property.title}" for ${guestsCount} guest${guestsCount > 1 ? 's' : ''} from ${formattedIn} to ${formattedOut} (${nights} night${nights > 1 ? 's' : ''}). Total booking value: ₹${totalPrice.toLocaleString()}.`,
        type: 'booking_confirmed',
        booking: booking._id,
        property: property._id,
        guest: req.user._id || req.user.id,
        metadata: {
          guestName,
          guestEmail,
          guestPhone,
          guestsCount,
          nights,
          totalPrice,
          checkInDate: start,
          checkOutDate: end,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking successfully confirmed!',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for the currently logged in user
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('property', 'title images city address pricePerNight rating location propertyType')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get guest travel analytics & dashboard stats (total trips, spent, nights stayed, upcoming stays)
// @route   GET /api/bookings/guest/analytics
// @access  Private
export const getGuestAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const allBookings = await Booking.find({ user: userId })
      .populate('property', 'title images city address pricePerNight rating propertyType')
      .sort('-checkInDate');

    const confirmedOrCompleted = allBookings.filter((b) => b.orderStatus !== 'cancelled');
    const completedBookings = allBookings.filter((b) => b.orderStatus === 'completed');
    const cancelledBookings = allBookings.filter((b) => b.orderStatus === 'cancelled');

    const now = new Date();
    const activeTrips = confirmedOrCompleted.filter((b) => {
      const start = new Date(b.checkInDate);
      const end = new Date(b.checkOutDate);
      return start <= now && end >= now;
    });

    const upcomingTrips = confirmedOrCompleted.filter((b) => {
      const start = new Date(b.checkInDate);
      return start > now;
    });

    const pastTrips = confirmedOrCompleted.filter((b) => {
      const end = new Date(b.checkOutDate);
      return end < now || b.orderStatus === 'completed';
    });

    // Calculations
    const totalTripsCount = confirmedOrCompleted.length;
    const totalSpent = confirmedOrCompleted.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const totalNights = confirmedOrCompleted.reduce((sum, b) => sum + (b.nights || 0), 0);

    // Unique cities visited
    const citiesVisited = [
      ...new Set(
        confirmedOrCompleted
          .map((b) => b.property?.city)
          .filter(Boolean)
      ),
    ];

    // Next upcoming trip
    const sortedUpcoming = [...upcomingTrips].sort(
      (a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime()
    );
    const nextTrip = sortedUpcoming.length > 0 ? sortedUpcoming[0] : null;

    res.status(200).json({
      success: true,
      analytics: {
        totalTrips: totalTripsCount,
        totalSpent,
        totalNights,
        citiesVisitedCount: citiesVisited.length,
        citiesVisited,
        activeTripsCount: activeTrips.length,
        upcomingTripsCount: upcomingTrips.length,
        pastTripsCount: pastTrips.length,
        cancelledTripsCount: cancelledBookings.length,
        nextTrip,
        recentBookings: allBookings.slice(0, 6),
        allBookings,
        upcomingTrips,
        pastTrips,
        cancelledBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking details
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingDetails = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('property')
      .populate('user', 'name email avatar');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Ensure only the booker or property owner, host, or admin can view
    const currentUserId = (req.user._id || req.user.id)?.toString();
    const guestId = (booking.user?._id || booking.user)?.toString();
    const propOwnerId = booking.property?.owner?._id?.toString() || booking.property?.owner?.toString();

    const isGuest = guestId && guestId === currentUserId;
    const isOwnerHost = propOwnerId && propOwnerId === currentUserId;
    const isHostRole = req.user.role === 'host';
    const isAdmin = req.user.role === 'admin';

    if (!isGuest && !isOwnerHost && !isHostRole && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this booking',
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking and release booked dates from property (by Guest, Host, or Admin)
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('property')
      .populate('user', 'name email phone avatar');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.orderStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    // Robust ID extraction
    const currentUserId = (req.user._id || req.user.id)?.toString();
    const guestId = (booking.user?._id || booking.user)?.toString();

    // Look up property to ensure we have the authentic owner ID
    let propOwnerId = booking.property?.owner?._id?.toString() || booking.property?.owner?.toString();
    if (!propOwnerId && booking.property) {
      const propDoc = await Property.findById(booking.property?._id || booking.property).select('owner');
      propOwnerId = propDoc?.owner?.toString();
    }

    const isGuest = guestId && guestId === currentUserId;
    const isOwnerHost = propOwnerId && propOwnerId === currentUserId;
    const isHostRole = req.user?.role === 'host';
    const isAdmin = req.user?.role === 'admin';

    // Authorized if: guest who made the booking, owner of the property, host user role, or admin
    if (!isGuest && !isOwnerHost && !isHostRole && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this booking',
      });
    }

    const isHostAction = isOwnerHost || isHostRole || (isAdmin && !isGuest);
    const cancellationReason = req.body?.reason?.trim() || (isHostAction ? 'Host cancelled reservation due to unforeseen circumstances' : 'Guest requested cancellation');
    const cancelledBy = isHostAction ? 'host' : isGuest ? 'guest' : 'admin';

    booking.orderStatus = 'cancelled';
    booking.cancellationReason = cancellationReason;
    booking.cancelledBy = cancelledBy;
    booking.cancelledAt = new Date();
    await booking.save();

    // 1. Unlock dates: Remove booking dates from property.currentBookings
    const targetPropId = booking.property?._id || booking.property;
    if (targetPropId) {
      await Property.findByIdAndUpdate(targetPropId, {
        $pull: { currentBookings: { bookingId: booking._id } },
      });
    }

    // 2. Dispatch Notifications to both Host and Guest
    const formattedIn = new Date(booking.checkInDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedOut = new Date(booking.checkOutDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const propertyTitle = booking.property?.title || 'Your stay';

    if (isHostAction) {
      // Notification to Guest informing them the Host cancelled with reason
      if (booking.user?._id || booking.user) {
        await Notification.create({
          recipient: booking.user._id || booking.user,
          title: `Reservation Cancelled by Host ⚠️`,
          message: `Your reservation at "${propertyTitle}" (${formattedIn} – ${formattedOut}) was cancelled by the host. Reason: "${cancellationReason}". Full refund has been initiated.`,
          type: 'booking_cancelled',
          booking: booking._id,
          property: booking.property?._id || booking.property,
          metadata: {
            guestName: booking.user?.name,
            guestEmail: booking.user?.email,
            cancellationReason,
            cancelledBy: 'host',
            nights: booking.nights,
            totalPrice: booking.totalPrice,
            checkInDate: booking.checkInDate,
            checkOutDate: booking.checkOutDate,
          },
        });
      }

      // Notification confirmation to Host
      await Notification.create({
        recipient: currentUserId,
        title: `Booking #${booking._id.toString().slice(-6).toUpperCase()} Cancelled ❌`,
        message: `You cancelled the reservation for guest ${booking.user?.name || 'Traveler'} at "${propertyTitle}". Reason provided: "${cancellationReason}". The calendar dates are now unlocked and reopened for bookings.`,
        type: 'booking_cancelled',
        booking: booking._id,
        property: booking.property?._id || booking.property,
        metadata: {
          guestName: booking.user?.name,
          guestEmail: booking.user?.email,
          cancellationReason,
          cancelledBy: 'host',
          nights: booking.nights,
          totalPrice: booking.totalPrice,
          checkInDate: booking.checkInDate,
          checkOutDate: booking.checkOutDate,
        },
      });
    } else {
      // Guest cancelled - Notify Host
      let targetHost = propOwnerId;
      if (!targetHost && booking.property) {
        const p = await Property.findById(booking.property?._id || booking.property).select('owner');
        targetHost = p?.owner;
      }

      if (targetHost) {
        const guestName = booking.guestDetails?.fullName || booking.user?.name || 'A traveler';
        const guestEmail = booking.guestDetails?.email || booking.user?.email || 'N/A';

        await Notification.create({
          recipient: targetHost,
          title: `Guest Cancelled Reservation ⚠️`,
          message: `Guest ${guestName} (${guestEmail}) cancelled their reservation at "${propertyTitle}" (${formattedIn} – ${formattedOut}). Reason: "${cancellationReason}". The dates are now available for other guests.`,
          type: 'booking_cancelled',
          booking: booking._id,
          property: booking.property?._id || booking.property,
          guest: booking.user?._id || booking.user,
          metadata: {
            guestName,
            guestEmail,
            cancellationReason,
            cancelledBy: 'guest',
            nights: booking.nights,
            totalPrice: booking.totalPrice,
            checkInDate: booking.checkInDate,
            checkOutDate: booking.checkOutDate,
          },
        });
      }

      // Guest cancellation confirmation notification for Guest
      if (currentUserId) {
        await Notification.create({
          recipient: currentUserId,
          title: `Reservation Cancelled ❌`,
          message: `Your reservation at "${propertyTitle}" (${formattedIn} – ${formattedOut}) has been cancelled. Your refund has been scheduled.`,
          type: 'booking_cancelled',
          booking: booking._id,
          property: booking.property?._id || booking.property,
          metadata: {
            cancellationReason,
            cancelledBy: 'guest',
            nights: booking.nights,
            totalPrice: booking.totalPrice,
            checkInDate: booking.checkInDate,
            checkOutDate: booking.checkOutDate,
          },
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled and dates unlocked successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Get host analytics (occupied rooms, rent money earned, total tenants, next booking, etc.)
// @route   GET /api/bookings/host/analytics
// @access  Private (Host/Admin)
export const getHostAnalytics = async (req, res, next) => {
  try {
    const hostId = req.user.id;

    // 1. Fetch all properties owned by this host
    const properties = await Property.find({ owner: hostId });
    const propertyIds = properties.map((p) => p._id);

    // If host has no properties listed yet
    if (properties.length === 0) {
      return res.status(200).json({
        success: true,
        analytics: {
          totalProperties: 0,
          totalBedrooms: 0,
          occupiedBedrooms: 0,
          occupancyRate: 0,
          totalEarnings: 0,
          totalTenants: 0,
          activeBookingsCount: 0,
          nextBooking: null,
          recentBookings: [],
          propertyPerformance: [],
        },
      });
    }

    // 2. Fetch all bookings (including completed and cancelled for full historical logs)
    const allBookings = await Booking.find({
      property: { $in: propertyIds },
    })
      .populate('property', 'title city images bedrooms pricePerNight')
      .populate('user', 'name email avatar')
      .sort('-checkInDate');

    const activeOrCompletedBookings = allBookings.filter((b) => b.orderStatus !== 'cancelled');

    const now = new Date();

    // 3. Calculate Rent Money Earned (Total gross revenue from non-cancelled bookings)
    const totalEarnings = activeOrCompletedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    // 4. Calculate Unique Tenants (Number of distinct guest users who booked)
    const tenantUserIds = new Set(activeOrCompletedBookings.map((b) => b.user?._id?.toString() || b.user?.toString()));
    const totalTenants = tenantUserIds.size;

    // 5. Total bedrooms across all host properties
    const totalBedrooms = properties.reduce((sum, p) => sum + (p.bedrooms || 1), 0);

    // 6. Current Occupied Rooms & Active Bookings right now
    // A booking is currently active if checkIn <= now < checkOut and not cancelled
    const currentlyActiveBookings = activeOrCompletedBookings.filter((b) => {
      const start = new Date(b.checkInDate);
      const end = new Date(b.checkOutDate);
      return start <= now && end > now;
    });

    const activePropertyIds = new Set(currentlyActiveBookings.map((b) => b.property?._id?.toString()));
    const occupiedBedrooms = properties
      .filter((p) => activePropertyIds.has(p._id.toString()))
      .reduce((sum, p) => sum + (p.bedrooms || 1), 0);

    const occupancyRate = totalBedrooms > 0
      ? Math.min(100, Math.round((occupiedBedrooms / totalBedrooms) * 100))
      : 0;

    // 7. Categorize Incoming vs Past vs Cancelled Bookings
    // Incoming: checkOutDate >= now and not cancelled (sorted earliest checkIn first)
    const incomingBookings = activeOrCompletedBookings
      .filter((b) => new Date(b.checkOutDate) >= now)
      .sort((a, b) => new Date(a.checkInDate) - new Date(b.checkInDate));

    // Past: checkOutDate < now or orderStatus === 'completed' (excluding cancelled)
    const pastBookings = activeOrCompletedBookings
      .filter((b) => new Date(b.checkOutDate) < now || b.orderStatus === 'completed')
      .sort((a, b) => new Date(b.checkOutDate) - new Date(a.checkOutDate));

    // Cancelled bookings
    const cancelledBookings = allBookings
      .filter((b) => b.orderStatus === 'cancelled')
      .sort((a, b) => new Date(b.cancelledAt || b.updatedAt) - new Date(a.cancelledAt || a.updatedAt));

    // Next upcoming booking
    const upcomingBookings = activeOrCompletedBookings
      .filter((b) => new Date(b.checkInDate) >= now)
      .sort((a, b) => new Date(a.checkInDate) - new Date(b.checkInDate));
    const nextBooking = upcomingBookings.length > 0 ? upcomingBookings[0] : null;

    // 8. Property Performance Breakdown
    const propertyPerformance = properties.map((prop) => {
      const propBookings = activeOrCompletedBookings.filter(
        (b) => (b.property?._id?.toString() || b.property?.toString()) === prop._id.toString()
      );
      const propEarnings = propBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
      const isCurrentlyOccupied = activePropertyIds.has(prop._id.toString());

      return {
        id: prop._id,
        title: prop.title,
        city: prop.city,
        pricePerNight: prop.pricePerNight,
        image: prop.images?.[0] || '',
        totalBookings: propBookings.length,
        earnings: propEarnings,
        isOccupied: isCurrentlyOccupied,
        bedrooms: prop.bedrooms,
      };
    });

    // 9. Monthly Revenue & Booking Trends (Last 6 Months for Interactive Graphs)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mName = monthNames[d.getMonth()];
      const yVal = d.getFullYear();
      const monthStart = new Date(yVal, d.getMonth(), 1);
      const monthEnd = new Date(yVal, d.getMonth() + 1, 0, 23, 59, 59);

      const mBookings = activeOrCompletedBookings.filter((b) => {
        const bDate = new Date(b.createdAt || b.checkInDate);
        return bDate >= monthStart && bDate <= monthEnd;
      });

      const mRevenue = mBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
      monthlyRevenue.push({
        month: `${mName}`,
        revenue: mRevenue,
        bookings: mBookings.length,
      });
    }

    res.status(200).json({
      success: true,
      analytics: {
        totalProperties: properties.length,
        totalBedrooms,
        occupiedBedrooms,
        occupancyRate,
        totalEarnings,
        totalTenants,
        activeBookingsCount: currentlyActiveBookings.length,
        nextBooking,
        allBookings,
        incomingBookings,
        pastBookings,
        cancelledBookings,
        recentBookings: allBookings.slice(0, 8),
        propertyPerformance,
        monthlyRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset all bookings and unlock dates for host properties (Stats reset to 0)
// @route   POST /api/bookings/host/reset-bookings
// @access  Private (Host/Admin)
export const resetHostBookings = async (req, res, next) => {
  try {
    const hostId = req.user.id;

    // Find all properties owned by host (or all if host role)
    let properties = await Property.find({ owner: hostId });
    if (properties.length === 0 && req.user.role === 'host') {
      properties = await Property.find();
    }

    const propIds = properties.map((p) => p._id);

    // Delete all bookings associated with host's properties
    const deleteResult = await Booking.deleteMany({ property: { $in: propIds } });

    // Unlock dates for all properties (clear currentBookings)
    await Property.updateMany(
      { _id: { $in: propIds } },
      { $set: { currentBookings: [] } }
    );

    // Clear booking-related notifications for this host & relevant bookings
    await Notification.deleteMany({
      $or: [
        { recipient: hostId },
        { property: { $in: propIds } },
      ],
    });

    res.status(200).json({
      success: true,
      message: `Successfully reset all bookings. Deleted ${deleteResult.deletedCount} bookings. All dates are unlocked and stats are reset to 0!`,
    });
  } catch (error) {
    next(error);
  }
};

