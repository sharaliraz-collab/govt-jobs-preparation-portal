export interface SALUMockQuestion {
  id: number;
  category: 'English' | 'General Knowledge' | 'Islamic Studies' | 'Science / Biology' | 'Science / Physics';
  text: string;
  options: string[];
  answer: number; // 0-indexed correct option
  explanation?: string;
}

export interface SALUSection {
  name: string;
  category: SALUMockQuestion['category'];
  questionCount: number;
  weightPercentage: number;
  iconName: string;
  color: string;
  badgeBg: string;
}

export const SALU_SECTIONS: SALUSection[] = [
  {
    name: 'English Language',
    category: 'English',
    questionCount: 10,
    weightPercentage: 20,
    iconName: 'BookOpen',
    color: 'from-blue-600 to-indigo-700',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    name: 'General Knowledge & Current Affairs',
    category: 'General Knowledge',
    questionCount: 10,
    weightPercentage: 20,
    iconName: 'Globe',
    color: 'from-emerald-600 to-teal-700',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    name: 'Islamic Studies (اسلاميات)',
    category: 'Islamic Studies',
    questionCount: 10,
    weightPercentage: 20,
    iconName: 'BookMarked',
    color: 'from-amber-600 to-yellow-700',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    name: 'Everyday Science (Biology)',
    category: 'Science / Biology',
    questionCount: 10,
    weightPercentage: 20,
    iconName: 'Dna',
    color: 'from-rose-600 to-red-700',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  {
    name: 'Everyday Science (Physics)',
    category: 'Science / Physics',
    questionCount: 10,
    weightPercentage: 20,
    iconName: 'Zap',
    color: 'from-cyan-600 to-blue-700',
    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200'
  }
];

export const SALU_QUESTIONS: SALUMockQuestion[] = [
  // ── ENGLISH (Q1 - Q10) ──
  {
    id: 1,
    category: 'English',
    text: 'Choose the correct synonym of "Abundant":',
    options: ['Scarce', 'Plentiful', 'Rare', 'Empty'],
    answer: 1,
    explanation: '"Abundant" means existing or available in large quantities; plentiful.'
  },
  {
    id: 2,
    category: 'English',
    text: 'Which word is the antonym of "Benevolent"?',
    options: ['Kind', 'Cruel', 'Generous', 'Charitable'],
    answer: 1,
    explanation: '"Benevolent" means kind and well-meaning. Its opposite is "Cruel" or malevolent.'
  },
  {
    id: 3,
    category: 'English',
    text: 'Identify the grammatically correct sentence:',
    options: [
      'He go to school daily.',
      'He goes to school daily.',
      'He going to school daily.',
      'He went to school daily.'
    ],
    answer: 1,
    explanation: 'With a singular third-person subject ("He") in the present simple tense, the verb takes "s/es" -> "goes".'
  },
  {
    id: 4,
    category: 'English',
    text: 'What is the correct plural form of "Child"?',
    options: ['Childs', 'Children', 'Childrens', 'Childes'],
    answer: 1,
    explanation: 'The irregular plural of "child" is "children".'
  },
  {
    id: 5,
    category: 'English',
    text: 'Choose the correct passive voice: "The boy broke the window."',
    options: [
      'The window was broken by the boy.',
      'The window is broken by the boy.',
      'The window has been broken by the boy.',
      'The window were broken by the boy.'
    ],
    answer: 0,
    explanation: 'Past simple active "broke" converts to "was/were + past participle" -> "was broken".'
  },
  {
    id: 6,
    category: 'English',
    text: 'Which of the following is a preposition?',
    options: ['Run', 'Beautiful', 'Under', 'Quickly'],
    answer: 2,
    explanation: '"Under" is a preposition of place. "Run" is a verb, "Beautiful" is an adjective, and "Quickly" is an adverb.'
  },
  {
    id: 7,
    category: 'English',
    text: 'The synonym of "Courageous" is:',
    options: ['Brave', 'Coward', 'Fearful', 'Timid'],
    answer: 0,
    explanation: '"Courageous" and "Brave" both mean possessing or exhibiting bravery.'
  },
  {
    id: 8,
    category: 'English',
    text: 'Choose the correct article: "She is ___ honest woman."',
    options: ['a', 'an', 'the', 'none'],
    answer: 1,
    explanation: '"Honest" begins with a silent "h" producing a vowel sound /ɒ/, requiring the article "an".'
  },
  {
    id: 9,
    category: 'English',
    text: 'The antonym of "Ancient" is:',
    options: ['Old', 'Modern', 'Historic', 'Prehistoric'],
    answer: 1,
    explanation: '"Ancient" refers to something belonging to the distant past, while "Modern" refers to the present or recent times.'
  },
  {
    id: 10,
    category: 'English',
    text: 'Which sentence is grammatically correct?',
    options: [
      'I have went to the market.',
      'I have gone to the market.',
      'I have go to the market.',
      'I have going to the market.'
    ],
    answer: 1,
    explanation: 'Present perfect requires "have/has + past participle (V3)". "Gone" is the V3 of "go".'
  },

  // ── GENERAL KNOWLEDGE (Q11 - Q20) ──
  {
    id: 11,
    category: 'General Knowledge',
    text: 'What is the capital of Pakistan?',
    options: ['Karachi', 'Lahore', 'Islamabad', 'Peshawar'],
    answer: 2,
    explanation: 'Islamabad became the official federal capital of Pakistan in the 1960s, replacing Karachi.'
  },
  {
    id: 12,
    category: 'General Knowledge',
    text: 'Which is the largest ocean on Earth?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'],
    answer: 2,
    explanation: 'The Pacific Ocean is the largest and deepest of Earth\'s oceanic divisions, covering more than 30% of Earth\'s surface.'
  },
  {
    id: 13,
    category: 'General Knowledge',
    text: 'How many continents are there in the world?',
    options: ['5', '6', '7', '8'],
    answer: 2,
    explanation: 'There are 7 continents: Asia, Africa, North America, South America, Antarctica, Europe, and Australia.'
  },
  {
    id: 14,
    category: 'General Knowledge',
    text: 'What is the national language of Pakistan?',
    options: ['Punjabi', 'Urdu', 'Sindhi', 'English'],
    answer: 1,
    explanation: 'Urdu is declared the national language of Pakistan under Article 251 of the 1973 Constitution.'
  },
  {
    id: 15,
    category: 'General Knowledge',
    text: 'Which planet is known as the "Red Planet"?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    answer: 1,
    explanation: 'Mars appears reddish because of the high concentration of iron oxide (rust) on its surface.'
  },
  {
    id: 16,
    category: 'General Knowledge',
    text: 'Who is the founder of Pakistan?',
    options: ['Allama Iqbal', 'Liaquat Ali Khan', 'Muhammad Ali Jinnah', 'Sir Syed Ahmed Khan'],
    answer: 2,
    explanation: 'Quaid-e-Azam Muhammad Ali Jinnah is the founding father and first Governor-General of Pakistan.'
  },
  {
    id: 17,
    category: 'General Knowledge',
    text: 'What is the chemical formula of water?',
    options: ['H2O', 'CO2', 'NaCl', 'H2SO4'],
    answer: 0,
    explanation: 'Water consists of two hydrogen atoms bonded to one oxygen atom (H₂O).'
  },
  {
    id: 18,
    category: 'General Knowledge',
    text: 'Which country is currently the most populous in the world?',
    options: ['India', 'China', 'USA', 'Indonesia'],
    answer: 0,
    explanation: 'India surpassed China to become the world\'s most populous country in 2023 according to UN data.'
  },
  {
    id: 19,
    category: 'General Knowledge',
    text: 'What is the name of the longest river in the world?',
    options: ['Amazon River', 'Nile River', 'Mississippi River', 'Yangtze River'],
    answer: 1,
    explanation: 'The Nile River in Africa is traditionally recognized as the longest river in the world (~6,650 km).'
  },
  {
    id: 20,
    category: 'General Knowledge',
    text: 'What currency is officially used in Pakistan?',
    options: ['Pakistani Rupee (PKR)', 'US Dollar', 'British Pound', 'Euro'],
    answer: 0,
    explanation: 'The Pakistani Rupee (PKR) is the official currency of Pakistan, issued by the State Bank of Pakistan.'
  },

  // ── ISLAMIC STUDIES (Q21 - Q30) ──
  {
    id: 21,
    category: 'Islamic Studies',
    text: 'How many Surahs are there in the Holy Quran?',
    options: ['99', '114', '110', '120'],
    answer: 1,
    explanation: 'The Holy Quran contains 114 Surahs (86 Makki and 28 Madani).'
  },
  {
    id: 22,
    category: 'Islamic Studies',
    text: 'What is the first fundamental pillar of Islam?',
    options: ['Salah (Prayer)', 'Zakat (Almsgiving)', 'Shahadah (Faith)', 'Hajj (Pilgrimage)'],
    answer: 2,
    explanation: 'Shahadah (bearing witness that there is no god but Allah and Muhammad is His messenger) is the 1st pillar of Islam.'
  },
  {
    id: 23,
    category: 'Islamic Studies',
    text: 'Which prophet is titled "Khalilullah" (Friend of Allah)?',
    options: ['Prophet Musa (A.S)', 'Prophet Ibrahim (A.S)', 'Prophet Isa (A.S)', 'Prophet Muhammad (PBUH)'],
    answer: 1,
    explanation: 'Prophet Ibrahim (Abraham A.S) is awarded the title of Khalilullah (خلیل اللہ).'
  },
  {
    id: 24,
    category: 'Islamic Studies',
    text: 'Which is the longest Surah of the Holy Quran?',
    options: ['Surah Al-Baqarah', 'Surah Al-Imran', 'Surah An-Nisa', 'Surah Al-Ma\'idah'],
    answer: 0,
    explanation: 'Surah Al-Baqarah (Chapter 2) is the longest Surah of the Holy Quran, containing 286 verses.'
  },
  {
    id: 25,
    category: 'Islamic Studies',
    text: 'How many times is the name "Allah" mentioned in the Holy Quran?',
    options: ['2,699', '2,800', '2,500', '3,000'],
    answer: 0,
    explanation: 'The word "Allah" (اللہ) occurs exactly 2,699 times throughout the Holy Quran.'
  },
  {
    id: 26,
    category: 'Islamic Studies',
    text: 'What is the second pillar of Islam?',
    options: ['Shahadah', 'Salah (Namaz)', 'Zakat', 'Sawm (Fasting)'],
    answer: 1,
    explanation: 'Salah (5 daily obligatory prayers) is the second pillar of Islam.'
  },
  {
    id: 27,
    category: 'Islamic Studies',
    text: 'Which Archangel was appointed to convey revelations (Wahi) to prophets?',
    options: ['Hazrat Jibreel (A.S)', 'Hazrat Mikaeel (A.S)', 'Hazrat Israfeel (A.S)', 'Hazrat Azrael (A.S)'],
    answer: 0,
    explanation: 'Hazrat Jibreel (Gabriel A.S) brought revelations from Allah Almighty to the Prophets.'
  },
  {
    id: 28,
    category: 'Islamic Studies',
    text: 'What is the final holy book revealed to Prophet Muhammad (PBUH)?',
    options: ['Tawrat (Torah)', 'Injeel (Gospel)', 'Zabur (Psalms)', 'Holy Quran'],
    answer: 3,
    explanation: 'The Holy Quran is the final divine revelation revealed to the seal of the Prophets, Hazrat Muhammad (PBUH).'
  },
  {
    id: 29,
    category: 'Islamic Studies',
    text: 'How many months are there in the Islamic (Hijri) calendar?',
    options: ['10', '11', '12', '13'],
    answer: 2,
    explanation: 'According to Surah At-Tawbah (9:36), the number of months ordained by Allah in a year is twelve.'
  },
  {
    id: 30,
    category: 'Islamic Studies',
    text: 'Which holy city is the birthplace of Prophet Muhammad (PBUH)?',
    options: ['Madinah Al-Munawwarah', 'Jerusalem (Al-Quds)', 'Makkah Al-Mukarramah', 'Taif'],
    answer: 2,
    explanation: 'Prophet Muhammad (PBUH) was born in Makkah Al-Mukarramah in the Year of the Elephant (571 CE).'
  },

  // ── SCIENCE / BIOLOGY (Q31 - Q40) ──
  {
    id: 31,
    category: 'Science / Biology',
    text: 'What organelle is known as the "powerhouse of the cell"?',
    options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi apparatus'],
    answer: 2,
    explanation: 'Mitochondria generate most of the cell\'s supply of adenosine triphosphate (ATP), used as a source of chemical energy.'
  },
  {
    id: 32,
    category: 'Science / Biology',
    text: 'Which human blood group is known as the universal donor?',
    options: ['Blood Group A', 'Blood Group B', 'Blood Group AB', 'Blood Group O'],
    answer: 3,
    explanation: 'Blood group O negative (O-) lacks A and B surface antigens, making it compatible with any recipient.'
  },
  {
    id: 33,
    category: 'Science / Biology',
    text: 'What is the largest organ of the human body?',
    options: ['Liver', 'Heart', 'Skin (Integumentary)', 'Brain'],
    answer: 2,
    explanation: 'The skin is the body\'s largest organ, covering an average surface area of about 1.5 to 2 square meters.'
  },
  {
    id: 34,
    category: 'Science / Biology',
    text: 'How many chambers are there in a normal human heart?',
    options: ['2 chambers', '3 chambers', '4 chambers', '5 chambers'],
    answer: 2,
    explanation: 'The human heart has 4 chambers: two upper atria (left & right) and two lower ventricles (left & right).'
  },
  {
    id: 35,
    category: 'Science / Biology',
    text: 'Which vitamin is synthesized in the skin upon exposure to sunlight?',
    options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'],
    answer: 3,
    explanation: 'Ultraviolet B (UVB) rays from sunlight trigger vitamin D synthesis in the epidermal layers of the skin.'
  },
  {
    id: 36,
    category: 'Science / Biology',
    text: 'What is the fundamental structural and functional unit of all living organisms?',
    options: ['Atom', 'Molecule', 'Cell', 'Tissue'],
    answer: 2,
    explanation: 'The cell is the basic structural, functional, and biological unit of all known living organisms.'
  },
  {
    id: 37,
    category: 'Science / Biology',
    text: 'Approximately how many bones does a human baby have at birth?',
    options: ['206 bones', '300 bones', '270 bones', '350 bones'],
    answer: 1,
    explanation: 'A human infant is born with around 300 bones/cartilages, which fuse together into 206 bones in adulthood.'
  },
  {
    id: 38,
    category: 'Science / Biology',
    text: 'Which organ is primarily responsible for filtering waste products from the blood?',
    options: ['Liver', 'Kidneys', 'Heart', 'Lungs'],
    answer: 1,
    explanation: 'The kidneys filter metabolic waste products and excess fluid from the bloodstream to form urine.'
  },
  {
    id: 39,
    category: 'Science / Biology',
    text: 'What is the normal core body temperature of a healthy human in Celsius?',
    options: ['36.5°C', '37.0°C (98.6°F)', '37.5°C', '38.0°C'],
    answer: 1,
    explanation: 'Normal average human core body temperature is typically stated as 37.0°C (98.6°F).'
  },
  {
    id: 40,
    category: 'Science / Biology',
    text: 'Which atmospheric gas do green plants absorb during photosynthesis?',
    options: ['Oxygen', 'Carbon Dioxide (CO2)', 'Nitrogen', 'Hydrogen'],
    answer: 1,
    explanation: 'Green plants take in carbon dioxide (CO₂) and water in the presence of sunlight and chlorophyll to produce glucose and oxygen.'
  },

  // ── SCIENCE / PHYSICS (Q41 - Q50) ──
  {
    id: 41,
    category: 'Science / Physics',
    text: 'What is the standard International (SI) unit of force?',
    options: ['Newton (N)', 'Joule (J)', 'Watt (W)', 'Pascal (Pa)'],
    answer: 0,
    explanation: 'The SI unit of force is the Newton (N), defined as 1 kg·m/s².'
  },
  {
    id: 42,
    category: 'Science / Physics',
    text: 'What is the approximate speed of light in a vacuum?',
    options: ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10¹⁰ m/s', '3 × 10⁴ m/s'],
    answer: 0,
    explanation: 'The speed of light in vacuum (c) is precisely 299,792,458 m/s, approximately 3 × 10⁸ m/s (300,000 km/s).'
  },
  {
    id: 43,
    category: 'Science / Physics',
    text: 'Which atomic subparticle carries a positive electric charge?',
    options: ['Electron', 'Neutron', 'Proton', 'Photon'],
    answer: 2,
    explanation: 'Protons have a positive electric charge (+1e), electrons have a negative charge (-1e), and neutrons are neutral.'
  },
  {
    id: 44,
    category: 'Science / Physics',
    text: 'What is the formula for mechanical work done?',
    options: ['W = F × d', 'W = F / d', 'W = m × a', 'W = P × V'],
    answer: 0,
    explanation: 'Work is the scalar product of force and displacement: Work = Force × Distance (W = F · d).'
  },
  {
    id: 45,
    category: 'Science / Physics',
    text: 'Which electrical measuring instrument is connected in series to measure electric current?',
    options: ['Voltmeter', 'Ammeter', 'Galvanometer', 'Ohmmeter'],
    answer: 1,
    explanation: 'An ammeter measures electric current in amperes and is connected in series within the circuit.'
  },
  {
    id: 46,
    category: 'Science / Physics',
    text: 'Which type of optical lens converges parallel rays of light to a focal point?',
    options: ['Concave Lens', 'Convex Lens', 'Plane Glass', 'Cylindrical Lens'],
    answer: 1,
    explanation: 'A convex lens (biconvex) is thicker at the center and converges light rays towards its principal focus.'
  },
  {
    id: 47,
    category: 'Science / Physics',
    text: 'What is the standard International (SI) unit of pressure?',
    options: ['Newton', 'Joule', 'Pascal (Pa)', 'Watt'],
    answer: 2,
    explanation: 'The SI unit of pressure is the Pascal (Pa), which is equal to one Newton per square meter (N/m²).'
  },
  {
    id: 48,
    category: 'Science / Physics',
    text: 'Which fundamental law states that energy cannot be created or destroyed, only transformed?',
    options: ['Newton\'s First Law', 'Ohm\'s Law', 'Law of Conservation of Energy', 'Gauss\'s Law'],
    answer: 2,
    explanation: 'The Law of Conservation of Energy (First Law of Thermodynamics) states that total energy in an isolated system remains constant.'
  },
  {
    id: 49,
    category: 'Science / Physics',
    text: 'What is the standard acceleration due to gravity on Earth\'s surface?',
    options: ['9.8 m/s²', '8.9 m/s²', '10.8 m/s²', '7.8 m/s²'],
    answer: 0,
    explanation: 'The standard acceleration due to Earth\'s gravity (g) is approximately 9.80665 m/s² (~9.8 m/s²).'
  },
  {
    id: 50,
    category: 'Science / Physics',
    text: 'Which type of wave can propagate through a vacuum without requiring a material medium?',
    options: ['Sound Wave', 'Water Wave', 'Seismic Wave', 'Electromagnetic Wave (Light)'],
    answer: 3,
    explanation: 'Electromagnetic waves (e.g. light, radio, X-rays) consist of oscillating electric and magnetic fields and do not require a physical medium to propagate.'
  }
];
