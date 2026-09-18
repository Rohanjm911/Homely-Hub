class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // Search by keyword (title or city)
  search() {
    if (this.queryStr.keyword) {
      const keyword = {
        $or: [
          { title: { $regex: this.queryStr.keyword, $options: 'i' } },
          { city: { $regex: this.queryStr.keyword, $options: 'i' } },
          { address: { $regex: this.queryStr.keyword, $options: 'i' } },
        ],
      };
      this.query = this.query.find({ ...keyword });
    }
    return this;
  }

  // Filter by price, propertyType, guests, etc.
  filter() {
    const queryCopy = { ...this.queryStr };

    // Fields to remove from standard query object
    const removeFields = ['keyword', 'page', 'limit', 'sort', 'checkIn', 'checkOut'];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Handle city filtering explicitly if passed as parameter
    if (queryCopy.city) {
      queryCopy.city = { $regex: queryCopy.city, $options: 'i' };
    }

    // Handle guests capacity filter
    if (queryCopy.guests) {
      queryCopy.maxGuests = { $gte: Number(queryCopy.guests) };
      delete queryCopy.guests;
    }

    // Advanced filter for operators: gte, gt, lte, lt
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    const parsedFilter = JSON.parse(queryStr);

    // Support amenities array filter (if passed as comma-separated or array)
    if (parsedFilter.amenities) {
      if (typeof parsedFilter.amenities === 'string') {
        const list = parsedFilter.amenities.split(',').map((a) => a.trim());
        parsedFilter.amenities = { $all: list };
      }
    }

    this.query = this.query.find(parsedFilter);
    return this;
  }

  // Sort results
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  // Pagination - 12 properties per page as per slide 6
  paginate(resPerPage = 12) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

export default APIFeatures;
