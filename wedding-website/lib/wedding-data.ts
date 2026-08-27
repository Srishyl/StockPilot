export interface WeddingEvent {
  id: string;
  name: string;
  subtitle?: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapUrl?: string;
  dressCode?: string;
  description?: string;
  iconType?: "ring" | "henna" | "haldi" | "wedding" | "reception";
}

export interface StoryMilestone {
  id: string;
  tag: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  quote?: string;
}

export interface FamilySide {
  side: "bride" | "groom";
  title: string;
  subtitle: string;
  parentsTitle: string;
  parents: string;
  grandparents?: string;
  siblings?: string;
  familyMembers: { relation: string; names: string }[];
  blessingQuote?: string;
}

export interface PersonDetails {
  role: string;
  firstName: string;
  lastName: string;
  fullName: string;
  relationText: string;
  parents: string;
  residence: string;
  photo: string;
  bio?: string;
}

export interface WeddingData {
  groom: PersonDetails;
  bride: PersonDetails;
  couple: {
    bride: PersonDetails;
    groom: PersonDetails;
  };
  family: {
    bride: FamilySide;
    groom: FamilySide;
  };
  storyMilestones: StoryMilestone[];
  coupleInitials: string;
  weddingDate: {
    formatted: string;
    day: string;
    month: string;
    year: string;
    time: string;
    isoDate: string; // Target date for countdown (ISO 8601)
  };
  venue: {
    name: string;
    city: string;
    state: string;
    fullAddress: string;
    mapEmbedUrl?: string;
  };
  blessingTagline: string;
  invitationHeading: string;
  invitationSubheading: string;
  invitationText: string;
  hashtags: string[];
  events: WeddingEvent[];
  themeColors: {
    ivory: string;
    cream: string;
    champagne: string;
    beige: string;
    gold: string;
    goldLight: string;
    goldDark: string;
    burgundy: string;
    burgundyLight: string;
    darkBrown: string;
  };
}

const brideData: PersonDetails = {
  role: "THE BRIDE",
  firstName: "Ananya",
  lastName: "Kapoor",
  fullName: "Ananya Kapoor",
  relationText: "Daughter of",
  parents: "Mr. Vikram & Mrs. Meenakshi Kapoor",
  residence: "Jaipur, Rajasthan",
  photo: "/images/bride.jpg",
  bio: "A free-spirited creative curator who finds poetry in everyday moments, sunsets over Rajasthan palaces, and soulful old melodies.",
};

const groomData: PersonDetails = {
  role: "THE GROOM",
  firstName: "Rohan",
  lastName: "Sharma",
  fullName: "Rohan Sharma",
  relationText: "Son of",
  parents: "Mr. Rajesh & Mrs. Sunita Sharma",
  residence: "New Delhi, India",
  photo: "/images/groom.jpg",
  bio: "An impassioned architect and storyteller who believes in turning dreams into timeless structures and heartfelt adventures.",
};

export const weddingData: WeddingData = {
  groom: groomData,
  bride: brideData,
  couple: {
    bride: brideData,
    groom: groomData,
  },
  family: {
    bride: {
      side: "bride",
      title: "BRIDE'S FAMILY",
      subtitle: "The House of Kapoor",
      parentsTitle: "Parents",
      parents: "Mr. Vikram & Mrs. Meenakshi Kapoor",
      grandparents: "Late Shri Ramakant & Smt. Kamla Kapoor",
      siblings: "Aditya Kapoor (Brother), Rhea Kapoor (Sister)",
      familyMembers: [
        {
          relation: "Parents",
          names: "Mr. Vikram & Mrs. Meenakshi Kapoor",
        },
        {
          relation: "Grandparents",
          names: "Late Shri Ramakant & Smt. Kamla Kapoor",
        },
        {
          relation: "Siblings",
          names: "Aditya Kapoor & Rhea Kapoor",
        },
        {
          relation: "Extended Family",
          names: "The Kapoor & Mehra Families",
        },
      ],
      blessingQuote:
        "“With overflowing joy and grateful hearts, we welcome you to bless our beloved daughter as she embarks on this eternal journey.”",
    },
    groom: {
      side: "groom",
      title: "GROOM'S FAMILY",
      subtitle: "The House of Sharma",
      parentsTitle: "Parents",
      parents: "Mr. Rajesh & Mrs. Sunita Sharma",
      grandparents: "Shri Om Prakash & Smt. Shanti Sharma",
      siblings: "Pooja Sharma (Sister), Siddharth Sharma (Brother)",
      familyMembers: [
        {
          relation: "Parents",
          names: "Mr. Rajesh & Mrs. Sunita Sharma",
        },
        {
          relation: "Grandparents",
          names: "Shri Om Prakash & Smt. Shanti Sharma",
        },
        {
          relation: "Siblings",
          names: "Pooja Sharma & Siddharth Sharma",
        },
        {
          relation: "Extended Family",
          names: "The Sharma & Bhardwaj Families",
        },
      ],
      blessingQuote:
        "“We warmly invite our loved ones to celebrate the union of two kindred souls and welcome Ananya into our hearts and home.”",
    },
  },
  storyMilestones: [
    {
      id: "how-we-met",
      tag: "CHAPTER 01",
      year: "Autumn 2021",
      title: "HOW WE MET",
      subtitle: "A Serendipitous Encounter",
      description:
        "A chance meeting over warm artisanal chai in the rain-washed streets of Jaipur. What began as a brief exchange over art and heritage turned into hours of shared laughter and an unspoken, instant connection.",
      image: "/images/story-1.jpg",
      quote: "“In a room full of art, my eyes searched for you.”",
    },
    {
      id: "the-first-date",
      tag: "CHAPTER 02",
      year: "Winter 2022",
      title: "THE FIRST DATE",
      subtitle: "Starlit Conversations",
      description:
        "Under a canopy of fairy lights overlooking the majestic city lights, one dinner effortlessly turned into a four-hour stroll. We discovered shared passions, contrasting quirks, and how two souls could feel instantly at home.",
      image: "/images/story-2.jpg",
      quote: "“That night, conversation flowed like music we had always known.”",
    },
    {
      id: "the-proposal",
      tag: "CHAPTER 03",
      year: "Spring 2025",
      title: "THE PROPOSAL",
      subtitle: "A Promise by the Water",
      description:
        "Amidst the calm waters of Lake Pichola at golden hour, surrounded by floating lotus candles and soft acoustic notes, Rohan knelt down with a promise of forever. Through happy tears and an ecstatic 'Yes!', our next chapter began.",
      image: "/images/story-3.jpg",
      quote: "“I found the one whom my soul loves.”",
    },
    {
      id: "beginning-of-forever",
      tag: "CHAPTER 04",
      year: "December 2026",
      title: "THE BEGINNING OF FOREVER",
      subtitle: "Two Families, One Celebration",
      description:
        "Now standing on the threshold of our greatest adventure, we prepare to take seven sacred vows under the blessings of our cherished families, the holy sacred fire, and the eternal stars above.",
      image: "/images/story-4.jpg",
      quote: "“Hand in hand, into a lifetime of laughter, dreams, and devotion.”",
    },
  ],
  coupleInitials: "R & A",
  weddingDate: {
    formatted: "12 December 2026",
    day: "12",
    month: "December",
    year: "2026",
    time: "6:00 PM onwards",
    isoDate: "2026-12-12T18:00:00+05:30",
  },
  venue: {
    name: "The Royal Taj Palace & Resorts",
    city: "Jaipur",
    state: "Rajasthan, India",
    fullAddress: "The Royal Taj Palace, Palace Road, Jaipur, Rajasthan 302001",
    mapEmbedUrl: "https://maps.google.com/?q=Jaipur+Rajasthan",
  },
  blessingTagline: "|| श्री गणेशाय नमः ||",
  invitationHeading: "WITH THE BLESSINGS OF OUR FAMILIES",
  invitationSubheading: "WE INVITE YOU TO CELEBRATE THE WEDDING OF",
  invitationText:
    "Together with their families, invite you to celebrate the joyous union of their hearts & souls with love, blessings, and laughter.",
  hashtags: ["#RoFoundHisAnu", "#SharmaKapoorWedding"],
  events: [
    {
      id: "engagement",
      name: "Sagai & Ring Ceremony",
      subtitle: "The Promise of Forever",
      date: "Thursday, 10 December 2026",
      time: "6:30 PM Onwards",
      venue: "Grand Ballroom, The Royal Taj Palace",
      address: "Palace Road, Jaipur, Rajasthan 302001",
      dressCode: "Royal Festive / Indo-Western Elegance",
      description:
        "An enchanting evening of exchanged vows, sparkling rings, and acoustic melodies as two families unite into one.",
      mapUrl: "https://maps.google.com/?q=The+Royal+Taj+Palace+Jaipur",
      iconType: "ring",
    },
    {
      id: "mehendi",
      name: "Mehendi Ki Raat",
      subtitle: "Colors & Henna Swirls",
      date: "Friday, 11 December 2026",
      time: "11:00 AM Onwards",
      venue: "Courtyard of Jasmine, The Royal Taj Palace",
      address: "Palace Road, Jaipur, Rajasthan 302001",
      dressCode: "Vibrant Greens, Pastels & Floral Attire",
      description:
        "A breezy afternoon filled with intricate henna designs, fragrant marigold decor, folk dancers, and traditional festive snacks.",
      mapUrl: "https://maps.google.com/?q=The+Royal+Taj+Palace+Jaipur",
      iconType: "henna",
    },
    {
      id: "haldi",
      name: "Haldi & Phoolon Ki Holi",
      subtitle: "Golden Glow & Flower Showers",
      date: "Saturday, 12 December 2026",
      time: "10:00 AM Onwards",
      venue: "Lotus Lawn & Poolside",
      address: "Palace Road, Jaipur, Rajasthan 302001",
      dressCode: "Sunshine Yellow & Golden Hues",
      description:
        "An auspicious morning soaked in aromatic turmeric paste, rose petals, playful splashing, and traditional folk beats.",
      mapUrl: "https://maps.google.com/?q=The+Royal+Taj+Palace+Jaipur",
      iconType: "haldi",
    },
    {
      id: "wedding",
      name: "Shubh Vivaah (The Wedding)",
      subtitle: "Pheras Under The Royal Mandap",
      date: "Saturday, 12 December 2026",
      time: "6:00 PM (Baraat) | 8:00 PM (Pheras)",
      venue: "The Royal Taj Amphitheatre & Royal Mandap",
      address: "Palace Road, Jaipur, Rajasthan 302001",
      dressCode: "Traditional Indian Royal Attire",
      description:
        "Witness the sacred union through holy Vedic hymns, the royal Baraat procession, and sacred seven vows around the Agni.",
      mapUrl: "https://maps.google.com/?q=The+Royal+Taj+Palace+Jaipur",
      iconType: "wedding",
    },
    {
      id: "reception",
      name: "Royal Reception & Dinner",
      subtitle: "An Evening of Grandeur",
      date: "Sunday, 13 December 2026",
      time: "7:30 PM Onwards",
      venue: "The Palace Grand Lawn & Banquets",
      address: "Palace Road, Jaipur, Rajasthan 302001",
      dressCode: "Black Tie / Royal Formal Indian",
      description:
        "Join us for a celebratory gala featuring live symphony music, a royal Rajasthani banquet feast, and toasts to the newlyweds.",
      mapUrl: "https://maps.google.com/?q=The+Royal+Taj+Palace+Jaipur",
      iconType: "reception",
    },
  ],
  themeColors: {
    ivory: "#F4E3DD",
    cream: "#FAF0EC",
    champagne: "#EEDCD5",
    beige: "#E6D3CB",
    gold: "#9a7b3a",
    goldLight: "#c9a96e",
    goldDark: "#7d5f25",
    burgundy: "#8F3914",
    burgundyLight: "#A8451A",
    darkBrown: "#1a0f0a",
  },
};

