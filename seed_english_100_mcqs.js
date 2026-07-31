const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_wkeHO3sTxiE6@ep-rough-rice-ax0e6jfa-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

const questionsData = [
  // SECTION 1: PARTS OF SPEECH (1 to 20)
  { text: 'In the sentence "The dog barked loudly," what part of speech is "loudly"?', options: ['Adverb', 'Noun', 'Verb', 'Adjective'], correct: 0 },
  { text: 'Identify the part of speech of "beautiful" in: "She wore a beautiful dress."', options: ['Noun', 'Adjective', 'Verb', 'Adverb'], correct: 1 },
  { text: 'In "They quickly ran to the station," what part of speech is "quickly"?', options: ['Adjective', 'Noun', 'Adverb', 'Verb'], correct: 2 },
  { text: 'What part of speech is "and" in: "Ali and Sara went to the market"?', options: ['Preposition', 'Pronoun', 'Adverb', 'Conjunction'], correct: 3 },
  { text: 'In "She sat under the table," what part of speech is "under"?', options: ['Adverb', 'Preposition', 'Conjunction', 'Noun'], correct: 1 },
  { text: 'Identify the part of speech of "he" in: "He is a good teacher."', options: ['Noun', 'Adjective', 'Pronoun', 'Verb'], correct: 2 },
  { text: 'In "Wow! That was amazing," what part of speech is "Wow"?', options: ['Adverb', 'Noun', 'Verb', 'Interjection'], correct: 3 },
  { text: 'What part of speech is "teacher" in: "The teacher explained the lesson"?', options: ['Noun', 'Verb', 'Adjective', 'Pronoun'], correct: 0 },
  { text: 'In "She writes neatly," what part of speech is "writes"?', options: ['Noun', 'Adjective', 'Verb', 'Adverb'], correct: 2 },
  { text: 'Identify the part of speech of "three" in: "I have three books."', options: ['Noun', 'Pronoun', 'Verb', 'Adjective'], correct: 3 },
  { text: 'In "He is very tall," what part of speech is "very"?', options: ['Adverb', 'Adjective', 'Noun', 'Preposition'], correct: 0 },
  { text: 'What part of speech is "but" in: "He is poor but honest"?', options: ['Preposition', 'Conjunction', 'Pronoun', 'Adverb'], correct: 1 },
  { text: 'In "The book is on the table," what part of speech is "on"?', options: ['Adverb', 'Verb', 'Noun', 'Preposition'], correct: 3 },
  { text: 'Identify the part of speech of "quickly" in: "She finished the work quickly."', options: ['Adverb', 'Verb', 'Noun', 'Adjective'], correct: 0 },
  { text: 'In "This is my pen," what part of speech is "my"?', options: ['Pronoun', 'Adjective', 'Noun', 'Verb'], correct: 1 },
  { text: 'What part of speech is "happiness" in: "Happiness is important in life"?', options: ['Adjective', 'Verb', 'Noun', 'Adverb'], correct: 2 },
  { text: 'In "She sings well," what part of speech is "well"?', options: ['Adverb', 'Adjective', 'Noun', 'Verb'], correct: 0 },
  { text: 'Identify the part of speech of "run" in: "I run every morning."', options: ['Noun', 'Adjective', 'Adverb', 'Verb'], correct: 3 },
  { text: 'In "He arrived before noon," what part of speech is "before"?', options: ['Conjunction', 'Adverb', 'Preposition', 'Pronoun'], correct: 2 },
  { text: 'What part of speech is "the" in: "The sun rises in the east"?', options: ['Noun', 'Article/Determiner', 'Pronoun', 'Verb'], correct: 1 },

  // SECTION 2: SYNONYMS (21 to 40)
  { text: 'Choose the synonym of "Happy":', options: ['Sad', 'Joyful', 'Angry', 'Tired'], correct: 1 },
  { text: 'Choose the synonym of "Big":', options: ['Tiny', 'Short', 'Narrow', 'Large'], correct: 3 },
  { text: 'Choose the synonym of "Begin":', options: ['Start', 'End', 'Stop', 'Finish'], correct: 0 },
  { text: 'Choose the synonym of "Brave":', options: ['Coward', 'Fearful', 'Courageous', 'Weak'], correct: 2 },
  { text: 'Choose the synonym of "Rapid":', options: ['Slow', 'Fast', 'Late', 'Calm'], correct: 1 },
  { text: 'Choose the synonym of "Ancient":', options: ['Modern', 'New', 'Young', 'Old'], correct: 3 },
  { text: 'Choose the synonym of "Difficult":', options: ['Easy', 'Simple', 'Hard', 'Clear'], correct: 2 },
  { text: 'Choose the synonym of "Generous":', options: ['Unselfish', 'Selfish', 'Miserly', 'Cruel'], correct: 0 },
  { text: 'Choose the synonym of "Enormous":', options: ['Tiny', 'Small', 'Little', 'Huge'], correct: 3 },
  { text: 'Choose the synonym of "Genuine":', options: ['Fake', 'Real', 'False', 'Artificial'], correct: 1 },
  { text: 'Choose the synonym of "Assist":', options: ['Hinder', 'Block', 'Help', 'Oppose'], correct: 2 },
  { text: 'Choose the synonym of "Abundant":', options: ['Plentiful', 'Scarce', 'Rare', 'Limited'], correct: 0 },
  { text: 'Choose the synonym of "Courage":', options: ['Fear', 'Weakness', 'Doubt', 'Bravery'], correct: 3 },
  { text: 'Choose the synonym of "Diligent":', options: ['Lazy', 'Hardworking', 'Careless', 'Slow'], correct: 1 },
  { text: 'Choose the synonym of "Fragile":', options: ['Delicate', 'Strong', 'Sturdy', 'Solid'], correct: 0 },
  { text: 'Choose the synonym of "Honest":', options: ['Dishonest', 'Deceptive', 'Truthful', 'Corrupt'], correct: 2 },
  { text: 'Choose the synonym of "Intelligent":', options: ['Foolish', 'Dull', 'Ignorant', 'Smart'], correct: 3 },
  { text: 'Choose the synonym of "Joyful":', options: ['Sorrowful', 'Cheerful', 'Gloomy', 'Miserable'], correct: 1 },
  { text: 'Choose the synonym of "Kind":', options: ['Cruel', 'Rude', 'Gentle', 'Harsh'], correct: 2 },
  { text: 'Choose the synonym of "Vacant":', options: ['Empty', 'Full', 'Occupied', 'Crowded'], correct: 0 },

  // SECTION 3: ANTONYMS (41 to 60)
  { text: 'Choose the antonym of "Happy":', options: ['Joyful', 'Glad', 'Sad', 'Pleased'], correct: 2 },
  { text: 'Choose the antonym of "Big":', options: ['Small', 'Large', 'Huge', 'Enormous'], correct: 0 },
  { text: 'Choose the antonym of "Begin":', options: ['Start', 'Commence', 'Initiate', 'End'], correct: 3 },
  { text: 'Choose the antonym of "Brave":', options: ['Courageous', 'Cowardly', 'Bold', 'Fearless'], correct: 1 },
  { text: 'Choose the antonym of "Rapid":', options: ['Quick', 'Slow', 'Fast', 'Swift'], correct: 1 },
  { text: 'Choose the antonym of "Ancient":', options: ['Old', 'Aged', 'Antique', 'Modern'], correct: 3 },
  { text: 'Choose the antonym of "Difficult":', options: ['Easy', 'Hard', 'Tough', 'Complex'], correct: 0 },
  { text: 'Choose the antonym of "Generous":', options: ['Kind', 'Charitable', 'Stingy', 'Giving'], correct: 2 },
  { text: 'Choose the antonym of "Enormous":', options: ['Huge', 'Massive', 'Vast', 'Tiny'], correct: 3 },
  { text: 'Choose the antonym of "Genuine":', options: ['Real', 'True', 'Fake', 'Authentic'], correct: 2 },
  { text: 'Choose the antonym of "Assist":', options: ['Help', 'Hinder', 'Support', 'Aid'], correct: 1 },
  { text: 'Choose the antonym of "Abundant":', options: ['Scarce', 'Plentiful', 'Ample', 'Rich'], correct: 0 },
  { text: 'Choose the antonym of "Courage":', options: ['Fear', 'Bravery', 'Valor', 'Boldness'], correct: 0 },
  { text: 'Choose the antonym of "Diligent":', options: ['Hardworking', 'Lazy', 'Careful', 'Attentive'], correct: 1 },
  { text: 'Choose the antonym of "Fragile":', options: ['Delicate', 'Weak', 'Sturdy', 'Brittle'], correct: 2 },
  { text: 'Choose the antonym of "Honest":', options: ['Truthful', 'Sincere', 'Fair', 'Dishonest'], correct: 3 },
  { text: 'Choose the antonym of "Intelligent":', options: ['Smart', 'Foolish', 'Clever', 'Wise'], correct: 1 },
  { text: 'Choose the antonym of "Joyful":', options: ['Sorrowful', 'Cheerful', 'Happy', 'Glad'], correct: 0 },
  { text: 'Choose the antonym of "Kind":', options: ['Gentle', 'Caring', 'Friendly', 'Cruel'], correct: 3 },
  { text: 'Choose the antonym of "Vacant":', options: ['Empty', 'Hollow', 'Occupied', 'Free'], correct: 2 },

  // SECTION 4: ERROR DETECTION (61 to 80)
  { text: 'Identify the part of the sentence that has an error: "He don\'t know how to solve this math problem."', options: ['He don\'t know', 'how to solve', 'this math', 'problem.'], correct: 0 },
  { text: 'Identify the part of the sentence that has an error: "The news about the accident were very shocking today."', options: ['The news about', 'the accident', 'were very', 'shocking today.'], correct: 2 },
  { text: 'Identify the part of the sentence that has an error: "For many years, she have worked at this school with dedication."', options: ['For many years,', 'she have worked', 'at this school', 'with dedication.'], correct: 1 },
  { text: 'Identify the part of the sentence that has an error: "His opinion on this issue is completely different than mine."', options: ['His opinion', 'on this issue', 'is completely', 'different than mine.'], correct: 3 },
  { text: 'Identify the part of the sentence that has an error: "One of my friends are going to Lahore next week for a wedding."', options: ['One of my friends are going', 'to Lahore', 'next week', 'for a wedding.'], correct: 0 },
  { text: 'Identify the part of the sentence that has an error: "I heard that your cousin recently got married with a doctor."', options: ['I heard', 'that your cousin', 'recently got', 'married with a doctor.'], correct: 3 },
  { text: 'Identify the part of the sentence that has an error: "My uncle moved to Karachi since five years for work."', options: ['My uncle moved', 'to Karachi', 'since five years', 'for work.'], correct: 2 },
  { text: 'Identify the part of the sentence that has an error: "This term, a number of students has failed the final examination badly."', options: ['This term,', 'a number of students has failed', 'the final', 'examination badly.'], correct: 1 },
  { text: 'Identify the part of the sentence that has an error: "Ahmed has worked here for ten years and is much senior than me."', options: ['Ahmed has worked here', 'for ten years', 'and is much', 'senior than me.'], correct: 3 },
  { text: 'Identify the part of the sentence that has an error: "The number of students are increasing in government schools across the country every year."', options: ['The number of students are increasing', 'in government schools', 'across the country', 'every year.'], correct: 0 },
  { text: 'Identify the part of the sentence that has an error: "In our office, everyone know about the new leave policy already."', options: ['In our office,', 'everyone know about', 'the new leave', 'policy already.'], correct: 1 },
  { text: 'Identify the part of the sentence that has an error: "When we asked for help, neither Ali nor his brothers was willing to assist us."', options: ['When we asked for help,', 'neither Ali nor his brothers', 'was willing', 'to assist us.'], correct: 2 },
  { text: 'Identify the part of the sentence that has an error: "Last month, the principal, along with several teachers, were planning a new curriculum."', options: ['Last month,', 'the principal,', 'along with several teachers,', 'were planning a new curriculum.'], correct: 3 },
  { text: 'Identify the part of the sentence that has an error: "During the meeting, I am agree with most of what you proposed."', options: ['During the meeting,', 'I am agree with', 'most of what', 'you proposed.'], correct: 1 },
  { text: 'Identify the part of the sentence that has an error: "Please explain me the reason for the delay in submitting your report."', options: ['Please explain me the reason', 'for the delay', 'in submitting', 'your report.'], correct: 0 },
  { text: 'Identify the part of the sentence that has an error: "The roads were completely blocked due to heavy rain, but despite of these problems, we still reached on time."', options: ['The roads were completely blocked', 'due to heavy rain,', 'but despite of these problems,', 'we still reached on time.'], correct: 2 },
  { text: 'Identify the part of the sentence that has an error: "In today\'s meeting, we were discussing about the new policy for almost an hour."', options: ['In today\'s meeting,', 'we were discussing about', 'the new policy', 'for almost an hour.'], correct: 1 },
  { text: 'Identify the part of the sentence that has an error: "For this position, the company wants someone who has many experience in teaching."', options: ['For this position,', 'the company wants', 'someone who has', 'many experience in teaching.'], correct: 3 },
  { text: 'Identify the part of the sentence that has an error: "Bilal is one of the students who always arrives early to school every day."', options: ['Bilal is', 'one of the students', 'who always arrives', 'early to school every day.'], correct: 2 },
  { text: 'Identify the part of the sentence that has an error: "Each of the boys have finished their homework before going out to play football."', options: ['Each of the boys have finished', 'their homework', 'before going out', 'to play football.'], correct: 0 },

  // SECTION 5: PARAGRAPH READING & COMPREHENSION (81 to 100)
  { text: 'Read the passage: "Trees play a vital role in maintaining the balance of nature. They provide oxygen, absorb harmful gases, and offer shelter to countless birds and animals. Deforestation has become a serious concern..." Question: What is the main idea of the passage?', options: ['Trees are useless in cities', 'Birds do not need trees', 'Trees help maintain ecological balance', 'Deforestation is beneficial'], correct: 2 },
  { text: 'Read the passage: "Trees play a vital role in maintaining the balance of nature... Deforestation has become a serious concern..." Question: According to the passage, what has become a serious concern?', options: ['Deforestation', 'Overpopulation', 'Air travel', 'Urban housing'], correct: 0 },
  { text: 'Read the passage: "Trees play a vital role... Deforestation has become a serious concern, prompting governments to launch large-scale tree plantation drives..." Question: What can be inferred about governments\' response to deforestation?', options: ['They are ignoring it', 'They are cutting more trees', 'They have no plan', 'They are launching plantation drives'], correct: 3 },
  { text: 'Read the passage: "Trees play a vital role in maintaining the balance of nature..." Question: The word "vital" is closest in meaning to:', options: ['Unimportant', 'Essential', 'Optional', 'Rare'], correct: 1 },
  { text: 'Read the passage: "Trees play a vital role in maintaining the balance of nature..." Question: What would be the best title for this passage?', options: ['The Importance of Trees', 'The History of Deforestation', 'Birds and Their Habitats', 'Government Policies'], correct: 0 },
  { text: 'Read the passage: "Success in life largely depends on how well a person manages time. Those who plan their daily tasks are usually able to achieve their goals..." Question: What is the main idea of the passage?', options: ['Idle activities are helpful', 'Planning is unnecessary', 'Time management leads to success', 'Goals are impossible to achieve'], correct: 2 },
  { text: 'Read the passage: "Success in life largely depends on how well a person manages time... people who waste time in idle activities often struggle..." Question: According to the passage, who struggles to complete tasks on time?', options: ['People who plan carefully', 'People who waste time in idle activities', 'People who follow a routine', 'People who work efficiently'], correct: 1 },
  { text: 'Read the passage: "Success in life largely depends on how well a person manages time..." Question: What can be inferred from the passage?', options: ['A routine has no effect on success', 'Success has nothing to do with time', 'Idle activities improve efficiency', 'A daily routine can help achieve goals'], correct: 3 },
  { text: 'Read the passage: "Success in life largely depends... achieve their goals more efficiently..." Question: The word "efficiently" is closest in meaning to:', options: ['Slowly', 'Effectively', 'Poorly', 'Rarely'], correct: 1 },
  { text: 'Read the passage: "Success in life largely depends on how well a person manages time..." Question: What would be the best title for this passage?', options: ['The History of Clocks', 'Idle Activities', 'Struggling Students', 'The Value of Time Management'], correct: 3 },
  { text: 'Read the passage: "Water is one of the most precious natural resources, yet millions of people still lack access to clean drinking water..." Question: What is the main idea of the passage?', options: ['Water is unlimited', 'Industries do not waste water', 'Water conservation is important', 'Clean water is available to everyone'], correct: 2 },
  { text: 'Read the passage: "Water is one of the most precious natural resources... Wasteful use of water in homes and industries has worsened the shortage..." Question: According to the passage, what has worsened the water shortage?', options: ['Wasteful use of water', 'Fixing leaking taps', 'Reusing water', 'Government policies'], correct: 0 },
  { text: 'Read the passage: "Water is one of the most precious natural resources... Experts stress that simple habits can make a noticeable difference..." Question: What can be inferred about the experts mentioned?', options: ['They believe small habits do not matter', 'They oppose water conservation', 'They think shortage cannot be solved', 'They believe simple habits can help conserve water'], correct: 3 },
  { text: 'Read the passage: "Water is one of the most precious natural resources..." Question: The word "precious" is closest in meaning to:', options: ['Worthless', 'Valuable', 'Common', 'Harmful'], correct: 1 },
  { text: 'Read the passage: "Water is one of the most precious natural resources..." Question: What would be the best title for this passage?', options: ['The Importance of Saving Water', 'Industrial Growth', 'Leaking Taps', 'Access to Electricity'], correct: 0 },
  { text: 'Read the passage: "Reading books broadens a person\'s knowledge and improves their ability to think critically... Educationists believe schools and libraries must work together..." Question: What is the main idea of the passage?', options: ['Digital entertainment should be banned', 'Libraries are no longer useful', 'Reading habits among youth need encouragement', 'Students read too many books'], correct: 2 },
  { text: 'Read the passage: "Reading books broadens a person\'s knowledge... with the rise of digital entertainment, many young people are reading fewer books..." Question: According to the passage, what has caused a decline in reading among young people?', options: ['The rise of digital entertainment', 'Lack of libraries', 'Too many schools', 'Expensive books'], correct: 0 },
  { text: 'Read the passage: "Reading books broadens a person\'s knowledge... Educationists believe schools and libraries must work together..." Question: What can be inferred about educationists\' view?', options: ['They think reading is unimportant', 'They believe digital media is more valuable', 'They want schools and libraries to promote reading', 'They are against libraries'], correct: 2 },
  { text: 'Read the passage: "Reading books broadens a person\'s knowledge and improves their ability to think critically..." Question: The word "critically" is closest in meaning to:', options: ['Carelessly', 'Randomly', 'Slowly', 'Analytically'], correct: 3 },
  { text: 'Read the passage: "Reading books broadens a person\'s knowledge and improves their ability to think critically..." Question: What would be the best title for this passage?', options: ['The Decline of Libraries', 'Encouraging a Reading Culture', 'Digital Entertainment Trends', 'School Curriculums'], correct: 1 }
];

async function seed100EnglishMCQs() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log('Connected to Neon for fast single-transaction bulk insertion of 100 English MCQs...');

  try {
    await client.query('BEGIN');

    const insertedIds = [];
    for (let i = 0; i < questionsData.length; i++) {
      const q = questionsData[i];
      const qId = `eng-100-q-${i + 1}`;
      insertedIds.push(qId);

      await client.query(`
        INSERT INTO "Question" (id, "textEn", "textUr", "optionsEn", "optionsUr", "correctIndex", subject, difficulty, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, 'English Grammar & Composition', 'medium', NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET "textEn" = EXCLUDED."textEn", "optionsEn" = EXCLUDED."optionsEn", "correctIndex" = EXCLUDED."correctIndex"
      `, [qId, q.text, q.text, q.options, q.options, q.correct]);
    }

    const quizId = 'english-grammar-100-master-quiz';
    await client.query(`
      INSERT INTO "Quiz" (id, "titleEn", "titleUr", subject, "timeLimitMinutes", "passPercentage", "createdAt", "updatedAt")
      VALUES ($1, '100 English Grammar & Composition Master Quiz (Parts of Speech, Synonyms, Antonyms, Error Detection & Reading Comprehension)', '100 انگریزی گرامر و کمپوزیشن ماسٹر کوئز', 'English Grammar & Composition', 60, 50, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET "titleEn" = EXCLUDED."titleEn"
    `, [quizId]);

    for (const qId of insertedIds) {
      await client.query(`
        INSERT INTO "_QuizQuestions" ("A", "B")
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
      `, [qId, quizId]);
    }

    await client.query('COMMIT');
    console.log(`🎉 SUCCESS! Seeded all ${insertedIds.length} English MCQs & Quiz into Neon PostgreSQL DB!`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error during transaction:', err);
  } finally {
    await client.end();
  }
}

seed100EnglishMCQs().catch(console.error);
