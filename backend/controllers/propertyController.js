import Property from '../models/Property.js';
import APIFeatures from '../utils/apiFeatures.js';

// @desc    Get all properties with filtering, search, pagination & date-overlap exclusion
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res, next) => {
  try {
    const resPerPage = 12; // 12 properties per page as specified in presentation slide 6

    // Total documents before filtering
    const totalProperties = await Property.countDocuments();

    // Check if dates are passed for availability filtering
    const { checkIn, checkOut } = req.query;
    let clashingPropertyIds = [];

    if (checkIn && checkOut) {
      const requestedStart = new Date(checkIn);
      const requestedEnd = new Date(checkOut);

      if (!isNaN(requestedStart) && !isNaN(requestedEnd)) {
        // Date overlap logic: existing.start < requestedEnd AND existing.end > requestedStart
        const overlappingProps = await Property.find({
          'currentBookings': {
            $elemMatch: {
              checkInDate: { $lt: requestedEnd },
              checkOutDate: { $gt: requestedStart },
            },
          },
        }).select('_id');

        clashingPropertyIds = overlappingProps.map((p) => p._id);
      }
    }

    // Initialize APIFeatures
    let baseQuery = Property.find();

    // Exclude clashing properties if dates are specified (Slide 6: Already-booked dates hidden from search)
    if (clashingPropertyIds.length > 0) {
      baseQuery = baseQuery.find({ _id: { $nin: clashingPropertyIds } });
    }

    // Apply search and filter
    const apiFeatures = new APIFeatures(baseQuery, req.query)
      .search()
      .filter();

    // Count after filtering but before pagination
    const filteredPropertiesCount = await Property.countDocuments(
      apiFeatures.query.getFilter()
    );

    // Apply sorting and pagination
    apiFeatures.sort().paginate(resPerPage);
    const properties = await apiFeatures.query.populate('owner', 'name avatar');

    res.status(200).json({
      success: true,
      count: properties.length,
      totalProperties,
      filteredPropertiesCount,
      resPerPage,
      currentPage: Number(req.query.page) || 1,
      properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property details
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyDetails = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'owner',
      'name email avatar createdAt'
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new property listing
// @route   POST /api/properties
// @access  Private
export const createProperty = async (req, res, next) => {
  try {
    req.body.owner = req.user.id;

    // Fallback default coordinates if not provided (e.g. Mumbai Gateway of India)
    if (!req.body.location || !req.body.location.lat) {
      req.body.location = {
        lat: 18.922 + (Math.random() - 0.5) * 0.08,
        lng: 72.834 + (Math.random() - 0.5) * 0.08,
      };
    }

    // Default image if none uploaded
    if (!req.body.images || req.body.images.length === 0) {
      req.body.images = [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop&q=80',
      ];
    }

    const property = await Property.create(req.body);

    res.status(201).json({
      success: true,
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Owner or Admin)
export const updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Check ownership
    if (
      property.owner.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this property',
      });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Owner or Admin)
export const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    if (
      property.owner.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this property',
      });
    }

    await property.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get properties listed by current user (Host)
// @route   GET /api/properties/owner/me
// @access  Private
export const getMyProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user.id }).sort('-createdAt');
    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    next(error);
  }
};
