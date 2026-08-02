const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_wkeHO3sTxiE6@ep-rough-rice-ax0e6jfa.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

const pakStudiesQuestions = [
  {
    "t": "History Is The Study Of ______, Particularly People, Places And Historical Events.",
    "o": [
      "Present",
      "Past",
      "Future",
      "Culture"
    ],
    "c": 1,
    "tSd": "تاريخ ______ ، خاص طور تي ماڻهن ، جڳهن ۽ تاريخي واقعن جو مطالعو آهي.",
    "oSd": [
      "حاضر",
      "ماضي",
      "مستقبل",
      "ثقافت"
    ]
  },
  {
    "t": "We Can Study History By Using Two Types Of Sources Called ______ And ______.",
    "o": [
      "Primary, Secondary",
      "Old, New",
      "Written, Oral",
      "Formal, Informal"
    ],
    "c": 0,
    "tSd": "اسان ٻن قسمن جا ذريعا استعمال ڪري تاريخ جو مطالعو ڪري سگهون ٿا، جن کي ______ ۽ ______ سڏيو ويندو آهي.",
    "oSd": [
      "پرائمري ، ثانوي",
      "پراڻو، نئون",
      "لکيل، زباني",
      "رسمي ، غير رسمي"
    ]
  },
  {
    "t": "History Must Be Based On ______ And ______.",
    "o": [
      "Opinions, Beliefs",
      "Evidence, Logical Thought",
      "Guesses, Assumptions",
      "Myths, Legends"
    ],
    "c": 1,
    "tSd": "تاريخ ______ ۽ ______ تي ٻڌل هجڻ گهرجي.",
    "oSd": [
      "رايا ، عقيدا",
      "ثبوت، منطقي سوچ",
      "اندازا ، مفروضا",
      "خرافات ، ڏند ڪٿا"
    ]
  },
  {
    "t": "Two Important Theories About The Origin Of Human Life Are ______ And ______.",
    "o": [
      "Creation, Evolution",
      "Science, Religion",
      "Ancient, Modern",
      "Eastern, Western"
    ],
    "c": 0,
    "tSd": "انساني زندگيءَ جي ابتدا بابت ٻه اهم نظريا ______ ۽ ______ آهن.",
    "oSd": [
      "تخليق ، ارتقا",
      "سائنس، مذهب",
      "قديم، جديد",
      "مشرقي، مغربي"
    ]
  },
  {
    "t": "Bipedalism Means The Ability To ______.",
    "o": [
      "Walk On Two Legs",
      "Climb Trees",
      "Swim",
      "Fly"
    ],
    "c": 0,
    "tSd": "بائيپيڊلزم جو مطلب آهي ______ ڪرڻ جي صلاحيت.",
    "oSd": [
      "ٻن ٽنگن تي هلو",
      "وڻن تي چڙهڻ",
      "ترڻ",
      "اڏامڻ"
    ]
  },
  {
    "t": "The Early Humans Went From Place To Place In Search Of ______.",
    "o": [
      "Shelter",
      "Clothing",
      "Food",
      "Water"
    ],
    "c": 2,
    "tSd": "اوائلي انسان هڪ هنڌ کان ٻئي هنڌ ______ ويو.",
    "oSd": [
      "پناهه گاهه",
      "ڪپڙا",
      "کاڌو",
      "پاڻي"
    ]
  },
  {
    "t": "Scientists Believe That Humans Evolved From An Ape-Like Ancestor About ______ Million Years Ago.",
    "o": [
      "2",
      "4",
      "6",
      "10"
    ],
    "c": 2,
    "tSd": "سائنسدانن جو خيال آهي ته انسان لڳ ڀڳ ______ ملين سال اڳ بن مانس جهڙي ڏاڏي مان ارتقا پذير ٿيو هو.",
    "oSd": [
      "2",
      "4",
      "6",
      "10"
    ]
  },
  {
    "t": "Modern Human Beings Are Known As ______.",
    "o": [
      "Homo Habilis",
      "Homo Erectus",
      "Neanderthal",
      "Homo Sapiens"
    ],
    "c": 3,
    "tSd": "جديد انسان کي ______ طور سڃاتو وڃي ٿو.",
    "oSd": [
      "هومو هابيلس",
      "هومو ايرڪٽس",
      "نيندرٿال",
      "هومو سيپينس"
    ]
  },
  {
    "t": "Which Theory States That God Created Human Beings?",
    "o": [
      "Theory Of Evolution",
      "Theory Of Creation",
      "Theory Of Relativity",
      "Theory Of Gravity"
    ],
    "c": 1,
    "tSd": "ڪهڙو نظريو ٻڌائي ٿو ته خدا انسان کي پيدا ڪيو؟",
    "oSd": [
      "ارتقا جو نظريو",
      "تخليق جو نظريو",
      "اضافيت جو نظريو",
      "ڪشش ثقل جو نظريو"
    ]
  },
  {
    "t": "Charles Darwin Published His Book \"The Origin Of Species\" In Which Year?",
    "o": [
      "1849",
      "1859",
      "1869",
      "1879"
    ],
    "c": 1,
    "tSd": "چارلس ڊارون پنهنجو ڪتاب \"نسلن جي اصليت\" ڪهڙي سال شايع ڪيو؟",
    "oSd": [
      "1849",
      "1859",
      "1869",
      "1879"
    ]
  },
  {
    "t": "Earth Is About ______ Billion Years Old.",
    "o": [
      "2.5",
      "3.5",
      "4.5",
      "5.5"
    ],
    "c": 2,
    "tSd": "ڌرتي تقريبن ______ ارب سال پراڻي آهي.",
    "oSd": [
      "2.5",
      "3.5",
      "4.5",
      "5.5"
    ]
  },
  {
    "t": "The Study Of Humans, Past And Present Is Called ______.",
    "o": [
      "Archaeology",
      "Anthropology",
      "Sociology",
      "Psychology"
    ],
    "c": 1,
    "tSd": "انسان جي ماضيءَ ۽ حال جي مطالعي کي ______ چئبو آهي.",
    "oSd": [
      "آثار قديمه",
      "انٿروپولوجي",
      "سماجيات",
      "نفسيات"
    ]
  },
  {
    "t": "The ______ Society Emerged Around 10,000 Years Ago.",
    "o": [
      "Industrial",
      "Agricultural",
      "Pastoral",
      "Post-Industrial"
    ],
    "c": 1,
    "tSd": "______ سماج تقريبن 10 هزار سال اڳ پيدا ٿيو.",
    "oSd": [
      "صنعتي",
      "زرعي",
      "پادري",
      "پوسٽ انڊسٽريل"
    ]
  },
  {
    "t": "The Change From An Agricultural To An Industrial Society Was Brought About By The ______.",
    "o": [
      "Green Revolution",
      "Industrial Revolution",
      "French Revolution",
      "Digital Revolution"
    ],
    "c": 1,
    "tSd": "زرعي کان صنعتي سماج ۾ تبديلي ______.",
    "oSd": [
      "سبز انقلاب",
      "صنعتي انقلاب",
      "فرانسيسي انقلاب",
      "ڊجيٽل انقلاب"
    ]
  },
  {
    "t": "An Agricultural Society Is One In Which Crops Are ______ And Animals Are ______.",
    "o": [
      "Planted, Hunted",
      "Grown, Domesticated",
      "Harvested, Captured",
      "Bought, Sold"
    ],
    "c": 1,
    "tSd": "زرعي سماج اهو آهي جنهن ۾ فصل ______ ۽ جانور ______.",
    "oSd": [
      "پوکيو ، شڪار ڪيو ويو",
      "وڌو، پالتو",
      "فصل ڪٽيل، پڪڙيو ويو",
      "خريد ڪيو ، وڪرو ڪيو ويو"
    ]
  },
  {
    "t": "Today's Society Would Be Called A ______.",
    "o": [
      "Agricultural Society",
      "Industrial Society",
      "Post-Industrial Society",
      "Hunting-Gathering Society"
    ],
    "c": 2,
    "tSd": "اڄ جو سماج هڪ ______ سڏيو ويندو.",
    "oSd": [
      "زرعي سوسائٽي",
      "صنعتي سوسائٽي",
      "پوسٽ انڊسٽريل سوسائٽي",
      "شڪار گڏ ڪرڻ واري سوسائٽي"
    ]
  },
  {
    "t": "Culture Is The ______ Of A Group Of People.",
    "o": [
      "Genetic Makeup",
      "Way Of Life",
      "Economic System",
      "Political System"
    ],
    "c": 1,
    "tSd": "ثقافت ماڻهن جي هڪ گروهه جو ______ آهي.",
    "oSd": [
      "جينياتي ميڪ اپ",
      "زندگي جو طريقو",
      "اقتصادي نظام",
      "سياسي نظام"
    ]
  },
  {
    "t": "A Set Of Beliefs About Life And The World Is Called A ______.",
    "o": [
      "Culture",
      "Civilization",
      "World-View",
      "Tradition"
    ],
    "c": 2,
    "tSd": "زندگي ۽ دنيا بابت عقيدن جو هڪ سيٽ هڪ ______ سڏيو ويندو آهي.",
    "oSd": [
      "ثقافت",
      "تهذيب",
      "دنيا جو نظارو",
      "روايت"
    ]
  },
  {
    "t": "When Most Members Of A Society Share A Set Of Beliefs About Life And The World They Have A ______.",
    "o": [
      "Personal World-View",
      "Societal World-View",
      "Cultural Identity",
      "National Identity"
    ],
    "c": 1,
    "tSd": "جڏهن ڪنهن سماج جا اڪثر ميمبر زندگي ۽ دنيا بابت عقيدن جو هڪ مجموعو حصيداري ڪندا آهن ته انهن جو هڪ ______ هوندو آهي.",
    "oSd": [
      "ذاتي دنيا جو نظارو",
      "سماجي دنيا جو نظارو",
      "ثقافتي سڃاڻپ",
      "قومي سڃاڻپ"
    ]
  },
  {
    "t": "A Society That Has Reached An Advanced State Of Social Development And Organization Is Called A ______.",
    "o": [
      "Community",
      "Nation",
      "Civilization",
      "State"
    ],
    "c": 2,
    "tSd": "جيڪو معاشرو سماجي ترقي ۽ تنظيم جي ترقي يافته درجي تي پهچي چڪو آهي، ان کي ______ چئبو آهي.",
    "oSd": [
      "ڪميونٽي",
      "قوم",
      "تهذيب",
      "رياست"
    ]
  },
  {
    "t": "The First Civilization Began To Appear Around ______ BCE.",
    "o": [
      "2500",
      "3500",
      "4500",
      "5500"
    ],
    "c": 1,
    "tSd": "پهرين تهذيب ______ ق.م ڌاري ظاهر ٿيڻ شروع ٿي.",
    "oSd": [
      "2500",
      "3500",
      "4500",
      "5500"
    ]
  },
  {
    "t": "All Early Civilizations Started Along The Banks Of ______.",
    "o": [
      "Oceans",
      "Rivers",
      "Mountains",
      "Deserts"
    ],
    "c": 1,
    "tSd": "سڀ اوائلي تهذيبون ______ جي ڪناري سان شروع ٿيون.",
    "oSd": [
      "سمنڊ",
      "نديون",
      "جبل",
      "ريگستانون"
    ]
  },
  {
    "t": "The Indus Valley Civilization Grew Along The Bank Of The ______.",
    "o": [
      "River Ganges",
      "River Indus",
      "River Brahmaputra",
      "River Nile"
    ],
    "c": 1,
    "tSd": "سنڌو تهذيب درياءَ جي ڪناري سان وڌي ______.",
    "oSd": [
      "گنگا ندي",
      "سنڌو درياء",
      "درياء برهمپترا",
      "نيل ندي"
    ]
  },
  {
    "t": "The Civilization Existed Between ______ And ______ BCE.",
    "o": [
      "2500, 1500",
      "3300, 1300",
      "4000, 2000",
      "5000, 3000"
    ],
    "c": 1,
    "tSd": "تهذيب ______ ۽ ______ ق.م جي وچ ۾ موجود هئي.",
    "oSd": [
      "2500, 1500",
      "3300, 1300",
      "4000, 2000",
      "5000, 3000"
    ]
  },
  {
    "t": "The Two Main Cities Of The Indus Valley Civilization Are ______ And ______.",
    "o": [
      "Moen-Jo-Daro, Lothal",
      "Harappa, Moen-Jo-Daro",
      "Harappa, Dholavira",
      "Moen-Jo-Daro, Kalibangan"
    ],
    "c": 1,
    "tSd": "سنڌو تهذيب جا ٻه مکيه شهر ______ ۽ ______ آهن.",
    "oSd": [
      "موئن-جو-دڙو، لوٿل",
      "هڙاپا، موئن-جو-دڙو",
      "هڙاپا ، ڍولاويرا",
      "موئن-جو-دڙو، ڪليباتانان"
    ]
  },
  {
    "t": "Our Knowledge Of The People And Their Way Of Life Comes From Studying The ______ That Have Been Unearthed.",
    "o": [
      "Books",
      "Inscriptions",
      "Artifacts",
      "Manuscripts"
    ],
    "c": 2,
    "tSd": "اسان جي ماڻهن ۽ انهن جي زندگي جي طريقي جي علم انهن ______ جي مطالعي مان اچي ٿي جيڪي دريافت ڪيا ويا آهن.",
    "oSd": [
      "ڪتاب",
      "رجسٽريشن",
      "نوادرات",
      "قلمي نسخا"
    ]
  },
  {
    "t": "Children's Toys Include ______ And ______.",
    "o": [
      "Carts, Animal Figures",
      "Balls, Dolls",
      "Puzzles, Board Games",
      "Ropes, Kites"
    ],
    "c": 0,
    "tSd": "ٻارن جي رانديڪن ۾ ______ ۽ ______ شامل آهن.",
    "oSd": [
      "گاڏيون ، جانورن جا انگ اکر",
      "بالز ، گڏيون",
      "پزل ، بورڊ رانديون",
      "رسيون ، پتنگون"
    ]
  },
  {
    "t": "The Indus Valley Civilization Extended Over An Area Of ______ Million Sq Km.",
    "o": [
      "0.75",
      "1.00",
      "1.25",
      "1.50"
    ],
    "c": 2,
    "tSd": "سنڌو تهذيب ______ ملين چورس ڪلوميٽرن جي ايراضيءَ تي پکڙيل هئي.",
    "oSd": [
      "0.75",
      "1.00",
      "1.25",
      "1.50"
    ]
  },
  {
    "t": "At Its Peak, The Indus Valley Civilization Had A Population Of More Than ______ Million People.",
    "o": [
      "3",
      "4",
      "5",
      "6"
    ],
    "c": 2,
    "tSd": "سنڌو تهذيب پنهنجي عروج تي ______ ملين کان وڌيڪ ماڻهن جي آبادي هئي.",
    "oSd": [
      "3",
      "4",
      "5",
      "6"
    ]
  },
  {
    "t": "The \"Priest-King\" Statue Was Found At Which City?",
    "o": [
      "Harappa",
      "Moen-Jo-Daro",
      "Lothal",
      "Dholavira"
    ],
    "c": 1,
    "tSd": "\"پادري بادشاهه\" جو مجسمو ڪهڙي شهر ۾ مليو هو؟",
    "oSd": [
      "هڙاپا",
      "موئن-جو-دڙو",
      "لوٿل",
      "ڍولاويرا"
    ]
  },
  {
    "t": "All Indus Valley Bricks Were The Same Ratio Of ______.",
    "o": [
      "1:2:3",
      "1:2:4",
      "1:3:5",
      "2:3:4"
    ],
    "c": 1,
    "tSd": "سنڌو ماٿريءَ جون سڀ سرون هڪ ئي تناسب ______ هيون.",
    "oSd": [
      "1:2:3",
      "1:2:4",
      "1:3:5",
      "2:3:4"
    ]
  },
  {
    "t": "The People Of The Indus Valley Civilization Were Good In ______ And ______.",
    "o": [
      "Farming, Trade",
      "Art, Architecture",
      "Writing, Reading",
      "Fishing, Hunting"
    ],
    "c": 1,
    "tSd": "سنڌو تهذيب جا ماڻهو ______ ۽ ______ ۾ سٺا هئا.",
    "oSd": [
      "فارمنگ ، واپار",
      "آرٽ، آرڪيٽيڪچر",
      "لکڻ ، پڙهڻ",
      "مڇي مارڻ ، شڪار ڪرڻ"
    ]
  },
  {
    "t": "Houses And Other Buildings Were Made Of ______.",
    "o": [
      "Stone",
      "Wood",
      "Baked Bricks",
      "Mud"
    ],
    "c": 2,
    "tSd": "گهر ۽ ٻيون عمارتون ______ مان ٺهيل هيون.",
    "oSd": [
      "پٿر",
      "ڪاٺ",
      "پڪل سرون",
      "مٽي"
    ]
  },
  {
    "t": "Three Forms Of Art In The Indus Valley Civilization Were ______, ______ And ______.",
    "o": [
      "Sculpture, Pottery, Jewellery",
      "Painting, Dance, Music",
      "Writing, Carving, Weaving",
      "Metalwork, Glass, Woodwork"
    ],
    "c": 0,
    "tSd": "سنڌو تهذيب ۾ فن جا ٽي روپ ______، ______ ۽ ______ هئا.",
    "oSd": [
      "مجسما سازي ، ڪنڀار ، زيور",
      "مصوري, ناچ, موسيقي",
      "لکڻ ، چٽسالي ، اُڻڻ",
      "ڌاتو جو ڪم ، گلاس ، ڪاٺ جو ڪم"
    ]
  },
  {
    "t": "We Know That The People Engaged In Some Form Of Dancing Because A Statuette Of A ______ Was Found.",
    "o": [
      "Boy",
      "Priest",
      "Dancing Girl",
      "King"
    ],
    "c": 2,
    "tSd": "اسان thatاڻون ٿا ته ماڻهو ڪنهن نه ڪنهن قسم جي ناچ ۾ مشغول هئا ڇاڪاڻ ته هڪ ______ جو مجسمو مليو هو.",
    "oSd": [
      "ڇوڪرو",
      "پادري",
      "نچڻ واري ڇوڪري",
      "بادشاهه"
    ]
  },
  {
    "t": "Seals With Writing On Them Were Used For Trading. This Shows That The Traders Could ______.",
    "o": [
      "Read And Write",
      "Trade Goods",
      "Travel Far",
      "Speak Many Languages"
    ],
    "c": 0,
    "tSd": "واپار لاءِ مهرون استعمال ڪيون وينديون هيون جن تي لکيل هو. هن مان ظاهر ٿئي ٿو ته واپاري ______ ڪري سگهيا آهن.",
    "oSd": [
      "پڙهو ۽ لکو",
      "واپاري سامان",
      "پري سفر ڪريو",
      "ڪيتريون ئي ٻوليون ڳالهايو"
    ]
  },
  {
    "t": "The Great Bath Is Located At Which City?",
    "o": [
      "Harappa",
      "Moen-Jo-Daro",
      "Lothal",
      "Dholavira"
    ],
    "c": 1,
    "tSd": "عظيم غسل ڪهڙي شهر ۾ واقع آهي؟",
    "oSd": [
      "هڙاپا",
      "موئن-جو-دڙو",
      "لوٿل",
      "ڍولاويرا"
    ]
  },
  {
    "t": "How Many Different Characters Have Been Identified In The Indus Valley Writing System?",
    "o": [
      "200",
      "300",
      "400",
      "500"
    ],
    "c": 2,
    "tSd": "سنڌو ماٿريءَ جي لکڻ واري سرشتي ۾ ڪيترا مختلف ڪردارن جي نشاندهي ڪئي وئي آهي؟",
    "oSd": [
      "200",
      "300",
      "400",
      "500"
    ]
  },
  {
    "t": "Buttons Made From Seashell Were Used In The Indus Valley Civilization By ______ BCE.",
    "o": [
      "1000",
      "1500",
      "2000",
      "2500"
    ],
    "c": 3,
    "tSd": "سامونڊي شيل مان ٺهيل بٽڻ سنڌو تهذيب ۾ ______ سال قبل مسيح ۾ استعمال ڪيا ويا هئا.",
    "oSd": [
      "1000",
      "1500",
      "2000",
      "2500"
    ]
  },
  {
    "t": "A Harp-Like Instrument Depicted On An Indus Seal Indicates The Use Of ______.",
    "o": [
      "Percussion Instruments",
      "Wind Instruments",
      "Stringed Instruments",
      "Brass Instruments"
    ],
    "c": 2,
    "tSd": "سنڌوءَ جي مهر تي چنگ نما ساز ڏيکاريل ______ جي استعمال جي نشاندهي ڪري ٿو.",
    "oSd": [
      "پرڪشن آلات",
      "ونڊ آلات",
      "تار وارا اوزار",
      "پيتل جا اوزار"
    ]
  },
  {
    "t": "A System Of Measurement Was Developed To Measure ______, ______ And ______.",
    "o": [
      "Length, Mass, Time",
      "Weight, Height, Volume",
      "Distance, Speed, Temperature",
      "Area, Capacity, Density"
    ],
    "c": 0,
    "tSd": "ماپ جو هڪ نظام ______ ، ______ ۽ ______ کي ماپڻ لاءِ تيار ڪيو ويو.",
    "oSd": [
      "ڊيگهه، ماس، وقت",
      "وزن، اوچائي، حجم",
      "فاصلو ، رفتار ، گرمي پد",
      "علائقو ، گنجائش ، کثافت"
    ]
  },
  {
    "t": "Most Tools Were Made Of ______.",
    "o": [
      "Bronze",
      "Copper",
      "Stone",
      "Iron"
    ],
    "c": 2,
    "tSd": "اڪثر اوزار ______ جا ٺهيل هئا.",
    "oSd": [
      "کانسي",
      "ٽامي",
      "پٿر",
      "لوهه"
    ]
  },
  {
    "t": "New Techniques Of Metallurgy Resulted In The Development Of ______, ______ And ______.",
    "o": [
      "Copper, Bronze, Lead",
      "Gold, Silver, Platinum",
      "Iron, Steel, Tin",
      "Aluminum, Zinc, Nickel"
    ],
    "c": 0,
    "tSd": "ڌاتوءَ جي نئين ٽيڪنڪ جي نتيجي ۾ ______، ______ ۽ ______ جي ترقي ٿي.",
    "oSd": [
      "ٽامو ، کانسي ، ليڊ",
      "سون ، چاندي ، پلاٽينم",
      "لوهه ، اسٽيل ، ٽين",
      "ايلومينيم ، زنڪ ، نکل"
    ]
  },
  {
    "t": "The Economy Of The Indus Valley Civilization Depended On ______.",
    "o": [
      "Farming",
      "Trade",
      "Fishing",
      "Mining"
    ],
    "c": 1,
    "tSd": "سنڌو تهذيب جي معيشت جو دارومدار ______ تي هو.",
    "oSd": [
      "پوک",
      "واپار",
      "مڇي مارڻ",
      "کان کني"
    ]
  },
  {
    "t": "Trade With Other Places Was Facilitated By The Development Of ______ And ______.",
    "o": [
      "Roads, Bridges",
      "Bullock Carts, Boats",
      "Horses, Camels",
      "Ships, Trains"
    ],
    "c": 1,
    "tSd": "ٻين هنڌن سان واپار کي ______ ۽ ______ جي ترقي سان سهولت فراهم ڪئي وئي.",
    "oSd": [
      "روڊ ، پل",
      "بيل گاڏيون ، ٻيڙيون",
      "گهوڙا، اٺ",
      "جهاز, ٽرينون بند"
    ]
  },
  {
    "t": "Weights Were Based On Units Of ______ Grams.",
    "o": [
      "25",
      "28",
      "30",
      "35"
    ],
    "c": 1,
    "tSd": "وزن ______ گرام جي يونٽن تي ٻڌل هئا.",
    "oSd": [
      "25",
      "28",
      "30",
      "35"
    ]
  },
  {
    "t": "The Smallest Cube Used As Weight Weighed Less Than ______ Gram.",
    "o": [
      "1",
      "2",
      "3",
      "4"
    ],
    "c": 0,
    "tSd": "وزن جي طور تي استعمال ٿيندڙ سڀ کان ننڍڙو ڪعب گرام گرام کان گهٽ ______ هو.",
    "oSd": [
      "1",
      "2",
      "3",
      "4"
    ]
  },
  {
    "t": "The Largest Cube Used As Weight Weighed Over ______ Kilograms.",
    "o": [
      "5",
      "8",
      "11",
      "15"
    ],
    "c": 2,
    "tSd": "وزن جي طور تي استعمال ٿيندڙ سڀ کان وڏو ڪعب ______ ڪلوگرام کان وڌيڪ وزن هو.",
    "oSd": [
      "5",
      "8",
      "11",
      "15"
    ]
  },
  {
    "t": "A Ruler Made From Ivory Found At Lothal Was Divided Into Units Corresponding To ______ Mm.",
    "o": [
      "25.5",
      "30.5",
      "33.5",
      "35.5"
    ],
    "c": 2,
    "tSd": "لوٿل مان لڌل آئيوري مان ٺهيل هڪ حڪمران کي ______ ملي ميٽر جي برابر يونٽن ۾ ورهايو ويو هو.",
    "oSd": [
      "25.5",
      "30.5",
      "33.5",
      "35.5"
    ]
  },
  {
    "t": "The Indus Valley Civilization Came To An End Around ______ BCE.",
    "o": [
      "1000",
      "1300",
      "1500",
      "2000"
    ],
    "c": 1,
    "tSd": "سنڌو تهذيب ق.م ڌاري ______ پڄاڻي تي پهتي.",
    "oSd": [
      "1000",
      "1300",
      "1500",
      "2000"
    ]
  },
  {
    "t": "Historians Have Not Been Able To Find The Cause That Resulted In The Civilization Coming To An ______.",
    "o": [
      "Beginning",
      "End",
      "Start",
      "Peak"
    ],
    "c": 1,
    "tSd": "تاريخدان اهو سبب ڳولي نه سگهيا آهن جنهن جي نتيجي ۾ تهذيب هڪ هنڌ اچي ______.",
    "oSd": [
      "شروعات",
      "ختم ڪريو",
      "شروع ڪريو",
      "چوٽي"
    ]
  },
  {
    "t": "Around ______ BCE Major Climatic Changes Occurred In The Indus Valley.",
    "o": [
      "1000",
      "1500",
      "2000",
      "2500"
    ],
    "c": 2,
    "tSd": "ق.م ______ ڌاري سنڌو ماٿريءَ ۾ وڏيون موسمي تبديليون آيون.",
    "oSd": [
      "1000",
      "1500",
      "2000",
      "2500"
    ]
  },
  {
    "t": "Three Reasons Why The Indus Valley Civilization Is Important For Us Are ______, ______ And ______.",
    "o": [
      "Art, Trade, Farming",
      "Cleanliness, Town Planning, Peace",
      "Writing, Religion, Science",
      "Architecture, Tools, Music"
    ],
    "c": 1,
    "tSd": "سنڌو تهذيب اسان لاءِ اهم هجڻ جا ٽي سبب ______، ______ ۽ ______ آهن.",
    "oSd": [
      "آرٽ، واپار، فارمنگ",
      "صفائي, ٽائون پلاننگ, امن",
      "لکڻ, مذهب, سائنس",
      "آرڪيٽيڪچر, اوزار, موسيقي"
    ]
  },
  {
    "t": "The Ochre Colored Pottery Of The Indus Valley Civilization Is Still Made In The Whole Region ______.",
    "o": [
      "Today",
      "Yesterday",
      "Tomorrow",
      "Never"
    ],
    "c": 0,
    "tSd": "سنڌو تهذيب جا اوڪري رنگ جا ٺڪر اڄ به سڄي علائقي ۾ ______ آهن.",
    "oSd": [
      "اڄ",
      "ڪالهه",
      "سڀاڻي",
      "ڪڏهن به نه"
    ]
  },
  {
    "t": "The System By Which A Community Is Governed Is Called ______.",
    "o": [
      "State",
      "Government",
      "Parliament",
      "Constitution"
    ],
    "c": 1,
    "tSd": "جنهن نظام سان ڪميونٽي تي حڪمراني ڪئي ويندي آهي ان کي ______ سڏيو ويندو آهي.",
    "oSd": [
      "رياست",
      "حڪومت",
      "پارليامينٽ",
      "آئين"
    ]
  },
  {
    "t": "The Government Makes ______ To Rule The Country.",
    "o": [
      "Laws",
      "Money",
      "Products",
      "Services"
    ],
    "c": 0,
    "tSd": "حڪومت ملڪ تي حڪمراني ڪرڻ لاءِ ______ ڪري ٿي.",
    "oSd": [
      "قانون",
      "پئسو",
      "مصنوعات",
      "خدمتون"
    ]
  },
  {
    "t": "Pakistan Has A ______ And ______ Form Of Government.",
    "o": [
      "Presidential, Democratic",
      "Federal, Parliamentary",
      "Unitary, Presidential",
      "Federal, Presidential"
    ],
    "c": 1,
    "tSd": "پاڪستان ۾ هڪ ______ ۽ ______ طرز حڪومت آهي.",
    "oSd": [
      "صدارتي ، ڊيموڪريٽڪ",
      "وفاقي، پارلياماني",
      "وحداني ، صدارتي",
      "وفاقي، صدارتي"
    ]
  },
  {
    "t": "In A Federal System Of Government, Powers Are Shared Between The ______ And The ______.",
    "o": [
      "Centre, Provinces",
      "Provinces, Districts",
      "Federal, Local",
      "Federal, Provincial"
    ],
    "c": 3,
    "tSd": "حڪومت جي وفاقي نظام ۾، اختيارن کي ______ ۽ ______ جي وچ ۾ ورهايو ويندو آهي.",
    "oSd": [
      "مرڪزي ، صوبا",
      "صوبا ، ضلعا",
      "وفاقي، مقامي",
      "قومي، رياست"
    ]
  },
  {
    "t": "In A Parliamentary Form Of Government, The Legislative And Executive Branches Are Not ______.",
    "o": [
      "Separated",
      "Combined",
      "Divided",
      "Distinct"
    ],
    "c": 0,
    "tSd": "حڪومت جي پارلياماني شڪل ۾ قانون سازي ۽ انتظامي شاخون ______ نه هونديون آهن.",
    "oSd": [
      "جدا ٿيل",
      "گڏيل",
      "ورهايل",
      "ڌار ڌار"
    ]
  },
  {
    "t": "Democracy Means Rule By The ______.",
    "o": [
      "People",
      "King",
      "Military",
      "Elites"
    ],
    "c": 0,
    "tSd": "جمهوريت جو مطلب آهي ______ جي حڪمراني",
    "oSd": [
      "ماڻهو",
      "بادشاهه",
      "فوجي",
      "اشراف"
    ]
  },
  {
    "t": "The 1973 Constitution Of Pakistan Lists The ______ Rights Of Citizens.",
    "o": [
      "Political",
      "Economic",
      "Fundamental",
      "Social"
    ],
    "c": 2,
    "tSd": "پاڪستان جي 1973ع واري آئين ۾ شهرين جي ______ حقن جي فهرست ڏنل آهي.",
    "oSd": [
      "سياسي",
      "اقتصادي",
      "بنيادي",
      "سماجي"
    ]
  },
  {
    "t": "FATA Stands For ______.",
    "o": [
      "Federally Administered Tribal Areas",
      "Federal Administrative Tribal Areas",
      "Federally Associated Territorial Areas",
      "Federal Allied Tribal Areas"
    ],
    "c": 0,
    "tSd": "فاٽا جو مطلب ______.",
    "oSd": [
      "وفاق جي انتظام هيٺ قبائلي علائقا",
      "وفاقي انتظامي قبائلي علائقا",
      "وفاقي طور تي لاڳاپيل علائقائي علائقا",
      "وفاقي اتحادي قبائلي علائقا"
    ]
  },
  {
    "t": "Three Branches Of Government Are ______, ______ And ______.",
    "o": [
      "Legislative, Executive, Judicial",
      "Federal, Provincial, Local",
      "Parliament, Senate, Court",
      "Upper, Lower, Middle"
    ],
    "c": 0,
    "tSd": "حڪومت جون ٽي شاخون ______، ______ ۽ ______ آهن.",
    "oSd": [
      "قانون سازي، ايگزيڪيوٽو، عدالتي",
      "وفاقي، صوبائي، مقامي",
      "پارليامينٽ، سينيٽ، ڪورٽ",
      "مٿيون ، هيٺيون ، وچ"
    ]
  },
  {
    "t": "The Legislative Branch Or Parliament Consists Of Two Houses: ______ And ______.",
    "o": [
      "National Assembly, Senate",
      "National Assembly, Provincial Assembly",
      "Senate, Provincial Assembly",
      "Upper House, Lower House"
    ],
    "c": 0,
    "tSd": "قانون ساز شاخ يا پارليامينٽ ٻن ايوانن تي مشتمل آهي: ______ ۽ ______.",
    "oSd": [
      "قومي اسيمبلي، سينيٽ",
      "قومي اسيمبلي، صوبائي اسيمبلي",
      "سينيٽ، صوبائي اسيمبلي",
      "مٿيون ايوان ، هيٺيون ايوان"
    ]
  },
  {
    "t": "The Head Of Government In Pakistan Is The ______.",
    "o": [
      "President",
      "Prime Minister",
      "Chief Justice",
      "Speaker"
    ],
    "c": 1,
    "tSd": "پاڪستان ۾ حڪومت جو سربراهه ______ آهي.",
    "oSd": [
      "صدر",
      "وزيراعظم",
      "چيف جسٽس",
      "ڳالهائيندڙ"
    ]
  },
  {
    "t": "The Prime Minister Appoints The Cabinet From The Members Of The ______.",
    "o": [
      "Senate",
      "National Assembly",
      "Provincial Assembly",
      "Supreme Court"
    ],
    "c": 1,
    "tSd": "وزيراعظم ڪابينا جي مقرري ______ جي ميمبرن مان ڪري ٿو.",
    "oSd": [
      "سينيٽ",
      "قومي اسيمبلي",
      "صوبائي اسيمبلي",
      "سپريم ڪورٽ"
    ]
  },
  {
    "t": "The Highest Court Of Pakistan Is The ______.",
    "o": [
      "High Court",
      "Federal Shariat Court",
      "Supreme Court",
      "District Court"
    ],
    "c": 2,
    "tSd": "پاڪستان جي سڀ کان وڏي عدالت ______ آهي.",
    "oSd": [
      "هاءِ ڪورٽ",
      "وفاقي شريعت عدالت",
      "سپريم ڪورٽ",
      "ڊسٽرڪٽ ڪورٽ"
    ]
  },
  {
    "t": "The Total Membership Of The National Assembly Is ______.",
    "o": [
      "272",
      "342",
      "442",
      "542"
    ],
    "c": 1,
    "tSd": "قومي اسيمبليءَ جي ڪل ميمبرشپ ______ آهي.",
    "oSd": [
      "272",
      "342",
      "442",
      "542"
    ]
  },
  {
    "t": "The Senate Has ______ Members.",
    "o": [
      "104",
      "114",
      "124",
      "134"
    ],
    "c": 0,
    "tSd": "سينيٽ جا ______ ميمبر آهن.",
    "oSd": [
      "104",
      "114",
      "124",
      "134"
    ]
  },
  {
    "t": "The Term Of The Senate Members Is ______ Years.",
    "o": [
      "4",
      "5",
      "6",
      "7"
    ],
    "c": 2,
    "tSd": "سينيٽ ميمبرن جو مدو ______ سال آهي.",
    "oSd": [
      "4",
      "5",
      "6",
      "7"
    ]
  },
  {
    "t": "One-Half Of The Senate Members Retire After Every ______ Years.",
    "o": [
      "2",
      "3",
      "4",
      "5"
    ],
    "c": 1,
    "tSd": "سينيٽ جا اڌ ميمبر هر ______ سالن کان پوءِ رٽائر ٿين ٿا.",
    "oSd": [
      "2",
      "3",
      "4",
      "5"
    ]
  },
  {
    "t": "The Minimum Age To Become A Member Of The Senate Is ______ Years.",
    "o": [
      "25",
      "28",
      "30",
      "35"
    ],
    "c": 2,
    "tSd": "سينيٽ جو ميمبر ٿيڻ جي گهٽ ۾ گهٽ عمر ______ سال آهي.",
    "oSd": [
      "25",
      "28",
      "30",
      "35"
    ]
  },
  {
    "t": "The President Of Pakistan Is The Supreme Commander Of The ______.",
    "o": [
      "Armed Forces",
      "Civil Service",
      "Judiciary",
      "Parliament"
    ],
    "c": 0,
    "tSd": "پاڪستان جو صدر ______ جو سپريم ڪمانڊر آهي.",
    "oSd": [
      "هٿياربند فوج",
      "سول سروس",
      "عدليه",
      "پارليامينٽ"
    ]
  },
  {
    "t": "The Chief Justice Of The Supreme Court May Remain In Office Until The Age Of ______.",
    "o": [
      "60",
      "62",
      "65",
      "70"
    ],
    "c": 2,
    "tSd": "سپريم ڪورٽ جو چيف جسٽس ______ سالن جي عمر تائين پنهنجي عهدي تي رهي سگهي ٿو.",
    "oSd": [
      "60",
      "62",
      "65",
      "70"
    ]
  },
  {
    "t": "According To Sindh Local Govt Act 2013, There Are ______ Tiers Of Local Government.",
    "o": [
      "2",
      "3",
      "4",
      "5"
    ],
    "c": 1,
    "tSd": "سنڌ لوڪل گورنمينٽ ايڪٽ 2013 موجب لوڪل گورنمينٽ جا ______ درجا آهن.",
    "oSd": [
      "2",
      "3",
      "4",
      "5"
    ]
  },
  {
    "t": "The Three Tiers Of Local Government Are ______, ______ And ______.",
    "o": [
      "District, Taluka, Union",
      "City, Town, Village",
      "Provincial, District, Taluka",
      "Federal, Provincial, Local"
    ],
    "c": 0,
    "tSd": "لوڪل گورنمينٽ جا ٽي درجا ______ ، ______ ۽ ______ آهن.",
    "oSd": [
      "ضلعو، تعلقو، يونين",
      "شهر، ٽائون، ڳوٺ",
      "صوبائي، ضلعو، تعلقو",
      "وفاقي، صوبائي، مقامي"
    ]
  },
  {
    "t": "In Metropolitan Cities, The Chairman Is Called ______.",
    "o": [
      "Commissioner",
      "Mayor",
      "Deputy Commissioner",
      "Administrator"
    ],
    "c": 1,
    "tSd": "ميٽروپوليٽن شهرن ۾ چيئرمين کي ______ سڏيو ويندو آهي.",
    "oSd": [
      "ڪمشنر",
      "ميئر",
      "ڊپٽي ڪمشنر",
      "منتظم"
    ]
  },
  {
    "t": "Councilors Are Elected On ______ Basis.",
    "o": [
      "Party",
      "Non-Party",
      "Religious",
      "Ethnic"
    ],
    "c": 1,
    "tSd": "ڪائونسلر ______ بنياد تي چونڊيا ويندا آهن.",
    "oSd": [
      "پارٽي",
      "غير پارٽي",
      "مذهبي",
      "نسلي"
    ]
  },
  {
    "t": "Councilors Serve A Term Of ______ Years.",
    "o": [
      "2",
      "3",
      "4",
      "5"
    ],
    "c": 2,
    "tSd": "ڪائونسلر ______ سالن جي مدت جي خدمت ڪن ٿا.",
    "oSd": [
      "2",
      "3",
      "4",
      "5"
    ]
  },
  {
    "t": "In Pakistan, General Elections Are Held After Every ______ Years.",
    "o": [
      "3",
      "4",
      "5",
      "6"
    ],
    "c": 2,
    "tSd": "پاڪستان ۾ هر ______ سالن کانپوءِ عام چونڊون ٿينديون آهن.",
    "oSd": [
      "3",
      "4",
      "5",
      "6"
    ]
  },
  {
    "t": "The Age Of The Voter In Pakistan Is ______ Years.",
    "o": [
      "16",
      "17",
      "18",
      "20"
    ],
    "c": 2,
    "tSd": "پاڪستان ۾ ووٽر جي عمر ______ سال آهي.",
    "oSd": [
      "16",
      "17",
      "18",
      "20"
    ]
  },
  {
    "t": "The Minimum Age Of The Representatives In Pakistan Is ______ Years.",
    "o": [
      "18",
      "21",
      "25",
      "30"
    ],
    "c": 2,
    "tSd": "پاڪستان ۾ نمائندن جي گهٽ ۾ گهٽ عمر ______ سال آهي.",
    "oSd": [
      "18",
      "21",
      "25",
      "30"
    ]
  },
  {
    "t": "The Body Which Is Responsible For Conducting The Elections In The Country Is Called ______.",
    "o": [
      "Election Commission Of Pakistan",
      "Supreme Court",
      "Parliament",
      "National Assembly"
    ],
    "c": 0,
    "tSd": "ملڪ ۾ چونڊون ڪرائڻ جو ذميوار ادارو ______ سڏجي ٿو.",
    "oSd": [
      "اليڪشن ڪميشن آف پاڪستان",
      "سپريم ڪورٽ",
      "پارليامينٽ",
      "قومي اسيمبلي"
    ]
  },
  {
    "t": "The Chief Election Commissioner Has To Be A Serving Or A Former Judge Of The ______.",
    "o": [
      "High Court",
      "Supreme Court",
      "District Court",
      "Federal Shariat Court"
    ],
    "c": 1,
    "tSd": "چيف اليڪشن ڪمشنر کي حاضر سروس يا اڳوڻو جج ______ ٿيڻو آهي.",
    "oSd": [
      "هاءِ ڪورٽ",
      "سپريم ڪورٽ",
      "ڊسٽرڪٽ ڪورٽ",
      "وفاقي شريعت عدالت"
    ]
  },
  {
    "t": "\"Government Of The People, By The People, For The People\" Is A Quote By ______.",
    "o": [
      "Abraham Lincoln",
      "George Washington",
      "Winston Churchill",
      "Muhammad Ali Jinnah"
    ],
    "c": 0,
    "tSd": "\"عوام جي حڪومت، عوام طرفان، عوام لاءِ\" ______ جو هڪ اقتباس آهي.",
    "oSd": [
      "ابراهيم لنڪن",
      "جارج واشنگٽن",
      "ونسٽن چرچل",
      "محمد علي جناح"
    ]
  },
  {
    "t": "ECP Stands For ______.",
    "o": [
      "Election Commission Of Pakistan",
      "Electoral Committee Of Pakistan",
      "Election Council Of Pakistan",
      "Electoral Commission Of Pakistan"
    ],
    "c": 0,
    "tSd": "اي سي پي ______ لاءِ بيٺل آهي.",
    "oSd": [
      "اليڪشن ڪميشن آف پاڪستان",
      "اليڪشن ڪميٽي آف پاڪستان",
      "اليڪشن ڪائونسل آف پاڪستان",
      "اليڪشن ڪميشن آف پاڪستان"
    ]
  },
  {
    "t": "PEMRA Was Established In ______.",
    "o": [
      "2000",
      "2001",
      "2002",
      "2003"
    ],
    "c": 2,
    "tSd": "پيمرا ______ ۾ قائم ڪئي وئي.",
    "oSd": [
      "2000",
      "2001",
      "2002",
      "2003"
    ]
  },
  {
    "t": "The Pakistan Press, Newspapers, News Agencies And Books Registration Ordinance (PNNABRO) Regulates The ______ Media.",
    "o": [
      "Electronic",
      "Print",
      "Social",
      "Digital"
    ],
    "c": 1,
    "tSd": "پاڪستان پريس، اخبارون، خبرون ايجنسيون ۽ ڪتابن جي رجسٽريشن آرڊيننس (PNNABRO) ______ ميڊيا کي منظم ڪري ٿو.",
    "oSd": [
      "اليڪٽرانڪ",
      "ڇاپيو",
      "سماجي",
      "ڊجيٽل"
    ]
  },
  {
    "t": "The Different Channels Used To Communicate With Others Are Called ______.",
    "o": [
      "Media",
      "Technology",
      "Communication",
      "Information"
    ],
    "c": 0,
    "tSd": "ٻين سان ڳالهه ٻولهه ڪرڻ لاءِ استعمال ٿيندڙ مختلف چينلن کي ______ سڏيو ويندو آهي.",
    "oSd": [
      "ميڊيا",
      "ٽيڪنالاجي",
      "مواصلات",
      "اڻ"
    ]
  },
  {
    "t": "The Use Of Electronic Communication Channels To Communicate With Others Is Called ______.",
    "o": [
      "Print Media",
      "Electronic Media",
      "Social Media",
      "Digital Media"
    ],
    "c": 1,
    "tSd": "ٻين سان ڳالهه ٻولهه ڪرڻ لاءِ اليڪٽرانڪ مواصلاتي چينلز جو استعمال ______ سڏيو ويندو آهي.",
    "oSd": [
      "ڇاپو ميڊيا",
      "اليڪٽرانڪ ميڊيا",
      "سوشل ميڊيا",
      "ڊجيٽل ميڊيا"
    ]
  },
  {
    "t": "The Main Source Of Income For Media Houses Comes From ______.",
    "o": [
      "Subscriptions",
      "Government Funding",
      "Advertising",
      "Donations"
    ],
    "c": 2,
    "tSd": "ميڊيا هائوسز جي آمدني جو بنيادي ذريعو ______ کان اچي ٿو.",
    "oSd": [
      "رڪنيت",
      "حڪومت جي فنڊنگ",
      "اشتهارسازي",
      "عطيا"
    ]
  },
  {
    "t": "The Message Encoded Via A Machine Readable Format Is Called ______.",
    "o": [
      "Print Media",
      "Electronic Media",
      "Digital Media",
      "Social Media"
    ],
    "c": 2,
    "tSd": "مشين پڙهڻ واري فارميٽ ذريعي انڪوڊ ٿيل پيغام کي ______ سڏيو ويندو آهي.",
    "oSd": [
      "ڇاپو ميڊيا",
      "اليڪٽرانڪ ميڊيا",
      "ڊجيٽل ميڊيا",
      "سوشل ميڊيا"
    ]
  },
  {
    "t": "The Communication Delivered In A Paper Format Is Called ______.",
    "o": [
      "Print Media",
      "Electronic Media",
      "Digital Media",
      "Social Media"
    ],
    "c": 0,
    "tSd": "ڪاغذ جي شڪل ۾ پهچايل مواصلات کي ______ سڏيو ويندو آهي.",
    "oSd": [
      "ڇاپو ميڊيا",
      "اليڪٽرانڪ ميڊيا",
      "ڊجيٽل ميڊيا",
      "سوشل ميڊيا"
    ]
  },
  {
    "t": "The Interaction Among People By Use Of Internet And Telephone Technologies Is Called ______.",
    "o": [
      "Print Media",
      "Electronic Media",
      "Digital Media",
      "Social Media"
    ],
    "c": 3,
    "tSd": "انٽرنيٽ ۽ ٽيليفون ٽيڪنالاجيز جي استعمال سان ماڻهن جي وچ ۾ رابطي کي ______ سڏيو ويندو آهي.",
    "oSd": [
      "ڇاپو ميڊيا",
      "اليڪٽرانڪ ميڊيا",
      "ڊجيٽل ميڊيا",
      "سوشل ميڊيا"
    ]
  },
  {
    "t": "Examples Of Print Media Are ______, ______ And ______.",
    "o": [
      "Newspapers, Books, Magazines",
      "Radio, TV, Internet",
      "Websites, Blogs, Emails",
      "Social Media, Apps, Games"
    ],
    "c": 0,
    "tSd": "پرنٽ ميڊيا جا مثال ______ ، ______ ۽ ______ آهن.",
    "oSd": [
      "اخبارون، ڪتاب، رسالا",
      "ريڊيو ، ٽي وي ، انٽرنيٽ",
      "ويب سائيٽون ، بلاگ ، اي ميلون",
      "سوشل ميڊيا, ايپس, رانديون"
    ]
  },
  {
    "t": "Skype, Twitter, Linkedin, Google And Youtube Are Examples Of ______ Media.",
    "o": [
      "Print",
      "Electronic",
      "Digital",
      "Social"
    ],
    "c": 3,
    "tSd": "Skype ، Twitter ، Linkedin ، گوگل ۽ يوٽيوب ______ ميڊيا جا مثال آهن.",
    "oSd": [
      "ڇاپيو",
      "اليڪٽرانڪ",
      "ڊجيٽل",
      "سماجي"
    ]
  },
  {
    "t": "The Media Helps To Promote And Protect The Rights To ______ And ______.",
    "o": [
      "Speech, Expression",
      "Education, Health",
      "Property, Security",
      "Freedom Of Speech, Freedom Of Information"
    ],
    "c": 3,
    "tSd": "ميڊيا ______ ۽ ______ جي حقن کي فروغ ڏيڻ ۽ تحفظ ڏيڻ ۾ مدد ڪري ٿي.",
    "oSd": [
      "تقرير ، اظهار",
      "تعليم, صحت",
      "ملڪيت، سيڪيورٽي",
      "مذهب ، ثقافت"
    ]
  },
  {
    "t": "When The Media Reports On The Actions Of Public Officials, It Is Playing The Role Of A ______.",
    "o": [
      "Watchdog",
      "Teacher",
      "Entertainer",
      "Advertiser"
    ],
    "c": 0,
    "tSd": "ميڊيا جڏهن سرڪاري عملدارن جي عملن تي رپورٽ ڪري ٿي ته اها هڪ ______ جو ڪردار ادا ڪري رهي آهي.",
    "oSd": [
      "چوڪيدار",
      "استاد",
      "تفريح ڪندڙ",
      "اشتهار ڏيندڙ"
    ]
  },
  {
    "t": "Freedom Of Information Helps Citizens To Make Informed Choices When Choosing ______ For Public Officials In The Upcoming Elections.",
    "o": [
      "To Vote",
      "To Work",
      "To Stand",
      "To Apply"
    ],
    "c": 0,
    "tSd": "معلومات جي آزادي شهرين کي ايندڙ چونڊن ۾ سرڪاري عملدارن لاءِ ______ چونڊڻ وقت باخبر چونڊ ڪرڻ ۾ مدد ڪري ٿي.",
    "oSd": [
      "ووٽ ڏيڻ لاءِ",
      "ڪم ڪرڻ",
      "بيهڻ لاءِ",
      "لاڳو ڪرڻ لاءِ"
    ]
  },
  {
    "t": "The Media Must Be ______ And ______ If It Is To Play The Role Of Watchdog.",
    "o": [
      "Free, Independent",
      "Strong, Powerful",
      "Popular, Wealthy",
      "Large, Influential"
    ],
    "c": 0,
    "tSd": "ميڊيا کي لازمي طور تي ______ ۽ ______ هجڻ گهرجي جيڪڏهن اهو چوڪيدار جو ڪردار ادا ڪرڻو آهي.",
    "oSd": [
      "آزاد ، آزاد",
      "مضبوط ، طاقتور",
      "مشهور ، مالدار",
      "وڏو، بااثر"
    ]
  },
  {
    "t": "Article 19 Of The Constitution Guarantees The Right To ______.",
    "o": [
      "Education",
      "Health",
      "Freedom Of Speech",
      "Property"
    ],
    "c": 2,
    "tSd": "آئين جو آرٽيڪل 19 ______ جي حق جي ضمانت ڏئي ٿو.",
    "oSd": [
      "تعليم",
      "صحت",
      "تقرير جي آزادي",
      "ملڪيت"
    ]
  },
  {
    "t": "Article 19(A) Guarantees The Right To ______.",
    "o": [
      "Education",
      "Health",
      "Information",
      "Property"
    ],
    "c": 2,
    "tSd": "آرٽيڪل 19 (A) ______ جي حق جي ضمانت ڏئي ٿو.",
    "oSd": [
      "تعليم",
      "صحت",
      "اڻ",
      "ملڪيت"
    ]
  },
  {
    "t": "PNNABRO Was Established In ______.",
    "o": [
      "2000",
      "2001",
      "2002",
      "2003"
    ],
    "c": 2,
    "tSd": "PNNABRO ______ ۾ قائم ڪيو ويو.",
    "oSd": [
      "2000",
      "2001",
      "2002",
      "2003"
    ]
  },
  {
    "t": "The Media Often Seek Not Only To Inform, But Also To ______ Us.",
    "o": [
      "Educate",
      "Entertain",
      "Influence",
      "Inspire"
    ],
    "c": 2,
    "tSd": "ميڊيا اڪثر ڪري نه رڳو informاڻ ڏيڻ جي ڪوشش ڪندو آهي ، پر اسان کي ______ ڪرڻ لاءِ پڻ.",
    "oSd": [
      "تعليم حاصل ڪريو",
      "تفريح",
      "اثر و رسوخ",
      "انسپائريشن"
    ]
  },
  {
    "t": "A Fact Can Be ______.",
    "o": [
      "Proven",
      "Believed",
      "Imagined",
      "Guessed"
    ],
    "c": 0,
    "tSd": "هڪ حقيقت ______ ٿي سگهي ٿي.",
    "oSd": [
      "ثابت ٿيل",
      "مڃيو",
      "تصور ڪيو",
      "اندازو لڳايو"
    ]
  },
  {
    "t": "The Tendency To Favour One Person, Group Or View-Point Over Another Is Called ______.",
    "o": [
      "Bias",
      "Propaganda",
      "Stereotyping",
      "Prejudice"
    ],
    "c": 0,
    "tSd": "هڪ شخص ، گروهه يا نقطه نظر کي ٻئي جي مٿان پسند ڪرڻ جو رجحان ______ چيو ويندو آهي.",
    "oSd": [
      "تعصب",
      "پروپيگنڊا",
      "اسٽريٽائپنگ",
      "تعصب"
    ]
  },
  {
    "t": "The Technique Of Using Information To Arouse Feelings Is Called ______.",
    "o": [
      "Name-Calling",
      "Bandwagon",
      "Appeal To Emotion",
      "Transfer"
    ],
    "c": 2,
    "tSd": "جذبات کي جاڳائڻ لاءِ معلومات کي استعمال ڪرڻ جي ٽيڪنڪ کي ______ سڏيو ويندو آهي.",
    "oSd": [
      "نالو سڏڻ",
      "بينڊوگن",
      "جذبات کي اپيل ڪريو",
      "منتقلي"
    ]
  },
  {
    "t": "When All Women Or All Men Are Said To Behave In A Certain Way, This Is An Example Of ______.",
    "o": [
      "Bias",
      "Propaganda",
      "Stereotyping",
      "Prejudice"
    ],
    "c": 2,
    "tSd": "جڏهن سڀني عورتن يا سڀني مردن کي چيو ويندو آهي ته هڪ خاص طريقي سان برتاءُ ڪن ٿا ، اهو هڪ مثال ______ آهي.",
    "oSd": [
      "تعصب",
      "پروپيگنڊا",
      "اسٽريٽائپنگ",
      "تعصب"
    ]
  },
  {
    "t": "A Stereotype Is A ______ That Is Too Simple, Usually Exaggerated And Often Offensive.",
    "o": [
      "Generalization",
      "Fact",
      "Opinion",
      "Belief"
    ],
    "c": 0,
    "tSd": "هڪ اسٽريٽائپ هڪ ______ آهي جيڪو تمام سادو آهي ، عام طور تي مبالغو ۽ اڪثر جارحانه آهي.",
    "oSd": [
      "جنرلائيزيشن",
      "حقيقت",
      "راءِ",
      "عقيدو"
    ]
  },
  {
    "t": "Propaganda Is The Systematic Effort To Spread Opinions Or Beliefs, Often By ______.",
    "o": [
      "Evidence And Proof",
      "Distortion And Deception",
      "Logic And Reason",
      "Honesty And Truth"
    ],
    "c": 1,
    "tSd": "پروپيگنڊا رايا يا عقيدن کي پکيڙڻ جي منظم ڪوشش آهي ، اڪثر ڪري ______.",
    "oSd": [
      "ثبوت ۽ ثبوت",
      "تحريف ۽ فريب",
      "منطق ۽ دليل",
      "ايمانداري ۽ سچائي"
    ]
  },
  {
    "t": "The Technique That Uses A Famous Person To Say That An Idea Is Good Is Called ______.",
    "o": [
      "Testimonial",
      "Plain Folks",
      "Glittering Generalities",
      "Transfer"
    ],
    "c": 0,
    "tSd": "اها ٽيڪنڪ جيڪا هڪ مشهور شخص کي استعمال ڪندي اهو چوڻ لاءِ استعمال ڪري ٿي ته هڪ خيال سٺو آهي ، ان کي ______ سڏيو ويندو آهي.",
    "oSd": [
      "شاهدي",
      "سادي ماڻهو",
      "چمڪندڙ عموميات",
      "منتقلي"
    ]
  },
  {
    "t": "The Technique That Claims \"Everyone\" Has One Or \"Everyone\" Is Doing It Is Called ______.",
    "o": [
      "Name-Calling",
      "Bandwagon",
      "Card Stacking",
      "Transfer"
    ],
    "c": 1,
    "tSd": "ٽيڪنڪ جيڪا دعويٰ ڪري ٿي ته \"هرڪو\" وٽ هڪ آهي يا \"هرڪو\" اهو ڪري رهيو آهي ، ان کي ______ سڏيو ويندو آهي.",
    "oSd": [
      "نالو سڏڻ",
      "بينڊوگن",
      "ڪارڊ اسٽيڪنگ",
      "منتقلي"
    ]
  },
  {
    "t": "Quaid-I-Azam Mohammad Ali Jinnah Died On September 11, 1948 Is An Example Of A ______.",
    "o": [
      "Opinion",
      "Fact",
      "Belief",
      "Judgment"
    ],
    "c": 1,
    "tSd": "قائداعظم محمد علي جناح 11 سيپٽمبر 1948ع تي وفات ڪئي ______ جو مثال آهي.",
    "oSd": [
      "راءِ",
      "حقيقت",
      "عقيدو",
      "فيصلو"
    ]
  },
  {
    "t": "\"My Mother Is The Best Cook In The World\" Is An Example Of An ______.",
    "o": [
      "Fact",
      "Opinion",
      "Evidence",
      "Truth"
    ],
    "c": 1,
    "tSd": "\"منهنجي ماءُ دنيا ۾ بهترين بورچي آهي\" هڪ ______ جو هڪ مثال آهي.",
    "oSd": [
      "حقيقت",
      "راءِ",
      "ثبوت",
      "سچ"
    ]
  },
  {
    "t": "The Region Of South Asia Comprises ______ Countries.",
    "o": [
      "6",
      "7",
      "8",
      "9"
    ],
    "c": 2,
    "tSd": "ڏکڻ ايشيا جو علائقو ______ ملڪن تي مشتمل آهي.",
    "oSd": [
      "6",
      "7",
      "8",
      "9"
    ]
  },
  {
    "t": "An Area Of Land That Shares Common Features Is Called A ______.",
    "o": [
      "Continent",
      "Region",
      "Country",
      "State"
    ],
    "c": 1,
    "tSd": "زمين جو هڪ علائقو جيڪو عام خاصيتن کي حصيداري ڪري ٿو ان کي ______ سڏيو ويندو آهي.",
    "oSd": [
      "براعظم",
      "علائقو",
      "ملڪ",
      "رياست"
    ]
  },
  {
    "t": "The North, North-West And North-East Of South Asia Are Surrounded By ______.",
    "o": [
      "Oceans",
      "Deserts",
      "Mountain Ranges",
      "Plains"
    ],
    "c": 2,
    "tSd": "ڏکڻ ايشيا جو اتر، اتر اولهه ۽ اتر اوڀر ______ سان گهيريل آهي.",
    "oSd": [
      "سمنڊ",
      "ريگستانون",
      "جبل جون قطارون",
      "ميداني"
    ]
  },
  {
    "t": "To The South Of Pakistan Lies The ______.",
    "o": [
      "Bay Of Bengal",
      "Arabian Sea",
      "Indian Ocean",
      "Red Sea"
    ],
    "c": 1,
    "tSd": "پاڪستان جي ڏکڻ ۾ ______ آهي.",
    "oSd": [
      "بنگال جي خليج",
      "عربي سمنڊ",
      "هندي سمنڊ",
      "ڳاڙهو سمنڊ"
    ]
  },
  {
    "t": "South Asia Is A Region Because It Shares The Following Characteristics: ______, ______ And ______.",
    "o": [
      "Land, People, Culture",
      "Mountains, Rivers, Deserts",
      "Religion, Language, Food",
      "Climate, Economy, Government"
    ],
    "c": 0,
    "tSd": "ڏکڻ ايشيا هڪ علائقو آهي ڇاڪاڻ ته اهو هيٺين خاصيتن کي حصيداري ڪري ٿو: ______ ، ______ ۽ ______.",
    "oSd": [
      "زمين، ماڻهو، ثقافت",
      "جبل، درياهه، صحرا",
      "مذهب, ٻولي, کاڌو",
      "آبهوا ، معيشت ، حڪومت"
    ]
  },
  {
    "t": "The Largest Continent Of The World Both In Area And Population Is ______.",
    "o": [
      "Africa",
      "Asia",
      "Europe",
      "North America"
    ],
    "c": 1,
    "tSd": "دنيا جو سڀ کان وڏو کنڊ ايراضي ۽ آبادي جي لحاظ کان ______ آهي.",
    "oSd": [
      "آفريڪا",
      "ايشيا",
      "يورپ",
      "اتر آمريڪا"
    ]
  },
  {
    "t": "Asia Is ______ Of The Land Of The World.",
    "o": [
      "One-Fourth",
      "One-Third",
      "One-Half",
      "Two-Thirds"
    ],
    "c": 1,
    "tSd": "ايشيا دنيا جي سرزمين ______ آهي.",
    "oSd": [
      "هڪ چوٿون",
      "هڪ ٽيون",
      "هڪ اڌ",
      "ٻه ٽيون حصو"
    ]
  },
  {
    "t": "Approximately ______ Percent Of The World's Population Lives In Asia.",
    "o": [
      "50",
      "60",
      "70",
      "80"
    ],
    "c": 1,
    "tSd": "دنيا جي تقريبن ______ سيڪڙو آبادي ايشيا ۾ رهي ٿي.",
    "oSd": [
      "50",
      "60",
      "70",
      "80"
    ]
  },
  {
    "t": "The Maldives Consists Of A Chain Of ______.",
    "o": [
      "Mountains",
      "Islands",
      "Deserts",
      "Forests"
    ],
    "c": 1,
    "tSd": "مالديپ ______ جي زنجير تي مشتمل آهي.",
    "oSd": [
      "جبل",
      "ٻيٽ",
      "ريگستانون",
      "ٻيلا"
    ]
  },
  {
    "t": "When Rocks Bend In Up-Folds And Down-Folds ______ Mountains Are Formed.",
    "o": [
      "Block",
      "Fold",
      "Volcanic",
      "Dome"
    ],
    "c": 1,
    "tSd": "۽ جڏھن پھڻن کي ھيٺ ۽ ھيٺ جھڪبا ۽ جبل ______ ٿيندا.",
    "oSd": [
      "بلاڪ ڪريو",
      "فولڊ ڪريو",
      "آتش فشاں",
      "گنبذ"
    ]
  },
  {
    "t": "When The Plates Move Towards Each Other And Do Not Fold But Crack ______ Mountains Are Formed.",
    "o": [
      "Fold",
      "Fault-Block",
      "Volcanic",
      "Dome"
    ],
    "c": 1,
    "tSd": "۽ جڏھن وڇاڻا ھڪ ٻئي ڏانھن نه ھلندا ۽ ڦاٽندا ______ جبل ڇڄندا.",
    "oSd": [
      "فولڊ ڪريو",
      "غلطي-بلاڪ",
      "آتش فشاں",
      "گنبذ"
    ]
  },
  {
    "t": "When Lava Flows To The Earth's Surface Causing A Cone-Shaped Mountain Called A ______.",
    "o": [
      "Plateau",
      "Mountain",
      "Volcano",
      "Hill"
    ],
    "c": 2,
    "tSd": "جڏهن لاوا ڌرتيءَ جي سطح تي وهندو آهي ، هڪ شنک جي شڪل وارو جبل پيدا ڪندو آهي ، جنهن کي ______ سڏيو ويندو آهي.",
    "oSd": [
      "پليٽو",
      "جبل",
      "آتش فشاں",
      "ٽڪري"
    ]
  },
  {
    "t": "Plains Are Formed By ______ Or ______.",
    "o": [
      "Folding, Faulting",
      "Erosion, Deposition",
      "Volcanic, Glacial",
      "Wind, Water"
    ],
    "c": 1,
    "tSd": "ميداني ميدان ______ يا ______ سان ٺهيل آهن.",
    "oSd": [
      "فولڊنگ ، فالٽنگ",
      "ڪٽڻ ، جمع ٿيڻ",
      "آتش فشاں ، برفاني",
      "واء، پاڻي"
    ]
  },
  {
    "t": "The Three Large Plains In South Asia Are ______, ______ And ______.",
    "o": [
      "Indus, Ganges, Brahmaputra",
      "Indus, Ganges, Nile",
      "Ganges, Brahmaputra, Yangtze",
      "Indus, Brahmaputra, Mekong"
    ],
    "c": 0,
    "tSd": "ڏکڻ ايشيا جا ٽي وڏا ميدان ______ ، ______ ۽ ______ آهن.",
    "oSd": [
      "سنڌو، گنگا، برهمپتر",
      "سنڌو، گنگا، نيل",
      "گنگا ، برهمپترا ، يانگزي",
      "سنڌو، برهمپترا، ميڪونگ"
    ]
  },
  {
    "t": "Mount Everest, The Highest Mountain Peak In The World Lies In The ______.",
    "o": [
      "Karakoram",
      "Himalayas",
      "Hindukush",
      "Andes"
    ],
    "c": 1,
    "tSd": "مائونٽ ايورسٽ، دنيا جي بلند ترين جبل جي چوٽي ______ ۾ آهي.",
    "oSd": [
      "قراقرم",
      "هماليه",
      "هندو ڪش",
      "اينڊس"
    ]
  },
  {
    "t": "The Second Highest Peak K-2 Is Situated In Which Mountain Range?",
    "o": [
      "Himalayas",
      "Karakoram",
      "Hindukush",
      "Andes"
    ],
    "c": 1,
    "tSd": "ٻي بلند ترين چوٽي K-2 ڪهڙي جبل جي حد ۾ واقع آهي؟",
    "oSd": [
      "هماليه",
      "قراقرم",
      "هندو ڪش",
      "اينڊس"
    ]
  },
  {
    "t": "The Three Main Plateaus In South Asia Are ______, ______ And ______.",
    "o": [
      "Deccan, Potwar, Balochistan",
      "Tibetan, Deccan, Potwar",
      "Balochistan, Deccan, Tibetan",
      "Potwar, Balochistan, Tibetan"
    ],
    "c": 0,
    "tSd": "ڏکڻ ايشيا جا ٽي مكيه پليٽون ______، ______ ۽ ______ آهن.",
    "oSd": [
      "دکن، پوٽوڙ، بلوچستان",
      "تبتي ، دکن ، پوٽاڙهه",
      "بلوچستان، دکن، تبتي",
      "پوٽوار، بلوچستان، تبتي"
    ]
  },
  {
    "t": "The Deccan Plateau Is Located In Which Country?",
    "o": [
      "Pakistan",
      "India",
      "Nepal",
      "Bangladesh"
    ],
    "c": 1,
    "tSd": "دکن جي ماٿري ڪهڙي ملڪ ۾ آهي؟",
    "oSd": [
      "پاڪستان",
      "ھندستان",
      "نيپال",
      "بنگلاديش"
    ]
  },
  {
    "t": "The Potwar Plateau Is Situated Between The River Indus And ______.",
    "o": [
      "Jhelum",
      "Chenab",
      "Ravi",
      "Sutlej"
    ],
    "c": 0,
    "tSd": "پوٽواڙ پليٽو سنڌو درياهه ۽ ______ جي وچ ۾ واقع آهي.",
    "oSd": [
      "جهلم",
      "چناب",
      "روي",
      "ستلج"
    ]
  },
  {
    "t": "The Majority Of The Population Of Pakistan Lives In The ______ Areas.",
    "o": [
      "Mountain",
      "Plateau",
      "Plain",
      "Desert"
    ],
    "c": 2,
    "tSd": "پاڪستان جي آبادي جي اڪثريت ______ علائقن ۾ رهي ٿي.",
    "oSd": [
      "جبل",
      "پليٽو",
      "سادي",
      "ريگستان"
    ]
  },
  {
    "t": "The People Of Nepal Are Called ______.",
    "o": [
      "Nepalese",
      "Nepali",
      "Nepalis",
      "Gurkhas"
    ],
    "c": 0,
    "tSd": "نيپال جي ماڻهن کي ______ سڏيو وڃي ٿو.",
    "oSd": [
      "نيپالي",
      "نيپالي",
      "نيپالي",
      "گورکھا"
    ]
  },
  {
    "t": "The Two Main Ethnic Groups In Sri Lanka Are ______ And ______.",
    "o": [
      "Sinhalese, Tamils",
      "Sinhalese, Bengalis",
      "Tamils, Bhotia",
      "Tamils, Gurungs"
    ],
    "c": 0,
    "tSd": "سري لنڪا جا ٻه مکيه نسلي گروهه ______ ۽ ______ آهن.",
    "oSd": [
      "سنهالي، تامل",
      "سنهالي، بنگالي",
      "تامل، ڀوتيا",
      "تامل ، گرونگ"
    ]
  },
  {
    "t": "The Majority Of The People Of Pakistan Are ______.",
    "o": [
      "Hindus",
      "Christians",
      "Muslims",
      "Buddhists"
    ],
    "c": 2,
    "tSd": "پاڪستان جي عوام جي اڪثريت ______ آهي.",
    "oSd": [
      "هندو",
      "عيسائي",
      "مسلمان",
      "ٻڌ ڌرم"
    ]
  },
  {
    "t": "About ______ Percent Of The People Of Maldives Engage In Fishing.",
    "o": [
      "60",
      "70",
      "80",
      "90"
    ],
    "c": 2,
    "tSd": "مالديپ جا تقريبن ______ سيڪڙو ماڻهو مڇي مارڻ ۾ مشغول آهن.",
    "oSd": [
      "60",
      "70",
      "80",
      "90"
    ]
  },
  {
    "t": "The Maldives Consists Of A Group Of ______.",
    "o": [
      "Islands",
      "Mountains",
      "Deserts",
      "Forests"
    ],
    "c": 0,
    "tSd": "مالديپ ______ جي هڪ گروهه تي مشتمل آهي.",
    "oSd": [
      "ٻيٽ",
      "جبل",
      "ريگستانون",
      "ٻيلا"
    ]
  },
  {
    "t": "The Official Languages Of India Are Hindi And ______.",
    "o": [
      "Urdu",
      "English",
      "Bengali",
      "Tamil"
    ],
    "c": 1,
    "tSd": "هندستان جون سرڪاري ٻوليون هندي ۽ ______ آهن.",
    "oSd": [
      "اردو",
      "انگريزي",
      "بنگالي",
      "تامل"
    ]
  },
  {
    "t": "About ______ Percent Of Indians Are Hindus.",
    "o": [
      "73",
      "78",
      "83",
      "88"
    ],
    "c": 2,
    "tSd": "تقريبن ______ سيڪڙو هندستاني هندو آهن.",
    "oSd": [
      "73",
      "78",
      "83",
      "88"
    ]
  },
  {
    "t": "Bangladesh Became An Independent Country In ______.",
    "o": [
      "1947",
      "1956",
      "1971",
      "1973"
    ],
    "c": 2,
    "tSd": "بنگلاديش ______ ۾ هڪ آزاد ملڪ بڻجي ويو.",
    "oSd": [
      "1947",
      "1956",
      "1971",
      "1973"
    ]
  },
  {
    "t": "The Language Of The People Of Maldives (Dhivehi) Is Very Close To Which Language?",
    "o": [
      "Hindi",
      "Tamil",
      "Sinhalese",
      "Bengali"
    ],
    "c": 2,
    "tSd": "مالديپ جي ماڻهن (ڌيوي) جي ٻولي ڪهڙي ٻوليءَ جي تمام ويجهو آهي؟",
    "oSd": [
      "ھندي",
      "تامل",
      "سنهالي",
      "بنگالي"
    ]
  },
  {
    "t": "The Dominant Religion In Maldives Today Is ______.",
    "o": [
      "Buddhism",
      "Hinduism",
      "Islam",
      "Christianity"
    ],
    "c": 2,
    "tSd": "مالديپ ۾ ا todayڪلهه غالب مذهب ______ آهي.",
    "oSd": [
      "ٻڌمت",
      "هندو ڌرم",
      "اسلام",
      "عيسائيت"
    ]
  },
  {
    "t": "Sri Lanka Was Formerly Known As ______.",
    "o": [
      "Serendip",
      "Ceylon",
      "Lanka",
      "Singhala"
    ],
    "c": 1,
    "tSd": "سري لنڪا اڳ ۾ ______ طور سڃاتو ويندو هو.",
    "oSd": [
      "سرينڊپ",
      "سلون",
      "لنڪا",
      "سنگال"
    ]
  },
  {
    "t": "The Activities That Use The Earth's Resources Such As Land, Water And Minerals Are ______ Activities.",
    "o": [
      "Primary",
      "Secondary",
      "Tertiary",
      "Quaternary"
    ],
    "c": 0,
    "tSd": "سرگرميون جيڪي زمين جي وسيلن جهڙوڪ زمين ، پاڻي ۽ معدنيات کي استعمال ڪن ٿيون اهي ______ سرگرميون آهن.",
    "oSd": [
      "پرائمري",
      "ثانوي",
      "ٽيريٽري",
      "ڪواٽرنري"
    ]
  },
  {
    "t": "______ Activities Use Raw Materials And Change Them Into Valuable Products.",
    "o": [
      "Primary",
      "Secondary",
      "Tertiary",
      "Quaternary"
    ],
    "c": 1,
    "tSd": "______ سرگرميون خام مال استعمال ڪن ٿيون ۽ انهن کي قيمتي شين ۾ تبديل ڪن ٿيون.",
    "oSd": [
      "پرائمري",
      "ثانوي",
      "ٽيريٽري",
      "ڪواٽرنري"
    ]
  },
  {
    "t": "______ Activities Refer To Segments Of The Economy That Provide Services.",
    "o": [
      "Primary",
      "Secondary",
      "Tertiary",
      "Quaternary"
    ],
    "c": 2,
    "tSd": "______ سرگرميون معيشت جي حصن جو حوالو ڏين ٿيون جيڪي خدمتون مهيا ڪن ٿيون.",
    "oSd": [
      "پرائمري",
      "ثانوي",
      "ٽيريٽري",
      "ڪواٽرنري"
    ]
  },
  {
    "t": "The Oil Is Bleached And Cleaned Using ______ In The Production Of Edible Cooking Oil.",
    "o": [
      "Water",
      "Soap",
      "Chemicals",
      "Heat"
    ],
    "c": 1,
    "tSd": "تيل کي کاڄرو پچائڻ واري تيل جي پيداوار ۾ ______ استعمال ڪندي بليچ ۽ صاف ڪيو ويندو آهي.",
    "oSd": [
      "پاڻي",
      "صابڻ",
      "ڪيميائي",
      "گرمي"
    ]
  },
  {
    "t": "Banks Provide At Least Three Main Services: Saving, Lending And ______.",
    "o": [
      "Investing",
      "Transfers Of Money",
      "Insurance",
      "Financial Advice"
    ],
    "c": 1,
    "tSd": "بئنڪ گهٽ ۾ گهٽ ٽي مکيه خدمتون مهيا ڪن ٿا: بچت ، قرض ڏيڻ ۽ ______.",
    "oSd": [
      "سيڙپ ڪرڻ",
      "پئسن جي منتقلي",
      "انشورنس",
      "مالي صلاح"
    ]
  },
  {
    "t": "A Place That Is Too Crowded Is Called ______.",
    "o": [
      "Densely Populated",
      "Sparsely Populated",
      "Over-Populated",
      "Under-Populated"
    ],
    "c": 2,
    "tSd": "هڪ جڳهه جيڪا تمام گهڻي رش آهي ان کي ______ سڏيو ويندو آهي.",
    "oSd": [
      "گهاٽي آبادي",
      "گهٽ آبادي",
      "وڌيڪ آبادي",
      "گهٽ آبادي"
    ]
  },
  {
    "t": "If An Area Has Fewer People Living Than The Area Available, We Call This ______.",
    "o": [
      "Densely Populated",
      "Sparsely Populated",
      "Over-Populated",
      "Moderately Populated"
    ],
    "c": 1,
    "tSd": "جيڪڏهن ڪنهن علائقي ۾ موجود علائقي کان گهٽ ماڻهو رهندا آهن ، اسان هن کي ______ سڏيون ٿا.",
    "oSd": [
      "گهاٽي آبادي",
      "گهٽ آبادي",
      "وڌيڪ آبادي",
      "اعتدال پسند آبادي"
    ]
  },
  {
    "t": "Population Density Is Expressed As ______.",
    "o": [
      "Persons Per Km²",
      "Persons Per Mile²",
      "Persons Per Hectare",
      "Persons Per Acre"
    ],
    "c": 0,
    "tSd": "آبادي جي کثافت ______ طور تي ظاهر ڪئي وئي آهي.",
    "oSd": [
      "ماڻهو في ڪلوميٽر²",
      "ماڻهو في ميل²",
      "ماڻهو في هيڪٽر",
      "ماڻهو في ايڪڙ"
    ]
  },
  {
    "t": "The Way People Are Spread Over An Area Is Called ______.",
    "o": [
      "Population Density",
      "Population Distribution",
      "Population Growth",
      "Population Control"
    ],
    "c": 1,
    "tSd": "جنهن طريقي سان ماڻهو ڪنهن علائقي ۾ پکڙيل هوندا آهن، ان کي ______ چئبو آهي.",
    "oSd": [
      "آبادي جي کثافت",
      "آبادي جي ورڇ",
      "آبادي ۾ واڌ",
      "آبادي تي ضابطو"
    ]
  },
  {
    "t": "The Number Of People Living In An Area Is Called ______.",
    "o": [
      "Community",
      "Population",
      "Society",
      "Nation"
    ],
    "c": 1,
    "tSd": "ڪنهن علائقي ۾ رهندڙ ماڻهن جي تعداد کي ______ سڏيو ويندو آهي.",
    "oSd": [
      "ڪميونٽي",
      "آبادي",
      "سوسائٽي",
      "قوم"
    ]
  },
  {
    "t": "Positive Factors That Encourage People To Live In Certain Areas Include Access To ______, ______ And ______.",
    "o": [
      "Water, Food, Employment",
      "Mountains, Forests, Deserts",
      "Cold, Snow, Ice",
      "Heat, Sand, Rocks"
    ],
    "c": 0,
    "tSd": "مثبت عنصر جيڪي ماڻهن کي ڪجهه علائقن ۾ رهڻ جي حوصلا افزائي ڪن ٿا انهن ۾ ______ ، ______ ۽ ______ تائين رسائي شامل آهن.",
    "oSd": [
      "پاڻي ، کاڌو ، روزگار",
      "جبل، ٻيلا، صحرا",
      "ٿڌو ، برف ، برف",
      "گرمي ، ريت ، پٿر"
    ]
  },
  {
    "t": "In 2015, Pakistan's Population Was Approximately ______ Million.",
    "o": [
      "150",
      "175",
      "200",
      "225"
    ],
    "c": 2,
    "tSd": "2015ع ۾ پاڪستان جي آبادي لڳ ڀڳ ______ ملين هئي.",
    "oSd": [
      "150",
      "175",
      "200",
      "225"
    ]
  },
  {
    "t": "The Birth Rate Is The Number Of Live Births For Every ______ People In A Year.",
    "o": [
      "100",
      "500",
      "1000",
      "5000"
    ],
    "c": 2,
    "tSd": "پيدائش جي شرح هڪ سال ۾ هر ______ ماڻهن جي زنده پيدائش جو تعداد آهي.",
    "oSd": [
      "100",
      "500",
      "1000",
      "5000"
    ]
  },
  {
    "t": "The Death Rate Is The Number Of Deaths For Every ______ People In A Year.",
    "o": [
      "100",
      "500",
      "1000",
      "5000"
    ],
    "c": 2,
    "tSd": "موت جي شرح هڪ سال ۾ هر ______ ماڻهن جي موت جو تعداد آهي.",
    "oSd": [
      "100",
      "500",
      "1000",
      "5000"
    ]
  },
  {
    "t": "People Who Study Population Are Called ______.",
    "o": [
      "Geographers",
      "Demographers",
      "Sociologists",
      "Anthropologists"
    ],
    "c": 1,
    "tSd": "جيڪي ماڻهو آبادي جو مطالعو ڪن ٿا انهن کي ______ سڏيو ويندو آهي.",
    "oSd": [
      "جاگرافيدان",
      "ڊيموگرافر",
      "سماجيات جا ماهر",
      "اينٿروپولوجسٽ"
    ]
  },
  {
    "t": "By 2050, The Total Population Of The World May Grow To Nearly ______ Billion.",
    "o": [
      "5",
      "7",
      "10",
      "12"
    ],
    "c": 2,
    "tSd": "2050 تائين ، دنيا جي ڪل آبادي تقريبن ______ بلين تائين وڌي سگهي ٿي.",
    "oSd": [
      "5",
      "7",
      "10",
      "12"
    ]
  },
  {
    "t": "The Fastest Growth In Population Is In The World's ______ Countries.",
    "o": [
      "Rich",
      "Poor",
      "Developed",
      "Industrialized"
    ],
    "c": 1,
    "tSd": "آبادي ۾ تيز ترين واڌ دنيا جي ______ ملڪن ۾ آهي.",
    "oSd": [
      "امير",
      "غريب",
      "ترقي يافته",
      "صنعتي"
    ]
  },
  {
    "t": "The Main Cause For The Rapid Growth Of The World Population Is The Drop In ______.",
    "o": [
      "Birth Rates",
      "Death Rates",
      "Migration Rates",
      "Fertility Rates"
    ],
    "c": 1,
    "tSd": "دنيا جي آبادي جي تيزي سان واڌ جو بنيادي سبب ______ ۾ گهٽتائي آهي.",
    "oSd": [
      "پيدائش جي شرح",
      "موت جي شرح",
      "لڏپلاڻ جي شرح",
      "زرخيزي جي شرح"
    ]
  },
  {
    "t": "Over-Population Is The Number Of People In An Area That Exceeds The ______.",
    "o": [
      "Capacity Of The Environment",
      "Available Food",
      "Housing Supply",
      "Water Supply"
    ],
    "c": 0,
    "tSd": "وڌيڪ آبادي هڪ علائقي ۾ ماڻهن جو تعداد آهي جيڪو ______ کان وڌيڪ آهي.",
    "oSd": [
      "ماحول جي گنجائش",
      "دستياب کاڌو",
      "هائوسنگ جي فراهمي",
      "پاڻي جي فراهمي"
    ]
  },
  {
    "t": "One Of The Consequences Of Over-Population Easiest To See In Our Daily Life Is ______.",
    "o": [
      "Crowding",
      "Pollution",
      "Unemployment",
      "Poverty"
    ],
    "c": 0,
    "tSd": "اسان جي روزاني زندگي ۾ ڏسڻ لاءِ وڌيڪ آبادي جي نتيجن مان هڪ ______ آهي.",
    "oSd": [
      "هجوم",
      "آلودگي",
      "بيروزگاري",
      "غربت"
    ]
  },
  {
    "t": "China's Famous Policy To Control Growing Population Is The ______ Policy.",
    "o": [
      "One-Child",
      "Two-Child",
      "Three-Child",
      "No-Child"
    ],
    "c": 0,
    "tSd": "وڌندڙ آبادي کي ڪنٽرول ڪرڻ لاءِ چين جي مشهور پاليسي ______ پاليسي آهي.",
    "oSd": [
      "هڪ ٻار",
      "ٻه ٻار",
      "ٽي ٻار",
      "نه ٻار"
    ]
  },
  {
    "t": "Educating ______ Is One Way In Which Governments Can Work To Reduce Population Growth.",
    "o": [
      "Boys",
      "Girls",
      "Adults",
      "Elders"
    ],
    "c": 1,
    "tSd": "______ کي تعليم ڏيڻ هڪ طريقو آهي جنهن ۾ حڪومتون آبادي جي واڌ کي گهٽائڻ لاءِ ڪم ڪري سگهن ٿيون.",
    "oSd": [
      "ڇوڪرا",
      "ڇوڪريون",
      "بالغ",
      "بزرگ"
    ]
  },
  {
    "t": "Our Wants Are ______ But Our Resources Are ______.",
    "o": [
      "Limited, Unlimited",
      "Unlimited, Limited",
      "Limited, Limited",
      "Unlimited, Unlimited"
    ],
    "c": 1,
    "tSd": "اسان جون خواهشون ______ آهن پر اسان جا وسيلا ______ آهن.",
    "oSd": [
      "لميٽيڊ ، لامحدود",
      "لامحدود ، محدود",
      "لميٽيڊ ، لميٽيڊ",
      "لامحدود ، لامحدود"
    ]
  },
  {
    "t": "People Cannot Have All The Goods And Services They Want So They Must Make ______.",
    "o": [
      "Choices",
      "Decisions",
      "Plans",
      "Investments"
    ],
    "c": 0,
    "tSd": "ماڻهن وٽ اهي سڀ سامان ۽ خدمتون نه ٿي سگهن جيڪي اهي چاهين ٿا ، تنهن ڪري انهن کي لازمي طور تي ٺاهڻ ______.",
    "oSd": [
      "چونڊون",
      "فيصلا",
      "منصوبا",
      "سيڙپڪاري"
    ]
  },
  {
    "t": "The Choices People Make Are Based On ______, ______ And ______.",
    "o": [
      "Income, Cost, Values",
      "Wants, Needs, Desires",
      "Time, Money, Skills",
      "Family, Friends, Society"
    ],
    "c": 0,
    "tSd": "چونڊون جيڪي ماڻهو ٺاهيندا آهن اهي ______ ، ______ ۽ ______ تي ٻڌل آهن.",
    "oSd": [
      "آمدني، قيمت، قدر",
      "خواهشون، ضرورتون، خواهشون",
      "وقت ، پئسو ، صلاحيتون",
      "خاندان، دوست، سماج"
    ]
  },
  {
    "t": "The Requirements Which Are Necessary For Survival Are Called ______.",
    "o": [
      "Wants",
      "Needs",
      "Desires",
      "Luxuries"
    ],
    "c": 1,
    "tSd": "بقا لاءِ جيڪي گهرجون ضروري هونديون آهن انهن کي ______ سڏيو ويندو آهي.",
    "oSd": [
      "چاهي ٿو",
      "ضرورتون",
      "خواهشون",
      "عيش عشرت"
    ]
  },
  {
    "t": "The Desires That Are Not Essential For Survival Are Called ______.",
    "o": [
      "Needs",
      "Wants",
      "Necessities",
      "Requirements"
    ],
    "c": 1,
    "tSd": "جن خواهشن کي جياپي لاءِ ضروري نه آهي، انهن کي ______ چئبو آهي.",
    "oSd": [
      "ضرورتون",
      "چاهي ٿو",
      "ضرورتون",
      "گهرجون"
    ]
  },
  {
    "t": "The Condition Of Not Being Able To Have All The Goods And Services That We Want Is Called ______.",
    "o": [
      "Choice",
      "Scarcity",
      "Opportunity Cost",
      "Trade-Off"
    ],
    "c": 1,
    "tSd": "اسان جيڪي سڀ سامان ۽ خدمتون چاهيون ٿا حاصل ڪرڻ جي قابل نه هجڻ جي حالت کي ______ سڏيو ويندو آهي.",
    "oSd": [
      "چونڊ",
      "کوٽ",
      "موقعي جي قيمت",
      "واپار بند"
    ]
  },
  {
    "t": "Income Is The Money Received On A Regular Basis For ______.",
    "o": [
      "Work",
      "Investment",
      "Saving",
      "Spending"
    ],
    "c": 0,
    "tSd": "آمدني اهو پئسو آهي جيڪو باقاعده بنيادن تي وصول ڪيو ويندو آهي ______.",
    "oSd": [
      "ڪم",
      "سيڙپڪاري",
      "بچت ڪندي",
      "خرچ ڪرڻ"
    ]
  },
  {
    "t": "The Things Or Objects Which We Can Feel And Touch Are Called ______.",
    "o": [
      "Services",
      "Goods",
      "Desires",
      "Needs"
    ],
    "c": 1,
    "tSd": "اهي شيون يا شيون جن کي اسين محسوس ڪري سگهون ٿا ۽ ڇهي سگهون ٿا انهن کي ______ سڏيو وڃي ٿو.",
    "oSd": [
      "خدمتون",
      "سامان",
      "خواهشون",
      "ضرورتون"
    ]
  },
  {
    "t": "Activities People Do In Their Free Time For Relaxation Or Enjoyment Are Called ______.",
    "o": [
      "Work",
      "Leisure Activities",
      "Chores",
      "Duties"
    ],
    "c": 1,
    "tSd": "سرگرميون جيڪي ماڻهو پنهنجي فارغ وقت ۾ آرام يا لطف اندوز ٿيڻ لاءِ ڪندا آهن انهن کي ______ سڏيو ويندو آهي.",
    "oSd": [
      "ڪم",
      "تفريحي سرگرميون",
      "ڪم ڪار",
      "فرائض"
    ]
  },
  {
    "t": "We Must Make Choices Because We Face ______.",
    "o": [
      "Scarcity",
      "Abundance",
      "Wealth",
      "Opportunity"
    ],
    "c": 0,
    "tSd": "اسان کي چونڊون ڪرڻ گهرجن ڇو ته اسان کي منهن ______.",
    "oSd": [
      "کوٽ",
      "ڪثرت",
      "دولت",
      "موقعو"
    ]
  },
  {
    "t": "The Process Of Choosing And Best Allocating Limited Time And Money Is Called Making A ______.",
    "o": [
      "Decision",
      "Trade-Off",
      "Choice",
      "Plan"
    ],
    "c": 1,
    "tSd": "محدود وقت ۽ پئسو چونڊڻ ۽ بهترين مختص ڪرڻ جي عمل کي هڪ ______ ٺاهڻ سڏيو ويندو آهي.",
    "oSd": [
      "فيصلو",
      "واپار بند",
      "چونڊ",
      "منصوبو"
    ]
  },
  {
    "t": "A Graph That Shows The Trade-Offs That Necessarily Accompany Decision-Making In The Face Of Scarcity Is Called The ______.",
    "o": [
      "PPF",
      "PFF",
      "FPP",
      "PFP"
    ],
    "c": 0,
    "tSd": "هڪ گراف جيڪو واپار کي ظاهر ڪري ٿو جيڪي لازمي طور تي گهٽتائي جي منهن ۾ فيصلا ڪرڻ سان گڏ هوندا آهن ، ان کي ______ سڏيو ويندو آهي.",
    "oSd": [
      "پي پي ايف",
      "پي ايف ايف",
      "ايف پي پي",
      "پي ايف پي"
    ]
  },
  {
    "t": "Benefit Is What You ______ From Something.",
    "o": [
      "Give Up",
      "Gain",
      "Lose",
      "Sacrifice"
    ],
    "c": 1,
    "tSd": "فائدو اهو آهي جيڪو توهان ڪنهن شيءَ مان ______ آهي.",
    "oSd": [
      "ڇڏي ڏيو",
      "حاصلات",
      "وڃايو",
      "قرباني"
    ]
  },
  {
    "t": "Cost Is What You Must ______ To Get Something.",
    "o": [
      "Gain",
      "Give Up",
      "Pay",
      "Sacrifice"
    ],
    "c": 1,
    "tSd": "قيمت اها آهي جيڪا توهان کي ڪجهه حاصل ڪرڻ لاءِ ______ هجڻ گهرجي.",
    "oSd": [
      "حاصلات",
      "ڇڏي ڏيو",
      "ادا ڪريو",
      "قرباني"
    ]
  },
  {
    "t": "The Act Of Balancing Two Things That Are Opposed To Each Other Is Called A ______.",
    "o": [
      "Choice",
      "Trade-Off",
      "Decision",
      "Option"
    ],
    "c": 1,
    "tSd": "ٻن شين جي توازن جو عمل جيڪو هڪ ٻئي جي مخالف آهي ان کي ______ چئبو آهي.",
    "oSd": [
      "چونڊ",
      "واپار بند",
      "فيصلو",
      "اختيار"
    ]
  },
  {
    "t": "PPF Stands For ______.",
    "o": [
      "Production Possibility Frontier",
      "Product Performance Factor",
      "Production Process Flow",
      "Product Price Formula"
    ],
    "c": 0,
    "tSd": "پي پي ايف جو مطلب ______.",
    "oSd": [
      "پيداوار جو امڪان فرنٽيئر",
      "پيداوار جي ڪارڪردگي فيڪٽر",
      "پيداوار جي عمل جو وهڪرو",
      "پيداوار جي قيمت جو فارمولا"
    ]
  },
  {
    "t": "Y = C + S Means ______.",
    "o": [
      "Income = Consumption + Saving",
      "Yield = Cost + Sales",
      "Year = Capital + Supply",
      "Yield = Consumption + Supply"
    ],
    "c": 0,
    "tSd": "Y = C + S معنيٰ ______.",
    "oSd": [
      "آمدني = واپرائڻ + بچت",
      "پيداوار = قيمت + وڪرو",
      "سال = سرمايو + سپلائي",
      "پيداوار = واپرائڻ + فراهمي"
    ]
  },
  {
    "t": "______ Is The Value Of The Next Best Alternative That Could Have Been Chosen.",
    "o": [
      "Opportunity Cost",
      "Trade-Off",
      "Scarcity",
      "Choice"
    ],
    "c": 0,
    "tSd": "______ ايندڙ بهترين متبادل جي قيمت آهي جيڪا چونڊجي سگهي ٿي.",
    "oSd": [
      "موقعي جي قيمت",
      "واپار بند",
      "کوٽ",
      "چونڊ"
    ]
  },
  {
    "t": "If There Is No Opportunity Cost In Consuming A Good, We Call It A ______ Good.",
    "o": [
      "Public",
      "Private",
      "Free",
      "Merit"
    ],
    "c": 2,
    "tSd": "جيڪڏهن سٺو کائڻ ۾ ڪو موقعو خرچ نه آهي ، اسان ان کي ______ سٺو سڏيون ٿا.",
    "oSd": [
      "عوامي",
      "پرائيويٽ",
      "مفت",
      "ميرٽ"
    ]
  },
  {
    "t": "People Who Use Goods And Services To Satisfy Their Personal Needs And Wants Are Known As ______.",
    "o": [
      "Producers",
      "Consumers",
      "Entrepreneurs",
      "Workers"
    ],
    "c": 1,
    "tSd": "ماڻهو جيڪي پنهنجي ذاتي ضرورتن ۽ خواهشن کي پورو ڪرڻ لاءِ سامان ۽ خدمتون استعمال ڪندا آهن انهن کي ______ طور سڃاتو وڃي ٿو.",
    "oSd": [
      "پروڊيوسر",
      "صارفين",
      "ٺيڪيدار",
      "مزدور"
    ]
  },
  {
    "t": "People And Firms That Use Resources To Make Goods And Services Are Known As ______.",
    "o": [
      "Consumers",
      "Producers",
      "Entrepreneurs",
      "Workers"
    ],
    "c": 1,
    "tSd": "ماڻهو ۽ فرم جيڪي سامان ۽ خدمتون ٺاهڻ لاءِ وسيلا استعمال ڪن ٿا انهن کي ______ طور سڃاتو وڃي ٿو.",
    "oSd": [
      "صارفين",
      "پروڊيوسر",
      "ٺيڪيدار",
      "مزدور"
    ]
  },
  {
    "t": "A Business Person Who Uses A Shop To Run A Books And Stationery Business Cannot Use The Same Shop To Produce Pizzas. This Is An Example Of ______.",
    "o": [
      "Scarcity",
      "Choice",
      "Opportunity Cost",
      "Trade-Off"
    ],
    "c": 2,
    "tSd": "هڪ ڪاروباري ماڻهو جيڪو ڪتابن ۽ اسٽيشنري جو ڪاروبار هلائڻ لاءِ دڪان استعمال ڪندو آهي ، اهو ساڳيو دڪان پيزا پيدا ڪرڻ لاءِ استعمال نٿو ڪري سگهي. هي ______ جو هڪ مثال آهي.",
    "oSd": [
      "کوٽ",
      "چونڊ",
      "موقعي جي قيمت",
      "واپار بند"
    ]
  },
  {
    "t": "The Opportunity Cost Of Moving From Point B To Point A In A PPF Graph Shows ______.",
    "o": [
      "What Is Gained",
      "What Is Sacrificed",
      "Total Production",
      "Maximum Output"
    ],
    "c": 1,
    "tSd": "پي پي ايف گراف ۾ پوائنٽ بي کان پوائنٽ اي ڏانهن منتقل ٿيڻ جي موقعي جي قيمت ______ ڏيکاري ٿي.",
    "oSd": [
      "جيڪو حاصل ٿيو",
      "ڇا قربان ڪيو ويندو آهي",
      "ڪل پيداوار",
      "وڌ کان وڌ پيداوار"
    ]
  },
  {
    "t": "The Two Characteristics That Help Us To Decide Whether A Good Or Service Is Public Or Private Are ______ And ______.",
    "o": [
      "Rivalry, Excludability",
      "Price, Quality",
      "Demand, Supply",
      "Quantity, Quality"
    ],
    "c": 0,
    "tSd": "ٻه خاصيتون جيڪي اسان کي اهو فيصلو ڪرڻ ۾ مدد ڏين ٿيون ته ڇا سٺو يا خدمت عوامي يا نجي آهي ______ ۽ ______.",
    "oSd": [
      "رقابت ، خارج ٿيڻ",
      "قيمت ، معيار",
      "طلب ، فراهمي",
      "مقدار ، معيار"
    ]
  },
  {
    "t": "The Goods And Services Which Are Provided Free By The Government To Benefit The Society Are Known As ______ Goods.",
    "o": [
      "Private",
      "Public",
      "Merit",
      "Collective"
    ],
    "c": 1,
    "tSd": "سامان ۽ خدمتون جيڪي حڪومت طرفان سماج کي فائدو ڏيڻ لاءِ مفت فراهم ڪيون وينديون آهن انهن کي ______ سامان طور سڃاتو وڃي ٿو.",
    "oSd": [
      "پرائيويٽ",
      "عوامي",
      "ميرٽ",
      "اجتماعي"
    ]
  },
  {
    "t": "Goods Which Are Used To Produce Other Goods And Services Are Known As ______ Goods.",
    "o": [
      "Consumer",
      "Capital",
      "Public",
      "Private"
    ],
    "c": 1,
    "tSd": "سامان جيڪي ٻين شين ۽ خدمتن جي پيداوار لاءِ استعمال ڪيا ويندا آهن انهن کي ______ سامان طور سڃاتو وڃي ٿو.",
    "oSd": [
      "صارف",
      "سرمايو",
      "عوامي",
      "پرائيويٽ"
    ]
  },
  {
    "t": "Things Or Objects We Buy To Satisfy Our Needs And Wants Are Called ______.",
    "o": [
      "Services",
      "Goods",
      "Commodities",
      "Products"
    ],
    "c": 1,
    "tSd": "شيون يا شيون جيڪي اسان پنهنجي ضرورتن ۽ خواهشن کي پورو ڪرڻ لاءِ خريد ڪندا آهيون انهن کي ______ سڏيو ويندو آهي.",
    "oSd": [
      "خدمتون",
      "سامان",
      "شيون",
      "مصنوعات"
    ]
  },
  {
    "t": "Something (Some Work Or Some Action) Done For Us That We Pay For Is Called A ______.",
    "o": [
      "Good",
      "Service",
      "Product",
      "Commodity"
    ],
    "c": 1,
    "tSd": "ڪجهه (ڪجهه ڪم يا ڪجهه عمل) اسان لاءِ ڪيو ويو آهي جنهن لاءِ اسان ادا ڪندا آهيون ان کي ______ سڏيو ويندو آهي.",
    "oSd": [
      "سٺو",
      "خدمت",
      "پيداوار",
      "اجناس"
    ]
  },
  {
    "t": "Land, Buildings And Machinery Are Examples Of ______ Goods.",
    "o": [
      "Consumer",
      "Capital",
      "Public",
      "Private"
    ],
    "c": 1,
    "tSd": "زمين، عمارتون ۽ مشينري ______ مال جا مثال آهن.",
    "oSd": [
      "صارف",
      "سرمايو",
      "عوامي",
      "پرائيويٽ"
    ]
  },
  {
    "t": "Pencils, Books, And Toys Are Examples Of ______ Goods.",
    "o": [
      "Consumer",
      "Capital",
      "Public",
      "Private"
    ],
    "c": 0,
    "tSd": "پينسل، ڪتاب ۽ رانديڪا ______ شين جا مثال آهن.",
    "oSd": [
      "صارف",
      "سرمايو",
      "عوامي",
      "پرائيويٽ"
    ]
  },
  {
    "t": "Goods And Services Which Are Consumed Collectively, By Everyone Are Called ______.",
    "o": [
      "Private Goods",
      "Collective Goods",
      "Merit Goods",
      "Capital Goods"
    ],
    "c": 1,
    "tSd": "سامان ۽ خدمتون جيڪي گڏيل طور تي استعمال ڪيون وينديون آهن ، هر ڪنهن طرفان ______ سڏيو ويندو آهي.",
    "oSd": [
      "خانگي سامان",
      "اجتماعي سامان",
      "ميرٽ گڊس",
      "سرمائيداري جو سامان"
    ]
  },
  {
    "t": "Roads, Parks, Schools, Libraries And Street Lighting Are Examples Of ______ Goods.",
    "o": [
      "Private",
      "Public",
      "Consumer",
      "Capital"
    ],
    "c": 1,
    "tSd": "روڊ ، پارڪ ، اسڪول ، لائبريريون ۽ اسٽريٽ لائٽنگ ______ سامان جا مثال آهن.",
    "oSd": [
      "پرائيويٽ",
      "عوامي",
      "صارف",
      "سرمايو"
    ]
  },
  {
    "t": "A Single Business Is Known As A ______.",
    "o": [
      "Firm",
      "Industry",
      "Company",
      "Enterprise"
    ],
    "c": 0,
    "tSd": "هڪ واحد ڪاروبار هڪ ______ طور سڃاتو وڃي ٿو.",
    "oSd": [
      "فرم",
      "انڊسٽري",
      "ڪمپني",
      "انٽرپرائز"
    ]
  },
  {
    "t": "A Group Of Businesses Or Producers That Produce A Similar Good Or Service Is Known As An ______.",
    "o": [
      "Firm",
      "Industry",
      "Company",
      "Enterprise"
    ],
    "c": 1,
    "tSd": "ڪاروبار يا پيدا ڪندڙن جو هڪ گروپ جيڪو هڪ جهڙي سٺي يا خدمت پيدا ڪري ٿو ، هڪ ______ طور سڃاتو وڃي ٿو.",
    "oSd": [
      "فرم",
      "انڊسٽري",
      "ڪمپني",
      "انٽرپرائز"
    ]
  },
  {
    "t": "The Businesses That Are Owned By The Government And Run Like Private Sector Businesses, With A View To Make A Profit Are Known As ______.",
    "o": [
      "Private Enterprises",
      "State-Owned Enterprises",
      "Public Enterprises",
      "Voluntary Organizations"
    ],
    "c": 1,
    "tSd": "ڪاروبار جيڪي حڪومت جي ملڪيت آهن ۽ نجي شعبي جي ڪاروبار وانگر هلن ٿا ، منافعو ڪمائڻ جي نظر سان ، انهن کي ______ طور سڃاتو وڃي ٿو.",
    "oSd": [
      "پرائيويٽ انٽرپرائزز",
      "رياستي ملڪيت وارا ادارا",
      "پبلڪ انٽرپرائزز",
      "رضاڪارانه تنظيمون"
    ]
  },
  {
    "t": "Voluntary Organizations Are Sometimes Known As ______.",
    "o": [
      "Profit Organizations",
      "Non-Profit Organizations",
      "Public Organizations",
      "Government Organizations"
    ],
    "c": 1,
    "tSd": "رضاڪارانه تنظيمون ڪڏهن ڪڏهن ______ طور سڃاتو وڃي ٿو.",
    "oSd": [
      "منافع بخش تنظيمون",
      "غير منافع بخش تنظيمون",
      "عوامي تنظيمون",
      "سرڪاري تنظيمون"
    ]
  },
  {
    "t": "The Main Goal Of Private Sector Producers Is To Make A ______.",
    "o": [
      "Profit",
      "Loss",
      "Service",
      "Contribution"
    ],
    "c": 0,
    "tSd": "نجي شعبي جي پيدا ڪندڙن جو بنيادي مقصد هڪ ڪم ٺاهڻ ______ آهي.",
    "oSd": [
      "نفعو",
      "نقصان",
      "خدمت",
      "حصو"
    ]
  },
  {
    "t": "The Edhi Foundation Is An Example Of A ______.",
    "o": [
      "Private Business",
      "State-Owned Enterprise",
      "Voluntary Organization",
      "Public Sector Business"
    ],
    "c": 2,
    "tSd": "ايڌي فائونڊيشن ______ جو مثال آهي.",
    "oSd": [
      "نجي ڪاروبار",
      "رياستي ملڪيت وارو ادارو",
      "رضاڪارانه تنظيم",
      "پبلڪ سيڪٽر بزنس"
    ]
  },
  {
    "t": "Bata Shoes Is An Example Of A ______.",
    "o": [
      "Firm",
      "Industry",
      "State-Owned Enterprise",
      "Voluntary Organization"
    ],
    "c": 0,
    "tSd": "باٽا جوتا هڪ ______ جو مثال آهي.",
    "oSd": [
      "فرم",
      "انڊسٽري",
      "رياستي ملڪيت وارو ادارو",
      "رضاڪارانه تنظيم"
    ]
  },
  {
    "t": "The Textile Industry Is An Example Of An ______.",
    "o": [
      "Firm",
      "Industry",
      "Company",
      "Enterprise"
    ],
    "c": 1,
    "tSd": "ٽيڪسٽائل انڊسٽري هڪ ______ جو هڪ مثال آهي.",
    "oSd": [
      "فرم",
      "انڊسٽري",
      "ڪمپني",
      "انٽرپرائز"
    ]
  },
  {
    "t": "A Tax Paid On The Money That A Person Or Business Receives As Income Is Known As ______ Tax.",
    "o": [
      "Sales",
      "Income",
      "Property",
      "Excise"
    ],
    "c": 1,
    "tSd": "هڪ ٽيڪس جيڪو پئسن تي ادا ڪيو ويندو آهي جيڪو هڪ شخص يا ڪاروبار آمدني جي طور تي وصول ڪري ٿو ، ٽيڪس ______ طور سڃاتو وڃي ٿو.",
    "oSd": [
      "وڪرو",
      "آمدني",
      "ملڪيت",
      "ايڪسائيز"
    ]
  },
  {
    "t": "A Tax That Is Added To The Price Of Goods And Services Is Known As ______ Tax.",
    "o": [
      "Income",
      "Sales",
      "Property",
      "Excise"
    ],
    "c": 1,
    "tSd": "هڪ ٽيڪس جيڪو سامان ۽ خدمتن جي قيمت ۾ شامل ڪيو ويندو آهي اهو ٽيڪس ______ طور سڃاتو وڃي ٿو.",
    "oSd": [
      "آمدني",
      "وڪرو",
      "ملڪيت",
      "ايڪسائيز"
    ]
  },
  {
    "t": "Productive Resources In Economics Are Known As Factors Of ______.",
    "o": [
      "Production",
      "Consumption",
      "Distribution",
      "Exchange"
    ],
    "c": 0,
    "tSd": "اقتصاديات ۾ پيداواري وسيلا ______ جي عنصر طور سڃاتو وڃي ٿو.",
    "oSd": [
      "پيداوار",
      "واپرائڻ",
      "ورڇ",
      "مٽا سٽا"
    ]
  },
  {
    "t": "A Person Who Comes Up With New Ideas About What And How To Produce, Makes Business Decisions And Bears The Risks Is Known As An ______.",
    "o": [
      "Employee",
      "Entrepreneur",
      "Manager",
      "Worker"
    ],
    "c": 1,
    "tSd": "هڪ ماڻهو جيڪو نئين خيالن سان گڏ اچي ٿو ته ڇا ۽ ڪيئن پيدا ڪجي ، ڪاروباري فيصلا ڪري ٿو ۽ خطرن کي برداشت ڪري ٿو ، هڪ ______ طور سڃاتو وڃي ٿو.",
    "oSd": [
      "ملازم",
      "انٽرپرينيور",
      "مئنيجر",
      "ڪارڪن"
    ]
  },
  {
    "t": "Land Earns ______.",
    "o": [
      "Wages",
      "Rent",
      "Interest",
      "Profit"
    ],
    "c": 1,
    "tSd": "زمين ڪمائي ______.",
    "oSd": [
      "اجرت",
      "مسواڙ",
      "دلچسپي",
      "نفعو"
    ]
  },
  {
    "t": "Labour Earns ______.",
    "o": [
      "Wages",
      "Rent",
      "Interest",
      "Profit"
    ],
    "c": 0,
    "tSd": "ليبر ڪمائي ______.",
    "oSd": [
      "اجرت",
      "مسواڙ",
      "دلچسپي",
      "نفعو"
    ]
  },
  {
    "t": "Capital Earns ______.",
    "o": [
      "Wages",
      "Rent",
      "Interest",
      "Profit"
    ],
    "c": 2,
    "tSd": "سرمايو ڪمائي ______.",
    "oSd": [
      "اجرت",
      "مسواڙ",
      "دلچسپي",
      "نفعو"
    ]
  },
  {
    "t": "Entrepreneur Earns ______.",
    "o": [
      "Wages",
      "Rent",
      "Interest",
      "Profit"
    ],
    "c": 3,
    "tSd": "انٽرپرينيور ڪمائي ______",
    "oSd": [
      "اجرت",
      "مسواڙ",
      "دلچسپي",
      "نفعو"
    ]
  },
  {
    "t": "The Four Factors Of Production Are ______, ______, ______ And ______.",
    "o": [
      "Land, Labour, Capital, Entrepreneur",
      "Land, Money, Resources, Technology",
      "People, Machines, Buildings, Money",
      "Nature, Work, Finance, Ideas"
    ],
    "c": 0,
    "tSd": "پيداوار جا چار عنصر ______ ، ______ ، ______ ۽ ______ آهن.",
    "oSd": [
      "زمين، مزدور، سرمايو، انٽرپرينيور",
      "زمين، پئسا، وسيلا، ٽيڪنالاجي",
      "ماڻهو ، مشينون ، عمارتون ، پئسو",
      "فطرت, ڪم, ماليات, خيالات"
    ]
  },
  {
    "t": "The Language Spoken In Bhutan Is ______.",
    "o": [
      "Hindi",
      "Nepalese",
      "Sharchhopka",
      "Urdu"
    ],
    "c": 2,
    "tSd": "ڀوٽان ۾ ڳالهائجندڙ ٻولي ______.",
    "oSd": [
      "ھندي",
      "نيپالي",
      "اسڪارچوپڪا",
      "اردو"
    ]
  },
  {
    "t": "The Main Festival Of Nepal Is ______.",
    "o": [
      "Eid",
      "Holi",
      "Dashain",
      "Diwali"
    ],
    "c": 2,
    "tSd": "نيپال جو مکيه تهوار ______ آهي.",
    "oSd": [
      "عيد",
      "هولي",
      "دشين",
      "ڏياري"
    ]
  },
  {
    "t": "The Most Practiced Religions Of South Asia Are ______ And ______.",
    "o": [
      "Islam, Hinduism",
      "Buddhism, Christianity",
      "Sikhism, Jainism",
      "Judaism, Zoroastrianism"
    ],
    "c": 0,
    "tSd": "ڏکڻ ايشيا جا سڀ کان وڌيڪ مذهب ______ ۽ ______ آهن.",
    "oSd": [
      "اسلام، هندو مذهب",
      "ٻڌمت ، عيسائيت",
      "سک مت، جين مت",
      "يهوديت، زرتشت"
    ]
  },
  {
    "t": "A Community Is A Social Unit Of Any Size That Shares Common ______.",
    "o": [
      "Values",
      "Wealth",
      "Power",
      "Resources"
    ],
    "c": 0,
    "tSd": "ڪميونٽي ڪنهن به سائيز جو هڪ سماجي يونٽ آهي جيڪو عام ______ حصيداري ڪري ٿو.",
    "oSd": [
      "قدرون",
      "دولت",
      "طاقت",
      "وسيلا"
    ]
  },
  {
    "t": "A Person's Sense Of Responsibilities, Ethics And Morals Is Influenced By ______.",
    "o": [
      "Family And Culture",
      "Weather And Climate",
      "Technology And Media",
      "Politics And Economy"
    ],
    "c": 0,
    "tSd": "انسان جي ذميدارين ، اخلاقيات ۽ اخلاق جو احساس ______ کان متاثر ٿئي ٿو.",
    "oSd": [
      "خاندان ۽ ثقافت",
      "موسم ۽ آبهوا",
      "ٽيڪنالاجي ۽ ميڊيا",
      "سياست ۽ معيشت"
    ]
  },
  {
    "t": "In South Asia, ______ Are The Heads Of The Family Who Take Major Decisions For The Family.",
    "o": [
      "Children",
      "Grandparents",
      "Mothers",
      "Uncles"
    ],
    "c": 1,
    "tSd": "ڏکڻ ايشيا ۾ ، ______ خاندان جا سربراهه آهن جيڪي خاندان لاءِ وڏا فيصلا ڪن ٿا.",
    "oSd": [
      "ٻار",
      "ڏاڏي ۽ ڏاڏي",
      "مائرون",
      "چاچا"
    ]
  },
  {
    "t": "Girls Are Not Encouraged To Move Freely At Night In South Asia Is An Example Of A ______.",
    "o": [
      "Value",
      "Norm",
      "Belief",
      "Tradition"
    ],
    "c": 1,
    "tSd": "ڏکڻ ايشيا ۾ ڇوڪرين کي رات جو آزاديءَ سان هلڻ جي حوصلا افزائي نه ڪئي ويندي آهي______",
    "oSd": [
      "ويليو",
      "نارم",
      "عقيدو",
      "روايت"
    ]
  },
  {
    "t": "Respecting Elders And Being Polite To Them Is An Example Of A ______.",
    "o": [
      "Value",
      "Norm",
      "Belief",
      "Tradition"
    ],
    "c": 0,
    "tSd": "بزرگن جي عزت ڪرڻ ۽ انهن سان شائسته ٿيڻ هڪ ______ جو مثال آهي.",
    "oSd": [
      "ويليو",
      "نارم",
      "عقيدو",
      "روايت"
    ]
  },
  {
    "t": "It Is Disrespectful To Use The Left Hand To Give And Take In South Asian Countries. This Is An Example Of A ______.",
    "o": [
      "Value",
      "Norm",
      "Belief",
      "Custom"
    ],
    "c": 3,
    "tSd": "ڏکڻ ايشيائي ملڪن ۾ ڏيڻ ۽ وٺڻ لاءِ کاٻي هٿ استعمال ڪرڻ بي عزتي آهي. هي هڪ ______ جو مثال آهي.",
    "oSd": [
      "ويليو",
      "نارم",
      "عقيدو",
      "رواج"
    ]
  },
  {
    "t": "A Fairly Flat Piece Of Lowland Is Called A ______.",
    "o": [
      "Plain",
      "Plateau",
      "Mountain",
      "Valley"
    ],
    "c": 0,
    "tSd": "هيٺاهين جو هڪ ڪافي فليٽ ٽڪرو هڪ ______ سڏيو ويندو آهي.",
    "oSd": [
      "سادي",
      "پليٽو",
      "جبل",
      "وادي"
    ]
  },
  {
    "t": "The Lowland Between Two Highlands Is Called A ______.",
    "o": [
      "Plain",
      "Plateau",
      "Mountain",
      "Valley"
    ],
    "c": 3,
    "tSd": "ٻن جابلو علائقن جي وچ واري هيٺاهين کي هڪ ______ سڏيو ويندو آهي.",
    "oSd": [
      "سادي",
      "پليٽو",
      "جبل",
      "وادي"
    ]
  },
  {
    "t": "A Highland With A Broad Base, Steep Slopes And A Narrow Top Is Called A ______.",
    "o": [
      "Plain",
      "Plateau",
      "Mountain",
      "Hill"
    ],
    "c": 2,
    "tSd": "هڪ مٿاهين زمين جنهن ۾ وسيع بنياد ، تيز لاهيون ۽ هڪ سوڙهي چوٽي آهي ، هڪ ______ سڏيو ويندو آهي.",
    "oSd": [
      "سادي",
      "پليٽو",
      "جبل",
      "ٽڪري"
    ]
  },
  {
    "t": "A Highland That Is Flat On The Top Is Called A ______.",
    "o": [
      "Plain",
      "Plateau",
      "Mountain",
      "Valley"
    ],
    "c": 1,
    "tSd": "هڪ هاءِ لينڊ جيڪا مٿي تي فليٽ آهي ان کي ______ چئبو آهي.",
    "oSd": [
      "سادي",
      "پليٽو",
      "جبل",
      "وادي"
    ]
  },
  {
    "t": "Saudi Arabia Has A ______ Form Of Government.",
    "o": [
      "Democratic",
      "Monarchy",
      "Presidential",
      "Parliamentary"
    ],
    "c": 1,
    "tSd": "سعودي عرب ۾ حڪومت جو هڪ ______ روپ آهي.",
    "oSd": [
      "ڊيموڪريٽڪ",
      "بادشاهت",
      "صدارتي",
      "پارلياماني"
    ]
  },
  {
    "t": "Chandragupta Maurya founded the Mauryan Empire in ______ BCE.",
    "o": [
      "350",
      "322",
      "300",
      "280"
    ],
    "c": 1,
    "tSd": "چندر گپت موريا ______ قبل مسيح ۾ موريا سلطنت جو بنياد وڌو.",
    "oSd": [
      "350",
      "322",
      "300",
      "280"
    ]
  },
  {
    "t": "Chandragupta Maurya's grandson was ______.",
    "o": [
      "Bindusara",
      "Ashoka",
      "Kautilya",
      "Alexander"
    ],
    "c": 1,
    "tSd": "چندر گپت موريا جو پوٽو ______ هو.",
    "oSd": [
      "بندوسارا",
      "اشوڪ",
      "ڪوٽليا",
      "سڪندر"
    ]
  },
  {
    "t": "The Mauryan Empire lasted about ______ years.",
    "o": [
      "100",
      "130",
      "140",
      "150"
    ],
    "c": 2,
    "tSd": "موريا جي سلطنت اٽڪل ______ سالن تائين رهي.",
    "oSd": [
      "100",
      "130",
      "140",
      "150"
    ]
  },
  {
    "t": "Ashoka became king at around ______ BC.",
    "o": [
      "300",
      "272",
      "269",
      "232"
    ],
    "c": 2,
    "tSd": "اشوڪ ______ قبل مسيح ڌاري بادشاهه ٿيو.",
    "oSd": [
      "300",
      "272",
      "269",
      "232"
    ]
  },
  {
    "t": "Ashoka's Empire included much of ______.",
    "o": [
      "China",
      "India",
      "Persia",
      "Egypt"
    ],
    "c": 1,
    "tSd": "اشوڪ جي سلطنت ۾ ______ جو گهڻو حصو شامل هو.",
    "oSd": [
      "چين",
      "ھندستان",
      "فارس",
      "مصر"
    ]
  },
  {
    "t": "The Persian Empire was founded in the year ______.",
    "o": [
      "550 BC",
      "539 BC",
      "522 BC",
      "500 BC"
    ],
    "c": 0,
    "tSd": "فارس جي سلطنت جو بنياد سال ______ ۾ وڌو ويو.",
    "oSd": [
      "550 ق.م",
      "539 ق.م",
      "522 ق.م",
      "500 ق.م"
    ]
  },
  {
    "t": "The famous road made by Darius is known as ______.",
    "o": [
      "Silk Road",
      "Royal Road",
      "Grand Trunk Road",
      "Persian Road"
    ],
    "c": 1,
    "tSd": "دارا جو ٺاهيل مشهور روڊ ______ جي نالي سان سڃاتو وڃي ٿو.",
    "oSd": [
      "سلڪ روڊ",
      "روئل روڊ",
      "گرافي ٽرنڪ روڊ",
      "فارسي روڊ"
    ]
  },
  {
    "t": "The religion that gave the answers of the questions which people have for their problems was ______.",
    "o": [
      "Buddhism",
      "Zoroastrianism",
      "Hinduism",
      "Christianity"
    ],
    "c": 1,
    "tSd": "مذهب جنهن ماڻهن جي مسئلن جو جواب ڏنو هو اهي ______ مذهب هو.",
    "oSd": [
      "ٻڌمت",
      "زرتشت",
      "هندو ڌرم",
      "عيسائيت"
    ]
  },
  {
    "t": "Ansan tribal kingdom lived under the rule of another Iranian ruler named ______.",
    "o": [
      "Darius",
      "Cyrus",
      "Xerxes",
      "Cambyses"
    ],
    "c": 1,
    "tSd": "انسان مڙسي جو قبيلو ڪنهن ٻئي ايراني حڪمران ______ جي ماتحت رهندو هو.",
    "oSd": [
      "دارا",
      "سائرس",
      "زيرڪس",
      "ڪيمبيسس"
    ]
  },
  {
    "t": "The Middle Ages dates from ______ to ______.",
    "o": [
      "400, 1400",
      "450, 1450",
      "500, 1500",
      "550, 1550"
    ],
    "c": 1,
    "tSd": "قرون وسطى تائين ______ کان ______ تائين جون تاريخون آهن.",
    "oSd": [
      "400, 1400",
      "450, 1450",
      "500, 1500",
      "550, 1550"
    ]
  },
  {
    "t": "Dark Age is referred to ______.",
    "o": [
      "early Middle Ages",
      "late Middle Ages",
      "Renaissance",
      "Industrial Revolution"
    ],
    "c": 0,
    "tSd": "تارريڪ دور سان مراد ______ آهي.",
    "oSd": [
      "شروعاتي قرون وسطى",
      "آخري قرون وسطى",
      "نشاة الثانيہ",
      "صنعتي انقلاب"
    ]
  },
  {
    "t": "Crusades mean ______.",
    "o": [
      "holy wars",
      "trade routes",
      "religious festivals",
      "political alliances"
    ],
    "c": 0,
    "tSd": "صليبي جنگين جو مطلب ______ آهي.",
    "oSd": [
      "مقدس جنگيون",
      "تجارتي رستا",
      "مذهبي تيوار",
      "سياسي اتحاد"
    ]
  },
  {
    "t": "Feudal system refers to ______.",
    "o": [
      "economic system",
      "social hierarchy",
      "political organization",
      "military structure"
    ],
    "c": 1,
    "tSd": "جاگيرداري نظام مراد ______ کي ڏئي ٿو.",
    "oSd": [
      "اقتصادي نظام",
      "سماجي درجي بندي",
      "سياسي تنظيم",
      "فوجي ڍانچو"
    ]
  },
  {
    "t": "Plague is a disease that brought ______ to Europe.",
    "o": [
      "prosperity",
      "death",
      "peace",
      "wealth"
    ],
    "c": 1,
    "tSd": "طاعون هڪ بيماري آهي جيڪا يورپ ۾ ______ آندي.",
    "oSd": [
      "خوشحالي",
      "موت",
      "امن",
      "دولت"
    ]
  },
  {
    "t": "______ is a basic and fundamental law of a state.",
    "o": [
      "Constitution",
      "Law",
      "Act",
      "Charter"
    ],
    "c": 0,
    "tSd": "______ هڪ رياست جو بنيادي قانون آهي.",
    "oSd": [
      "آئين",
      "قانون",
      "ايڪٽ",
      "چارٽر"
    ]
  },
  {
    "t": "The representative government is consisted of three branches i.e. Executive, ______ and ______.",
    "o": [
      "Legislative, Judicial",
      "Federal, Provincial",
      "Senate, Assembly",
      "Upper, Lower"
    ],
    "c": 0,
    "tSd": "نمائنده حڪومت ٽن شاخن تي مشتمل آهي، يعني انتظاميه، ______ ۽ ______.",
    "oSd": [
      "قانون سازي، عدالتي",
      "وفاقي، صوبائي",
      "سينيٽ، اسيمبلي",
      "مٿيون ، هيٺيون"
    ]
  },
  {
    "t": "Sovereignty means ______.",
    "o": [
      "supreme authority",
      "democracy",
      "independence",
      "freedom"
    ],
    "c": 0,
    "tSd": "خودمختياريءَ جو مطلب ______ آهي.",
    "oSd": [
      "اعليٰ اختيار",
      "جمهوريت",
      "آزادي",
      "آزادي"
    ]
  },
  {
    "t": "The constitution of Pakistan comprises of ______ articles.",
    "o": [
      "200",
      "250",
      "280",
      "300"
    ],
    "c": 2,
    "tSd": "پاڪستان جو آئين ______ آرٽيڪلن تي مشتمل آهي.",
    "oSd": [
      "200",
      "250",
      "280",
      "300"
    ]
  },
  {
    "t": "The civil rights are mainly associated with the life and ______ of a citizen.",
    "o": [
      "liberty",
      "property",
      "security",
      "health"
    ],
    "c": 0,
    "tSd": "سول حق بنيادي طور تي هڪ شهريءَ جي زندگي ۽ ______ سان لاڳاپيل هوندا آهن.",
    "oSd": [
      "آزادي",
      "ملڪيت",
      "سيڪيورٽي",
      "صحت"
    ]
  },
  {
    "t": "The Article 25-A of the Constitution provides for ______ to all children of age five (5) to sixteen (16).",
    "o": [
      "free education",
      "free health",
      "free food",
      "free housing"
    ],
    "c": 0,
    "tSd": "آئين جو آرٽيڪل 25-A پنج (5) کان سورهن (16) سالن جي سڀني ٻارن لاءِ ______ فراهم ڪري ٿو.",
    "oSd": [
      "مفت تعليم",
      "مفت صحت",
      "مفت کاڌو",
      "مفت هائوسنگ"
    ]
  },
  {
    "t": "The fundamental rights promote better life, ______ and ______.",
    "o": [
      "equality, justice",
      "freedom, security",
      "peace, harmony",
      "progress, development"
    ],
    "c": 0,
    "tSd": "بنيادي حق بهتر زندگي، ______ ۽ ______ کي فروغ ڏين ٿا.",
    "oSd": [
      "برابري، انصاف",
      "آزادي، سيڪيورٽي",
      "امن، هم آهنگي",
      "ترقي، ترقي"
    ]
  },
  {
    "t": "The person who works for an organization without being paid is called ______.",
    "o": [
      "worker",
      "volunteer",
      "employee",
      "servant"
    ],
    "c": 1,
    "tSd": "جيڪو شخص ڪنهن تنظيم لاءِ بغير معاوضي جي ڪم ڪري، ان کي ______ چئبو آهي.",
    "oSd": [
      "ملازم",
      "رضاڪار",
      "ملازم",
      "خادم"
    ]
  },
  {
    "t": "Basic role of civil society is to limit and control the power of the ______.",
    "o": [
      "state",
      "government",
      "parliament",
      "judiciary"
    ],
    "c": 0,
    "tSd": "سول سوسائٽي جو بنيادي ڪردار ______ جي طاقت کي محدود ڪرڻ ۽ ان تي ضابطو آڻڻ آهي.",
    "oSd": [
      "رياست",
      "حڪومت",
      "پارليامينٽ",
      "عدليه"
    ]
  },
  {
    "t": "The volunteer sector plays a key role in ______.",
    "o": [
      "society",
      "economy",
      "politics",
      "culture"
    ],
    "c": 0,
    "tSd": "رضاڪارانه سيڪٽر ______ ۾ هڪ اهم ڪردار ادا ڪري ٿو.",
    "oSd": [
      "سوسائٽي",
      "معيشت",
      "سياست",
      "ثقافت"
    ]
  },
  {
    "t": "Civil society can provide a training ground for future political ______.",
    "o": [
      "leaders",
      "workers",
      "thinkers",
      "activists"
    ],
    "c": 0,
    "tSd": "سول سوسائٽي مستقبل جي سياسي ______ لاءِ تربيتي زمين فراهم ڪري سگهي ٿي.",
    "oSd": [
      "سربراهه",
      "ملازم",
      "فڪر رکندڙ",
      "فعال ڪندڙ"
    ]
  },
  {
    "t": "The land size of Asia is ______.",
    "o": [
      "17,212,000 sq miles",
      "17,212,000 sq km",
      "16,212,000 sq miles",
      "18,212,000 sq miles"
    ],
    "c": 0,
    "tSd": "ايشيا جي زمين جي ماپ ______ آهي.",
    "oSd": [
      "17,212,000 چورس ميل",
      "17,212,000 چورس ڪلوميٽر",
      "16,212,000 چورس ميل",
      "18,212,000 چورس ميل"
    ]
  },
  {
    "t": "The coastline of Asia is ______ long.",
    "o": [
      "50,000 km",
      "55,000 km",
      "62,800 km",
      "70,000 km"
    ],
    "c": 2,
    "tSd": "ايشيا جي ساحلي پٽي ______ تائين ڊگهي آهي.",
    "oSd": [
      "50,000 ڪلوميٽر",
      "55,000 ڪلوميٽر",
      "62,800 ڪلوميٽر",
      "70,000 ڪلوميٽر"
    ]
  },
  {
    "t": "Ural is the name of ______.",
    "o": [
      "a mountain",
      "a river",
      "a desert",
      "a plateau"
    ],
    "c": 0,
    "tSd": "يورال ______ جو نالو آهي.",
    "oSd": [
      "هڪ جبل",
      "هڪ ندي",
      "هڪ ريگستان",
      "هڪ پليٽو"
    ]
  },
  {
    "t": "Arabian peninsula is situated between ______ and ______.",
    "o": [
      "Red Sea, Persian Gulf",
      "Indian Ocean, Arabian Sea",
      "Mediterranean, Black Sea",
      "Caspian Sea, Red Sea"
    ],
    "c": 0,
    "tSd": "عرب شبه ٻيٽ ______ ۽ ______ جي وچ ۾ واقع آهي.",
    "oSd": [
      "ڳاڙهو سمنڊ، فارسي خليج",
      "هندي سمنڊ، عربي سمنڊ",
      "ميڊيٽرينين، بليڪ سمنڊ",
      "جبل طارق، ڳاڙهو سمنڊ"
    ]
  },
  {
    "t": "Karakoram Range is located in ______ and ______.",
    "o": [
      "Pakistan, China",
      "India, Nepal",
      "Afghanistan, Tajikistan",
      "China, India"
    ],
    "c": 0,
    "tSd": "قراقرم جبل جي حد ______ ۽ ______ ۾ واقع آهي.",
    "oSd": [
      "پاڪستان، چين",
      "هندستان، نيپال",
      "افغانستان، تاجڪستان",
      "چين، هندستان"
    ]
  },
  {
    "t": "The two most populous countries of the world i.e China and ______ are part of Asia.",
    "o": [
      "India",
      "Pakistan",
      "Bangladesh",
      "Indonesia"
    ],
    "c": 0,
    "tSd": "دنيا جا ٻه سڀ کان وڌيڪ آبادي وارا ملڪ يعني چين ۽ ______ ايشيا جو حصو آهن.",
    "oSd": [
      "هندستان",
      "پاڪستان",
      "بنگلاديش",
      "انڊونيشيا"
    ]
  },
  {
    "t": "The major crop grown in Bangladesh is ______.",
    "o": [
      "wheat",
      "rice",
      "jute",
      "tea"
    ],
    "c": 2,
    "tSd": "بنگلاديش ۾ پوکجندڙ مکيه فصل ______ آهي.",
    "oSd": [
      "ڪڻڪ",
      "چاهين",
      "پٽسن",
      "چاهي"
    ]
  },
  {
    "t": "Borneo is located in ______.",
    "o": [
      "Indonesia",
      "Malaysia",
      "Philippines",
      "Thailand"
    ],
    "c": 1,
    "tSd": "بورنيو ______ ۾ واقع آهي.",
    "oSd": [
      "انڊونيشيا",
      "ملائيشيا",
      "فلپائن",
      "ٿائي لينڊ"
    ]
  },
  {
    "t": "The capital city of Malaysia is ______.",
    "o": [
      "Jakarta",
      "Kuala Lumpur",
      "Singapore",
      "Bangkok"
    ],
    "c": 1,
    "tSd": "ملائيشيا جي گاديءَ جو هنڌ ______ آهي.",
    "oSd": [
      "جڪارتا",
      "ڪوالالمپور",
      "سنگاپور",
      "بئنڪاڪ"
    ]
  },
  {
    "t": "______ is a process of removing salt from substance.",
    "o": [
      "Desalination",
      "Evaporation",
      "Condensation",
      "Filtration"
    ],
    "c": 0,
    "tSd": "______ هڪ مواد مان لوڻ ختم ڪرڻ جو هڪ عمل آهي.",
    "oSd": [
      "ڊي سالينيشن",
      "بخارات",
      "تڪثيف",
      "فلٽريشن"
    ]
  },
  {
    "t": "The process where water turns into water vapors is called ______.",
    "o": [
      "condensation",
      "evaporation",
      "precipitation",
      "transpiration"
    ],
    "c": 1,
    "tSd": "اهو عمل جنهن ۾ پاڻي پاڻيءَ جي باهه ۾ تبديل ٿي وڃي ٿو، ان کي ______ چئبو آهي.",
    "oSd": [
      "تڪثيف",
      "بخارات",
      "ورن",
      "تبخير"
    ]
  },
  {
    "t": "The process where water runs over the surface of the earth is known as ______.",
    "o": [
      "runoff",
      "infiltration",
      "evaporation",
      "condensation"
    ],
    "c": 0,
    "tSd": "اهو عمل جتي پاڻي ڌرتيءَ جي سطح تي وهندو آهي، ان کي ______ چئبو آهي.",
    "oSd": [
      "وهڪرو",
      "انفلٽريشن",
      "بخارات",
      "تڪثيف"
    ]
  },
  {
    "t": "There are three major water sources in Pakistan i.e. rain water, ______ and rivers.",
    "o": [
      "ground water",
      "lake water",
      "sea water",
      "canal water"
    ],
    "c": 0,
    "tSd": "پاڪستان ۾ پاڻيءَ جا ٽي وڏا ذريعا آهن، يعني مينهن جو پاڻي، ______ ۽ نديون.",
    "oSd": [
      "زميني پاڻي",
      "ڍنڍ جو پاڻي",
      "سمنڊ جو پاڻي",
      "کال جو پاڻي"
    ]
  },
  {
    "t": "______ is the man-made supply of water to the land to encourage vegetation.",
    "o": [
      "Irrigation",
      "Drainage",
      "Cultivation",
      "Fertilization"
    ],
    "c": 0,
    "tSd": "______ نباتات کي حوصلا افزائي ڪرڻ لاءِ زمين ڏانهن پاڻي جي انساني ٺاهيل پيداوار آهي.",
    "oSd": [
      "آبياري",
      "ڊرينيج",
      "پوکي",
      "زرخيزي"
    ]
  },
  {
    "t": "Weathering is a process in which ______.",
    "o": [
      "rocks break down",
      "soil erodes",
      "water evaporates",
      "plants grow"
    ],
    "c": 0,
    "tSd": "موسميات هڪ عمل آهي جنهن ۾ ______.",
    "oSd": [
      "پٿر تباھ ٿي ويندا آھن",
      "مٽي ختم ٿي وڃي ٿي",
      "پاڻي باهه ۾ تبديل ٿئي ٿو",
      "ٻوٽا وڌندا آهن"
    ]
  },
  {
    "t": "______ is the shift from rural to urban life.",
    "o": [
      "Globalization",
      "Urbanization",
      "Education",
      "Desertification"
    ],
    "c": 1,
    "tSd": "______ ڳوٺاڻن کان شهري زندگي ڏانهن منتقل ٿيڻ آهي.",
    "oSd": [
      "گلوبلائيزيشن",
      "شهريت",
      "تعليم",
      "ريگستاني"
    ]
  },
  {
    "t": "A single urban centre that leads all others in attracting people, resources and money is a ______.",
    "o": [
      "Megalopolis",
      "Growth pole",
      "Primate City",
      "Shanty town"
    ],
    "c": 2,
    "tSd": "هڪ هائي انٽيگريٽيڊ شهر جيڪو پنهنجي آس پاس جي ٻين شهرن کان اڳتي هجي، ان کي ______ چئبو آهي.",
    "oSd": [
      "ميگالوپولس",
      "واڌ جو قطب",
      "پرائميٽ شهر",
      "شانٽي ٽائون"
    ]
  },
  {
    "t": "The population in Southeast Asia is concentrated in ______.",
    "o": [
      "River valleys and coastal plains",
      "Mountains",
      "Plateaus",
      "Deserts"
    ],
    "c": 0,
    "tSd": "ڏکڻ اوڀر ايشيا ۾ آبادي ______ ۾ مرڪوز آهي.",
    "oSd": [
      "ندين جي وادين ۽ ساحلي ميدانن",
      "جبلن",
      "پليٽو",
      "ريگستانن"
    ]
  },
  {
    "t": "When the price goes up, the quantity demanded goes ______.",
    "o": [
      "up",
      "down",
      "remains same",
      "uncertain"
    ],
    "c": 1,
    "tSd": "جڏهن قيمت وڌي ٿي، ته گھربل مقدار ______ ٿئي ٿي.",
    "oSd": [
      "وڌي وڃي ٿي",
      "گهٽجي وڃي ٿي",
      "ساڳي رهي ٿي",
      "غير يقيني"
    ]
  },
  {
    "t": "Two basic types of demand are ______ and ______.",
    "o": [
      "individual, market",
      "primary, secondary",
      "elastic, inelastic",
      "high, low"
    ],
    "c": 0,
    "tSd": "طلب جون ٻه بنيادي قسمن جا آهن ______ ۽ ______.",
    "oSd": [
      "انفرادي، مارڪيٽ",
      "پرائمري، ثانوي",
      "لچڪدار، غير لچڪدار",
      "مٿاهين، گهٽايو"
    ]
  },
  {
    "t": "The graphical representation of demand schedule is known as a ______.",
    "o": [
      "demand curve",
      "supply curve",
      "line graph",
      "pie chart"
    ],
    "c": 0,
    "tSd": "طلب جدول جي گرافڪ نمائندگي کي ______ چئبو آهي.",
    "oSd": [
      "طلب مڙھ",
      "سپلائي مڙھ",
      "لڪير گراف",
      "پائي چارٽ"
    ]
  },
  {
    "t": "A person who creates economic value or produces goods and services is called a ______.",
    "o": [
      "producer",
      "consumer",
      "seller",
      "buyer"
    ],
    "c": 0,
    "tSd": "جيڪو شخص اقتصادي قدر پيدا ڪري يا سامان ۽ خدمتون پيدا ڪري، ان کي ______ چئبو آهي.",
    "oSd": [
      "پروڊيوسر",
      "صارفين",
      "وڪرو ڪندڙ",
      "خريدار"
    ]
  },
  {
    "t": "If there is a technological advancement in a good's production, its supply would be ______.",
    "o": [
      "increase",
      "decrease",
      "remain same",
      "uncertain"
    ],
    "c": 0,
    "tSd": "جيڪڏهن ڪنهن شيءِ جي پيداوار ۾ ٽيڪنالاجي پيش رفت ٿئي ٿي، ته ان جي فراهمي ______ ٿيندي.",
    "oSd": [
      "وڌندي",
      "گهٽجي ويندي",
      "ساڳي رهندي",
      "غير يقيني"
    ]
  },
  {
    "t": "A ______ represents the relationship between the price of a good or service and the quantity supplied through a graph.",
    "o": [
      "supply curve",
      "demand curve",
      "line graph",
      "bar graph"
    ],
    "c": 0,
    "tSd": "هڪ ______ گراف ذريعي ڪنهن شيءِ يا خدمت جي قيمت ۽ مليل مقدار جي وچ ۾ رابطي جي نمائندگي ڪري ٿو.",
    "oSd": [
      "سپلائي مڙھ",
      "طلب مڙھ",
      "لڪير گراف",
      "بار گراف"
    ]
  },
  {
    "t": "A democratic leader is one who ______ the people in the decision making process.",
    "o": [
      "involves",
      "excludes",
      "ignores",
      "avoids"
    ],
    "c": 0,
    "tSd": "هڪ ڊيموڪريٽڪ اڳواڻ اهو آهي جيڪو فيصلي ڪرڻ واري عمل ۾ ماڻهن کي ______ ڪري ٿو.",
    "oSd": [
      "شامل",
      "ٻاهر ڪڍي ٿو",
      "نظرانداز ڪري ٿو",
      "بچائي ٿو"
    ]
  },
  {
    "t": "The autocratic leaders make decisions without any ______ of others.",
    "o": [
      "input",
      "support",
      "approval",
      "consent"
    ],
    "c": 0,
    "tSd": "آمريت وارا اڳواڻ ٻين جي ڪنهن به ______ کان سواءِ فيصلا ڪندا آهن.",
    "oSd": [
      "انپٽ",
      "مدد",
      "منظوري",
      "رضامندي"
    ]
  },
  {
    "t": "The society is naturally divided into ______ and ______.",
    "o": [
      "leaders, followers",
      "rich, poor",
      "young, old",
      "educated, uneducated"
    ],
    "c": 0,
    "tSd": "سوسائٽي قدرتي طور تي ______ ۽ ______ ۾ ورهايل آهي.",
    "oSd": [
      "اڳواڻ، پيروڪار",
      "امير، غريب",
      "جوان، پوڙهو",
      "تعليم يافته، غير تعليم يافته"
    ]
  },
  {
    "t": "Women have a role to play as a ______ in every society.",
    "o": [
      "nation builder",
      "housewife",
      "mother",
      "worker"
    ],
    "c": 0,
    "tSd": "عورتن کي هر سماج ۾ ______ جي ناتي سان ڪردار ادا ڪرڻو پوي ٿو.",
    "oSd": [
      "قوم جي تعمير ڪندڙ",
      "گهر واري",
      "ماءُ",
      "ملازم"
    ]
  },
  {
    "t": "Countries are producing a huge quantity of graduates but they lack basic skills and ______.",
    "o": [
      "training",
      "education",
      "knowledge",
      "experience"
    ],
    "c": 0,
    "tSd": "ملڪ وڏي تعداد ۾ گريجوئيٽ پيدا ڪري رهيا آهن پر انهن ۾ بنيادي مهارتن ۽ ______ جي کوٽ آهي.",
    "oSd": [
      "تربيت",
      "تعليم",
      "ڄاڻ",
      "تجربو"
    ]
  },
  {
    "t": "People cut the trees and destroy forests for getting ______ and ______.",
    "o": [
      "land, accommodating people",
      "wood, fuel",
      "money, profit",
      "agriculture, settlement"
    ],
    "c": 0,
    "tSd": "ماڻهو زمين حاصل ڪرڻ ۽ ماڻهن کي ويهارڻ لاءِ وڻ ڪٽيندا آهن ۽ ٻيلا تباھ ڪندا آهن ______.",
    "oSd": [
      "زمين، ماڻهن کي ويهارڻ",
      "ڪاٺ، ٻارڻ",
      "پئسو، منافعو",
      "زرعي، آبادڪاري"
    ]
  },
  {
    "t": "According to international standard, an individual who is of ______ age has right to cast his/her vote in the elections.",
    "o": [
      "16",
      "18",
      "21",
      "25"
    ],
    "c": 1,
    "tSd": "بين الاقوامي معيار موجب، جيڪو فرد ______ عمر جو آهي ان کي چونڊن ۾ ووٽ ڏيڻ جو حق آهي.",
    "oSd": [
      "16",
      "18",
      "21",
      "25"
    ]
  },
  {
    "t": "When a child reaches at the age of schooling then, he/she can exercise his/her right to ______.",
    "o": [
      "education",
      "health",
      "work",
      "play"
    ],
    "c": 0,
    "tSd": "جڏهن هڪ ٻار اسڪول وڃڻ جي عمر کي پهچي ٿو ته پوءِ هو/هي پنهنجي حق جو استعمال ______ لاءِ ڪري سگهي ٿو/ٿي.",
    "oSd": [
      "تعليم",
      "صحت",
      "ڪم",
      "راند"
    ]
  },
  {
    "t": "A minority can be of race, religion and ______ in any society.",
    "o": [
      "ethnicity",
      "gender",
      "age",
      "class"
    ],
    "c": 0,
    "tSd": "اقليت ڪنهن به سماج ۾ نژاد، مذهب ۽ ______ جي ٿي سگهي ٿي.",
    "oSd": [
      "نسل",
      "جنس",
      "عمر",
      "طبقي"
    ]
  },
  {
    "t": "Political parties identify and articulate the ______ of people and develop manifestoes accordingly.",
    "o": [
      "interests",
      "problems",
      "demands",
      "needs"
    ],
    "c": 0,
    "tSd": "سياسي پارٽيون ماڻهن جي ______ کي سڃاڻن ٿيون ۽ بيان ڪن ٿيون ۽ ان مطابق منشور تيار ڪن ٿيون.",
    "oSd": [
      "مفادن",
      "مسئلن",
      "مطالبن",
      "نواسين"
    ]
  },
  {
    "t": "Taking photographs of the ground from an elevated position is called ______.",
    "o": [
      "aerial photography",
      "satellite imagery",
      "remote sensing",
      "cartography"
    ],
    "c": 0,
    "tSd": "اوچي جاءِ تان زمين جا تصويرون ڪڍڻ کي ______ چئبو آهي.",
    "oSd": [
      "هوا ئي فوٽو گرافي",
      "سيٽلائيٽ تصويري",
      "ريموٽ سينسنگ",
      "ڪارٽو گرافي"
    ]
  },
  {
    "t": "The skills in which the specific ways students are expected to behave in order to achieve class norms are called ______.",
    "o": [
      "collaborative skills",
      "leadership skills",
      "communication skills",
      "problem-solving skills"
    ],
    "c": 0,
    "tSd": "اهي مهارتون جن ۾ شاگردن کي ڪلاس روم جي معيار حاصل ڪرڻ لاءِ مخصوص طريقن سان رويو ڏيکارڻ جي توقع ڪئي ويندي آهي، انهن کي ______ چئبو آهي.",
    "oSd": [
      "سهڪاري مهارتون",
      "قيادت مهارتون",
      "رابطي جون مهارتون",
      "مسئلا حل ڪرڻ جون مهارتون"
    ]
  },
  {
    "t": "The process of making choices by identifying a decision, gathering information and assessing alternative resolutions is called ______.",
    "o": [
      "decision-making",
      "problem-solving",
      "critical thinking",
      "collaboration"
    ],
    "c": 0,
    "tSd": "فيصلي جي سڃاڻپ، معلومات گڏ ڪرڻ ۽ متبادل حلن جي ارزيابي ذريعي چونڊون ڪرڻ جي عمل کي ______ چئبو آهي.",
    "oSd": [
      "فيصلي سازي",
      "مسئلا حل ڪرڻ",
      "تنقيدي سوچ",
      "سهڪار"
    ]
  },
  {
    "t": "The way of representing statistical data using symbolic figures to match the frequencies of different kinds of data is called ______.",
    "o": [
      "pictograph",
      "bar graph",
      "line graph",
      "pie chart"
    ],
    "c": 0,
    "tSd": "مختلف قسمن جي ڊيٽا جي تعدد کي ترتيب ڏيڻ لاءِ علامتي انگن اکرن جو استعمال ڪندي احصائي ڊيٽا کي ڏيکارڻ جي طريقي کي ______ چئبو آهي.",
    "oSd": [
      "پڪٽو گراف",
      "بار گراف",
      "لڪير گراف",
      "پائي چارٽ"
    ]
  },
  {
    "t": "The two kinds of bar graph are ______ and ______.",
    "o": [
      "vertical, horizontal",
      "simple, complex",
      "single, double",
      "primary, secondary"
    ],
    "c": 0,
    "tSd": "بار گراف جا ٻه قسمن جا آهن ______ ۽ ______.",
    "oSd": [
      "عمودي، افقي",
      "سادو، ڏکيو",
      "سنگل، ڊبل",
      "پرائمري، ثانوي"
    ]
  },
  {
    "t": "Victimized person should tell about the incident to someone he/she ______ the most.",
    "o": [
      "trusts",
      "loves",
      "respects",
      "believes"
    ],
    "c": 0,
    "tSd": "مظلوم شخص کي واقعي بابت ان شخص کي ٻڌائڻ گهرجي جنهن تي هو/هي سڀ کان وڌيڪ ______ ڪري ٿو/ٿي.",
    "oSd": [
      "اعتماد",
      "محبت",
      "احترام",
      "يقين"
    ]
  },
  {
    "t": "Protection from violence is every individual's ______.",
    "o": [
      "right",
      "duty",
      "privilege",
      "responsibility"
    ],
    "c": 0,
    "tSd": "تشدد کان تحفظ حاصل ڪرڻ هر فرد جو ______ آهي.",
    "oSd": [
      "حق",
      "فرض",
      "امتياز",
      "ذميداري"
    ]
  },
  {
    "t": "Revenue is calculated by multiplying ______ by ______.",
    "o": [
      "price, quantity",
      "cost, profit",
      "income, expense",
      "demand, supply"
    ],
    "c": 0,
    "tSd": "آمدني حاصل ڪرڻ لاءِ ______ کي ______ سان ضرب ڪيو ويندو آهي.",
    "oSd": [
      "قيمت، مقدار",
      "خرچ، نفعو",
      "آمدني، خرچ",
      "طلب، فراهمي"
    ]
  },
  {
    "t": "Total Profit = ______ - ______.",
    "o": [
      "Total Revenue, Total Costs",
      "Total Income, Total Expenses",
      "Total Sales, Total Purchase",
      "Total Demand, Total Supply"
    ],
    "c": 0,
    "tSd": "ڪل نفعو = ______ - ______.",
    "oSd": [
      "ڪل آمدني، ڪل خرچ",
      "ڪل آمدني، ڪل خرچن",
      "ڪل وڪرو، ڪل خريداري",
      "ڪل طلب، ڪل فراهمي"
    ]
  },
  {
    "t": "A supply schedule is a table which shows how much one or more firms will be willing to supply at ______.",
    "o": [
      "particular prices",
      "any price",
      "varying prices",
      "maximum prices"
    ],
    "c": 0,
    "tSd": "سپلائي جدول هڪ جدول آهي جيڪو ڏيکاري ٿو ته هڪ يا وڌيڪ فرمون ڪيترو سپلائي ڪرڻ لاءِ تيار هونديون ______.",
    "oSd": [
      "مخصوص قيمتن تي",
      "ڪنهن به قيمت تي",
      "مختلف قيمتن تي",
      "وڌ کان وڌ قيمتن تي"
    ]
  },
  {
    "t": "The supply curve is a graphical representation of the ______.",
    "o": [
      "supply schedule",
      "demand schedule",
      "market equilibrium",
      "production function"
    ],
    "c": 0,
    "tSd": "سپلائي مڙھ ______ جي گرافڪ نمائندگي آهي.",
    "oSd": [
      "سپلائي جدول",
      "طلب جدول",
      "مارڪيٽ جي توازن",
      "پيداواري فنڪشن"
    ]
  },
  {
    "t": "Private goods are characterized by ______ and ______.",
    "o": [
      "rivalry, excludability",
      "non-rivalry, non-excludability",
      "public, private",
      "consumer, capital"
    ],
    "c": 0,
    "tSd": "نجي سامان جي خاصيت ______ ۽ ______ آهي.",
    "oSd": [
      "رقابت، خارج ٿيڻ",
      "غير رقابت، غير خارج ٿيڻ",
      "عوامي، پرائيويٽ",
      "صارف، سرمايو"
    ]
  },
  {
    "t": "Public goods are characterized by ______ and ______.",
    "o": [
      "non-rivalry, non-excludability",
      "rivalry, excludability",
      "private, public",
      "free, paid"
    ],
    "c": 0,
    "tSd": "عوامي سامان جي خاصيت ______ ۽ ______ آهي.",
    "oSd": [
      "غير رقابت، غير خارج ٿيڻ",
      "رقابت، خارج ٿيڻ",
      "پرائيويٽ، عوامي",
      "مفت، پئسن وارو"
    ]
  },
  {
    "t": "Income tax is a tax paid on the ______ that a person or business receives.",
    "o": [
      "money",
      "goods",
      "services",
      "property"
    ],
    "c": 0,
    "tSd": "انڪم ٽيڪس هڪ ٽيڪس آهي جيڪو ______ تي ادا ڪيو ويندو آهي جيڪو هڪ شخص يا ڪاروبار حاصل ڪري ٿو.",
    "oSd": [
      "پئسو",
      "سامان",
      "خدمتون",
      "ملڪيت"
    ]
  },
  {
    "t": "Sales tax is a tax added to the ______ of goods and services.",
    "o": [
      "price",
      "quantity",
      "quality",
      "demand"
    ],
    "c": 0,
    "tSd": "سيلز ٽيڪس هڪ ٽيڪس آهي جيڪو سامان ۽ خدمتن جي ______ ۾ شامل ڪيو ويندو آهي.",
    "oSd": [
      "قيمت",
      "مقدار",
      "معيار",
      "طلب"
    ]
  },
  {
    "t": "Pakistan has a ______ form of government.",
    "o": [
      "federal parliamentary",
      "federal presidential",
      "unitary parliamentary",
      "unitary presidential"
    ],
    "c": 0,
    "tSd": "پاڪستان ۾ حڪومت جو ______ روپ آهي.",
    "oSd": [
      "وفاقي پارلياماني",
      "وفاقي صدارتي",
      "وحداني پارلياماني",
      "وحداني صدارتي"
    ]
  },
  {
    "t": "The 1973 Constitution of Pakistan has been amended ______ times so far.",
    "o": [
      "20",
      "23",
      "25",
      "28"
    ],
    "c": 1,
    "tSd": "پاڪستان جي 1973ع واري آئين ۾ هن وقت تائين ______ ترميمون ڪيون ويون آهن.",
    "oSd": [
      "20",
      "23",
      "25",
      "28"
    ]
  },
  {
    "t": "The National Language of Pakistan is ______.",
    "o": [
      "Urdu",
      "English",
      "Punjabi",
      "Sindhi"
    ],
    "c": 0,
    "tSd": "پاڪستان جي قومي ٻولي ______ آهي.",
    "oSd": [
      "اردو",
      "انگريزي",
      "پنجابي",
      "سنڌي"
    ]
  },
  {
    "t": "The Official Language of Pakistan is ______.",
    "o": [
      "English",
      "Urdu",
      "Punjabi",
      "Sindhi"
    ],
    "c": 0,
    "tSd": "پاڪستان جي سرڪاري ٻولي ______ آهي.",
    "oSd": [
      "انگريزي",
      "اردو",
      "پنجابي",
      "سنڌي"
    ]
  },
  {
    "t": "The Chairman of Senate is elected for a term of ______ years.",
    "o": [
      "2",
      "3",
      "4",
      "5"
    ],
    "c": 1,
    "tSd": "سينيٽ جو چيئرمين ______ سالن جي مد لاءِ چونڊيو ويندو آهي.",
    "oSd": [
      "2",
      "3",
      "4",
      "5"
    ]
  },
  {
    "t": "The Speaker of the National Assembly is elected from amongst its ______.",
    "o": [
      "members",
      "senators",
      "judges",
      "ministers"
    ],
    "c": 0,
    "tSd": "قومي اسيمبليءَ جو اسپيڪر ان جي ______ مان چونڊيو ويندو آهي.",
    "oSd": [
      "ميمبرن",
      "سينيٽرن",
      "ججن",
      "وزيرن"
    ]
  },
  {
    "t": "The four provinces of Pakistan are ______, ______, ______ and ______.",
    "o": [
      "Punjab, Sindh, KPK, Balochistan",
      "Punjab, Sindh, Balochistan, FATA",
      "Sindh, KPK, Balochistan, Gilgit",
      "Punjab, Sindh, KPK, Gilgit"
    ],
    "c": 0,
    "tSd": "پاڪستان جا چار صوبا ______، ______، ______ ۽ ______ آهن.",
    "oSd": [
      "پنجاب، سنڌ، ڪي پي ڪي، بلوچستان",
      "پنجاب، سنڌ، بلوچستان، فاٽا",
      "سنڌ، ڪي پي ڪي، بلوچستان، گلگت",
      "پنجاب، سنڌ، ڪي پي ڪي، گلگت"
    ]
  },
  {
    "t": "Pakistan came into existence in ______.",
    "o": [
      "1945",
      "1947",
      "1948",
      "1949"
    ],
    "c": 1,
    "tSd": "پاڪستان ______ ۾ وجود ۾ آيو.",
    "oSd": [
      "1945",
      "1947",
      "1948",
      "1949"
    ]
  },
  {
    "t": "Water covers about ______ percent of the earth's surface.",
    "o": [
      "65",
      "70",
      "75",
      "80"
    ],
    "c": 2,
    "tSd": "پاڻي ڌرتيءَ جي سطح جي لڳ ڀڳ ______ سيڪڙو کي ڍڪي ٿو.",
    "oSd": [
      "65",
      "70",
      "75",
      "80"
    ]
  },
  {
    "t": "In oceans, ______ of water is too salty for people, animals or plants to use.",
    "o": [
      "95",
      "96",
      "97",
      "98"
    ],
    "c": 2,
    "tSd": "سمنڊن ۾، ______ پاڻي ماڻهن، جانورن يا ٻوٽن جي استعمال لاءِ تمام کٽو هوندو آهي.",
    "oSd": [
      "95",
      "96",
      "97",
      "98"
    ]
  },
  {
    "t": "Only ______ of water is fresh water but not all of it can be used.",
    "o": [
      "0.5%",
      "1%",
      "2%",
      "3%"
    ],
    "c": 1,
    "tSd": "صرف ______ پاڻي مٺو پاڻي آهي پر اهو سڀ استعمال نٿو ڪري سگهجي.",
    "oSd": [
      "0.5%",
      "1%",
      "2%",
      "3%"
    ]
  },
  {
    "t": "Ground water is generally found around ______ feet deep in the Earth.",
    "o": [
      "1,000",
      "1,500",
      "2,000",
      "2,500"
    ],
    "c": 2,
    "tSd": "زميني پاڻي عام طور تي ڌرتيءَ ۾ لڳ ڀڳ ______ فٽ खोल ملندو آهي.",
    "oSd": [
      "1,000",
      "1,500",
      "2,000",
      "2,500"
    ]
  },
  {
    "t": "In Pakistan, ______ percent of agricultural land is under irrigation.",
    "o": [
      "65",
      "70",
      "75",
      "80"
    ],
    "c": 2,
    "tSd": "پاڪستان ۾، زرعي زمين جو ______ سيڪڙو آبياريءَ هيٺ آهي.",
    "oSd": [
      "65",
      "70",
      "75",
      "80"
    ]
  },
  {
    "t": "The average annual flow of Pakistan's Rivers is approximately ______ million acre feet (MAF).",
    "o": [
      "120",
      "135",
      "142",
      "150"
    ],
    "c": 2,
    "tSd": "پاڪستان جي ندين جو اوسط ساليانو وهڪرو لڳ ڀڳ ______ ملين ايڪڙ فٽ (MAF) آهي.",
    "oSd": [
      "120",
      "135",
      "142",
      "150"
    ]
  },
  {
    "t": "About ______ MAF of water is diverted for irrigation purposes in Pakistan.",
    "o": [
      "95",
      "100",
      "104",
      "110"
    ],
    "c": 2,
    "tSd": "پاڪستان ۾ آبياريءَ جي مقصدن لاءِ لڳ ڀڳ ______ MAF پاڻي موڙيو وڃي ٿو.",
    "oSd": [
      "95",
      "100",
      "104",
      "110"
    ]
  },
  {
    "t": "Ground water provides approximately ______ percent of crop water requirements in Pakistan.",
    "o": [
      "30",
      "35",
      "40",
      "45"
    ],
    "c": 2,
    "tSd": "زميني پاڻي پاڪستان ۾ فصلن جي پاڻيءَ جي ضرورتن جو لڳ ڀڳ ______ سيڪڙو فراهم ڪري ٿو.",
    "oSd": [
      "30",
      "35",
      "40",
      "45"
    ]
  },
  {
    "t": "Water logging and salinity has affected about ______ million hectares of agricultural land in Pakistan.",
    "o": [
      "2.5",
      "3.0",
      "3.5",
      "4.0"
    ],
    "c": 2,
    "tSd": "سم ۽ ڪلور پاڪستان ۾ زرعي زمين جي لڳ ڀڳ ______ ملين هيڪٽرن کي متاثر ڪيو آهي.",
    "oSd": [
      "2.5",
      "3.0",
      "3.5",
      "4.0"
    ]
  },
  {
    "t": "A person who is a legally recognized resident of a particular country is called a ______.",
    "o": [
      "citizen",
      "resident",
      "national",
      "subject"
    ],
    "c": 0,
    "tSd": "جيڪو شخص ڪنهن ملڪ جو قانوني طور تي تسليم ٿيل رهواسي هجي، ان کي ______ چئبو آهي.",
    "oSd": [
      "شهري",
      "رهواسي",
      "قومي",
      "شخص"
    ]
  },
  {
    "t": "Natural-born citizen is a citizen who was ______ in a state.",
    "o": [
      "born",
      "adopted",
      "naturalized",
      "settled"
    ],
    "c": 0,
    "tSd": "فطري طور ڄاول شهري اهو شهري هوندو آهي جيڪو ڪنهن رياست ۾ ______ هجي.",
    "oSd": [
      "پيدا ٿيو",
      "اپنائيو ويو",
      "شهريت ڏني وئي",
      "آباد ٿيو"
    ]
  },
  {
    "t": "Naturalized citizen is one who has adopted the citizenship of any other ______.",
    "o": [
      "state",
      "country",
      "nation",
      "region"
    ],
    "c": 0,
    "tSd": "شهريت يافته شهري اهو هوندو آهي جنهن ڪنهن ٻئي ______ جي شهريت اختيار ڪئي هجي.",
    "oSd": [
      "رياست",
      "ملڪ",
      "قوم",
      "علائقي"
    ]
  },
  {
    "t": "The Ulema were the religious scholars who were experts in the ______ law.",
    "o": [
      "Sharia",
      "Common",
      "Civil",
      "Constitutional"
    ],
    "c": 0,
    "tSd": "علماء مذهبي عالم هئا جيڪي ______ قانون جا ماهر هئا.",
    "oSd": [
      "شريعت",
      "عام",
      "سول",
      "آئيني"
    ]
  },
  {
    "t": "The non-Muslim communities in the Ottoman Empire were called ______.",
    "o": [
      "millets",
      "dhimmi",
      "minorities",
      "foreigners"
    ],
    "c": 0,
    "tSd": "عثماني سلطنت ۾ غير مسلم برادرين کي ______ چئبو هو.",
    "oSd": [
      "ملت",
      "ذمي",
      "اقليتون",
      "غير ملڪي"
    ]
  },
  {
    "t": "The Ottoman Sultan also claimed to be a ______.",
    "o": [
      "caliph",
      "king",
      "emperor",
      "ruler"
    ],
    "c": 0,
    "tSd": "عثماني سلطان پڻ ______ هجڻ جو دعويٰ ڪيو.",
    "oSd": [
      "خليفو",
      "بادشاهه",
      "شهنشاهه",
      "حڪمران"
    ]
  },
  {
    "t": "The chief minister of the Ottoman Empire was called the ______.",
    "o": [
      "Grand Vizier",
      "Sultan",
      "Caliph",
      "Amir"
    ],
    "c": 0,
    "tSd": "عثماني سلطنت جي مکيه وزير کي ______ چئبو هو.",
    "oSd": [
      "وزير اعظم",
      "سلطان",
      "خليفو",
      "امير"
    ]
  },
  {
    "t": "The Ottoman Empire lasted till the beginning of ______.",
    "o": [
      "World War I",
      "World War II",
      "French Revolution",
      "Industrial Revolution"
    ],
    "c": 0,
    "tSd": "عثماني سلطنت ______ جي شروعات تائين قائم رهي.",
    "oSd": [
      "پهرين عالمي جنگ",
      "ٻي عالمي جنگ",
      "فرانسيسي انقلاب",
      "صنعتي انقلاب"
    ]
  },
  {
    "t": "The Umayyad dynasty ruled from ______ until 750 AD.",
    "o": [
      "600",
      "650",
      "661",
      "700"
    ],
    "c": 2,
    "tSd": "بنو اميه جي حڪومت ______ کان 750 عيسوي تائين رهي.",
    "oSd": [
      "600",
      "650",
      "661",
      "700"
    ]
  },
  {
    "t": "The Abbasid dynasty ruled until ______ AD.",
    "o": [
      "1158",
      "1200",
      "1250",
      "1258"
    ],
    "c": 3,
    "tSd": "عباسي خاندان ______ عيسوي تائين حڪومت ڪئي.",
    "oSd": [
      "1158",
      "1200",
      "1250",
      "1258"
    ]
  },
  {
    "t": "Al-Khwarazmi discovered the number ______.",
    "o": [
      "one",
      "two",
      "zero",
      "ten"
    ],
    "c": 2,
    "tSd": "الخوارزمي عدد ______ دريافت ڪيو.",
    "oSd": [
      "هڪ",
      "ٻه",
      "ٻُڙي",
      "ڏهه"
    ]
  },
  {
    "t": "Ibrahim Al-Fazari invented a device known as the ______ for navigation.",
    "o": [
      "astrolabe",
      "compass",
      "sextant",
      "telescope"
    ],
    "c": 0,
    "tSd": "ابراهيم الفزاري جهاز رانيءَ لاءِ ______ نالي اوزار ايجاد ڪيو.",
    "oSd": [
      "اصطرباب",
      "قطب نما",
      "سيڪسٽنٽ",
      "دوربين"
    ]
  },
  {
    "t": "Ibn Sina's famous medical book is called ______.",
    "o": [
      "Qanun fi-al-Tibb",
      "Kitab al-Shifa",
      "Canon of Medicine",
      "Al-Qanun"
    ],
    "c": 0,
    "tSd": "ابن سينا جو مشهور طبي ڪتاب ______ سڏجي ٿو.",
    "oSd": [
      "قانون في الطب",
      "ڪتاب الشفاء",
      "ميڊيسن جو قانون",
      "القانون"
    ]
  },
  {
    "t": "The Battle of Manzikert was fought in ______ AD.",
    "o": [
      "1050",
      "1071",
      "1095",
      "1100"
    ],
    "c": 1,
    "tSd": "منزڪرٽ جي جنگ ______ عيسوي ۾ وڙهي وئي.",
    "oSd": [
      "1050",
      "1071",
      "1095",
      "1100"
    ]
  },
  {
    "t": "The Ottoman Empire captured Constantinople in ______ AD.",
    "o": [
      "1400",
      "1453",
      "1492",
      "1500"
    ],
    "c": 1,
    "tSd": "عثماني سلطنت قسطنطنيه کي ______ عيسوي ۾ فتح ڪيو.",
    "oSd": [
      "1400",
      "1453",
      "1492",
      "1500"
    ]
  },
  {
    "t": "The Black Death occurred in ______ AD.",
    "o": [
      "1300-1325",
      "1347-1348",
      "1350-1375",
      "1400-1425"
    ],
    "c": 1,
    "tSd": "ڪاري موت ______ عيسوي ۾ آئي.",
    "oSd": [
      "1300-1325",
      "1347-1348",
      "1350-1375",
      "1400-1425"
    ]
  },
  {
    "t": "The first hospital in Paris was founded by Louis IX after he came back from Crusade in ______ AD.",
    "o": [
      "1200",
      "1250",
      "1260",
      "1300"
    ],
    "c": 2,
    "tSd": "پئرس ۾ پهريون اسپتال لوئس نائين صليبي جنگ تان واپس اچڻ بعد ______ عيسوي ۾ قائم ڪيو.",
    "oSd": [
      "1200",
      "1250",
      "1260",
      "1300"
    ]
  },
  {
    "t": "The number of refugees in the world is approximately ______ million.",
    "o": [
      "15.5",
      "17.5",
      "19.5",
      "21.5"
    ],
    "c": 2,
    "tSd": "دنيا ۾ پناهگيرن جو تعداد لڳ ڀڳ ______ ملين آهي.",
    "oSd": [
      "15.5",
      "17.5",
      "19.5",
      "21.5"
    ]
  },
  {
    "t": "Together with internally displaced persons, there are ______ million refugees, asylum seekers and internally displaced persons.",
    "o": [
      "49.5",
      "54.5",
      "59.5",
      "64.5"
    ],
    "c": 2,
    "tSd": "ملڪ اندر بي گهر ٿيل ماڻهن سان گڏ، ڌرتيءَ تي ______ ملين پناهگير، پناهه ڳوليندڙ ۽ بي گهر ٿيل ماڻهو آهن.",
    "oSd": [
      "49.5",
      "54.5",
      "59.5",
      "64.5"
    ]
  },
  {
    "t": "Pakistan hosted the most refugees in 2008, with ______ million, nearly all from Afghanistan.",
    "o": [
      "1.5",
      "1.8",
      "2.0",
      "2.2"
    ],
    "c": 1,
    "tSd": "پاڪستان 2008ع ۾ سڀ کان وڌيڪ پناهگيرن جي ميزباني ڪئي، جن جو تعداد ______ ملين هو، جيڪي لڳ ڀڳ سڀ افغانستان مان هئا.",
    "oSd": [
      "1.5",
      "1.8",
      "2.0",
      "2.2"
    ]
  },
  {
    "t": "Up to ______ percent of all Afghan refugees live in Iran and Pakistan.",
    "o": [
      "85",
      "90",
      "95",
      "96"
    ],
    "c": 3,
    "tSd": "افغان پناهگيرن جو لڳ ڀڳ ______ سيڪڙو تائين ايران ۽ پاڪستان ۾ رهن ٿا.",
    "oSd": [
      "85",
      "90",
      "95",
      "96"
    ]
  },
  {
    "t": "The term \"brain drain\" is used to indicate the drain of ______ persons from one country to another.",
    "o": [
      "skilled",
      "unskilled",
      "educated",
      "qualified"
    ],
    "c": 0,
    "tSd": "اصطلاح \"برين ڊرين\" هڪ ملڪ مان ٻئي ملڪ ڏانهن ______ ماڻهن جي منتقل ٿيڻ جي نشاندهي ڪرڻ لاءِ استعمال ٿئي ٿو.",
    "oSd": [
      "ماهر",
      "غير ماهر",
      "تعليم يافته",
      "قابليت رکندڙ"
    ]
  },
  {
    "t": "An asylum seeker is a person who has fled from his or her own country due to fear of ______.",
    "o": [
      "torture",
      "poverty",
      "war",
      "natural disaster"
    ],
    "c": 0,
    "tSd": "پناهه ڳوليندڙ اهو شخص هوندو آهي جيڪو ______ جي خوف کان پنهنجي ملڪ مان ڀڄي ويو هجي.",
    "oSd": [
      "عذاب",
      "غربت",
      "جنگ",
      "قدرتي آفت"
    ]
  },
  {
    "t": "An internally displaced person is someone who is living inside the borders of their own country but is unable to safely live in their own ______.",
    "o": [
      "home",
      "country",
      "region",
      "city"
    ],
    "c": 0,
    "tSd": "ملڪ اندر بي گهر ٿيل شخص اهو هوندو آهي جيڪو پنهنجي ملڪ جي حدن اندر رهندو هجي پر محفوظ طريقي سان پنهنجي ______ ۾ رهن نٿو سگهي.",
    "oSd": [
      "گهر",
      "ملڪ",
      "علائقي",
      "شهر"
    ]
  },
  {
    "t": "The Afghan refugee population constitutes the largest extended ______ in the world.",
    "o": [
      "situation",
      "crisis",
      "problem",
      "disaster"
    ],
    "c": 0,
    "tSd": "افغان پناهگيرن جي آبادي دنيا ۾ سڀ کان وڏي ڊگهي ______ آهي.",
    "oSd": [
      "صورتحال",
      "بحران",
      "مسئلو",
      "آفت"
    ]
  },
  {
    "t": "People of FATA (Pakistan) were IDPs in the year ______.",
    "o": [
      "2013-2014",
      "2014-2015",
      "2015-2016",
      "2016-2017"
    ],
    "c": 2,
    "tSd": "فاٽا (پاڪستان) جا ماڻهو سال ______ ۾ ملڪ اندر بي گهر ٿيل ماڻهو هئا.",
    "oSd": [
      "2013-2014",
      "2014-2015",
      "2015-2016",
      "2016-2017"
    ]
  },
  {
    "t": "The East Asia and Pacific countries were relatively peaceful in recent decades compared to ______.",
    "o": [
      "Middle East, South Asia, Central Asia",
      "Europe, Africa, America",
      "North Asia, West Asia",
      "Southeast Asia, Southwest Asia"
    ],
    "c": 0,
    "tSd": "اتر اوڀر ايشيا ۽ پئسفڪ ملڪ تازن ڏهاڪن ۾ ______ جي مقابلي ۾ نسبتاً پرامن هئا.",
    "oSd": [
      "مڊل ايسٽ، ڏکڻ ايشيا، سينٽرل ايشيا",
      "يورپ، آفريڪا، آمريڪا",
      "نارٿ ايشيا، ويسٽ ايشيا",
      "سائوتھ ايسٽ ايشيا، سائوتھ ويسٽ ايشيا"
    ]
  },
  {
    "t": "Total membership of the National Assembly of Pakistan is ______.",
    "o": [
      "272",
      "342",
      "342",
      "442"
    ],
    "c": 1,
    "tSd": "پاڪستان جي قومي اسيمبليءَ جي ڪل ميمبرشپ ______ آهي.",
    "oSd": [
      "272",
      "342",
      "342",
      "442"
    ]
  },
  {
    "t": "Members of the National Assembly are elected for a term of ______ years.",
    "o": [
      "4",
      "5",
      "6",
      "7"
    ],
    "c": 1,
    "tSd": "قومي اسيمبليءَ جا ميمبر ______ سالن جي مد لاءِ چونڊيا ويندا آهن.",
    "oSd": [
      "4",
      "5",
      "6",
      "7"
    ]
  },
  {
    "t": "The Senate of Pakistan has ______ members.",
    "o": [
      "96",
      "100",
      "104",
      "108"
    ],
    "c": 2,
    "tSd": "پاڪستان جي سينيٽ جا ______ ميمبر آهن.",
    "oSd": [
      "96",
      "100",
      "104",
      "108"
    ]
  },
  {
    "t": "Term of members of the Senate is ______ years.",
    "o": [
      "4",
      "5",
      "6",
      "7"
    ],
    "c": 2,
    "tSd": "سينيٽ ميمبرن جو مدو ______ سال آهي.",
    "oSd": [
      "4",
      "5",
      "6",
      "7"
    ]
  },
  {
    "t": "One-half of the Senate members retire after every ______ years.",
    "o": [
      "2",
      "3",
      "4",
      "5"
    ],
    "c": 1,
    "tSd": "سينيٽ جا اڌ ميمبر هر ______ سالن کان پوءِ رٽائر ٿين ٿا.",
    "oSd": [
      "2",
      "3",
      "4",
      "5"
    ]
  },
  {
    "t": "The Sindh Local Govt Act was passed in ______.",
    "o": [
      "2005",
      "2010",
      "2011",
      "2013"
    ],
    "c": 3,
    "tSd": "سنڌ لوڪل گورنمينٽ ايڪٽ ______ ۾ پاس ڪيو ويو.",
    "oSd": [
      "2005",
      "2010",
      "2011",
      "2013"
    ]
  },
  {
    "t": "The three tiers of local government under Sindh Local Govt Act are ______, ______ And ______.",
    "o": [
      "District, Taluka, Union",
      "City, Town, Village",
      "Provincial, District, Taluka",
      "Union, Taluka, Town"
    ],
    "c": 0,
    "tSd": "سنڌ لوڪل گورنمينٽ ايڪٽ تحت مقامي حڪومت جا ٽي درجا ______، ______ ۽ ______ آهن.",
    "oSd": [
      "ضلعو، تعلقو، يونين",
      "شهر، ٽائون، ڳوٺ",
      "صوبائي، ضلعو، تعلقو",
      "يونين، تعلقو، ٽائون"
    ]
  },
  {
    "t": "In metropolitan cities, the Chairman of local government is called ______.",
    "o": [
      "Mayor",
      "Commissioner",
      "Administrator",
      "Deputy Commissioner"
    ],
    "c": 0,
    "tSd": "ميٽروپوليٽن شهرن ۾، مقامي حڪومت جي چيئرمين کي ______ سڏيو ويندو آهي.",
    "oSd": [
      "ميئر",
      "ڪمشنر",
      "منتظم",
      "ڊپٽي ڪمشنر"
    ]
  },
  {
    "t": "Councilors in local government serve a term of ______ years.",
    "o": [
      "3",
      "4",
      "5",
      "6"
    ],
    "c": 1,
    "tSd": "مقامي حڪومت ۾ ڪائونسلر ______ سالن جي مد لاءِ خدمت ڪن ٿا.",
    "oSd": [
      "3",
      "4",
      "5",
      "6"
    ]
  },
  {
    "t": "The two houses of Pakistan's Parliament are ______ And ______.",
    "o": [
      "National Assembly, Senate",
      "National Assembly, Provincial Assembly",
      "Senate, Provincial Assembly",
      "Lower House, Upper House"
    ],
    "c": 0,
    "tSd": "پاڪستان جي پارليامينٽ جا ٻئي ايوان ______ ۽ ______ آهن.",
    "oSd": [
      "قومي اسيمبلي، سينيٽ",
      "قومي اسيمبلي، صوبائي اسيمبلي",
      "سينيٽ، صوبائي اسيمبلي",
      "هيٺيون ايوان، مٿيون ايوان"
    ]
  },
  {
    "t": "The President of Pakistan is the Supreme Commander of the ______.",
    "o": [
      "Armed Forces",
      "Civil Service",
      "Judiciary",
      "Parliament"
    ],
    "c": 0,
    "tSd": "پاڪستان جو صدر ______ جو سپريم ڪمانڊر آهي.",
    "oSd": [
      "هٿياربند فوج",
      "سول سروس",
      "عدليه",
      "پارليامينٽ"
    ]
  },
  {
    "t": "The Chief Justice of Pakistan is appointed by the President with the advice of the ______.",
    "o": [
      "Prime Minister",
      "Senate",
      "National Assembly",
      "Chief Election Commissioner"
    ],
    "c": 0,
    "tSd": "پاڪستان جو چيف جسٽس صدر طرفان ______ جي صلاح سان مقرر ڪيو ويندو آهي.",
    "oSd": [
      "وزيراعظم",
      "سينيٽ",
      "قومي اسيمبلي",
      "چيف اليڪشن ڪمشنر"
    ]
  },
  {
    "t": "Kautilya wrote which book of rules to run the Empire?",
    "o": [
      "Arthasastra",
      "Shastras",
      "Vedas",
      "Puranas"
    ],
    "c": 0,
    "tSd": "ڪوٽليا سلطنت هلائڻ لاءِ ضابطن جو ڪهڙو ڪتاب لکيو؟",
    "oSd": [
      "ارٿ شاستر",
      "شاستر",
      "ويد",
      "پراڻ"
    ]
  },
  {
    "t": "Ashoka renounced warfare after which war?",
    "o": [
      "Kalinga War",
      "Mahabharata War",
      "Mughal War",
      "Persian War"
    ],
    "c": 0,
    "tSd": "اشوڪ ڪهڙي جنگ بعد جنگ کان توبهه ڪئي؟",
    "oSd": [
      "ڪلنگا جنگ",
      "مهاڀارت جنگ",
      "مغل جنگ",
      "فارسي جنگ"
    ]
  },
  {
    "t": "The Mauryan Empire was divided into how many provinces?",
    "o": [
      "2",
      "3",
      "4",
      "5"
    ],
    "c": 2,
    "tSd": "موريا سلطنت ڪيتريون صوبن ۾ ورهايل هئي؟",
    "oSd": [
      "2",
      "3",
      "4",
      "5"
    ]
  },
  {
    "t": "The famous educational centers during Mauryan rule were ______, ______ And ______.",
    "o": [
      "Taxila, Ujjayini, Varanasi",
      "Pataliputra, Taxila, Gaya",
      "Varanasi, Nalanda, Taxila",
      "Ujjayini, Nalanda, Pataliputra"
    ],
    "c": 0,
    "tSd": "موريا جي حڪومت دوران مشهور تعليمي مرڪز ______، ______ ۽ ______ هئا.",
    "oSd": [
      "ٽئڪسيلا، اوجين، وارانسي",
      "پاٽلي پتر، ٽئڪسيلا، گيا",
      "وارانسي، نالنڊا، ٽئڪسيلا",
      "اوجين، نالنڊا، پاٽلي پتر"
    ]
  }
];
async function seedPakStudies() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log('✅ Connected to Neon DB for Pakistan Studies MCQs...');

  try {
    await client.query('BEGIN');

    const BATCH_SIZE = 50;
    for (let i = 0; i < pakStudiesQuestions.length; i += BATCH_SIZE) {
      const chunk = pakStudiesQuestions.slice(i, i + BATCH_SIZE);
      const values = [];
      const valueStrings = [];

      chunk.forEach((q, idx) => {
        const qNum = i + idx + 1;
        const qId = `pak-std-q-${qNum}`;
        const offset = idx * 6;
        valueStrings.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, 'Pakistan Studies', 'medium', NOW(), NOW())`);
        values.push(qId, q.t, q.tSd || q.t, q.o, q.oSd || q.o, q.c);
      });

      const sql = `
        INSERT INTO "Question" (id, "textEn", "textUr", "optionsEn", "optionsUr", "correctIndex", subject, difficulty, "createdAt", "updatedAt")
        VALUES ${valueStrings.join(', ')}
        ON CONFLICT (id) DO UPDATE SET "textEn"=EXCLUDED."textEn", "textUr"=EXCLUDED."textUr", "optionsEn"=EXCLUDED."optionsEn", "optionsUr"=EXCLUDED."optionsUr", "correctIndex"=EXCLUDED."correctIndex", subject=EXCLUDED.subject
      `;

      await client.query(sql, values);
      console.log(`  ✅ Inserted batch ${Math.floor(i / BATCH_SIZE) + 1} (${chunk.length} questions)`);
    }

    await client.query('COMMIT');
    console.log(`🎉 SUCCESS! All ${pakStudiesQuestions.length} Pakistan Studies MCQs seeded into Neon DB!`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error during seeding:', err);
  } finally {
    await client.end();
  }
}

seedPakStudies().catch(console.error);
