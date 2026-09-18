import Notification from '../models/Notification.js';
import Booking from '../models/Booking.js';
import Property from '../models/Property.js';

/**
 * Helper to generate checkout/stay-end notifications automatically
 * Checks for bookings that have passed their check-out date
 */
export const checkAndCreateStayEndNotifications = async (userId) => {
  try {
    const now = new Date();

    // 1. Find completed bookings for this user where checkOutDate < now
    const pastBookings = await Booking.find({
      user: userId,
      checkOutDate: { $lte: now },
      orderStatus: 'confirmed',
    }).populate('property', 'title city owner');

    for (const booking of pastBookings) {
      // Check if checkout notification already exists for this booking & recipient
      const guestNotifExists = await Notification.findOne({
        recipient: userId,
        booking: booking._id,
        type: 'stay_completed',
      });

      if (!guestNotifExists && booking.property) {
        await Notification.create({
          recipient: userId,
          title: 'Stay Completed! Hope you enjoyed your trip 🌟',
          message: `Your reservation at "${booking.property.title}" in ${booking.property.city} has concluded. Thank you for booking with HomelyHub!`,
          type: 'stay_completed',
          booking: booking._id,
          property: booking.property._id,
        });
      }

      // Check if host got stay completed notification
      if (booking.property && booking.property.owner) {
        const hostNotifExists = await Notification.findOne({
          recipient: booking.property.owner,
          booking: booking._id,
          type: 'stay_completed',
        });

        if (!hostNotifExists) {
          await Notification.create({
            recipient: booking.property.owner,
            title: 'Guest Checkout Completed 🏡',
            message: `Reservation at "${booking.property.title}" has concluded. The stay dates are now unlocked for new bookings.`,
            type: 'stay_completed',
            booking: booking._id,
            property: booking.property._id,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error checking stay end notifications:', error);
  }
};

/**
 * Helper to ensure host receives notifications for all guest bookings & cancellations on their properties
 */
export const syncHostBookingNotifications = async (userId, userRole) => {
  try {
    const currentUserId = userId?.toString();

    // Find all properties owned by this host (or if user is host role, find properties assigned to them or created)
    let properties = await Property.find({ owner: currentUserId }).select('_id title city owner');
    if ((!properties || properties.length === 0) && userRole === 'host') {
      properties = await Property.find().select('_id title city owner');
    }
    if (!properties || properties.length === 0) return;

    const propIds = properties.map((p) => p._id);
    const propMap = new Map(properties.map((p) => [p._id.toString(), p]));

    // Find all bookings for properties owned by this host
    const bookings = await Booking.find({
      property: { $in: propIds },
    })
      .populate('user', 'name email phone avatar')
      .sort('-createdAt');

    for (const b of bookings) {
      if (!b.property) continue;
      const prop = propMap.get(b.property.toString());
      if (!prop) continue;

      const guestName = b.guestDetails?.fullName || b.user?.name || 'A traveler';
      const guestEmail = b.guestDetails?.email || b.user?.email || 'guest@homelyhub.com';
      const guestPhone = b.guestDetails?.phone || b.user?.phone || '+91 98765 43210';
      const guestsCount = b.guests || 1;
      const formattedIn = new Date(b.checkInDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      const formattedOut = new Date(b.checkOutDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

      // 1. Check if booking_confirmed notification exists for host
      const existingConfirmed = await Notification.findOne({
        recipient: currentUserId,
        booking: b._id,
        type: 'booking_confirmed',
      });

      if (!existingConfirmed) {
        await Notification.create({
          recipient: currentUserId,
          title: `New Booking: ${guestName} reserved your stay! 💰`,
          message: `Guest ${guestName} (${guestEmail}) has reserved "${prop.title}" in ${prop.city} for ${guestsCount} guest${guestsCount > 1 ? 's' : ''} from ${formattedIn} to ${formattedOut} (${b.nights} night${b.nights > 1 ? 's' : ''}). Total booking value: ₹${(b.totalPrice || 0).toLocaleString()}.`,
          type: 'booking_confirmed',
          booking: b._id,
          property: prop._id,
          guest: b.user?._id || b.user,
          metadata: {
            guestName,
            guestEmail,
            guestPhone,
            guestsCount,
            nights: b.nights,
            totalPrice: b.totalPrice,
            checkInDate: b.checkInDate,
            checkOutDate: b.checkOutDate,
          },
          createdAt: b.createdAt || new Date(),
        });
      }

      // 2. Check if booking is cancelled and host needs a cancellation notification
      if (b.orderStatus === 'cancelled') {
        const existingCancelled = await Notification.findOne({
          recipient: currentUserId,
          booking: b._id,
          type: 'booking_cancelled',
        });

        if (!existingCancelled) {
          const reason = b.cancellationReason || 'No reason specified';
          const isCancelledByHost = b.cancelledBy === 'host';

          await Notification.create({
            recipient: currentUserId,
            title: isCancelledByHost ? `Booking Cancelled (Host Action) ❌` : `Guest Cancelled Reservation ⚠️`,
            message: isCancelledByHost
              ? `You cancelled reservation for guest ${guestName} at "${prop.title}". Reason: "${reason}". Dates are unlocked.`
              : `Guest ${guestName} (${guestEmail}) cancelled reservation at "${prop.title}" (${formattedIn} – ${formattedOut}). Reason: "${reason}". Dates are unlocked.`,
            type: 'booking_cancelled',
            booking: b._id,
            property: prop._id,
            guest: b.user?._id || b.user,
            metadata: {
              guestName,
              guestEmail,
              cancellationReason: reason,
              cancelledBy: b.cancelledBy || 'guest',
              nights: b.nights,
              totalPrice: b.totalPrice,
              checkInDate: b.checkInDate,
              checkOutDate: b.checkOutDate,
            },
            createdAt: b.cancelledAt || b.updatedAt || new Date(),
          });
        }
      }
    }
  } catch (err) {
    console.error('Error syncing host booking notifications:', err);
  }
};


// @desc    Get all notifications for logged in user (with automatic stay end check)
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = async (req, res, next) => {
  try {
    const userId = (req.user._id || req.user.id)?.toString();

    // Run automated stay completion check
    await checkAndCreateStayEndNotifications(userId);

    // If the user is a host (or owns properties), sync guest booking and cancellation notifications
    await syncHostBookingNotifications(userId, req.user.role);

    const notifications = await Notification.find({ recipient: userId })
      .populate('property', 'title city images')
      .populate('guest', 'name email avatar')
      .sort('-createdAt')
      .limit(40);

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markNotificationAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};
