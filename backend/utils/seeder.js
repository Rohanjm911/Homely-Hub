import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';

dotenv.config();

const sampleProperties = [
  {
    title: 'Azure Palm Villa with Private Pool',
    description: 'Immerse yourself in coastal luxury at this stunning Portuguese-style villa in North Goa. Features a sun-drenched private swimming pool, landscaped tropical gardens, and walking distance to pristine beaches. Ideal for families and group getaways seeking serene coastal vibes.',
    propertyType: 'Villa',
    roomType: 'Entire place',
    pricePerNight: 7500,
    cleaningFee: 1200,
    serviceFee: 650,
    address: 'Near Calangute Beach Road',
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    location: {
      lat: 15.544,
      lng: 73.755,
    },
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Private pool', 'Free parking', 'Garden', 'BBQ grill'],
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop&q=80',
    ],
    checkInTime: '14:00',
    checkOutTime: '11:00',
    rating: 4.92,
    numReviews: 48,
  },
  {
    title: 'Himalayan Cedar Wood Chalet',
    description: 'Perched amidst fragrant pine groves in Old Manali, this handcrafted cedar-wood cottage offers breathtaking snow-capped mountain panoramas. Enjoy cozy evenings by the indoor fireplace, expansive wooden sun decks, and crisp alpine morning breezes.',
    propertyType: 'Cottage',
    roomType: 'Entire place',
    pricePerNight: 4200,
    cleaningFee: 600,
    serviceFee: 350,
    address: 'Club House Road, Old Manali',
    city: 'Manali',
    state: 'Himachal Pradesh',
    country: 'India',
    location: {
      lat: 32.256,
      lng: 77.175,
    },
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    amenities: ['Wifi', 'Indoor fireplace', 'Mountain view', 'Kitchen', 'Heating', 'Balcony', 'Dedicated workspace'],
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&auto=format&fit=crop&q=80',
    ],
    checkInTime: '13:00',
    checkOutTime: '11:00',
    rating: 4.88,
    numReviews: 32,
  },
  {
    title: 'Skyline Luxury Penthouse with Sea View',
    description: 'Experience unmatched metropolitan elegance in this Bandra West high-rise apartment overlooking the Arabian Sea. Furnished with designer Italian furniture, high-speed fiber internet, modular chef kitchen, and private elevator access.',
    propertyType: 'Flat',
    roomType: 'Entire place',
    pricePerNight: 8900,
    cleaningFee: 1500,
    serviceFee: 800,
    address: 'Carter Road, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    location: {
      lat: 19.062,
      lng: 72.825,
    },
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 5,
    amenities: ['Wifi', 'Air conditioning', 'Sea view', 'Elevator', 'Gym access', 'Kitchen', 'Security 24/7'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    ],
    checkInTime: '15:00',
    checkOutTime: '12:00',
    rating: 4.95,
    numReviews: 54,
  },
  {
    title: 'The Royal Heritage Haveli Suite',
    description: 'Step into royal Rajasthan inside this beautifully restored 19th-century Haveli near the City Palace. Features traditional Jharokha stone balconies, hand-painted fresco ceilings, an inner courtyard fountain, and authentic royal hospitality.',
    propertyType: 'Guest House',
    roomType: 'Private room',
    pricePerNight: 3500,
    cleaningFee: 400,
    serviceFee: 250,
    address: 'Near Hawa Mahal, Pink City',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    location: {
      lat: 26.924,
      lng: 75.827,
    },
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    amenities: ['Wifi', 'Air conditioning', 'Breakfast included', 'Courtyard', 'Heritage architecture', 'Terrace restaurant'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&auto=format&fit=crop&q=80',
    ],
    checkInTime: '12:00',
    checkOutTime: '10:00',
    rating: 4.79,
    numReviews: 29,
  },
  {
    title: 'Modern Tech Hub Garden Studio',
    description: 'Sleek, minimalist studio designed for digital nomads and tech professionals in vibrant Indiranagar. Equipped with 300 Mbps Wi-Fi, Herman Miller ergonomic desk setup, smart lighting, and tranquil private garden patio.',
    propertyType: 'Flat',
    roomType: 'Entire place',
    pricePerNight: 2800,
    cleaningFee: 350,
    serviceFee: 200,
    address: '100 Feet Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    location: {
      lat: 12.978,
      lng: 77.643,
    },
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    amenities: ['Wifi', 'Dedicated workspace', 'Air conditioning', 'Kitchenette', 'Private patio', 'Self check-in'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502005229762-ee152d3a5e88?w=1200&auto=format&fit=crop&q=80',
    ],
    checkInTime: '14:00',
    checkOutTime: '11:00',
    rating: 4.85,
    numReviews: 41,
  },
  {
    title: 'Backwater Serenade Houseboat & Villa',
    description: 'Unwind along the tranquil emerald backwaters of Alleppey. Featuring traditional teak wood architecture, private canal boat tours, fresh Kerala coconut water on arrival, and authentic Ayurvedic wellness options nearby.',
    propertyType: 'House',
    roomType: 'Entire place',
    pricePerNight: 5500,
    cleaningFee: 800,
    serviceFee: 450,
    address: 'Finishing Point Road, Punnamada',
    city: 'Kerala',
    state: 'Kerala',
    country: 'India',
    location: {
      lat: 9.498,
      lng: 76.338,
    },
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    amenities: ['Waterfront', 'Air conditioning', 'Free breakfast', 'Boat dock', 'Wifi', 'Kitchen'],
    images: [
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=80',
    ],
    checkInTime: '13:00',
    checkOutTime: '11:00',
    rating: 4.96,
    numReviews: 63,
  },
  {
    title: 'Artisan Boutique Loft near Hauz Khas',
    description: 'Chic bohemian loft located steps away from medieval monuments, lake trails, and designer boutiques in South Delhi. Features exposed brick walls, vintage record player, curated book library, and lush rooftop access.',
    propertyType: 'Flat',
    roomType: 'Entire place',
    pricePerNight: 3200,
    cleaningFee: 400,
    serviceFee: 250,
    address: 'Hauz Khas Village',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    location: {
      lat: 28.549,
      lng: 77.193,
    },
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    amenities: ['Wifi', 'Air conditioning', 'Balcony', 'Kitchen', 'Pet friendly', 'Rooftop access'],
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&auto=format&fit=crop&q=80',
    ],
    checkInTime: '14:00',
    checkOutTime: '11:00',
    rating: 4.75,
    numReviews: 24,
  },
  {
    title: 'Colva Sunset Beachside Cottage',
    description: 'Wake up to the sound of breaking waves at this peaceful beach cottage in South Goa. Steps away from white sandy shores, coconut groves, and charming shacks serving fresh catches of the day.',
    propertyType: 'Cottage',
    roomType: 'Entire place',
    pricePerNight: 3900,
    cleaningFee: 500,
    serviceFee: 300,
    address: 'Colva Beach Road, Salcete',
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    location: {
      lat: 15.278,
      lng: 73.916,
    },
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    amenities: ['Beachfront', 'Wifi', 'Air conditioning', 'Kitchen', 'Garden patio', 'Free parking'],
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=1200&auto=format&fit=crop&q=80',
    ],
    checkInTime: '14:00',
    checkOutTime: '11:00',
    rating: 4.87,
    numReviews: 38,
  },
  {
    title: 'Panoramic Valley View Apple Orchard Lodge',
    description: 'Nestled inside a private organic apple orchard in Naggar near Manali. Revel in uninterrupted vistas of the Beas river valley and pir panjal mountain range. Cozy wood interiors with warm fleece quilts and homemade organic breakfasts.',
    propertyType: 'House',
    roomType: 'Entire place',
    pricePerNight: 4800,
    cleaningFee: 700,
    serviceFee: 400,
    address: 'Naggar Castle Road',
    city: 'Manali',
    state: 'Himachal Pradesh',
    country: 'India',
    location: {
      lat: 32.146,
      lng: 77.170,
    },
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    amenities: ['Mountain view', 'Wifi', 'Indoor fireplace', 'Balcony', 'Kitchen', 'Free parking', 'Heater'],
    images: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
    ],
    checkInTime: '13:00',
    checkOutTime: '11:00',
    rating: 4.91,
    numReviews: 27,
  },
  {
    title: 'Amber Fort View Heritage Villa',
    description: 'Grand courtyard villa boasting straight views of the illuminated Amber Fort ramparts. Traditional hand-carved pillars, marble floors, private rooftop plunge pool, and evening sitar recitals.',
    propertyType: 'Villa',
    roomType: 'Entire place',
    pricePerNight: 6900,
    cleaningFee: 1000,
    serviceFee: 550,
    address: 'Amer Heritage Zone',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    location: {
      lat: 26.985,
      lng: 75.851,
    },
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    amenities: ['Swimming pool', 'Fort view', 'Air conditioning', 'Wifi', 'Free breakfast', 'Courtyard'],
    images: [
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80',
    ],
    checkInTime: '14:00',
    checkOutTime: '11:00',
    rating: 4.94,
    numReviews: 36,
  },
  {
    title: 'Marine Drive Art Deco Heritage Flat',
    description: 'An iconic 1930s Art Deco apartment directly on the Queen’s Necklace. Walk to Nariman Point, historic cinemas, and enjoy breathtaking sunsets over Back Bay from your private curved sea-facing balcony.',
    propertyType: 'Flat',
    roomType: 'Entire place',
    pricePerNight: 9500,
    cleaningFee: 1500,
    serviceFee: 850,
    address: 'Marine Drive, Churchgate',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    location: {
      lat: 18.943,
      lng: 72.823,
    },
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    amenities: ['Sea view', 'Air conditioning', 'Wifi', 'Elevator', 'Kitchen', 'Historic building'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
    ],
    checkInTime: '14:00',
    checkOutTime: '11:00',
    rating: 4.97,
    numReviews: 52,
  },
  {
    title: 'Cozy Cloud Forest Cottage in Munnar',
    description: 'Surrounded by sprawling tea plantations and mist-covered Western Ghat hills. Features natural stone fireplace, fresh organic estate tea bar, and private hiking pathways right out the front door.',
    propertyType: 'Cottage',
    roomType: 'Entire place',
    pricePerNight: 3800,
    cleaningFee: 500,
    serviceFee: 300,
    address: 'Devikulam Road, Tea County',
    city: 'Kerala',
    state: 'Kerala',
    country: 'India',
    location: {
      lat: 10.088,
      lng: 77.059,
    },
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    amenities: ['Tea plantation view', 'Wifi', 'Indoor fireplace', 'Balcony', 'Breakfast included', 'Garden'],
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&auto=format&fit=crop&q=80',
    ],
    checkInTime: '13:00',
    checkOutTime: '11:00',
    rating: 4.89,
    numReviews: 33,
  },
  {
    title: 'Koramangala Minimalist Loft Studio',
    description: 'Designer studio apartment situated in Bengaluru’s startup and nightlife epicenter. Floor-to-ceiling windows, high-speed Wi-Fi, ambient Hue lighting, and smart TV with all streaming apps.',
    propertyType: 'Flat',
    roomType: 'Entire place',
    pricePerNight: 2900,
    cleaningFee: 350,
    serviceFee: 220,
    address: '5th Block, Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    location: {
      lat: 12.935,
      lng: 77.624,
    },
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    amenities: ['Wifi', 'Dedicated workspace', 'Air conditioning', 'Smart TV', 'Elevator', 'Kitchen'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80',
    ],
    checkInTime: '14:00',
    checkOutTime: '11:00',
    rating: 4.83,
    numReviews: 29,
  }
];

export const seedDatabase = async () => {
  try {
    // Check if bookings already populated
    const bookingsCount = await Booking.countDocuments();
    const count = await Property.countDocuments();
    if (count >= 10 && bookingsCount >= 5) {
      console.log(`ℹ️ Database already contains ${count} properties and ${bookingsCount} bookings. Skipping seed.`);
      return;
    }

    console.log('🌱 Seeding database with initial admin, hosts, and premium stays...');

    // 1. Create or find default host user
    let hostUser = await User.findOne({ email: 'host@homelyhub.com' });
    if (!hostUser) {
      hostUser = await User.create({
        name: 'Aarav Sharma',
        email: 'host@homelyhub.com',
        password: 'Password@123',
        role: 'host',
      });
      console.log('👤 Created demo host account: host@homelyhub.com / Password@123');
    }

    // 2. Create multiple demo traveler users (Tenants)
    const demoGuests = [
      { name: 'Priya Patel', email: 'priya@example.com', password: 'Password@123', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Priya%20Patel&backgroundColor=0284c7&textColor=ffffff' },
      { name: 'Rohan Verma', email: 'rohan.v@example.com', password: 'Password@123', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Rohan%20Verma&backgroundColor=7c3aed&textColor=ffffff' },
      { name: 'Ananya Deshmukh', email: 'ananya@example.com', password: 'Password@123', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Ananya%20D&backgroundColor=059669&textColor=ffffff' },
      { name: 'Kabir Mehta', email: 'kabir@example.com', password: 'Password@123', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Kabir%20Mehta&backgroundColor=ea580c&textColor=ffffff' },
      { name: 'Sneha Kulkarni', email: 'sneha@example.com', password: 'Password@123', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Sneha%20K&backgroundColor=db2777&textColor=ffffff' },
      { name: 'Aditya Rao', email: 'aditya@example.com', password: 'Password@123', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Aditya%20Rao&backgroundColor=2563eb&textColor=ffffff' },
      { name: 'Meera Nair', email: 'meera@example.com', password: 'Password@123', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Meera%20Nair&backgroundColor=0d9488&textColor=ffffff' },
    ];

    const createdGuests = [];
    for (const g of demoGuests) {
      let u = await User.findOne({ email: g.email });
      if (!u) {
        u = await User.create({ ...g, role: 'user' });
      }
      createdGuests.push(u);
    }

    // Default legacy guest
    let guestUser = await User.findOne({ email: 'guest@homelyhub.com' });
    if (!guestUser) {
      guestUser = await User.create({
        name: 'Demo Traveler',
        email: 'guest@homelyhub.com',
        password: 'Password@123',
        role: 'user',
      });
    }
    createdGuests.push(guestUser);

    // 3. Clear existing properties and seed fresh
    await Property.deleteMany();
    await Booking.deleteMany();

    const propertiesWithHost = sampleProperties.map((p) => ({
      ...p,
      owner: hostUser._id,
      currentBookings: [],
    }));

    const createdProps = await Property.insertMany(propertiesWithHost);
    console.log(`✅ Successfully seeded ${createdProps.length} premium HomelyHub stays!`);

    // 4. Stays are ready with zero initial bookings so users can book fresh
    console.log('✅ Zero bookings initialized. All stay dates are completely open!');
  } catch (error) {
    console.error('❌ Error during database seeding:', error.message);
  }
};

// If run directly via node seeder.js
if (process.argv[1].endsWith('seeder.js')) {
  (async () => {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  })();
}
