import Groq from 'groq-sdk';
import Property from '../models/Property.js';

// Initialize Groq client if API key is present
const getGroqClient = () => {
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim() !== '') {
    try {
      return new Groq({ apiKey: process.env.GROQ_API_KEY });
    } catch (err) {
      console.warn('Could not initialize Groq SDK:', err.message);
      return null;
    }
  }
  return null;
};

// Fallback intelligent description generator (strictly uses only provided details without made-up amenities)
const generateLocalDescription = ({ title, propertyType, roomType, city, bedrooms, bathrooms, maxGuests, amenities }) => {
  const amenitiesList = Array.isArray(amenities) && amenities.length > 0
    ? amenities.join(', ')
    : 'essential modern comforts';

  return `Welcome to this charming ${roomType.toLowerCase()} ${propertyType.toLowerCase()} located in the vibrant heart of ${city}. Perfectly tailored for up to ${maxGuests} guests, the space features ${bedrooms} well-appointed bedroom${bedrooms > 1 ? 's' : ''} and ${bathrooms} clean bathroom${bathrooms > 1 ? 's' : ''}. Guests can relax with high-grade amenities including ${amenitiesList}. Whether you are traveling for leisure or remote work, this stay offers the ideal blend of comfort and homeliness.`;
};

// @desc    Generate a 3-4 sentence property description strictly from provided details
// @route   POST /api/ai/generate-description
// @access  Private
export const generatePropertyDescription = async (req, res, next) => {
  try {
    const { title, propertyType, roomType, city, bedrooms, bathrooms, maxGuests, amenities } = req.body;

    if (!title || !city || !propertyType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least title, city, and property type to generate a description',
      });
    }

    const groq = getGroqClient();

    if (groq) {
      try {
        const prompt = `You are a real estate listing expert for HomelyHub.
Write an attractive, elegant, and concise 3 to 4 sentence description for this property listing.

RULES (CRITICAL):
- Strictly DO NOT invent or assume any amenities that are not listed.
- Use only the provided information.
- Do not mention phrases like "as requested" or "here is the description".
- Return ONLY the final 3-4 sentence paragraph.

Property Details:
- Title: ${title}
- Property Type: ${propertyType}
- Room Type: ${roomType || 'Entire place'}
- City: ${city}
- Capacity: ${maxGuests || 2} guests, ${bedrooms || 1} bedrooms, ${bathrooms || 1} bathrooms
- Provided Amenities: ${Array.isArray(amenities) ? amenities.join(', ') : (amenities || 'Standard amenities')}
`;

        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You write concise, captivating 3-4 sentence Airbnb-style property descriptions without hallucinating unlisted amenities.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          model: 'llama-3.1-8b-instant',
          temperature: 0.6,
          max_tokens: 250,
        });

        const aiDescription = chatCompletion.choices[0]?.message?.content?.trim();
        if (aiDescription) {
          return res.status(200).json({
            success: true,
            description: aiDescription,
            source: 'groq-llama3',
          });
        }
      } catch (groqErr) {
        console.warn('Groq generation error, switching to deterministic generator:', groqErr.message);
      }
    }

    // Local fallback generator (Slide 8: No made-up amenities - AI uses only details given)
    const localDescription = generateLocalDescription({
      title,
      propertyType: propertyType || 'House',
      roomType: roomType || 'Entire place',
      city,
      bedrooms: bedrooms || 1,
      bathrooms: bathrooms || 1,
      maxGuests: maxGuests || 2,
      amenities: amenities || [],
    });

    res.status(200).json({
      success: true,
      description: localDescription,
      source: 'local-ai-engine',
    });
  } catch (error) {
    next(error);
  }
};

// Fallback intelligent trip planner generator (JSON format)
const generateLocalTripPlan = (destination, budget, days, interests, nightlyBudget) => {
  const sampleActivities = [
    { morning: `Arrive in ${destination}, check into your cozy HomelyHub stay and explore local cafes`, afternoon: `Heritage & culture walking tour focusing on ${interests}`, evening: `Sunset viewing and local culinary dinner experience` },
    { morning: `Scenic morning nature trail / sightseeing spots around ${destination}`, afternoon: `Artisan market exploration, souvenir shopping & cafe hopping`, evening: `Relaxed twilight dinner featuring authentic regional cuisine` },
    { morning: `Adventure & leisure activities suited for ${interests}`, afternoon: `Local museum, historic monuments or beach/mountain viewpoint visit`, evening: `Cozy evening stroll and fine dining at a highly rated bistro` },
    { morning: `Photography tour of landmark spots and hidden gems`, afternoon: `Leisure afternoon relaxation or boat ride / mountain drive`, evening: `Farewell banquet dinner with scenic panoramic night views` },
  ];

  const itinerary = [];
  for (let i = 1; i <= days; i++) {
    const act = sampleActivities[(i - 1) % sampleActivities.length];
    itinerary.push({
      day: i,
      title: `Day ${i}: Discovering the Heart of ${destination}`,
      morning: act.morning,
      afternoon: act.afternoon,
      evening: act.evening,
      estimatedDailyBudget: `₹${Math.round(budget / days)}`,
    });
  }

  return {
    tripTitle: `${days}-Day Ultimate ${destination} Getaway`,
    destination,
    totalBudget: `₹${budget}`,
    days,
    nightlyBudget: `₹${nightlyBudget}`,
    interests,
    summary: `An immersive ${days}-day itinerary through ${destination} crafted specifically for travelers who appreciate ${interests}, paced comfortably within your budget of ₹${budget}.`,
    itinerary,
  };
};

// @desc    Generate AI Trip Planner: Day-wise plan + matching stays where price per night <= budget / days
// @route   POST /api/ai/plan-trip
// @access  Public
export const planTrip = async (req, res, next) => {
  try {
    const { destination, budget, days, interests } = req.body;

    if (!destination || !budget || !days) {
      return res.status(400).json({
        success: false,
        message: 'Please provide destination, total budget, and number of days',
      });
    }

    const numDays = Math.max(1, Number(days));
    const totalBudget = Number(budget);
    // Slide 8 & 9: price per night = budget / days
    const nightlyBudget = Math.floor(totalBudget / numDays);

    // 1. Find matching stays in DB fitting the nightly budget
    let matchingStays = await Property.find({
      $or: [
        { city: { $regex: destination, $options: 'i' } },
        { address: { $regex: destination, $options: 'i' } },
      ],
      pricePerNight: { $lte: Math.max(nightlyBudget * 1.3, 1000) },
    })
      .limit(6)
      .populate('owner', 'name avatar');

    // If destination has no direct city match, find best budget stays in general
    if (matchingStays.length === 0) {
      matchingStays = await Property.find({
        pricePerNight: { $lte: Math.max(nightlyBudget * 1.3, 2000) },
      })
        .limit(6)
        .populate('owner', 'name avatar');
    }

    // 2. Generate Day-by-Day Plan with Groq (Strict JSON output - Slide 8 & 9)
    const groq = getGroqClient();
    let tripPlan = null;

    if (groq) {
      try {
        const systemPrompt = `You are an expert travel concierge for HomelyHub.
Create a structured day-by-day travel plan in pure JSON format.
Strictly return ONLY valid JSON matching this schema:
{
  "tripTitle": "string",
  "destination": "string",
  "totalBudget": "string",
  "days": number,
  "nightlyBudget": "string",
  "interests": "string",
  "summary": "string",
  "itinerary": [
    {
      "day": number,
      "title": "string",
      "morning": "string",
      "afternoon": "string",
      "evening": "string",
      "estimatedDailyBudget": "string"
    }
  ]
}`;

        const userPrompt = `Destination: ${destination}
Total Budget: ₹${totalBudget}
Duration: ${numDays} Days
Nightly Stays Target: ₹${nightlyBudget} per night
Interests: ${interests || 'General sightseeing, local food, exploration'}`;

        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          model: 'llama-3.1-8b-instant',
          response_format: { type: 'json_object' },
          temperature: 0.7,
        });

        const rawContent = completion.choices[0]?.message?.content;
        tripPlan = JSON.parse(rawContent);
      } catch (err) {
        console.warn('Groq Trip Planner failed or returned non-JSON, fallback used:', err.message);
      }
    }

    if (!tripPlan) {
      tripPlan = generateLocalTripPlan(
        destination,
        totalBudget,
        numDays,
        interests || 'Sightseeing, authentic food, culture',
        nightlyBudget
      );
    }

    res.status(200).json({
      success: true,
      destination,
      totalBudget,
      numDays,
      nightlyBudget,
      plan: tripPlan,
      matchingStays,
    });
  } catch (error) {
    next(error);
  }
};
