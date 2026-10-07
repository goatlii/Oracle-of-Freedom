import type { Copy } from "./types";

const budgets = {
  portraits: [
    { value: "lt-175", label: "Under €175" },
    { value: "175-300", label: "€175–300" },
    { value: "300-500", label: "€300–500" },
    { value: "500+", label: "€500+" },
  ],
  weddings: [
    { value: "lt-650", label: "Under €650" },
    { value: "650-1100", label: "€650–1,100" },
    { value: "1100-1650", label: "€1,100–1,650" },
    { value: "1650+", label: "€1,650+" },
  ],
  retreats: [
    { value: "lt-400", label: "Under €400" },
    { value: "400-1000", label: "€400–1,000" },
    { value: "1000-2000", label: "€1,000–2,000" },
    { value: "2000+", label: "€2,000+" },
  ],
  artists: [
    { value: "lt-110", label: "Under €110" },
    { value: "110-300", label: "€110–300" },
    { value: "300-600", label: "€300–600" },
    { value: "600+", label: "€600+" },
  ],
  places: [
    { value: "lt-475", label: "Under €475" },
    { value: "475-900", label: "€475–900" },
    { value: "900+", label: "€900+" },
  ],
  other: [
    { value: "lt-175", label: "Under €175" },
    { value: "175-600", label: "€175–600" },
    { value: "600-1500", label: "€600–1,500" },
    { value: "1500+", label: "€1,500+" },
  ],
};

export const en: Copy = {
  meta: {
    home: {
      title: "Oracle of Freedom · Algarve & Lisbon Photo & Film",
      description:
        "Photo & film for free spirits, from the Algarve to Lisbon. Weddings, retreats, festivals and commercial shoots travel further across Portugal, Europe and beyond.",
      keywords: "Algarve and Lisbon photographer; Algarve photographer; Lisbon photographer; boho photographer Portugal",
    },
    about: {
      title: "About Agota · Algarve & Lisbon Photographer",
      description:
        "Meet Agota Urbikaite. Every session is covered from the Algarve to Lisbon. Weddings, retreats, festivals and commercial work can go further.",
      keywords: "Agota Urbikaite photographer; Algarve and Lisbon photographer; candid photographer Portugal",
    },
    people: {
      title: "People · Portraits & Intimate Boho Weddings",
      description:
        "Portraits and intimate boho weddings from the Algarve to Lisbon, coast included. Weddings can travel further. Sessions from €175.",
      keywords: "Algarve couples photographer; Lisbon wedding photographer; boho wedding photographer Portugal",
    },
    portraits: {
      title: "Couples & Engagement Photographer · Algarve & Lisbon",
      description:
        "Portrait sessions for one person, a couple, a family or friends, from the Algarve to Lisbon. Natural, no stiff posing. From €175.",
      keywords:
        "Algarve couples photographer; Lisbon engagement photographer; Algarve photoshoot; Lisbon couple photos; proposal photographer Lisbon",
    },
    elopements: {
      title: "Boho Elopement Photographer · Algarve & Lisbon",
      description:
        "Intimate boho elopements from the Algarve to Lisbon, and further across Portugal, Europe and beyond. Small circles, up to about 30 guests. From €690.",
      keywords:
        "Algarve elopement photographer; Lisbon elopement photographer; boho elopement Portugal; intimate wedding photographer Portugal",
    },
    experiences: {
      title: "Experiences · Retreats, Festivals & Artists",
      description:
        "Retreats, festivals, DJs and fire artists. Based from the Algarve to Lisbon, and travelling further for the bigger gatherings.",
      keywords: "Algarve retreat photographer; Lisbon festival photographer; retreat photographer Portugal",
    },
    retreats: {
      title: "Retreat Photographer · Algarve, Lisbon & beyond",
      description:
        "Retreat photo and film from the Algarve to Lisbon, and further across Portugal and Europe. Consent-first, commercial licence included. From €400/day.",
      keywords:
        "Algarve retreat photographer; Lisbon retreat photographer; yoga retreat photographer Portugal; retreat videographer Europe",
    },
    festivals: {
      title: "Festival & DJ Photographer · Algarve & Lisbon",
      description:
        "Press shots, live sets, fire portraits and music videos. Based from the Algarve to Lisbon, travelling for festivals and commercial shoots. From €190.",
      keywords:
        "Algarve festival photographer; Lisbon DJ photographer; fire show photographer; music video Portugal",
    },
    places: {
      title: "Eco-Stay Photographer · Algarve & Lisbon",
      description:
        "Photos and reels for eco-quintas, surf houses and boutique stays from the Algarve to Lisbon. Commercial shoots can travel further. From €475.",
      keywords:
        "Algarve hotel photographer; Lisbon surf house photography; eco hotel photographer Portugal; Airbnb photographer Algarve",
    },
    portfolio: {
      title: "Portfolio · Oracle of Freedom",
      description:
        "Real moments of the wild ones. Portraits, gatherings, festivals, fire, DJs and film.",
      keywords: "Agota Urbikaite portfolio; boho photographer portfolio Portugal",
    },
    journal: {
      title: "Journal · Guides for Free Spirits",
      description:
        "Guides for eloping in Portugal, photographing a retreat so it sells, and golden-hour couple spots around Ericeira and Sintra.",
      keywords: "Algarve elopement guide; Lisbon couple photoshoot; retreat photography tips",
    },
    inquire: {
      title: "Inquire · Oracle of Freedom",
      description:
        "Tell me your story: date, place and dream. I reply within 48 hours. WhatsApp or email welcome.",
      keywords: "book Algarve photographer; book Lisbon photographer; contact Oracle of Freedom",
    },
    privacy: {
      title: "Privacy · Oracle of Freedom",
      description:
        "How Oracle of Freedom uses inquiry details, cookies and embedded video. A short GDPR notice.",
      keywords: "Oracle of Freedom privacy; GDPR",
    },
  },
  a11y: {
    skip: "Skip to content",
    menu: "Open menu",
    closeMenu: "Close menu",
    home: "Oracle of Freedom, home",
    openPhoto: "Open photo",
    close: "Close",
    previous: "Previous",
    next: "Next",
    photoPlaceholder: "Low-resolution placeholder — to be replaced",
    language: "Language",
  },
  nav: {
    people: "People",
    experiences: "Experiences",
    places: "Places",
    portfolio: "Portfolio",
    about: "About",
    journal: "Journal",
    inquire: "Inquire",
  },
  footer: {
    blurb:
      "Photo & film by Agota Urbikaite, from the Algarve to Lisbon. Weddings, retreats, festivals and commercial shoots travel further.",
    privacy: "Privacy",
    rights: "All rights reserved.",
  },
  whatsapp: {
    button: "Chat with me",
    general:
      "Hi Agota! I found you on oracleoffreedom.com and I'd love to chat 🌿",
    portraits:
      "Hi Agota! I'd love a portrait session around [date] in [place]. Here's who is coming and what I would like:",
    elopements:
      "Hi Agota! We're dreaming of an intimate boho elopement around [date] 💛",
    retreats:
      "Hi Agota! I'm hosting a retreat on [dates] and would love coverage",
    festivals: "Hi Agota! I'm a DJ/artist and I need content for…",
    places: "Hi Agota! I run [place] and I'd like to talk about content",
  },
  common: {
    explore: "Explore",
    viewPortfolio: "View the portfolio",
    readGuides: "Read the guides",
    meet: "Meet Agota",
    from: "From",
    priceNote: "From prices in EUR, excluding VAT. Weddings, stays and festivals are confirmed with a quote.",
    offer: "Offer",
    saveSeparately: "Save {amount} compared with booking them separately",
    placeholderTitle: "Placeholder — not a published testimonial",
    placeholderBody:
      "Real quotes will replace this once Agota has permission to share them. Nothing here is invented.",
    comingSoon: "Coming soon",
    mostLoved: "most loved",
    closingTitle: "Your story, felt from the inside.",
    closingBody:
      "Tell me what you're dreaming of — a sunset on the cliffs, a week of breathwork in the hills, a night of fire and drums. I'll tell you honestly how I can help.",
    closingPrimary: "Check my availability",
    closingSecondary: "or message me on WhatsApp",
    checkAvailability: "Check my availability",
    seeWork: "See the work",
  },
  cookies: {
    text: "This site stores a language preference and, only if you agree, loads Instagram and YouTube embeds. No marketing cookies.",
    accept: "Accept embeds",
    essential: "Essential only",
    privacy: "Privacy notice",
  },
  home: {
    title: "For free spirits, sacred gatherings and places with soul.",
    dek: "Photo & film for free spirits: couples in love, sacred gatherings, festival souls and the places that hold them. Every session from the Algarve to Lisbon; weddings, retreats, festivals and commercial work further afield.",
    manifesto:
      "I don't stand on the outside looking in. I dance at the edge of the fire, I walk into the sea with you, I sit in the circle. That's where the real moments live — and that's where my camera is.",
    doorsTitle: "Three ways in",
    peopleTitle: "People",
    peopleBody:
      "Portraits, engagement sessions and intimate boho weddings & elopements. Golden light, salty hair, real love.",
    peoplePrice: "Sessions from {session} · Elopements from {elopement}",
    experiencesTitle: "Experiences",
    experiencesBody:
      "Retreats, gatherings, festivals, DJs, fire and flow artists, music videos. The energy of the moment, captured from within.",
    experiencesPrice: "Retreat coverage from {retreat}/day",
    placesTitle: "Places",
    placesBody:
      "Eco-quintas, surf houses and conscious boutique stays. Images and reels that make guests feel the place before they arrive.",
    placesPrice: "Content days from {places}",
    howTitle: "How I work",
    how: [
      {
        title: "I become part of it.",
        body: "No stiff posing, no hovering. I move with the flow so you can forget the camera is there.",
      },
      {
        title: "Photo + film, one person.",
        body: "Stills and video from one eye and one heart — less crew, more intimacy.",
      },
      {
        title: "Consent-first, always.",
        body: "In circles, ceremonies and festivals, nobody is photographed or shared without their yes.",
      },
    ],
    featuredTitle: "Featured work",
    wordsTitle: "Kind words",
    about:
      "Hi, I'm Agota. For more than 10 years I've been photographing and filming the moments people don't pose for, capturing the very essence and magic of events, communities and wild souls.",
    journalTitle: "Journal",
    journalDek: "Guides for dreamers and planners.",
    closingTitle: "Tell me about your story.",
    follow: "Follow @oracle.of.freedom",
    igNote: "A quiet grid from the portfolio. The living one is on Instagram.",
  },
  about: {
    title: "Hi, I'm Agota.",
    paragraphs: [
      "I have been working with photography and video for over 10 years, both professionally and in passion projects. I specialise in capturing pure candid moments and bringing the magic of an event or community to life in still images and video edits.",
      "My style is fluid and organic, it is a delicate balance between opposing energies of action and calm - not just capturing the moment, but being in it; not just around the action but part of it. It’s what gives my work depth and where the sweetest most genuine moments are captured, where the viewer becomes part of it all.",
      "I'm drawn to people and places with a free spirit — gatherings in the jungle, ceremonies by the river, barefoot vows on the beach, DJs lost in their set, eco-houses built with love. And that's the magic I want to capture.",
    ],
    promise: "Oracle of Freedom is my promise: to see you as you really are, and to set that moment free.",
    valuesTitle: "What I believe in",
    values: [
      { title: "Presence", body: "I show up fully, so you can too." },
      { title: "Consent", body: "Your moments belong to you. I ask, I listen, I respect the no-camera spaces." },
      { title: "Freedom", body: "No scripts, no forced poses. Just gentle guidance when you want it." },
      { title: "Community", body: "I'm part of the circles I photograph, and I treat them with care." },
    ],
    facts:
      "10+ years in photo & video · Photo + film · Languages: {languages}",
    bts: "PLACEHOLDER — photos of Agota at work, still to be taken. This block stays empty until they exist.",
    closingTitle: "Let's create something real together.",
  },
  people: {
    title: "People",
    dek: "Portraits, love stories and intimate boho weddings — photographed with warmth, freedom and zero stiffness.",
    portraitsTitle: "Portrait sessions",
    portraitsBody:
      "One session for individuals, couples, engagement, families and friends. The starting price is shaped around what you want.",
    portraitsPrice: "From {price}",
    weddingsTitle: "Boho Weddings & Elopements",
    weddingsBody: "Barefoot vows, small circles of loved ones, ceremonies that feel like you.",
    weddingsPrice: "From {price}",
    wordsTitle: "Kind words",
  },
  experiences: {
    title: "Experiences",
    dek: "Retreats, gatherings, festivals, DJs, fire & flow artists and music videos — photographed and filmed from inside the circle.",
    retreatsTitle: "Retreats & Gatherings",
    retreatsBody: "Photos and reels that help you fill your next retreat.",
    retreatsPrice: "From {price}/day",
    festivalsTitle: "Festivals, DJs & Artists",
    festivalsBody: "Press shots, live-set clips, fire shows, showreels and music videos.",
    festivalsPrice: "From {price}",
    consentTitle: "Consent-first, always.",
    consent:
      "Sacred spaces deserve respect. I agree no-camera moments with you, can use wristbands or signals for people who don't want to be photographed, and nothing is shared publicly without approval.",
  },
  portraits: {
    eyebrow: "Portrait sessions",
    title: "For the barefoot, the fire-lit and the free.",
    subtitle: "Portrait sessions, from the Algarve to Lisbon",
    dek: "One session for you, for two, or for the people you love. Individuals, couples, engagement, families and friends.",
    cta: "Book your session",
    personalizeCta: "Personalize your session",
    personalizeWhatsapp: "or message on WhatsApp",
    inquiry: "portraits",
    whoTitle: "Who it's for",
    who: [
      "One person, a couple, an engagement, a family or a group of friends",
      "Surprise proposals, anniversaries and holidays together",
      "Anyone who wants natural photographs, with no stiff posing",
      "Yoga teachers, therapists, facilitators, musicians and artists who need soulful images for their brand",
    ],
    packagesTitle: "Sessions",
    filmsTitle: "Film",
    combosTitle: "Photo + film",
    addonsTitle: "Express delivery",
    packages: {
      "portrait-sessions": {
        name: "Portrait sessions",
        items: [
          "Individuals, couples, engagement, families, friends — any group",
          "Starts at one hour. Length, edited photos, locations and how many people shape the final price",
          "Gentle guidance, no stiff posing",
          "A private gallery in {artistWeeks}, ready to download and share",
        ],
      },
      "couples-film": {
        name: "Couples film",
        items: [
          "A short film of the session, about 60–90 seconds",
          "One vertical cut for stories",
          "Delivered in {artistFilmWeeks}",
        ],
      },
      "couples-combo": {
        name: "Portrait session + film",
        items: [
          "The portrait session and the short film",
          "One person, one afternoon",
          "Photographs and film in {artistFilmWeeks} — photo+film follows the film timeline",
        ],
      },
      "portrait-film-express": {
        name: "Express film",
        items: [
          "Rush the couples film",
          "Ready in {expressFilm} instead of {artistFilmWeeks}",
          "A paid add-on — add it when you book",
        ],
      },
      "portrait-combo-express": {
        name: "Express photo + film",
        items: [
          "Rush the portrait session and the film together",
          "Both in {expressFilm} instead of {artistFilmWeeks}",
          "Photographs on their own can be rushed in {expressPhoto}",
        ],
      },
    },
    travelNote:
      "Travel within {baseArea} is included for every session. Weddings, retreats, festivals and commercial shoots can go further — the rest of Portugal, Europe and beyond — with travel quoted at cost.",
    whereTitle: "Where we can shoot",
    where:
      "All of the Algarve, and the coast up to Lisbon: the south, the Costa Vicentina, the Alentejo shore, Comporta, Arrábida and the city itself. Ericeira and Sintra sit just north of Lisbon — tell me if that's the plan. For a wedding, retreat, festival or commercial shoot, the rest of Portugal, Europe and beyond are open.",
    processTitle: "How it works",
    process: [
      { title: "Say hi", body: "Send the form or a WhatsApp with your date idea and what you're dreaming of." },
      { title: "We plan", body: "I suggest locations, timing for the best light and what to wear." },
      { title: "We shoot", body: "Relaxed, playful, real. I'll guide you when you need it and disappear when you don't." },
      { title: "You relive it", body: "Your private gallery arrives in {artistWeeks}, ready to download, share and print. Films and photo+film collections follow the film timeline, {artistFilmWeeks}." },
    ],
    wordsTitle: "Kind words",
    testimonialIds: ["couple", "soul-brand"],
    faqTitle: "Questions",
    faq: [
      { q: "We're awkward in front of the camera. Is that okay?", a: "Totally. Most people are. I don't make you \"pose\" — I give you little prompts, we walk, we laugh, and the real you shows up." },
      { q: "What should we wear?", a: "Soft, natural colours and textures that move in the wind work beautifully. I send a short style guide after booking." },
      { q: "What time is best?", a: "Golden hour — the hour after sunrise or before sunset. I'll pick the timing for your date and place." },
      { q: "What if it rains?", a: "We move the session to another day free of charge, or we embrace the drama of the clouds — your choice." },
      { q: "Can you help plan a surprise proposal?", a: "Yes. I'll help you pick the spot and timing, and hide in plain sight." },
      { q: "Where do you photograph?", a: "Every session includes travel from the Algarve to Lisbon, along the coast in between. Weddings, retreats, festivals and commercial shoots can go further, with travel quoted at cost." },
      { q: "How do I book?", a: "Send the inquiry form. A {deposit} deposit secures your date." },
      { q: "When does the gallery arrive?", a: "Photographs in {artistWeeks}. Films and photo+film collections in {artistFilmWeeks}. Express delivery is a paid add-on: photographs in {expressPhoto}, film or the full combo in {expressFilm}." },
    ],
    guide: { post: "ericeira", label: "The most magical spots for a couple photoshoot around Ericeira & Sintra" },
  },
  elopements: {
    eyebrow: "Boho weddings & elopements",
    title: "For the barefoot, the fire-lit and the free.",
    subtitle: "Boho elopements from the Algarve to Lisbon, and further",
    dek: "Barefoot vows. A handful of people you love. A day that feels like freedom.",
    cta: "Check my date",
    inquiry: "elopement",
    whoTitle: "This is for you if…",
    who: [
      "You're eloping, or inviting only your closest people (up to about 30 guests)",
      "You'd rather say your vows on a beach, in a forest or by the river than in a ballroom",
      "Your dream day might include a handfasting, a cacao ceremony, flower crowns, drums, a fire circle or a long dinner under the stars",
      "You want to be present, not directed",
    ],
    notFor:
      "This is not for you if you're planning a large, traditional wedding — I focus only on small, intimate celebrations, so I can give each one my full heart.",
    packagesTitle: "Collections",
    filmsTitle: "Film",
    addonsTitle: "Add-ons",
    packages: {
      elopement: {
        name: "Elopement",
        items: [
          "3–4 hours: getting ready if you want it, ceremony, portraits",
          "Help choosing the place and the light",
          "About 100 edited photos in a private gallery",
          "Sneak peek within 48 hours, full gallery in {weeks}",
        ],
      },
      wedding: {
        name: "Small wedding",
        badge: "most loved",
        items: [
          "Up to about 30 guests",
          "5–6 hours, from the ceremony into the night — fire, music, dancing",
          "200+ edited photos",
          "Sneak peek within 48 hours, full gallery in {weeks}",
        ],
      },
      "elopement-film": {
        name: "Elopement film",
        items: ["A 3–5 minute film of the ceremony and portraits", "Delivered in {filmWeeks}"],
      },
      "wedding-film": {
        name: "Small wedding highlight",
        items: ["A highlight film of the ceremony, portraits and the night", "Made to share with the people who couldn't be there", "Delivered in {filmWeeks}"],
      },
      "elopement-photo-express": {
        name: "Express photos",
        items: ["A sneak peek of 15–20 edited photos within 48 hours", "Full gallery in half the usual delivery time"],
      },
      "elopement-film-express": {
        name: "Express film",
        items: [
          "Rush an elopement film or a small-wedding highlight",
          "Ready in {expressFilm} instead of {filmWeeks}",
          "A paid add-on — add it when you book",
        ],
      },
      "elopement-drone-stills": {
        name: "Drone stills add-on",
        items: [
          "A short aerial set added to your elopement or small wedding",
          "The place, the two of you in the landscape, the gathering from above",
          "We fly only when the weather and the airspace allow",
        ],
      },
      "elopement-drone-story": {
        name: "Drone photo + film add-on",
        items: [
          "Aerial stills and a short film, added to the day",
          "One flight beside the ground coverage, not a separate production",
          "We fly only when the weather and the airspace allow",
        ],
      },
    },
    travelNote:
      "Travel within {baseArea} is included. Elopements and intimate weddings further away — the rest of Portugal, Europe and beyond — are quoted at cost.",
    dayTitle: "What your day could look like",
    day: "Sunrise vows on a wild beach. A walk through the forest with flowers in your hair. A ceremony led by a friend, a shaman or a celebrant. Your people in a circle, drums and laughter. A long table under fairy lights. A fire dance to close the night.",
    comingSoon:
      "Coming soon: our first full boho elopement story. Until then, these are couple and gathering photographs — not a wedding day.",
    processTitle: "How it works",
    process: [
      { title: "Tell me your story", body: "Fill in the form: date, place (or \"no idea yet\"), how many people." },
      { title: "Let's talk", body: "A relaxed video call to feel if we're a fit." },
      { title: "Book", body: "A {deposit} deposit reserves your date. Express delivery can be added then." },
      { title: "Dream together", body: "I help with the location, timing and flow of the day, and I can recommend like-minded celebrants, florists and places." },
      { title: "The day & after", body: "I'm with you, part of it. Sneak peek in 48 hours. Photographs in {weeks}; films in {filmWeeks}." },
    ],
    wordsTitle: "Love notes",
    testimonialIds: ["elopement", "wedding"],
    faqTitle: "Questions",
    faq: [
      { q: "Do you only photograph small weddings?", a: "Yes — elopements and intimate celebrations up to about 30 guests. That's where my style truly shines." },
      { q: "Can we have a symbolic ceremony?", a: "Absolutely. Many couples marry legally at home and celebrate here in nature. I can recommend celebrants." },
      { q: "We don't know where to elope yet. Can you help?", a: "That's one of my favourite parts. Tell me your vibe (ocean, forest, desert-like plains, mountains) and I'll suggest places." },
      { q: "Do you do video too?", a: "Yes. An elopement film and a small-wedding highlight can be booked on their own." },
      { q: "Can you photograph fire, night and dancing?", a: "Night, fire and festival light are my speciality. Your after-party is safe with me." },
      { q: "Do you travel?", a: "Yes. The Algarve-to-Lisbon coast is included. For a wedding I also travel the rest of Portugal, Europe and beyond, including tropical destinations, with travel quoted at cost." },
      { q: "How far in advance should we book?", a: "For May–October, 6–12 months is ideal; for elopements, sometimes a few weeks is enough — just ask." },
      { q: "When do we receive the photographs and the film?", a: "Photographs in {weeks}. Films follow the film timeline, {filmWeeks}. A sneak peek goes out within 48 hours. Express delivery is a paid add-on: photographs in {expressPhoto}, film in {expressFilm}." },
    ],
    guide: { post: "boho", label: "Boho elopement in Portugal: places, seasons & real costs" },
  },
  retreats: {
    eyebrow: "Retreats & gatherings",
    title: "For the barefoot, the fire-lit and the free.",
    subtitle: "Retreat photographer, from the Algarve to Lisbon and further",
    dek: "Your next retreat sells on the feeling of the last one. Let's capture it.",
    cta: "Plan your retreat coverage",
    inquiry: "retreat",
    whoTitle: "Who it's for",
    who: [
      "Yoga, surf, breathwork, dance, cacao, sound and wellness retreat organisers",
      "Retreat centres and eco-venues hosting groups",
      "Facilitators, healers and space-holders running workshops and ceremonies",
      "Community gatherings, ecstatic dances and small conscious festivals",
    ],
    problemTitle: "Why it matters",
    problem:
      "People book retreats on a feeling. Honest images of real transformation — the circle, the silence, the laughter, the food, the landscape — are what make someone press \"book\" on BookRetreats, Retreat Guru or your website.",
    packagesTitle: "Packages",
    addonsTitle: "Add-ons",
    addonsNote:
      "Added to a retreat day you're already booking. A quiet flight when the weather is kind and the airspace allows — not a separate aerial day.",
    packages: {
      "retreat-day": {
        name: "Retreat · 1 day",
        items: [
          "One full day on site (sessions, rituals, meals, in-between moments)",
          "150+ edited photos with a commercial licence for your website, listings and social media",
          "Selection and editing during the retreat — delivered as soon as it ends",
        ],
      },
      "retreat-journey": {
        name: "Retreat · 3 days",
        badge: "best for filling future dates",
        items: [
          "3 days documenting the full arc: arrival, deep work, integration, goodbyes",
          "Photos + 5 short vertical reels ready for Instagram, TikTok and your listings",
          "Portraits of your facilitators for your team page",
          "Commercial licence included",
        ],
      },
      "retreat-custom": {
        name: "Custom",
        items: ["Week-long retreats, festivals and ceremonies. Tell me your programme and I'll send a tailored quote."],
      },
      "retreat-drone-addon": {
        name: "Drone stills add-on",
        items: [
          "A quiet aerial set added to retreat coverage you're already booking",
          "The land, the circle from above, the path in — for your next listing",
          "We fly when the weather is kind and the airspace allows",
        ],
      },
    },
    travelNote:
      "Retreats on the coast from the Algarve to Lisbon include my travel. Further retreats — the rest of Portugal, Europe and beyond — are quoted at cost. Accommodation and meals on site are usually covered by the retreat.",
    consentTitle: "How I work in sacred spaces",
    consent: [
      "I join your opening circle and introduce myself, so people feel safe.",
      "We agree which moments are no-camera (ceremonies, breathwork peaks, integration shares).",
      "Anyone can opt out — with a simple wristband or signal.",
      "You approve the selection before anything is published.",
    ],
    processTitle: "How it works",
    process: [
      { title: "Share your programme", body: "Dates, place, group size, what you want to show." },
      { title: "Plan the shot list", body: "What your future guests need to see: space, food, practice, people, landscape." },
      { title: "I join the retreat", body: "Present, discreet, part of it." },
      { title: "Delivery", body: "Galleries and reels ready for your next launch." },
    ],
    wordsTitle: "Kind words",
    testimonialIds: ["retreat"],
    faqTitle: "Questions",
    faq: [
      { q: "Will a photographer disturb the energy of the group?", a: "Not when they're part of it. I move gently, respect silence and step away when needed." },
      { q: "Can I use the images for ads and listings?", a: "Yes — a commercial licence is included for your own marketing." },
      { q: "Do you also film?", a: "Yes, reels and short films are part of the Journey package or available as an add-on." },
      { q: "Do guests need to sign anything?", a: "I'll share a simple consent approach with you before the retreat, and anyone can opt out." },
      { q: "Do you travel abroad?", a: "Yes. Retreats are one of the projects I leave the Algarve–Lisbon coast for: the rest of Portugal, Spain, Europe and tropical destinations, with travel quoted at cost." },
      { q: "How early should I book?", a: "2–3 months ahead is ideal, especially for May–October." },
    ],
    guide: { post: "retreat", label: "How to photograph your retreat so it sells out next time" },
  },
  festivals: {
    eyebrow: "Festivals, DJs & artists",
    title: "Festival, DJ & fire-show photographer and videographer",
    dek: "For the people who create the magic — on stage, behind the decks and inside the fire.",
    cta: "Get your content",
    inquiry: "artist",
    whoTitle: "Who it's for",
    who: [
      "DJs & musicians who need press photos, live-set clips and a showreel to get booked",
      "Fire, flow and performance artists — night portraits, fire and smoke are my speciality",
      "Festivals, stages, workshops and crews wanting official, consent-first content",
      "Bands and artists who want a music video with an organic, cinematic feel",
    ],
    packagesTitle: "Packages",
    filmsTitle: "Film",
    combosTitle: "Photo + film",
    addonsTitle: "Add-ons",
    addonsNote:
      "Full weekend priority starts from €200. The fee follows the days and hours of coverage, how fast you need the files, and whether you want photographs, film, or both. Photo and film together take longer than photographs alone. Standard film still arrives in {artistFilmWeeks}. These are priority add-ons on top of coverage. Inquire with the shape of the gathering and you’ll have a clear fee before the {deposit} deposit. The drone hop is separate: a same-day flight while I’m already booked for that festival day, weather-dependent and only in legal airspace. It is not full-event coverage from the air.",
    addonsCta: "Inquire about an add-on",
    packages: {
      "press-kit": {
        name: "DJ / artist press kit",
        items: [
          "2-hour portrait / press session (location or night / fire setup)",
          "20–30 edited photos for press, streaming covers and socials",
          "Gallery in {artistWeeks}",
        ],
      },
      "live-set": {
        name: "Live-set content",
        items: ["Performance photos and the room, per night", "Clips of the set, delivered within 48 hours", "Full gallery in {artistWeeks}"],
      },
      "festival-day": {
        name: "Festival / event day",
        items: ["A full day of official photographs", "Same-day selects for social media", "Delivered in 2–4 weeks, depending on the number of event days"],
      },
      "festival-half": {
        name: "Festival / event half day",
        items: ["Half a day of official photographs", "Selects for social media", "Full gallery in {artistWeeks}"],
      },
      aftermovie: {
        name: "Festival aftermovie",
        items: ["A short film of the day, per day of the event", "Made to post once the gathering is over", "Delivered in 2–4 weeks, depending on festival length"],
      },
      "music-video": {
        name: "Music video",
        items: ["Concept, filming and edit for an organic, performance or nature-based music video", "The final quote depends on the idea", "Delivered in 3–5 weeks"],
      },
      "reels-pack": {
        name: "Reels pack",
        items: ["A set of short vertical films for Instagram and TikTok", "Cut from a session or an event", "Delivered in {artistFilmWeeks}"],
      },
      "single-reel": {
        name: "Single reel",
        items: ["One vertical film, ready to post", "Delivered in {artistFilmWeeks}"],
      },
      "festival-combo": {
        name: "Festival day photo + aftermovie",
        items: [
          "A full day of official photographs, plus a short aftermovie of that day",
          "Same-day selects for social media",
          "Delivered in 3–5 weeks, depending on event length",
        ],
      },
      "press-kit-combo": {
        name: "Artist press kit + reels pack",
        items: [
          "The 2-hour press session and 20–30 edited photos",
          "A set of short vertical reels from the same session",
          "Delivered in 3–4 weeks",
        ],
      },
      "live-set-combo": {
        name: "Live-set photos + reels pack",
        items: [
          "Performance and room photos for the night",
          "A set of reels cut from the set",
          "Set clips within 48 hours",
          "Delivered in 3–4 weeks",
        ],
      },
      "festival-express-photos": {
        name: "Next-day photo selects",
        items: [
          "One day of photographs, with selects the next day",
          "A priority add-on on top of the coverage package",
          "Hours and the edit set the fee, confirmed before the {deposit} deposit",
        ],
      },
      "festival-express-teaser": {
        name: "Same-day teaser",
        items: [
          "A handful of social selects, the same day, when the schedule allows",
          "Photographs only, on top of that day’s coverage",
          "A short note on the running order, then the fee before the {deposit} deposit",
        ],
      },
      "festival-express-weekend": {
        name: "Full weekend priority",
        badge: "From €200",
        items: [
          "About three days of Express or priority for the whole package",
          "Quoted from the days, the hours, and photographs, film, or both",
          "Photo and film together take longer than photographs on their own",
          "A short conversation, then a clear fee before the {deposit} deposit",
        ],
      },
      "festival-drone-addon": {
        name: "Drone hop · same day",
        items: [
          "A same-day hop while I'm already with you for a booked festival day",
          "Not full-event coverage from the air — a short look at the site, the stage and the land",
          "Weather-dependent, and only where flying is legally allowed",
        ],
      },
    },
    travelNote:
      "Artist sessions from the Algarve to Lisbon include travel. Festivals and commercial shoots further away — the rest of Portugal, Europe and beyond — are quoted at cost.",
    videosTitle: "Watch",
    videosNote:
      "PLACEHOLDER — confirm which link is fire, bonfire, drums or DJ. These load only after you choose to play them.",
    processTitle: "How it works",
    process: [
      { title: "Tell me the vision", body: "Artist, event, date, what you need it for." },
      { title: "Plan", body: "Mood, locations, lighting. Fire shoots need a safe setup and a spotter." },
      { title: "Shoot", body: "I move with the music and the fire." },
      { title: "Delivery", body: "Selects for socials, then the full gallery and edits. Live-set clips within 48 hours. Photographs within {artistWeeks}. Films within {artistFilmWeeks} — photo and film together take longer than photographs alone. Priority delivery is a sliding-scale add-on, quoted before the {deposit} deposit." },
    ],
    wordsTitle: "Kind words",
    testimonialIds: ["rewild", "kliq", "nixie", "sage", "artist"],
    faqTitle: "Questions",
    faq: [
      { q: "Do you shoot in dark clubs and at night?", a: "Yes — low light, stage lights, smoke and fire are my comfort zone." },
      { q: "Can I use the photos for my press kit and streaming platforms?", a: "Yes, promotional use is included." },
      { q: "Do you work with festivals?", a: "Yes, as part of official or partner content teams, always within each festival's photo and consent rules." },
      { q: "Can you film a full music video?", a: "Yes, from concept to final edit. Tell me your idea and budget." },
      { q: "How fast are clips delivered?", a: "Live-set clips within 48 hours. Photographs in {artistWeeks}. Films, and photo with film, in {artistFilmWeeks} — together they take longer than photographs alone. Photo + film bundles are with the packages: a festival day with aftermovie in 3–5 weeks, depending on event length, and a press kit or live set with reels in 3–4 weeks. Express and priority delivery is a separate add-on, quoted to the job: next-day photo selects from €75–100, a same-day teaser from €100–150 when the schedule allows, and a full weekend from €200. Tell me the days, the hours and how fast you need it. I’ll confirm the fee before the {deposit} deposit." },
    ],
  },
  places: {
    eyebrow: "Places",
    title: "Photo & video for eco-stays, surf houses and conscious boutique places",
    dek: "Let guests feel your place before they arrive.",
    cta: "Let's talk about your place",
    inquiry: "place",
    whoTitle: "Who it's for",
    who: [
      "Eco-quintas, rural guesthouses and farm stays",
      "Surf houses, surf camps and surf-yoga retreats",
      "Retreat centres, glamping and off-grid stays",
      "Small boutique hotels with a soul",
    ],
    problemTitle: "The problem I solve",
    problem:
      "Your place is beautiful — but your photos are old, generic or taken on a phone, you have no time for social media, and you depend on Booking and Airbnb. I create honest, warm images and reels that show the experience: the morning light, the breakfast from the garden, the board wax and salty hair, the fire at night.",
    packagesTitle: "Packages",
    filmsTitle: "Film",
    combosTitle: "Photo + video",
    addonsTitle: "Add-ons",
    addonsNote:
      "These sit on top of a stay content day. The aerial packages above can also be booked on their own. We fly when the weather is kind and the airspace allows.",
    packages: {
      "hotel-photo": {
        name: "Stay content day · photo",
        items: [
          "1 content day, photographs only",
          "Horizontal photos for your website, Booking, Airbnb and Google",
          "Lifestyle photos of the place, food and surroundings",
          "Commercial licence for your own marketing",
        ],
      },
      "hotel-film": {
        name: "Stay film",
        items: ["A short film of the stay", "Vertical cuts for Instagram and TikTok", "Commercial licence for your own marketing"],
      },
      "hotel-combo": {
        name: "Stay day · photo + video",
        items: ["The content day in photographs and film", "One visit, both sets", "Less than booking the two separately"],
      },
      "places-drone-stills": {
        name: "Aerial stills mini",
        items: [
          "A short flight over the place: the roofs, the garden, the path down to the water",
          "A small set of edited aerial photographs for your site and listings",
          "We fly when the weather is kind and the airspace allows",
          "Commercial licence for your own marketing",
        ],
      },
      "places-drone-story": {
        name: "Aerial story · photo + film",
        items: [
          "The same short flight, in stills and a short aerial film",
          "Enough to show the land, the light, and how the place sits in it",
          "We fly when the weather is kind and the airspace allows",
          "Commercial licence for your own marketing",
        ],
      },
      "places-drone-addon-stills": {
        name: "Drone stills add-on",
        items: [
          "A short aerial set added to a stay content day",
          "Edited photographs from above: the house, the land, the way in",
          "Only when the weather and the airspace allow",
        ],
      },
      "places-drone-addon-story": {
        name: "Drone photo + film add-on",
        items: [
          "Aerial stills and a short film, added to a content day",
          "One flight, both sets, beside the coverage on the ground",
          "Weather and permitted airspace come first",
        ],
      },
    },
    deliverablesTitle: "What you receive",
    deliverables: [
      "Horizontal photos for OTAs and your website",
      "Lifestyle images",
      "Vertical reels",
      "A commercial licence for your own marketing",
    ],
    travelNote:
      "A content day from the Algarve to Lisbon includes travel. Commercial shoots further away — the rest of Portugal, Europe and beyond — are quoted at cost.",
    comingSoon: "Dedicated stay and room collaborations are still in progress.",
    processTitle: "How it works",
    process: [
      { title: "15-minute call", body: "Your place, your guests, your goals." },
      { title: "Shot list & plan", body: "What to show, which rooms, which moments, best light and season." },
      { title: "Content day", body: "I work around your guests quietly." },
      { title: "Delivery", body: "Web-ready photos, vertical reels and a posting plan." },
    ],
    wordsTitle: "Kind words",
    testimonialIds: ["place"],
    faqTitle: "Questions",
    faq: [
      { q: "Will you disturb my guests?", a: "No — I plan around your occupancy and always ask before photographing anyone." },
      { q: "Do you provide models?", a: "I can bring friends from my community or work with your willing guests." },
      { q: "Are the photos right for Booking and Airbnb?", a: "Yes — I deliver a clean, horizontal set that follows platform guidelines, plus a warmer lifestyle set for social media." },
      { q: "Can we trade a stay for content?", a: "For new partnerships in low season I sometimes offer hybrid collaborations — ask me." },
    ],
  },
  portfolio: {
    title: "Portfolio",
    dek: "Real moments of the wild ones.",
    filters: [
      { id: "all", label: "All" },
      { id: "portraits", label: "Portraits & Couples" },
      { id: "elopements", label: "Elopements", soon: true },
      { id: "retreats", label: "Retreats & Gatherings" },
      { id: "festivals", label: "Festivals" },
      { id: "djs", label: "DJs & Music" },
      { id: "fire", label: "Fire" },
      { id: "places", label: "Places" },
      { id: "film", label: "Film" },
    ],
    empty: "Nothing in this filter yet.",
  },
  journal: {
    title: "Journal",
    dek: "Guides, stories and inspiration for free-spirited couples, retreat leaders and conscious places.",
    read: "Read the guide",
    related: "A guide that might help",
    cta: "Tell me about your plans",
  },
  inquire: {
    title: "Let's create something real.",
    dek: "Tell me a little about you and what you're dreaming of. I read every message personally and reply within 48 hours.",
    prefer: "Prefer to chat?",
    email: "Email",
    nextTitle: "What happens next?",
    next: [
      "I reply within 48 hours with availability and a few questions.",
      "We have a short call (video or WhatsApp) to feel if we're a fit.",
      "You receive a tailored proposal. A {deposit} deposit secures your date. Express delivery is a paid add-on if you need the gallery sooner.",
    ],
    confirm:
      "Thank you, beautiful soul — your message has arrived. I'll be in touch within 48 hours. In the meantime, come say hi on Instagram @oracle.of.freedom.",
  },
  thankYou: {
    title: "Message received",
    body: "Thank you, beautiful soul — your message has arrived. I'll be in touch within 48 hours. In the meantime, come say hi on Instagram @oracle.of.freedom.",
    preview:
      "Preview: this inquiry was checked and saved in the response, but email is not configured yet. Add RESEND_API_KEY before launch.",
    again: "Back home",
  },
  privacy: {
    title: "Privacy notice",
    updated: "Updated 29 September 2026. This is a short notice, not a full legal policy.",
    sections: [
      {
        title: "Who",
        body: [
          "Oracle of Freedom is Agota Urbikaite, working from the Algarve to Lisbon. Email: agota@oracleoffreedom.com.",
        ],
      },
      {
        title: "What the inquiry form collects",
        body: [
          "Your name, email, the story you choose to tell, and any optional phone number, date, place, budget and how you found the site. You send it so Agota can reply about a possible collaboration.",
          "Messages are emailed to agota@oracleoffreedom.com through Resend when that service is configured. Until then, the form still runs, but nothing is delivered.",
          "PLACEHOLDER: confirm how long inquiries are kept. The intention is to keep them only as long as needed to reply and follow the conversation, then delete them.",
        ],
      },
      {
        title: "Your choices",
        body: [
          "You can ask to see, correct or delete what you sent by emailing agota@oracleoffreedom.com.",
          "If you are unhappy with a reply about your data, you can contact the Portuguese data protection authority, CNPD.",
        ],
      },
      {
        title: "Cookies and embeds",
        body: [
          "A language cookie remembers EN, ES or PT. That is essential for the site to stay in the language you chose.",
          "Instagram and YouTube are not loaded until you accept embeds and then press play. If you choose essential only, those films stay as still images and links.",
          "The site can use Vercel Web Analytics, which does not use marketing cookies.",
          "Hosting is on Vercel. Email delivery, when switched on, is Resend. Their own privacy terms apply to that processing.",
        ],
      },
    ],
  },
  form: {
    steps: ["The dream", "The details", "How to reach you"],
    next: "Continue",
    back: "Back",
    submit: "Send my story",
    sending: "Sending…",
    name: "Your name(s)",
    email: "Email",
    phone: "WhatsApp / phone",
    service: "What are you dreaming of?",
    services: {
      portraits: "Portrait session",
      proposal: "Proposal",
      "soul-brand": "Personal / soul-brand portrait",
      elopement: "Elopement",
      wedding: "Intimate boho wedding (up to about 30)",
      retreat: "Retreat / gathering",
      artist: "DJ / artist / fire show",
      "music-video": "Music video",
      festival: "Festival / event",
      place: "Place (eco-stay / surf house / boutique)",
      other: "Something else",
    },
    date: "Date (or approx.)",
    dateFrom: "Coverage from",
    dateTo: "Coverage to",
    flexible: "My date is flexible",
    place: "Where? (the Algarve to Lisbon is included — or say if it's further)",
    people: "How many people?",
    peopleOptions: { "1": "1", "2": "2", "3-10": "3–10", "11-30": "11–30", "30+": "30+" },
    eventOptions: { "lt-10": "Under 10", "10-20": "10–20", "20-40": "20–40", "40+": "40+" },
    days: "How many days?",
    dayOptions: { "1": "1", "2-3": "2–3", "4-7": "4–7", "7+": "7+" },
    placeType: "Type of place",
    placeTypes: {
      quinta: "Eco-quinta",
      surf: "Surf house / camp",
      retreat: "Retreat centre",
      boutique: "Boutique hotel",
      glamping: "Glamping",
      other: "Other",
    },
    website: "Website / Instagram",
    budget: "Your budget for photo/film",
    budgetUnsure: "Not sure",
    budgets,
    media: "Photo, film or both",
    mediaOptions: { photo: "Photo", film: "Film", both: "Both" },
    story: "Tell me about you and your vision",
    storyPlaceholder: "The vibe, the place, what matters most…",
    found: "How did you find me?",
    foundOptions: {
      instagram: "Instagram",
      google: "Google",
      pinterest: "Pinterest",
      tiktok: "TikTok",
      friend: "A friend / past client",
      retreat: "Retreat / venue / celebrant",
      directory: "Directory (EscapeElopements, Photo Portugal…)",
      festival: "Festival / event",
      other: "Other",
    },
    language: "Preferred language",
    languages: { en: "English", es: "Español", lt: "Lietuvių" },
    consent: "I agree to be contacted about my inquiry.",
    promoCode: "Promo code",
    promoHint: "Optional. If you have one, it goes with your message.",
    wish: "What would you like?",
    wishPlaceholder: "Who is coming, how long, which place, and what you want the photographs to feel like.",
    errors: {
      required: "This field is needed.",
      email: "Add an email address Agota can reply to.",
      consent: "Consent is needed before the message can be sent.",
      date: "Add a date, or tick that your date is flexible.",
      dateEnd: "Add the end date, or tick that your date is flexible.",
      dateOrder: "The end date needs to be the same day or later.",
    },
    weddingLimit:
      "I only photograph intimate celebrations of up to about 30 guests, so I can give the day my full heart. A larger wedding is outside this work — a portrait session often still fits. You're welcome to send the note; I'll answer honestly.",
    fail: "The message didn't send. Write to agota@oracleoffreedom.com and it will still reach me.",
  },
};
