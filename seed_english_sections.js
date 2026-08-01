const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_wkeHO3sTxiE6@ep-rough-rice-ax0e6jfa-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

// =============================================
// SECTION 1 — 100 Questions
// =============================================
const section1Questions = [
  { text: 'Our country is spiritual country, theirs . . . . . . religious.', options: ['is', 'are', 'also', 'have'], correct: 0 },
  { text: 'Our sir teaches Mathematics . . . . . . English.', options: ['across', 'besides', 'beside', 'both'], correct: 1 },
  { text: 'Please, come . . . . . . the bathroom.', options: ['out of', 'over', 'on', 'in'], correct: 0 },
  { text: "Please, don't laugh . . . . . . those beggars.", options: ['for', 'against', 'at', 'from'], correct: 2 },
  { text: 'Please, stop . . . . . so many mistakes.', options: ['to make', 'make', 'making', 'makes'], correct: 2 },
  { text: 'She . . . . . her husband for 15 minutes.', options: ['is beating', 'has been beating', 'has been beaten', 'beats'], correct: 1 },
  { text: 'The English . . . . . English.', options: ['speak', 'spoke', 'spoken', 'is spoken'], correct: 0 },
  { text: 'The rain comes . . . . . . . the clouds.', options: ['in', 'near', 'from', 'under'], correct: 2 },
  { text: 'The ship . . . . . , Robinson arrived on the Island.', options: ['had been broken', 'having been broken', 'having broken', 'has broken'], correct: 1 },
  { text: 'The stars . . . . . counted.', options: ['can', 'can be', 'cannot be', 'must'], correct: 2 },
  { text: 'Three Idiots . . . . . really a watchable movie.', options: ['are', 'is', 'superb', 'do'], correct: 1 },
  { text: 'Chirag hardly ever cooks, . . . . . . ?', options: ["isn't he", "he doesn't", "doesn't he", 'does he'], correct: 3 },
  { text: "I don't know the city . . . . . he lives.", options: ['what', 'where', 'when', 'which'], correct: 1 },
  { text: 'He always stammers in public meetings, but his today\'s speech . . . . . . . . . .', options: ['was fairly audible to everyone.', 'was not liked by the audience.', 'was not received by the audience.', 'was surprisingly fluent.'], correct: 3 },
  { text: 'We have been in Sector: 8, Gandhinagar . . . . . . . 1997.', options: ['for', 'from', 'about', 'since'], correct: 3 },
  { text: 'Our armed forces are . . . . . . . those of any other country in the world.', options: ['Superior than', 'Superior to', 'Superior from', 'Superior of'], correct: 1 },
  { text: 'Do not cry . . . . . spilt milk.', options: ['on', 'over', 'about', 'for'], correct: 1 },
  { text: 'He deserves my thanks for . . . . . . . my purse and returned it to me without taking anything from it.', options: ['having found', 'found', 'founded', 'find'], correct: 0 },
  { text: "'The green eyed monster' means . . . . . .", options: ['hatred', 'love', 'live', 'jealousy'], correct: 3 },
  { text: 'The electricity is . . . . . . than coal.', options: ['cheap', 'to cheap', 'cheaper', 'cheapest'], correct: 2 },
  { text: 'After six months, you can also speak in English . . . . . me.', options: ['around', 'like', 'without', 'about'], correct: 1 },
  { text: 'All the winners . . . . . prizes tomorrow.', options: ['will be given', 'will given', 'will be giving', 'will have given'], correct: 0 },
  { text: 'America . . . . . . the powerful president.', options: ['have', 'has', 'is', 'does'], correct: 1 },
  { text: 'Amir Khan . . . . . new movie next year.', options: ['is release', 'will be release', 'going to release', 'will release'], correct: 3 },
  { text: 'Angel has been sending English learning videos . . . . . July 2014.', options: ['since', 'for', 'from', 'in'], correct: 0 },
  { text: 'Angel is famous . . . . . English in Jasdan.', options: ['for', 'in', 'about', 'with'], correct: 0 },
  { text: 'Before sometimes, the monkey jumped . . . . . . the river.', options: ['on', 'into', 'near', 'upon'], correct: 1 },
  { text: 'Before you gave answers, sir . . . . . them to us.', options: ['sent', 'will send', 'had sent', 'was sending'], correct: 2 },
  { text: 'Board . . . . . not . . . . . . this question in the previous exam.', options: ['did , ask', 'was , ask', 'does , ask', 'will , ask'], correct: 0 },
  { text: 'Columbus was in search . . . . . America.', options: ['for', 'of', 'about', 'under'], correct: 1 },
  { text: 'Could is the past form of . . . . . .', options: ['can', 'can be', 'cannot', 'cloud'], correct: 0 },
  { text: 'Cut this apple . . . . . . that knife.', options: ['by', 'with', 'in', 'into'], correct: 1 },
  { text: 'Do you always go to school . . . . . foot?', options: ['on', 'by', 'with', 'walking'], correct: 0 },
  { text: 'Do you think that flying an airplane is a . . . . . experience?', options: ['terrified', 'terrifying', 'terrify', 'terror'], correct: 1 },
  { text: "Don't disturb the principal. He . . . . . in his chamber.", options: ['sleeping', 'is sleeping', 'sleeps', 'slept'], correct: 1 },
  { text: 'Eagle has been flying in the sky . . . . . last week.', options: ['since', 'for', 'over', 'before'], correct: 0 },
  { text: 'Elders . . . . . . .', options: ['should respect', 'should be respect', 'should be respected', 'should have been respected'], correct: 2 },
  { text: 'English is taught . . . . . . Kishan sir to us very easily.', options: ['of', 'by', 'for', 'with'], correct: 1 },
  { text: 'English . . . . . all over the world.', options: ['speaks', 'is speak', 'is speaking', 'is spoken'], correct: 3 },
  { text: 'Girls have been teasing boys . . . . . 20 minutes.', options: ['since', 'for', 'from', 'in'], correct: 1 },
  { text: 'God has been distributing wisdom among people . . . . . . many years.', options: ['since', 'for', 'from', 'so'], correct: 1 },
  { text: 'Hanuman . . . . . . . Ram too much.', options: ['had', 'was respected', 'did respect', 'respected'], correct: 3 },
  { text: "'Have' ..... used with plurals generally.", options: ['is', 'you', 'are', 'your'], correct: 0 },
  { text: 'Have you ever . . . . . Taj Mahal?', options: ['see', 'saw', 'seen', 'have seen'], correct: 2 },
  { text: 'He . . . . . . an airplane for 10 hours.', options: ['has flown', 'is flying', 'has been flying', 'will fly'], correct: 2 },
  { text: 'The person who conducts sales at which goods are sold to the persons making the highest bid or offer is called . . . . . .', options: ['conjurer', 'bursar', 'chairman', 'auctioneer'], correct: 3 },
  { text: 'If . . . . . . I would not lose temper.', options: ['I were you', 'I was you', 'I am not you', 'I am you'], correct: 0 },
  { text: 'Imam Husian died . . . . . . a noble cause.', options: ['of', 'for', 'in', 'at'], correct: 1 },
  { text: 'A mango was . . . . . . by Manju.', options: ['eat', 'ate', 'eats', 'eaten'], correct: 3 },
  { text: 'Rohan was . . . . . . till death by the dacoits.', options: ['hanged', 'hung', 'hanging', 'hunged'], correct: 0 },
  { text: 'Early to bed and early to rise . . . . . . a man healthy, wealthy.', options: ['make', 'makes', 'shall make', 'made'], correct: 1 },
  { text: 'The letter has already . . . . . . It must have reached by now.', options: ['sent', 'been send', 'send', 'been sent'], correct: 3 },
  { text: 'One who hates woman is called . . . . . .', options: ['philanthropist', 'ascetic', 'misogamist', 'misogynist'], correct: 3 },
  { text: 'Mayank . . . . . . overtime for the last two weeks.', options: ['is working', 'has been working', 'is being working', 'does'], correct: 1 },
  { text: "Every morning I get up at 4 O' clock, but today I . . . . . . 7 o'clock.", options: ['got up', 'am getting up', 'was getting up', 'could not got up'], correct: 0 },
  { text: 'Most children . . . . . . ice-cream.', options: ['likes', 'were liking', 'like', 'are like'], correct: 2 },
  { text: '. . . . . . takes charge of a prison.', options: ['An editor', 'An optician', 'A detective', 'A warden'], correct: 3 },
  { text: "After a day's work, they slept . . . . . .", options: ['soundly', 'slowly', 'strangely', 'severely'], correct: 0 },
  { text: "He . . . . . . for you all day. He's still waiting now.", options: ['has been waiting', 'has waited', 'waited', 'had waited'], correct: 0 },
  { text: 'Heena . . . . . . to buy the new dress she wants.', options: ["doesn't have money enough", "isn't enough money", "doesn't have enough money", "don't have enough money"], correct: 2 },
  { text: 'Look at all those black clouds! It . . . . . . today.', options: ['is going to rain', 'is raining', 'will be rain', 'rains'], correct: 0 },
  { text: "'Kites' . . . . . . the plural form of kite.", options: ['is', 'are', 'have', 'do'], correct: 0 },
  { text: 'Kites . . . . . . . available in many colours and shapes.', options: ['have', 'are', 'do', 'many'], correct: 1 },
  { text: 'Kites . . . . . . by Children, adult, girls and boys in India.', options: ['are fly', 'flew', 'are flown', 'flying'], correct: 2 },
  { text: 'Kites . . . . . in future also.', options: ['fly', 'will fly', 'will be flown', 'will flying'], correct: 2 },
  { text: 'Kites . . . . . . last year also.', options: ['did fly', 'were flown', 'flew', 'flying'], correct: 1 },
  { text: 'Listen, a nice song . . . . . . .', options: ['is singing', 'has sung', 'was being sung', 'is being sung'], correct: 3 },
  { text: 'Listen, an announcement . . . . . to cancel all the flights due to heavy ice-fall.', options: ['making', 'is making', 'is made', 'is being made'], correct: 3 },
  { text: 'Listen, she is talking . . . . . . . you.', options: ['for', 'in', 'about', 'at'], correct: 2 },
  { text: 'Look, a new missile . . . . . . .', options: ['is launched', 'is launch', 'is being launch', 'is being launched'], correct: 3 },
  { text: 'Look, many students . . . . . kites.', options: ['are fly', 'are flown', 'are flying', 'are being flown'], correct: 2 },
  { text: 'Marry . . . . . . a question to Mohan yesterday.', options: ['was asked', 'asked', 'had asked', 'asking'], correct: 1 },
  { text: 'Merry . . . . . two husbands.', options: ['has', 'have', 'is', 'are'], correct: 0 },
  { text: 'Might is the past form of . . . . . .', options: ['might', 'may', 'will', 'can'], correct: 1 },
  { text: 'Monday is the first day . . . . . . . the week.', options: ['of', 'after', 'during', 'before'], correct: 0 },
  { text: 'Mr. John . . . . . in India since his wife died.', options: ['settled', 'has been settled', 'has settled', 'has been settling'], correct: 2 },
  { text: 'My father is a farmer but yours . . . . . an advocate.', options: ['is', 'are', 'do', 'does'], correct: 0 },
  { text: 'My husband has studied only . . . . . . . S.S.C.', options: ['till', 'up to', 'for', 'since'], correct: 1 },
  { text: 'My monthly income is . . . . . . . 1,000,000/- Rs.', options: ['down', 'below', 'under', 'more'], correct: 1 },
  { text: 'Neha was angry . . . . . . herself for making such a stupid mistake.', options: ['about', 'with', 'on', 'for'], correct: 1 },
  { text: 'New series . . . . . . already . . . . . .', options: ['have been , launched', 'launched', 'has been , launched', 'are launching'], correct: 2 },
  { text: 'News . . . . . good.', options: ['is', 'has', 'are', 'must'], correct: 0 },
  { text: 'No sooner . . . . . the sun . . . . . , than the birds start chirping.', options: ['did , rise', 'is , rise', 'do , rise', 'does , rise'], correct: 3 },
  { text: 'No sooner did sir enter the class, . . . . . . all the students stood up.', options: ['when', 'than', 'then', 'before'], correct: 1 },
  { text: 'Once, I have visited America. I know . . . . . cities there.', options: ['few', 'a few', 'little', 'a little'], correct: 1 },
  { text: 'One of students . . . . . absent today.', options: ['was', 'were', 'had', 'are'], correct: 0 },
  { text: '. . . . . I use your cell phone as I have forgotten mine?', options: ['May', 'Should', 'Would', 'Do'], correct: 0 },
  { text: 'Divya . . . . . Dimple if she could take her scooty.', options: ['told', 'helped', 'sent', 'asked'], correct: 3 },
  { text: 'We . . . . . . our home work just now.', options: ['are finished', 'have finished', 'had finished', 'are finishing'], correct: 1 },
  { text: 'There . . . . . many children on the playground yesterday.', options: ['are', 'were', 'did', 'playing'], correct: 1 },
  { text: "'To arrive' means . . . . . .", options: ['to go', 'to come', 'to see', 'to arrest'], correct: 1 },
  { text: 'Next week, she is going to Surat with a view to . . . . . a seminar.', options: ['will attend', 'attend', 'attends', 'attending'], correct: 3 },
  { text: 'Listen, someone . . . . . a song.', options: ['is singing', 'sings', 'singing', 'will'], correct: 0 },
  { text: 'He has killed his own father. He is in jail because of . . . . . .', options: ["father's death", 'homicide', 'suicide', 'patricide'], correct: 3 },
  { text: 'A mosquito is flying . . . . . your head.', options: ['inside', 'outside', 'over', 'on'], correct: 2 },
  { text: "Plural form of 'deer' is . . . . . . .", options: ['deer', 'deeres', 'deers', 'dear'], correct: 0 },
  { text: 'People are mad . . . . . money', options: ['over', 'after', 'in', 'with'], correct: 1 },
  { text: 'One who has no parents is called . . . . . .', options: ['orphan', 'abundant', 'lucky', 'careless'], correct: 0 },
  { text: 'This is the hotel . . . . . I had stayed last night.', options: ['which', 'that', 'where', 'costly'], correct: 2 },
  { text: 'The scientific study of the human mind and behaviour is called . . . . . .', options: ['Astrology', 'Biology', 'Pathology', 'Psychology'], correct: 3 },
];

// =============================================
// SECTION 2 — 100 Questions
// =============================================
const section2Questions = [
  { text: 'I think that sign means we . . . . . enter the building. Look, there is a security guard too.', options: ["mustn't", 'have to', 'will', "don't"], correct: 0 },
  { text: '. . . . . a wonderful picture it is!', options: ['How', 'What', 'So', 'Very'], correct: 1 },
  { text: "Don't chew panmasala, . . . . . ?", options: ['will you', 'should you', 'are you', 'never you'], correct: 0 },
  { text: '. . . . . . me, you should read English newspapers daily.', options: ['Because of', 'Inspite of', 'According to', 'Though'], correct: 2 },
  { text: "Superlative form of adjective 'popular' is . . . . .", options: ['popularity', 'popularest', 'most popular', 'the most'], correct: 2 },
  { text: 'Why do you travel by . . . . . bus?', options: ['a', 'an', 'the', 'none of the above'], correct: 3 },
  { text: "You speak so . . . . . that I can't understand properly.", options: ['fast', 'fastly', 'slow', 'nice'], correct: 0 },
  { text: 'He has taken my . . . . . car.', options: ['a', 'an', 'the', 'none of the above'], correct: 3 },
  { text: 'Shraddha is a singer. She sings . . . . . .', options: ['beautiful', 'beautifully', 'beauty', 'beautifulness'], correct: 1 },
  { text: 'We . . . . . already . . . . . our lunch when the guests arrived.', options: ['had , took', 'have , taken', 'had , taken', 'did , take'], correct: 2 },
  { text: 'The Olympic Games . . . . . every four years.', options: ['are holding', 'are held', 'are helded', 'hold'], correct: 1 },
  { text: '. . . . . . you go really? You only arrived an hour ago!', options: ['Should', 'Must', 'Can', 'How'], correct: 1 },
  { text: 'The bride was dressed . . . . . white . . . . . . head . . . . . . foot.', options: ['with , from , to', 'in , from , to', 'with , to , from', 'in , on , below'], correct: 1 },
  { text: 'My friend Ganesha, . . . . . lives in heaven, has a mouse as a vehicle.', options: ['whose', 'who', 'that', 'he'], correct: 1 },
  { text: 'You are . . . . . . a nice person . . . . . . everybody likes to be your friend.', options: ['such , as', 'such , that', 'same , as', 'so , that'], correct: 1 },
  { text: 'The truck driver . . . . . . responsible for the accident.', options: ['was holding', 'was held', 'declared', 'had'], correct: 1 },
  { text: 'Write only three answer, . . . . . . ?', options: ["don't you", "won't you", 'will you', 'do you'], correct: 2 },
  { text: 'No one can help you, . . . . . ?', options: ['can he', 'can she', 'can they', "can't you"], correct: 2 },
  { text: '. . . . . more you earn, . . . . . . more you can spend.', options: ['As , as', 'The , the', 'If , than', 'So , as'], correct: 1 },
  { text: 'No, I have never met . . . . . .', options: ['It', 'him', 'them', 'her'], correct: 1 },
  { text: '. . . . . he invited me, I would have attended his birthday party.', options: ['Hardly had', 'Had', 'Had better', 'If'], correct: 1 },
  { text: 'The athletes who . . . . . . the games are called competitors.', options: ['enter', 'entered', 'while entering', 'are'], correct: 0 },
  { text: 'When you were young, . . . . . . you climb a tree?', options: ['did', 'could', 'how', 'should'], correct: 1 },
  { text: 'They are two brothers, but . . . . . . of them is hardworking.', options: ['none', 'either', 'neither', 'every'], correct: 2 },
  { text: 'Wings of Fire . . . . . an autobiography of APJ Abdul Kalam.', options: ['are', 'is', 'has', 'was'], correct: 1 },
  { text: '. . . . . . a doctor . . . . . . in time, the patient can be saved.', options: ['Had , arrived', 'If , arrives', 'Do , arrive', 'Will , arrive'], correct: 1 },
  { text: '. . . . . . alphabets are readable in your book.', options: ['A little', 'A few', 'Much', 'How many'], correct: 1 },
  { text: '. . . . . . answers were given by you.', options: ['Much', 'Oldest', 'A little', 'A few'], correct: 3 },
  { text: '. . . . . are you doing now?', options: ['When', 'What', 'Who', 'Whose'], correct: 1 },
  { text: '. . . . . . birds, can we fly?', options: ['Before', 'Like', 'As', 'Without'], correct: 1 },
  { text: '. . . . . breakfast is in tin, go and take it.', options: ['A little', 'A few', 'Very', 'Many'], correct: 0 },
  { text: ". . . . . clever you are, you can't solve this puzzle.", options: ['Very', 'However', 'Even if', 'Since'], correct: 1 },
  { text: '. . . . . know computer operating among us.', options: ['A little', 'Jayesh', 'A few', 'One of'], correct: 2 },
  { text: '. . . . . . does sir ask a question than clever students give an answer.', options: ['When', 'Hardly had', 'As soon as', 'No sooner'], correct: 3 },
  { text: '. . . . . dogs can make friendship with cats.', options: ['Few', 'A few', 'Little', 'A little'], correct: 0 },
  { text: '. . . . . . dogs seldom bite.', options: ['Barking', 'To bark', 'Bark', 'Barked'], correct: 0 },
  { text: '. . . . . . Gandhiji . . . . . . in Rajkot?', options: ['When , studied', 'Did , study', 'Was , study', 'Does , studied'], correct: 1 },
  { text: '. . . . . . god bless you!', options: ['How', 'May be', 'May', 'When'], correct: 2 },
  { text: '. . . . . . goods were carried on the truck.', options: ['A little', 'A few', 'Many', 'Several'], correct: 2 },
  { text: '. . . . . . he complains, the police will take action.', options: ['If', 'Unless', 'When', 'No sooner did'], correct: 0 },
  { text: 'He has been seriously injured. There is . . . . . . . hope for his survival.', options: ['a little', 'a few', 'little', 'few'], correct: 2 },
  { text: '. . . . . . . I come in, sir?', options: ['Should', 'May be', 'May', 'How'], correct: 2 },
  { text: '. . . . . . I were the richest person of the world!', options: ['If', 'Unless', 'When', 'Not any'], correct: 0 },
  { text: '. . . . . . . is a very regular class, sir.', options: ['My', 'Mines', 'Your', 'Ours'], correct: 3 },
  { text: '. . . . . . . know about where the soul goes after the death.', options: ['Few', 'A few', 'Little', 'A little'], correct: 0 },
  { text: 'Have . . . . . . love for animals.', options: ['lots off', 'a little', 'a few', 'many'], correct: 1 },
  { text: 'Give me . . . . . . . mango juice.', options: ['boiled', 'a few', '500', 'a little'], correct: 3 },
  { text: 'There are . . . . . . . mangoes in a fridge. You can take any of them.', options: ['much', '12 litre', 'a little', 'a few'], correct: 3 },
  { text: 'I have . . . . . . money. I will hire a rickshaw.', options: ['a little', 'a few', 'many', '100'], correct: 0 },
  { text: '. . . . . . Nensi ever . . . . . . . you?', options: ['Has , beaten', 'Do , beats', 'Is , beaten', 'When , beats'], correct: 0 },
  { text: 'He and she . . . . . watching a movie now.', options: ['do', 'is', 'are', 'were'], correct: 2 },
  { text: "He didn't wait even . . . . . . . minutes but started a lecture.", options: ['few', 'a few', 'little', 'a little'], correct: 1 },
  { text: 'He divided his property . . . . . . . his two sons.', options: ['among', 'in', 'between', 'of'], correct: 2 },
  { text: 'He has many . . . . . . .', options: ['female friends', 'females friends', "females' friend", "female's friend"], correct: 0 },
  { text: 'He is very weak. He . . . . . . . more.', options: ['can walk', 'can be not walked', 'cannot walk', "can't"], correct: 2 },
  { text: 'He or she . . . . . . watching a movie now.', options: ['is', 'are', 'does', 'has'], correct: 0 },
  { text: 'He reminds us . . . . . . Paul Walker.', options: ['about', 'of', 'for', 'with'], correct: 1 },
  { text: 'How . . . . . you . . . . . . this puzzle?', options: ['can , solved', 'can be , solved', 'do , solved', 'can , solve'], correct: 3 },
  { text: 'How many friends . . . . . . she . . . . . ?', options: ['do , have', 'does , has', 'does , have', 'are , has'], correct: 2 },
  { text: 'How many kites . . . . . . in the sky now ?', options: ['are fly', 'flying', 'are flying', 'have'], correct: 2 },
  { text: 'I . . . . . always capital.', options: ['am', 'is', 'has', 'do'], correct: 1 },
  { text: 'I . . . . . . English now.', options: ['can speak', 'can be speak', 'can speaking', 'am speak'], correct: 0 },
  { text: 'I . . . . . . English online since July, 2014.', options: ['am teaching', 'have taught', 'have been teaching', 'teaching'], correct: 2 },
  { text: 'I am also your friend. Would you invite me . . . . . . your birthday celebration?', options: ['on', 'over', 'in', 'for'], correct: 3 },
  { text: 'I am in . . . . . . hostel now.', options: ["boy's", "boys's", 'boys', "boys'"], correct: 3 },
  { text: 'I had to walk 5 km yesterday as I had . . . . . rupees for fare.', options: ['few', 'a few', 'little', 'a little'], correct: 0 },
  { text: 'I have yet . . . . . . options to solve this question. I never lose hope.', options: ['few', 'a few', 'little', 'a little'], correct: 1 },
  { text: 'I would not allow you to enter . . . . . . . showing me a pass.', options: ['without', 'for', 'about', 'before'], correct: 0 },
  { text: 'I . . . . . . you yesterday.', options: ['was met', 'did met', 'meted', 'met'], correct: 3 },
  { text: "If Bianca hadn't argued, Raghubhai . . . . . . the case.", options: ['lost', 'had lost', 'would lose', 'would have lost'], correct: 3 },
  { text: "If I . . . . . . a lot of money, I wouldn't work anymore.", options: ['were', 'have', 'had', 'has'], correct: 2 },
  { text: 'If you have . . . . . . good friends in life, life is worth living.', options: ['few', 'a few', 'little', 'a little'], correct: 1 },
  { text: 'In olden days, doves . . . . . messages.', options: ['take', 'took', 'taken', 'had took'], correct: 1 },
  { text: 'Kishan sir is very much fond . . . . . . teaching English.', options: ['between', 'from', 'of', 'for'], correct: 2 },
  { text: 'Kishan sir . . . . . 100 books to South Africa yesterday.', options: ['was sent', 'were sent', 'sented', 'sent'], correct: 3 },
  { text: 'He was accustomed . . . . . . chewing Tulsi leaves even when he delivered the lecture.', options: ['of', 'about', 'at', 'to'], correct: 3 },
  { text: 'Kalidas is . . . . . . Shakespeare of India.', options: ['a', 'an', 'the', 'none of the above'], correct: 2 },
  { text: 'No sooner did I open the door . . . . . . the cat ran away.', options: ['as', 'when', 'than', 'so that'], correct: 2 },
  { text: 'Tell me . . . . . . you have put my hat.', options: ['which', 'what', 'where', 'whom'], correct: 2 },
  { text: 'That child died . . . . . . heavy fever.', options: ['at', 'with', 'of', 'from'], correct: 2 },
  { text: 'My mother asked me when . . . . . . have a glass of milk.', options: ['I will', 'I shall', 'I would', 'Would I'], correct: 2 },
  { text: 'To grease the palm means . . . . . . .', options: ['To smooth', 'To bribe', 'To win', 'To make up mind'], correct: 1 },
  { text: '. . . . . . you ever . . . . . . . Manali?', options: ['Have , visited', 'Had , visited', 'Did , visit', 'Will , be visiting'], correct: 0 },
  { text: "In my busy office schedule, I haven't got . . . . . . . time for playing.", options: ['no', 'much', 'little', 'few'], correct: 1 },
  { text: 'It . . . . . . heavily, so I will take an umbrella with me.', options: ['was raining', 'is raining', 'has rained', 'rained'], correct: 1 },
  { text: 'Human nature . . . . . . . from person to person.', options: ['vary', 'very', 'varies', 'veries'], correct: 2 },
  { text: "He . . . . . . . his fingers by interfering in his neighbour's affairs.", options: ['burnt', 'cut', 'pressed', 'hurt'], correct: 0 },
  { text: 'I wish I . . . . . . . a millionaire.', options: ['am', 'are', 'was', 'were'], correct: 3 },
  { text: 'Both the friends were idle . . . . . . of them stood up to answer.', options: ['Neither', 'Either', 'Each', 'All'], correct: 0 },
  { text: 'He is . . . . . . union leader.', options: ['a', 'an', 'the', 'article not required'], correct: 0 },
  { text: 'It is shady . . . . . . the tree.', options: ['below', 'beneath', 'under', 'none of three'], correct: 2 },
  { text: 'Kumar is . . . . . . B.A. of the M.S. University.', options: ['an', 'a', 'the', 'few'], correct: 1 },
  { text: 'At present, she is not going . . . . . . . library.', options: ['to', 'at', 'on', 'up'], correct: 0 },
  { text: 'Walk fast . . . . . . . you will miss the bus.', options: ['but', 'and', 'otherwise', 'so'], correct: 2 },
  { text: 'My parents . . . . . . . at 5:30 a.m daily.', options: ['got-up', 'get up', 'gets up', 'is get up'], correct: 1 },
  { text: 'Tomorrow my bicycle . . . . . . . by anyone.', options: ['is stoles', 'stolen', 'was stolen', 'will be stolen'], correct: 3 },
  { text: 'Where . . . . . . . they . . . . . . tomorrow?', options: ['shall , go', 'will , go', 'do , go', 'did , go'], correct: 1 },
  { text: '". . . . . . . boys are there?" "there are two boys."', options: ['How much', 'How many', 'Why', 'Which'], correct: 1 },
  { text: 'What time did you arrive . . . . . . . the station?', options: ['in', 'by', 'on', 'at'], correct: 3 },
  { text: '. . . . . . honest Indian soldiers are, a few can be bribed.', options: ['Though', 'As', 'However', 'If'], correct: 2 },
];

// =============================================
// SECTION 3 — 100 Questions
// =============================================
const section3Questions = [
  { text: 'China has . . . . . . people than Canada.', options: ['few', 'fewer', 'some', 'more'], correct: 3 },
  { text: 'The explosion that . . . . . . the bus killed twelve people.', options: ['wrecked', 'deflated', 'stalled', 'hindered'], correct: 0 },
  { text: "Opposite of 'Professional' is . . . . . . .", options: ['Amateur', 'Tradesman', 'Labour', 'Customer'], correct: 0 },
  { text: 'Sachin did not play so . . . . . . . as Saurav did.', options: ['well', 'good', 'better', 'best'], correct: 0 },
  { text: "The abstract noun of 'young' is . . . . . . . . . .", options: ['Youngster', 'Youth', 'Younger', 'Younker'], correct: 1 },
  { text: 'Traffic . . . . . . . by the school boys now.', options: ['is being controlled', 'is controlled', 'is controlling', 'controlled'], correct: 0 },
  { text: '. . . . . . . off the light, I went to bed.', options: ['Before', 'Switched', 'Having switched', 'Switching'], correct: 2 },
  { text: 'They are . . . . . . brothers but neither of them takes care of their parents.', options: ['two', 'few', 'many', 'some'], correct: 0 },
  { text: 'Very . . . . . . rivers in India are as long as the Narmada.', options: ['little', 'few', 'most other', 'many'], correct: 1 },
  { text: 'He has lost . . . . . . rupees in gambling. Now, he lives like a beggar.', options: ['a little', 'a few', 'a some', 'All'], correct: 3 },
  { text: '. . . . . . . Salman had married in time, his kids would have been adult till now.', options: ['If', 'Unless', 'When', 'Hardly'], correct: 0 },
  { text: '. . . . . . she . . . . . . away yesterday?', options: ['Why , ran', 'Did , run', 'Where , running', 'Was , run'], correct: 1 },
  { text: ". . . . . . sir asks a question, even we won't answer.", options: ['Hardly', 'If', 'Unless', 'When'], correct: 1 },
  { text: '. . . . . water was in a jug so a crow survived.', options: ['A little', 'A few', 'Many', 'Little'], correct: 0 },
  { text: '. . . . . we . . . . . without water?', options: ['Can , living', 'Can , live', 'Can , be', 'Can be , lived'], correct: 1 },
  { text: '. . . . . . we do exercise, we will remain healthy.', options: ['More', 'If', 'Unless', 'When'], correct: 1 },
  { text: '. . . . . . whom do the people work and earn?', options: ['In', 'For', 'Around', 'Why'], correct: 1 },
  { text: '. . . . . . work has been done yet. What about remaining work?', options: ['A little', 'A few', 'Much', 'Most of'], correct: 0 },
  { text: '. . . . . . you . . . . . . your kids?', options: ['Do , love', 'How , loving', 'How much , loved', 'Are , love'], correct: 0 },
  { text: ". . . . . . 'you' a noun or a pronoun?", options: ['Do', 'Have', 'Are', 'Is'], correct: 3 },
  { text: '. . . . . . you read, you cannot pass.', options: ['If', 'Till', 'Unless', 'When'], correct: 2 },
  { text: '. . . . . . you were the creator of the world!', options: ['If', 'Unless', 'When', 'Did'], correct: 0 },
  { text: ". . . . . . . you . . . . . . 'English in Ten days' in the morning?", options: ['Did , got', 'Will , get', 'Do , get', 'Did , get'], correct: 3 },
  { text: '. . . . . . . you . . . . . . up the form for next exam?', options: ['How , fill', 'Did , filled', 'Will , fill', 'When , will'], correct: 2 },
  { text: '. . . . . . you . . . . . . long!', options: ['May , live', 'Can , live', 'May be , live', 'How , lived'], correct: 0 },
  { text: '10,000 visitors . . . . . . a website last week.', options: ['were visit', 'did visit', 'visited', 'visitted'], correct: 2 },
  { text: '400 videos . . . . . . already . . . . . . by Angel for English on YouTube.', options: ['are , uploaded', 'have , uploaded', 'are been , uploaded', 'have been , uploaded'], correct: 3 },
  { text: '5,000 students had appeared in the exam . . . . . . . . students could get through.', options: ['few', 'a few', 'little', 'a little'], correct: 1 },
  { text: 'A festival of kites . . . . . very famous in India.', options: ['has', 'is', 'are', 'does'], correct: 1 },
  { text: 'A monkey . . . . . . a long tail.', options: ['have', 'does', 'has', 'is'], correct: 2 },
  { text: 'A policeman asked a girl what . . . . . . name was.', options: ['she', 'hers', 'herself', 'her'], correct: 3 },
  { text: 'No, I do not have the details (ready at hand), but you can look it up on the internet.', options: ['in my shoes', 'behind the scenes', 'at my door steps', 'at my fingertips'], correct: 3 },
  { text: 'Susan sits . . . . . . . the tree.', options: ['under', 'up', 'her', 'she'], correct: 0 },
  { text: 'Mrs Smith is not pleased . . . . . . the new servant.', options: ['with', 'of', 'at', 'on'], correct: 0 },
  { text: 'The police made him . . . . . . his crime.', options: ['confess', 'confessed', 'confesses', 'to confess'], correct: 0 },
  { text: 'You and I are doing our work, . . . . . . . ?', options: ["aren't we", "aren't you", 'are we', "aren't I"], correct: 0 },
  { text: 'Shraddha . . . . . . . since afternoon.', options: ['was working', 'works', 'is working', 'has been working'], correct: 3 },
  { text: '. . . . . . . the girls was selected for national scholarship.', options: ['Some of', 'All of', 'One of', 'Many of'], correct: 2 },
  { text: 'A life history of a person written by himself is . . . . . . . .', options: ['biography', 'autobiography', 'geography', 'biolife'], correct: 1 },
  { text: 'If she had worked hard, she . . . . . . in the election.', options: ['will elect', 'will be elected', 'would have been elected', 'would have elected'], correct: 2 },
  { text: 'The teacher made the naughty boy . . . . . . . .', options: ['Tiptoed', 'Tipoeing', 'Tiptoe', 'To tiptoes'], correct: 2 },
  { text: 'There . . . . . a lot of people at our party yesterday.', options: ['were', 'was', 'am', 'is'], correct: 0 },
  { text: '. . . . . . you read, the more you will learn.', options: ['The Most', 'The more', 'The lesser', 'The less'], correct: 1 },
  { text: "Don't go too . . . . . . the edge.", options: ['up', 'on', 'with', 'near'], correct: 3 },
  { text: '. . . . . . . I was tired I managed to finish the work.', options: ['Although', 'But', 'Yet', 'Still'], correct: 0 },
  { text: 'Neither of the biscuits you gave me . . . . . . chocolate chips.', options: ['is contain', 'are contained', 'contain', 'contains'], correct: 3 },
  { text: '. . . . . . . to the White Rann of Kuchch recently?', options: ['Have you been', 'Are you ever', 'Have you ever', 'Did you ever have'], correct: 0 },
  { text: 'Kaushikbhai . . . . . . . . a grain merchant.', options: ['am', 'is', 'are', 'were'], correct: 1 },
  { text: 'A blacksmith uses . . . . . . .', options: ['drill', 'plane', 'trowel', 'bellows'], correct: 3 },
  { text: 'What . . . . . . . the girls playing at noon yesterday?', options: ['was', 'were', 'had', 'had being'], correct: 1 },
  { text: 'The two brothers generally wear . . . . . . clothes.', options: ['their', "one another's", 'each other', "each other's"], correct: 3 },
  { text: 'He just cannot sleep. He spent . . . . . . lying awake in the bed.', options: ['all of the night', 'all night', 'hole night', 'whole night'], correct: 1 },
  { text: 'The cat jumped . . . . . . the table.', options: ['over', 'above', 'on', 'upon'], correct: 3 },
  { text: "Opposite of 'Stale' in meaning is . . . . . . .", options: ['Fresh', 'Old', 'Steal', 'Stalk'], correct: 0 },
  { text: '". . . . . . . feels thirsty? " "Jiya."', options: ['Who', 'Whose', 'Which', 'Where'], correct: 0 },
  { text: 'I put . . . . . . . . my hat when I come home.', options: ['to', 'with', 'up', 'off'], correct: 3 },
  { text: 'Why . . . . . . . going to the party?', options: ["didn't David", "isn't David", 'David not', "David isn't"], correct: 1 },
  { text: 'Follow the principle, "Do it . . . . . . . . ."', options: ['himself', 'yourself', 'themselves', 'myself'], correct: 1 },
  { text: '. . . . . . . . did the family members go yesterday?', options: ['Why', 'Where', 'When', 'Whose'], correct: 1 },
  { text: '. . . . . . . a telephone call, the driver turned up for extra duty.', options: ['having got', 'being got', 'having been got', 'had got'], correct: 0 },
  { text: 'You . . . . . . . permission of your parents before taking this important decision.', options: ['should have taked', 'should have taken', 'should took', 'should have took'], correct: 1 },
  { text: 'The dog is playing with . . . . . . . tail.', options: ['it', 'his', 'her', 'its'], correct: 3 },
  { text: 'Mr. Bajpai spoke in . . . . . . . . a way that all were surprised.', options: ['the same', 'which', 'such', 'none'], correct: 2 },
  { text: 'The husband and wife stood . . . . . . . each other as they shook hands with the guests.', options: ['beside', 'with', 'at', 'besides'], correct: 0 },
  { text: 'Do you think David Beckham is . . . . . . . English football player?', options: ['best', 'as best', 'better', 'the best'], correct: 3 },
  { text: 'Would you . . . . . . . the window?', options: ['close', 'to close', 'closed', 'closing'], correct: 0 },
  { text: '. . . . . . . . sun shines very brightly in summer.', options: ['An', 'A', 'The', 'That'], correct: 2 },
  { text: 'People . . . . . . . not . . . . . . time.', options: ['do , have', 'are , have', 'have , many', 'are , much'], correct: 0 },
  { text: 'Dhirubhai went to America . . . . . . earning money.', options: ['with a view to', 'for', 'in order that', 'in order to'], correct: 0 },
  { text: 'Yesterday, the terrorists made the captives . . . . . . . in a queue and then shot them dead.', options: ['to stand', 'standing', 'stand', 'stood'], correct: 2 },
  { text: 'He is richer than . . . . . . . am.', options: ['me', 'her', 'him', 'I'], correct: 3 },
  { text: 'We saw him . . . . . . a tree yesterday.', options: ['cutting', 'cut', 'to cut', 'was cutting'], correct: 0 },
  { text: 'This is the doctor . . . . . . wife is suffering from cancer.', options: ['his', 'whose', 'whom', 'a'], correct: 1 },
  { text: '. . . . . . Sagar Samrat is . . . . . . big ship.', options: ['A , a', 'A , the', 'The , a', 'The , the'], correct: 2 },
  { text: 'I have never gone to Japan. I know . . . . . . . people there.', options: ['few', 'a few', 'many', 'most of'], correct: 0 },
  { text: 'I am a doctor . . . . . . . my wife is a nurse.', options: ['when', 'while', 'so', 'because'], correct: 1 },
  { text: 'Divya . . . . . . since she arrived.', options: ['talks', 'talking', 'is talking', 'has been talking.'], correct: 3 },
  { text: 'I am a good orator, . . . . . . ?', options: ["don't you", "don't I", "aren't I", "aren't you"], correct: 2 },
  { text: 'Ajay and Kajol are husband and wife. They both love . . . . . . . .', options: ['for each other', 'made for each other', 'each other', 'in each other'], correct: 2 },
  { text: 'Does she . . . . . . . get up early and cook for family at this old age?', options: ['have to', 'has to', 'is', 'had'], correct: 0 },
  { text: "I don't agree . . . . . . . your proposal.", options: ['with', 'for', 'to', 'in'], correct: 2 },
  { text: '. . . . . . . . it stopped raining when we started our journey.', options: ['As soon as', 'Hardly had', 'No sooner did', 'Nevertheless'], correct: 1 },
  { text: 'Run fast . . . . . . . . get your ticket.', options: ['but', 'as', 'otherwise', 'and'], correct: 3 },
  { text: 'She did not sing so . . . . . . . . as her friend.', options: ['good', 'better', 'best', 'well'], correct: 3 },
  { text: 'The prime Minister dedicated . . . . . . . INS Vikramaditya to the nation.', options: ['a', 'the', 'an', 'none'], correct: 1 },
  { text: 'Shall I not . . . . . . . by you?', options: ['help', 'being helped', 'be helped', 'None of the above'], correct: 2 },
  { text: 'Do you know the . . . . . . . of your religion?', options: ['prinsipal', 'principal', 'prinsiple', 'principle'], correct: 3 },
  { text: 'The driver . . . . . . . . not control the bus, therefore the accident took place.', options: ['could', 'had', 'would', 'can'], correct: 0 },
  { text: '. . . . . . . . we go, the thinner the air becomes.', options: ['The longer', 'The high', 'The deeper', 'The higher'], correct: 3 },
  { text: 'There is a fence . . . . . . . the pool.', options: ['on', 'at', 'in', 'around'], correct: 3 },
  { text: 'My uncle died . . . . . . . the war.', options: ['during', 'with', 'at', 'for'], correct: 0 },
  { text: 'How nicely the vegetables . . . . . . . in that shop!', options: ['arranging', 'were arranged', 'arranged', 'arrange'], correct: 1 },
  { text: 'How . . . . . . . your last question paper . . . . . . . ?', options: ['did , attempt', 'is , attempted', 'had , attempted', 'was , attempted'], correct: 3 },
  { text: 'Attempts are necessary for success, . . . . . . . ?', options: ['are they', "aren't it", 'are it', "aren't they"], correct: 3 },
  { text: 'The person . . . . . . . talks too much is seldom respected.', options: ['whom', 'who', 'whose', 'None of above'], correct: 1 },
  { text: 'By the end of summer, you . . . . . . . your higher secondary examination.', options: ['will pass', 'will be passed', 'will be passing', 'will have passed'], correct: 3 },
  { text: 'Where . . . . . . . your books?', options: ['are', 'is', 'was', 'am'], correct: 0 },
  { text: 'I want to learn French language from the person . . . . . . . is experienced.', options: ['what', 'which', 'who', 'all the three'], correct: 2 },
  { text: "The phrase 'to gulp down' means . . . . . . .", options: ['to swallow eagerly', 'to eat fast', 'to move quickly', 'to jump over'], correct: 0 },
  { text: 'Only the brave . . . . . . . the fair.', options: ['deserving', 'deserves', 'deserve', 'none'], correct: 2 },
];

async function seedEnglishSections() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log('Connected. Starting English Grammar Sections 1-3 seed...\n');

  const allSections = [
    {
      num: 1,
      questions: section1Questions,
      quizId: 'english-grammar-section-1',
      subject: 'English Grammar Section 1',
      title: 'English Grammar MCQs — Section 1 (Q1–Q100)',
      titleUr: 'انگریزی گرامر — حصہ 1',
    },
    {
      num: 2,
      questions: section2Questions,
      quizId: 'english-grammar-section-2',
      subject: 'English Grammar Section 2',
      title: 'English Grammar MCQs — Section 2 (Q101–Q200)',
      titleUr: 'انگریزی گرامر — حصہ 2',
    },
    {
      num: 3,
      questions: section3Questions,
      quizId: 'english-grammar-section-3',
      subject: 'English Grammar Section 3',
      title: 'English Grammar MCQs — Section 3 (Q201–Q300)',
      titleUr: 'انگریزی گرامر — حصہ 3',
    },
  ];

  try {
    await client.query('BEGIN');

    for (const section of allSections) {
      console.log(`📚 Seeding Section ${section.num} (${section.questions.length} questions)...`);
      const insertedIds = [];

      for (let i = 0; i < section.questions.length; i++) {
        const q = section.questions[i];
        const qId = `eng-sec${section.num}-q-${String(i + 1).padStart(3, '0')}`;
        insertedIds.push(qId);

        await client.query(
          `INSERT INTO "Question" (id, "textEn", "textUr", "optionsEn", "optionsUr", "correctIndex", subject, difficulty, "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, 'medium', NOW(), NOW())
           ON CONFLICT (id) DO UPDATE SET
             "textEn" = EXCLUDED."textEn",
             "optionsEn" = EXCLUDED."optionsEn",
             "correctIndex" = EXCLUDED."correctIndex",
             subject = EXCLUDED.subject,
             "updatedAt" = NOW()`,
          [qId, q.text, q.text, q.options, q.options, q.correct, section.subject]
        );
      }

      await client.query(
        `INSERT INTO "Quiz" (id, "titleEn", "titleUr", subject, "timeLimitMinutes", "passPercentage", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, 60, 50, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           "titleEn" = EXCLUDED."titleEn",
           "titleUr" = EXCLUDED."titleUr",
           subject = EXCLUDED.subject,
           "updatedAt" = NOW()`,
        [section.quizId, section.title, section.titleUr, section.subject]
      );

      for (const qId of insertedIds) {
        await client.query(
          `INSERT INTO "_QuizQuestions" ("A", "B") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [qId, section.quizId]
        );
      }

      console.log(`  ✅ Section ${section.num}: ${insertedIds.length} questions inserted.\n`);
    }

    await client.query('COMMIT');
    console.log('🎉 All 3 English Grammar sections seeded successfully!');
    console.log('   Section 1 subject: "English Grammar Section 1"');
    console.log('   Section 2 subject: "English Grammar Section 2"');
    console.log('   Section 3 subject: "English Grammar Section 3"');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', err.message);
    throw err;
  } finally {
    await client.end();
  }
}

seedEnglishSections().catch(console.error);
