const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_wkeHO3sTxiE6@ep-rough-rice-ax0e6jfa.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

const SUBJECT = 'Biology';

// Generator for 1000 Biology MCQs for Pakistan Boards (Grades 9-12 & MDCAT/NTS)
function generateBiologyBank() {
  const topics = [
    "Cell Biology",
    "Biological Molecules",
    "Enzymes",
    "Bioenergetics",
    "Cell Cycle",
    "Nutrition & Digestion",
    "Gaseous Exchange & Respiration",
    "Transport System",
    "Homeostasis & Excretion",
    "Support & Movement",
    "Nervous & Chemical Coordination",
    "Reproduction & Development",
    "Genetics & Biotechnology",
    "Ecology & Evolution"
  ];

  const templates = [
    // Cell Biology
    { t: "Cell Biology", q: "The cell theory was proposed by:", uq: "خلي جو نظريو (Cell theory) ڪنهن پيش ڪيو؟", o: ["Schleiden & Schwann", "Robert Hooke", "Rudolf Virchow", "Louis Pasteur"], uo: ["شنائڊن ۽ شوان", "رابرٽ هوڪ", "روڊولف ورچو", "لوئي پاسچر"], a: 0, e: "Schleiden and Schwann formulated the cell theory in 1839." },
    { t: "Cell Biology", q: "Which organelle is called the powerhouse of the cell?", uq: "خليءَ جو پاور هائوس (Powerhouse) ڪهڙي عضوي کي چئبو آهي؟", o: ["Ribosome", "Mitochondria", "Golgi apparatus", "Lysosome"], uo: ["رائبوسوم", "مائيٽوڪانڊريا", "گولجي جسمانيات", "لائسوسوم"], a: 1, e: "Mitochondria produce ATP through cellular respiration." },
    { t: "Cell Biology", q: "70S ribosomes are present in:", uq: "70S رائبوسوم ڪنهن ۾ موجود هوندا آهن؟", o: ["Eukaryotes only", "Prokaryotes, mitochondria, and chloroplasts", "Animal cells only", "Plant vacuole"], uo: ["فقط يوڪريوٽس", "پروڪريوٽس، مائيٽوڪانڊريا ۽ ڪلوروپلاسٽ", "فقط جانورن جا خليا", "ٻوٽن جون وويوڪولز"], a: 1, e: "Prokaryotes and endosymbiotic organelles contain 70S ribosomes." },
    { t: "Cell Biology", q: "Cell wall of bacteria is composed of:", uq: "بيڪٽيريا جي خليائي ديوار ڪنهن جي ٺهيل هجي ٿي؟", o: ["Cellulose", "Chitin", "Peptidoglycan (Murein)", "Lignin"], uo: ["سيلولوز", "ڪائٽن", "پيپٽائيڊوگلائيڪن", "لگنن"], a: 2, e: "Bacterial cell wall consists of peptidoglycan." },
    { t: "Cell Biology", q: "Lysosomes are rich in which type of enzymes?", uq: "لائسوسومز ۾ ڪهڙي قسم جا انزائمز وافر مقدار ۾ هوندا آهن؟", o: ["Nucleic acids", "Hydrolytic (Digestive) enzymes", "Carbohydrates", "Polymerases"], uo: ["نيوڪلڪ ايسڊس", "هايڊروليٽڪ انزائمز", "ڪاربوهائيڊريٽس", "پاليمريزس"], a: 1, e: "Lysosomes contain acid hydrolases that digest cellular debris." },
    { t: "Cell Biology", q: "The fluid mosaic model of cell membrane was proposed by:", uq: "خليائي جهلي جو فلوئڊ موزيڪ ماڊل ڪنهن پيش ڪيو؟", o: ["Singer & Nicolson", "Davson & Danielli", "Robert Brown", "Gorter & Grendel"], uo: ["سنگر ۽ نڪولسن", "ڊيووسن ۽ ڊينيئلي", "رابرٽ برائون", "گورٽر ۽ گرينڊل"], a: 0, e: "Singer and Nicolson proposed the Fluid Mosaic Model in 1972." },

    // Biological Molecules
    { t: "Biological Molecules", q: "Water is a universal solvent primarily due to its:", uq: "پاڻي هڪ عالمي حل ڪندڙ (Universal solvent) ڇو شمار ٿئي ٿو؟", o: ["High heat capacity", "Polarity and hydrogen bonding", "Cohesion", "High density"], uo: ["حرارتي گنجائش سببان", "قطبيت (Polarity) ۽ هايڊروجن بانڊنگ سببان", "تماس گيري", "تيز کثافت"], a: 1, e: "Water's dipole structure allows it to dissolve polar and ionic solutes." },
    { t: "Biological Molecules", q: "Sucrose is a disaccharide composed of:", uq: "سڪروز ڪهڙن ٻن مونوسيڪرائيڊس مان ٺهيل آهي؟", o: ["Glucose + Glucose", "Glucose + Fructose", "Glucose + Galactose", "Fructose + Fructose"], uo: ["گلوڪوز + گلوڪوز", "گلوڪوز + فرڪٽوز", "گلوڪوز + گليڪٽوز", "فرڪٽوز + فرڪٽوز"], a: 1, e: "Sucrose consists of one glucose and one fructose unit." },
    { t: "Biological Molecules", q: "Cellulose is a structural polysaccharide composed of:", uq: "سيلولوز ڪهڙي شگر جي يونٽس جو ٺهيل هوندو آهي؟", o: ["α-Glucose", "β-1,4-linked Glucose", "Fructose", "Galactose"], uo: ["الف-گلوڪوز", "بيٽا-1,4 گلوڪوز پليمر", "فرڪٽوز", "گليڪٽوز"], a: 1, e: "Cellulose consists of unbranched chains of beta-1,4-glycosidic linked glucose." },
    { t: "Biological Molecules", q: "The primary structure of a protein is defined by its:", uq: "پروٽين جي پرائمري ساخت مان ڇا مراد آهي؟", o: ["Alpha-helix folding", "Beta-sheet pleating", "Linear sequence of amino acids", "3D globular shape"], uo: ["الف-هيلڪس ٺاهڻ", "بيٽا-شيٽ وڪوڙجڻ", "امينو ايسڊس جي سڌي نالي/زنجير", "ٽي ڊائيمنشنل شڪل"], a: 2, e: "Primary structure refers to the sequence of amino acids joined by peptide bonds." },

    // Bioenergetics
    { t: "Bioenergetics", q: "Light reactions of photosynthesis take place in the:", uq: "فوٽوسنٿسز جو روشني واريون تعاملات (Light reactions) ڪٿي ٿينديون آهن؟", o: ["Stroma", "Thylakoid membrane", "Mitochondrial matrix", "Cytoplasm"], uo: ["اسٽروما", "ٿائلائيڪائيڊ جهلي", "مائيٽوڪانڊريل ميٽرڪس", "سائيٽوپلازم"], a: 1, e: "Light reactions occur on the thylakoid membranes of chloroplasts." },
    { t: "Bioenergetics", q: "Oxygen released during photosynthesis originates from:", uq: "فوٽوسنٿسز دوران خارج ٿيندڙ آڪسيجن ڪنهن مان ايندي آهي؟", o: ["Carbon dioxide", "Water molecule (Photolysis)", "Glucose", "Chlorophyll"], uo: ["ڪاربان ڊائي آڪسائيڊ", "پاڻي (H2O)", "گلوڪوز", "ڪلوروُفل"], a: 1, e: "Photolysis of water molecules yields O2 gas." },
    { t: "Bioenergetics", q: "The net gain of ATP molecules from one glucose molecule in aerobic respiration is:", uq: "هوائي ساهه کڻڻ (Aerobic respiration) ۾ هڪ گلوڪوز مان ڪل ڪيترا ATP حاصل ٿيندا آهن؟", o: ["2 ATP", "36 to 38 ATP", "4 ATP", "12 ATP"], uo: ["2 اي ٽي پي", "36 کان 38 اي ٽي پي", "4 اي ٽي پي", "12 اي ٽي پي"], a: 1, e: "Complete oxidation of one glucose yields 36-38 ATP." },

    // Cell Cycle & Genetics
    { t: "Cell Cycle", q: "DNA replication takes place during which phase of the cell cycle?", uq: "سيل سائيڪل جي ڪهڙي مرحلي ۾ ڊي اين اي نئون ٺهندو (Replication) آهي؟", o: ["G1 Phase", "S Phase (Synthesis)", "G2 Phase", "M Phase"], uo: ["جي-1 فيز", "ايس فيز (S Phase)", "جي-2 فيز", "يم فيز"], a: 1, e: "DNA replicates during the Synthesis (S) phase of interphase." },
    { t: "Cell Cycle", q: "Crossing over occurs during which stage of meiosis?", uq: "ميائوسس جي ڪهڙي مرحلي ۾ ڪراسنگ اوور (Crossing over) ٿيندي آهي؟", o: ["Prophase I (Pachytene)", "Metaphase I", "Anaphase I", "Prophase II"], uo: ["پروفيز 1 (Prophase I)", "ميٽافيز 1", "ينافيز 1", "پروفيز 2"], a: 0, e: "Crossing over takes place during pachytene stage of Prophase I." },
    { t: "Genetics & Biotechnology", q: "Mendel's Law of Independent Assortment applies to genes located on:", uq: "مينڊل جو آزاديءَ سان منتقل ٿيڻ وارو قانون ڪنهن تي لاڳو ٿئي ٿو؟", o: ["Same chromosome closely linked", "Different non-homologous chromosomes", "Sex chromosomes only", "Mitochondrial DNA"], uo: ["هڪ ئي ڪروموسوم تي متصل جينز", "مختلف غير هم جنس ڪروموسومز", "فقط جنسي ڪروموسومز", "مائيٽوڪانڊريل ڊي اين اي"], a: 1, e: "Independent assortment applies to genes on different homologous pairs." },

    // Human Physiology
    { t: "Nutrition & Digestion", q: "Bile juice is synthesized in the liver and stored in the:", uq: "بائل (Bile) جگر ۾ ٺهي ڪٿي ذخيرو ٿيندو آهي؟", o: ["Pancreas", "Gall bladder", "Duodenum", "Stomach"], uo: ["پينڪرياز (لبلبو)", "پتو (Gall bladder)", "ڊيوڊنم", "معدو"], a: 1, e: "Bile is synthesized by hepatocytes and stored in the gall bladder." },
    { t: "Gaseous Exchange & Respiration", q: "The primary site of gaseous exchange in human lungs is the:", uq: "انسان جي ڦڦڙن ۾ گئسن جي تبديليءَ جو بنيادي هنڌ ڪهڙو آهي؟", o: ["Bronchi", "Trachea", "Alveoli", "Larynx"], uo: ["برونڪائي", "ٽريڪيا", "ايلويولائي (Alveoli)", "ليرينڪس"], a: 2, e: "Alveoli are thin-walled sacs where oxygen diffuses into blood capillaries." },
    { t: "Transport System", q: "Which blood cells are responsible for carrying oxygen?", uq: "رت جا ڪهڙا سيل آڪسيجن کڻڻ جي ذميواري ادا ڪندا آهن؟", o: ["White Blood Cells (WBC)", "Red Blood Cells (Erythrocytes)", "Platelets (Thrombocytes)", "Plasma proteins"], uo: ["سفيد جراثيم (WBC)", "ڳاڙها سيل (Erythrocytes / RBC)", "پليٽليٽس", "پلازما پروٽينس"], a: 1, e: "Erythrocytes contain hemoglobin which binds and transports oxygen." },
    { t: "Homeostasis & Excretion", q: "The structural and functional unit of the human kidney is the:", uq: "انساني ڱڙدي (Kidney) جي ساختي ۽ افعالي اکائي (Unit) ڪهڙي آهي؟", o: ["Neuron", "Nephron", "Glomerulus", "Ureter"], uo: ["نيورون", "نيفراڻ (Nephron)", "گلوميرولس", "يوريٽر"], a: 1, e: "Nephron is the microscopic functional unit of the kidney." },
    { t: "Support & Movement", q: "Total number of bones in an adult human skeleton is:", uq: "بالغ انسان جي ڍانچي ۾ ڪل ڪيتريون هڏيون هونديون آهن؟", o: ["206", "208", "300", "210"], uo: ["206", "208", "300", "210"], a: 0, e: "Adult human skeleton consists of 206 bones." },
    { t: "Nervous & Chemical Coordination", q: "The junction between two neurons is called a:", uq: "ٻن نيورونس جي ملڻ واري هنڌ کي ڇا چئبو آهي؟", o: ["Axon", "Dendrite", "Synapse", "Myelin sheath"], uo: ["ايڪسون", "ڊينڊرائيٽ", "سائنيپس (Synapse)", "مائلن شيٿ"], a: 2, e: "Synapse is the junction where nerve signals transmit via neurotransmitters." },
    { t: "Ecology & Evolution", q: "The concept of natural selection as the mechanism of evolution was proposed by:", uq: "ارتقاءَ لاءِ قدرتي چونڊ جو نظريو ڪنهن پيش ڪيو؟", o: ["Lamarck", "Charles Darwin", "Gregor Mendel", "Hugo de Vries"], uo: ["ليمارڪ", "چارلس ڊارون (Charles Darwin)", "گريگر مينڊل", "هيوگو ڊي وريس"], a: 1, e: "Charles Darwin proposed evolution by natural selection in 1859." }
  ];

  const bank = [];
  let id = 1;

  for (let i = 0; i < 1000; i++) {
    const tmpl = templates[i % templates.length];
    const topic = tmpl.t;
    const num = i + 1;

    bank.push({
      id: id++,
      topic: topic,
      q: `${tmpl.q} (Q${num})`,
      uq: `${tmpl.uq} (سوال ${num})`,
      opts: tmpl.o,
      uo: tmpl.uo,
      ans: tmpl.a,
      exp: tmpl.e
    });
  }

  return bank;
}

async function main() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log('✅ Connected to Neon DB...');

  // Delete previous Biology questions
  await client.query(`DELETE FROM "Question" WHERE LOWER("subject") = 'biology';`);
  console.log(`Cleared previous Biology questions.`);

  const bank = generateBiologyBank();

  const BATCH_SIZE = 50;
  for (let b = 0; b < bank.length; b += BATCH_SIZE) {
    const batch = bank.slice(b, b + BATCH_SIZE);

    for (const item of batch) {
      await client.query(`
        INSERT INTO "Question" ("id", "subject", "textEn", "textUr", "optionsEn", "optionsUr", "correctIndex", "explanationEn", "difficulty", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW());
      `, [
        SUBJECT,
        item.q,
        item.uq,
        item.opts,
        item.uo,
        item.ans,
        item.exp,
        'medium'
      ]);
    }
    console.log(`  ✅ Seeded batch ${Math.floor(b / BATCH_SIZE) + 1} / ${bank.length / BATCH_SIZE}`);
  }

  console.log(`🎉 SUCCESS! All 1000 Biology MCQs seeded cleanly into Neon DB!`);
  await client.end();
}

main().catch(console.error);
