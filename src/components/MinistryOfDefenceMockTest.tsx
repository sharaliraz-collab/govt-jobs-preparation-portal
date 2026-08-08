'use client';

import React, { useState, useEffect, useRef } from 'react';
import ShareButtons from '@/components/ShareButtons';
import { absoluteUrl } from '@/lib/seo';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Printer,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';

export interface MODQuestion {
  id: number;
  section: string;
  q: string;
  opts: string[];
  ans: number;
}

const MOD_QUESTIONS: MODQuestion[] = [
  // Section A: English (1–20)
  { id: 1, section: 'English', q: 'Synonym of "Abrogate" is:', opts: ['Enact', 'Abolish', 'Cherish', 'Provoke'], ans: 1 },
  { id: 2, section: 'English', q: 'Antonym of "Benevolent" is:', opts: ['Malevolent', 'Kind', 'Generous', 'Friendly'], ans: 0 },
  { id: 3, section: 'English', q: 'He is afraid ___ dogs.', opts: ['from', 'of', 'with', 'by'], ans: 1 },
  { id: 4, section: 'English', q: 'Identify the error: "Each of the students have completed their homework."', opts: ['Each of the students', 'have completed', 'their homework', 'No error'], ans: 1 },
  { id: 5, section: 'English', q: 'The idiom "To spill the beans" means:', opts: ['To make a mess', 'To reveal a secret', 'To waste food', 'To be angry'], ans: 1 },
  { id: 6, section: 'English', q: 'Synonym of "Meticulous" is:', opts: ['Careless', 'Thorough', 'Quick', 'Lazy'], ans: 1 },
  { id: 7, section: 'English', q: 'She is senior ___ me.', opts: ['than', 'to', 'from', 'with'], ans: 1 },
  { id: 8, section: 'English', q: 'Change into passive voice: "The teacher praised the student."', opts: ['The student is praised by the teacher', 'The student was praised by the teacher', 'The student praised the teacher', 'The student has been praised'], ans: 1 },
  { id: 9, section: 'English', q: 'Synonym of "Prudent" is:', opts: ['Reckless', 'Wise', 'Foolish', 'Careless'], ans: 1 },
  { id: 10, section: 'English', q: 'Antonym of "Obstinate" is:', opts: ['Stubborn', 'Flexible', 'Adamant', 'Rigid'], ans: 1 },
  { id: 11, section: 'English', q: 'Choose the correct spelling:', opts: ['Accomodate', 'Accommodate', 'Acommodate', 'Accomodate'], ans: 1 },
  { id: 12, section: 'English', q: 'He is ___ honest man.', opts: ['a', 'an', 'the', 'no article'], ans: 1 },
  { id: 13, section: 'English', q: 'The idiom "A white elephant" means:', opts: ['A rare animal', 'A costly but useless possession', 'A holy thing', 'An intelligent person'], ans: 1 },
  { id: 14, section: 'English', q: 'Synonym of "Ephemeral" is:', opts: ['Eternal', 'Short-lived', 'Permanent', 'Durable'], ans: 1 },
  { id: 15, section: 'English', q: 'One word substitution: A person who knows everything –', opts: ['Omniscient', 'Omnipotent', 'Omnipresent', 'Gullible'], ans: 0 },
  { id: 16, section: 'English', q: 'Change the narration: He said, "I am busy."', opts: ['He said that he was busy', 'He said that I am busy', 'He said that he is busy', 'He said I was busy'], ans: 0 },
  { id: 17, section: 'English', q: 'Antonym of "Vivacious" is:', opts: ['Lively', 'Dull', 'Cheerful', 'Animated'], ans: 1 },
  { id: 18, section: 'English', q: 'He was accused ___ theft.', opts: ['for', 'of', 'with', 'to'], ans: 1 },
  { id: 19, section: 'English', q: 'Choose the correct sentence:', opts: ['He is more wiser than his brother.', 'He is wiser than his brother.', 'He is more wise than his brother.', 'He is wiser then his brother.'], ans: 1 },
  { id: 20, section: 'English', q: 'The phrase "To bury the hatchet" means:', opts: ['To hide the weapon', 'To make peace', 'To start a fight', 'To dig a grave'], ans: 1 },

  // Section B: Pakistan Studies (21–40)
  { id: 21, section: 'Pakistan Studies', q: 'The current President of Pakistan (as of 2026) is:', opts: ['Arif Alvi', 'Asif Ali Zardari', 'Mamnoon Hussain', 'Pervez Musharraf'], ans: 1 },
  { id: 22, section: 'Pakistan Studies', q: 'The Lahore Resolution was passed in:', opts: ['1930', '1940', '1947', '1956'], ans: 1 },
  { id: 23, section: 'Pakistan Studies', q: "The length of Pakistan's coastline is approximately:", opts: ['700 km', '1046 km', '1200 km', '850 km'], ans: 1 },
  { id: 24, section: 'Pakistan Studies', q: 'The largest province of Pakistan by area is:', opts: ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan'], ans: 3 },
  { id: 25, section: 'Pakistan Studies', q: 'The Indus Water Treaty was signed in:', opts: ['1960', '1955', '1971', '1948'], ans: 0 },
  { id: 26, section: 'Pakistan Studies', q: 'The first Prime Minister of Pakistan was:', opts: ['Liaquat Ali Khan', 'Muhammad Ali Bogra', 'Khawaja Nazimuddin', 'Huseyn Shaheed Suhrawardy'], ans: 0 },
  { id: 27, section: 'Pakistan Studies', q: "The music of Pakistan's national anthem was composed by:", opts: ['Hafeez Jullundhri', 'Ahmed Ghulamali Chagla', 'Allama Iqbal', 'Abdur Rab Nishtar'], ans: 1 },
  { id: 28, section: 'Pakistan Studies', q: 'The Objective Resolution was passed in:', opts: ['1947', '1949', '1956', '1962'], ans: 1 },
  { id: 29, section: 'Pakistan Studies', q: "Pakistan's first constitution was enforced in:", opts: ['1956', '1962', '1973', '1947'], ans: 0 },
  { id: 30, section: 'Pakistan Studies', q: 'The boundary line between Pakistan and Afghanistan is called:', opts: ['Durand Line', 'Radcliffe Line', 'McMahon Line', 'Line of Control'], ans: 0 },
  { id: 31, section: 'Pakistan Studies', q: 'The Siachen Glacier is located in which mountain range?', opts: ['Himalayas', 'Karakoram', 'Hindu Kush', 'Pamir'], ans: 1 },
  { id: 32, section: 'Pakistan Studies', q: 'Who is known as the "Father of the Nation" in Pakistan?', opts: ['Allama Iqbal', 'Quaid-e-Azam Muhammad Ali Jinnah', 'Liaquat Ali Khan', 'Sir Syed Ahmed Khan'], ans: 1 },
  { id: 33, section: 'Pakistan Studies', q: 'The Simla Agreement was signed in:', opts: ['1971', '1972', '1973', '1974'], ans: 1 },
  { id: 34, section: 'Pakistan Studies', q: 'The largest artificial lake in Pakistan is:', opts: ['Tarbela Dam reservoir', 'Mangla Dam reservoir', 'Keenjhar Lake', 'Haleji Lake'], ans: 0 },
  { id: 35, section: 'Pakistan Studies', q: 'Shalimar Gardens are located in:', opts: ['Peshawar', 'Lahore', 'Multan', 'Islamabad'], ans: 1 },
  { id: 36, section: 'Pakistan Studies', q: 'The current Chief of Army Staff (as of 2026) is:', opts: ['General Qamar Javed Bajwa', 'General Asim Munir', 'General Raheel Sharif', 'General Ashfaq Parvez Kayani'], ans: 1 },
  { id: 37, section: 'Pakistan Studies', q: 'Kashmir Day is observed on:', opts: ['5 February', '23 March', '14 August', '1 May'], ans: 0 },
  { id: 38, section: 'Pakistan Studies', q: 'Which pass connects Pakistan with China?', opts: ['Khyber Pass', 'Bolan Pass', 'Khunjerab Pass', 'Gomal Pass'], ans: 2 },
  { id: 39, section: 'Pakistan Studies', q: 'The Pakistan Resolution was presented by:', opts: ['Allama Iqbal', 'A.K. Fazlul Huq', 'Choudhary Rahmat Ali', 'Liaquat Ali Khan'], ans: 1 },
  { id: 40, section: 'Pakistan Studies', q: 'The highest peak of Pakistan is:', opts: ['Nanga Parbat', 'K2 (Mount Godwin-Austen)', 'Rakaposhi', 'Tirich Mir'], ans: 1 },

  // Section C: Islamiat (41–55)
  { id: 41, section: 'Islamiat', q: 'The first revelation was revealed in the cave of:', opts: ['Saur', 'Hira', 'Thawr', 'Uhud'], ans: 1 },
  { id: 42, section: 'Islamiat', q: 'The total number of Surahs in the Holy Quran is:', opts: ['112', '114', '116', '118'], ans: 1 },
  { id: 43, section: 'Islamiat', q: 'The literal meaning of "Islam" is:', opts: ['Peace', 'Submission', 'Love', 'Obedience'], ans: 1 },
  { id: 44, section: 'Islamiat', q: 'The Battle of Badr was fought in:', opts: ['1 AH', '2 AH', '3 AH', '4 AH'], ans: 1 },
  { id: 45, section: 'Islamiat', q: 'Which prophet is known as "Khalilullah" (Friend of Allah)?', opts: ['Musa (AS)', 'Ibrahim (AS)', 'Isa (AS)', 'Muhammad (SAW)'], ans: 1 },
  { id: 46, section: 'Islamiat', q: 'The minimum amount of wealth on which Zakat is obligatory is called:', opts: ['Ushr', 'Khums', 'Nisab', 'Jizya'], ans: 2 },
  { id: 47, section: 'Islamiat', q: 'The book revealed to Hazrat Dawood (AS) is:', opts: ['Torah', 'Zabur', 'Injil', 'Quran'], ans: 1 },
  { id: 48, section: 'Islamiat', q: 'The total number of rakats in Isha prayer (including Sunnah and Witr) is:', opts: ['17', '13', '15', '19'], ans: 0 },
  { id: 49, section: 'Islamiat', q: 'The Treaty of Hudaibiya was signed in:', opts: ['5 AH', '6 AH', '7 AH', '8 AH'], ans: 1 },
  { id: 50, section: 'Islamiat', q: 'Which companion is known as "As-Siddiq"?', opts: ['Hazrat Umar (RA)', 'Hazrat Uthman (RA)', 'Hazrat Ali (RA)', 'Hazrat Abu Bakr (RA)'], ans: 3 },
  { id: 51, section: 'Islamiat', q: 'Hajj is obligatory on Muslims:', opts: ['Once in a lifetime', 'Twice in a lifetime', 'Every year', 'Every five years'], ans: 0 },
  { id: 52, section: 'Islamiat', q: 'The second primary source of Islamic law after the Quran is:', opts: ['Ijma', 'Qiyas', 'Hadith/Sunnah', 'Fiqh'], ans: 2 },
  { id: 53, section: 'Islamiat', q: 'The first martyr in Islam was:', opts: ['Hazrat Hamza (RA)', 'Hazrat Sumayyah (RA)', 'Hazrat Bilal (RA)', 'Hazrat Yasir (RA)'], ans: 1 },
  { id: 54, section: 'Islamiat', q: 'The Holy Quran was revealed over a period of:', opts: ['21 years', '23 years', '25 years', '27 years'], ans: 1 },
  { id: 55, section: 'Islamiat', q: 'Lailat-ul-Qadr (the Night of Power) is better than:', opts: ['One year', 'Thousand months', 'One month', 'Hundred months'], ans: 1 },

  // Section D: General Knowledge / Current Affairs (56–70)
  { id: 56, section: 'GK / Current Affairs', q: 'The headquarters of the United Nations is in:', opts: ['Geneva', 'New York', 'Vienna', 'Paris'], ans: 1 },
  { id: 57, section: 'GK / Current Affairs', q: 'The largest ocean in the world is:', opts: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], ans: 3 },
  { id: 58, section: 'GK / Current Affairs', q: 'The currency of Saudi Arabia is:', opts: ['Dinar', 'Riyal', 'Dirham', 'Rial'], ans: 1 },
  { id: 59, section: 'GK / Current Affairs', q: 'The number of member states in the European Union (after Brexit) is:', opts: ['27', '28', '25', '30'], ans: 0 },
  { id: 60, section: 'GK / Current Affairs', q: 'Magna Carta was signed in:', opts: ['1215', '1066', '1492', '1648'], ans: 0 },
  { id: 61, section: 'GK / Current Affairs', q: "The world's tallest building (as of 2026) is:", opts: ['Burj Khalifa', 'Shanghai Tower', 'Merdeka 118', 'One World Trade Center'], ans: 0 },
  { id: 62, section: 'GK / Current Affairs', q: 'The Nobel Peace Prize is awarded in:', opts: ['Stockholm', 'Oslo', 'Copenhagen', 'Helsinki'], ans: 1 },
  { id: 63, section: 'GK / Current Affairs', q: 'Amnesty International works for:', opts: ['Environmental protection', 'Human rights', 'Animal welfare', 'Disarmament'], ans: 1 },
  { id: 64, section: 'GK / Current Affairs', q: 'The largest desert in the world is:', opts: ['Sahara', 'Gobi', 'Antarctic Desert', 'Arabian Desert'], ans: 2 },
  { id: 65, section: 'GK / Current Affairs', q: 'The FIFA World Cup 2026 will be hosted by:', opts: ['Qatar', 'USA, Canada, Mexico', 'Spain, Portugal, Morocco', 'Saudi Arabia'], ans: 1 },
  { id: 66, section: 'GK / Current Affairs', q: 'The number of permanent members of the UN Security Council is:', opts: ['5', '10', '15', '7'], ans: 0 },
  { id: 67, section: 'GK / Current Affairs', q: 'The headquarters of the OIC is in:', opts: ['Riyadh', 'Jeddah', 'Tehran', 'Ankara'], ans: 1 },
  { id: 68, section: 'GK / Current Affairs', q: 'The largest Muslim-majority country by population is:', opts: ['Pakistan', 'Indonesia', 'Bangladesh', 'India'], ans: 1 },
  { id: 69, section: 'GK / Current Affairs', q: 'The "Belt and Road Initiative" is a project of:', opts: ['India', 'China', 'USA', 'Russia'], ans: 1 },
  { id: 70, section: 'GK / Current Affairs', q: 'The current UN Secretary-General (as of 2026) is:', opts: ['António Guterres', 'Ban Ki-moon', 'Kofi Annan', 'Boutros Boutros-Ghali'], ans: 0 },

  // Section E: Everyday Science (71–85)
  { id: 71, section: 'Everyday Science', q: 'The chemical symbol of gold is:', opts: ['Ag', 'Au', 'Go', 'Gd'], ans: 1 },
  { id: 72, section: 'Everyday Science', q: 'Which vitamin is produced in the skin upon exposure to sunlight?', opts: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'], ans: 3 },
  { id: 73, section: 'Everyday Science', q: 'The SI unit of electric current is:', opts: ['Volt', 'Watt', 'Ampere', 'Ohm'], ans: 2 },
  { id: 74, section: 'Everyday Science', q: 'The process by which plants make their food is called:', opts: ['Respiration', 'Transpiration', 'Photosynthesis', 'Evaporation'], ans: 2 },
  { id: 75, section: 'Everyday Science', q: 'The human heart has ___ chambers.', opts: ['2', '3', '4', '5'], ans: 2 },
  { id: 76, section: 'Everyday Science', q: 'The hardest natural substance is:', opts: ['Iron', 'Diamond', 'Graphite', 'Quartz'], ans: 1 },
  { id: 77, section: 'Everyday Science', q: "The most abundant gas in the Earth's atmosphere is:", opts: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'], ans: 2 },
  { id: 78, section: 'Everyday Science', q: 'Deficiency of Vitamin C causes:', opts: ['Rickets', 'Scurvy', 'Night blindness', 'Beriberi'], ans: 1 },
  { id: 79, section: 'Everyday Science', q: 'The largest organ of the human body is:', opts: ['Brain', 'Liver', 'Skin', 'Heart'], ans: 2 },
  { id: 80, section: 'Everyday Science', q: 'Sound travels fastest in:', opts: ['Air', 'Water', 'Vacuum', 'Steel'], ans: 3 },
  { id: 81, section: 'Everyday Science', q: 'The study of fossils is called:', opts: ['Paleontology', 'Anthropology', 'Archaeology', 'Geology'], ans: 0 },
  { id: 82, section: 'Everyday Science', q: 'The pH of pure water is:', opts: ['0', '7', '14', '1'], ans: 1 },
  { id: 83, section: 'Everyday Science', q: 'Diabetes is caused by the deficiency of:', opts: ['Insulin', 'Thyroxin', 'Estrogen', 'Adrenaline'], ans: 0 },
  { id: 84, section: 'Everyday Science', q: 'Which planet is known as the "Red Planet"?', opts: ['Venus', 'Mars', 'Jupiter', 'Saturn'], ans: 1 },
  { id: 85, section: 'Everyday Science', q: 'The unit of frequency is:', opts: ['Hertz', 'Pascal', 'Newton', 'Watt'], ans: 0 },

  // Section F: Mathematics (86–100)
  { id: 86, section: 'Mathematics', q: '15% of 200 is:', opts: ['20', '30', '40', '25'], ans: 1 },
  { id: 87, section: 'Mathematics', q: 'The average of 5, 10, 15, 20 is:', opts: ['10', '12.5', '15', '17.5'], ans: 1 },
  { id: 88, section: 'Mathematics', q: 'Solve: 3(x – 2) = 9, x = ?', opts: ['3', '4', '5', '6'], ans: 2 },
  { id: 89, section: 'Mathematics', q: 'The square root of 144 is:', opts: ['11', '12', '14', '16'], ans: 1 },
  { id: 90, section: 'Mathematics', q: 'A car covers 300 km in 5 hours. Its speed is:', opts: ['50 km/h', '60 km/h', '70 km/h', '65 km/h'], ans: 1 },
  { id: 91, section: 'Mathematics', q: 'The sum of internal angles of a triangle is:', opts: ['90°', '180°', '270°', '360°'], ans: 1 },
  { id: 92, section: 'Mathematics', q: 'A book is bought for Rs. 200 and sold for Rs. 250. The profit percentage is:', opts: ['20%', '25%', '30%', '50%'], ans: 1 },
  { id: 93, section: 'Mathematics', q: '2³ + 3² = ?', opts: ['17', '13', '12', '15'], ans: 0 },
  { id: 94, section: 'Mathematics', q: 'LCM of 4 and 6 is:', opts: ['2', '12', '24', '18'], ans: 1 },
  { id: 95, section: 'Mathematics', q: 'If ¼ of a number is 7, the number is:', opts: ['21', '28', '14', '35'], ans: 1 },
  { id: 96, section: 'Mathematics', q: 'Area of a rectangle with length 10 cm and width 5 cm is:', opts: ['50 cm²', '30 cm²', '15 cm²', '25 cm²'], ans: 0 },
  { id: 97, section: 'Mathematics', q: 'Next number in the series: 2, 5, 10, 17, __?', opts: ['24', '26', '28', '32'], ans: 1 },
  { id: 98, section: 'Mathematics', q: '40 ÷ 5 × 2 = ?', opts: ['4', '16', '20', '8'], ans: 1 },
  { id: 99, section: 'Mathematics', q: 'A 100 m long train crosses a pole in 10 seconds. Its speed in km/h is:', opts: ['36 km/h', '60 km/h', '50 km/h', '72 km/h'], ans: 0 },
  { id: 100, section: 'Mathematics', q: 'The ratio of boys to girls in a class is 3:2. If total students are 40, the number of boys is:', opts: ['20', '24', '16', '30'], ans: 1 }
];

const TOTAL_QUESTIONS = MOD_QUESTIONS.length; // 100
const QUESTIONS_PER_PAGE = 25; // 25 per page
const TOTAL_PAGES = 4; // 4 pages total
const TOTAL_TIME_SEC = 90 * 60; // 90 minutes

export default function MinistryOfDefenceMockTest() {
  const [currentPage, setCurrentPage] = useState(1);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(new Array(TOTAL_QUESTIONS).fill(null));
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME_SEC);
  const [showModal, setShowModal] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Live Timer Effect
  useEffect(() => {
    if (!testSubmitted) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testSubmitted]);

  const handleAutoSubmit = () => {
    setTestSubmitted(true);
    setShowModal(true);
  };

  const handleOptionSelect = (qIdx: number, optIdx: number) => {
    if (testSubmitted) return;
    setUserAnswers(prev => {
      const copy = [...prev];
      copy[qIdx] = optIdx;
      return copy;
    });
  };

  const handleClearSelection = (qIdx: number) => {
    if (testSubmitted) return;
    setUserAnswers(prev => {
      const copy = [...prev];
      copy[qIdx] = null;
      return copy;
    });
  };

  const handleSubmit = () => {
    if (testSubmitted) return;
    const answeredCount = userAnswers.filter(a => a !== null).length;
    const msg = answeredCount < TOTAL_QUESTIONS
      ? `You have answered ${answeredCount} out of ${TOTAL_QUESTIONS} questions. Are you sure you want to submit?`
      : 'Are you sure you want to submit the test?';

    if (window.confirm(msg)) {
      if (timerRef.current) clearInterval(timerRef.current);
      setTestSubmitted(true);
      setShowModal(true);
    }
  };

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= TOTAL_PAGES) {
      setCurrentPage(p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRetry = () => {
    setUserAnswers(new Array(TOTAL_QUESTIONS).fill(null));
    setTestSubmitted(false);
    setShowModal(false);
    setCurrentPage(1);
    setTimeRemaining(TOTAL_TIME_SEC);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  // Current page 25 questions
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const pageQuestions = MOD_QUESTIONS.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);

  // Calculations
  const answeredCount = userAnswers.filter(a => a !== null).length;
  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;

  if (testSubmitted) {
    userAnswers.forEach((ans, idx) => {
      if (ans === null) {
        skippedCount++;
      } else if (ans === MOD_QUESTIONS[idx].ans) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });
  }

  const percentage = Math.round((correctCount / TOTAL_QUESTIONS) * 100);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const shareUrl = absoluteUrl('/mock-papers/ministry-of-defence');
  const shareTitle = 'Ministry of Defence Pakistan (MOD) Mock Written Test — 100 MCQs (4 Pages)';
  const shareDescription = 'Attempt free 100-question Ministry of Defence (MOD) written practice exam. 25 MCQs per page, 90-min timer, instant scoring, & full answer key!';

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Main Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-900/40 shadow-xl"
        style={{ background: 'linear-gradient(135deg, #1a3c5e 0%, #0d6b3e 60%, #1a3c5e 100%)' }}>
        <div className="p-6 sm:p-8 text-white space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              Official Ministry of Defence Model Paper
            </span>
            <span className="bg-white/10 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-white/20">
              100 MCQs • 25 Per Page • 4 Pages
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              🇵🇰 Ministry of Defence (MOD) — Mock Test
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 leading-relaxed">
              Full-length 100-Question Written Practice Exam formatted into 4 pages (25 questions per page). Aligned to Past Papers Syllabus: English, Pakistan Studies, Islamiat, General Knowledge, Everyday Science, and Mathematics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-200 pt-1 font-semibold">
            <span>Page 1: Q1–25</span> •
            <span>Page 2: Q26–50</span> •
            <span>Page 3: Q51–75</span> •
            <span>Page 4: Q76–100</span>
          </div>
        </div>
      </div>

      {/* Live Stats & Timer Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs font-bold no-print">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-slate-600">
            Answered: <span className="text-slate-900 font-extrabold text-sm">{answeredCount}</span> / 100
          </span>
          <span className="text-slate-600">
            Correct: <span className="text-emerald-700 font-extrabold text-sm">{testSubmitted ? correctCount : '—'}</span>
          </span>
          <div className="flex items-center gap-1.5 text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            <Clock className="w-4 h-4 text-amber-600 animate-spin" />
            <span className="font-mono text-sm font-black">{formatTimer(timeRemaining)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {testSubmitted ? (
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs px-3 py-1.5 rounded-xl font-black">
              ✓ Test Completed ({percentage}%)
            </span>
          ) : (
            <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs px-3 py-1.5 rounded-xl font-bold">
              ⏳ Test In Progress
            </span>
          )}

          <button
            onClick={handlePrint}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-1.5 rounded-xl transition flex items-center gap-1 text-xs font-bold"
            title="Print test or save review PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* Page Tabs Navigation Bar (Top) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs no-print">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <BookOpen className="w-4 h-4 text-emerald-700" />
          <span>Page {currentPage} of {TOTAL_PAGES}</span>
          <span className="text-slate-500 font-normal text-[11px]">
            (Questions {startIndex + 1} – {startIndex + pageQuestions.length})
          </span>
        </div>

        {/* 4 Page Tab Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 text-[11px] font-bold flex items-center gap-1 transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev Page</span>
          </button>

          {[1, 2, 3, 4].map(p => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                p === currentPage
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>Page {p}</span>
              <span className="text-[10px] opacity-80">({(p - 1) * 25 + 1}–{p * 25})</span>
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === TOTAL_PAGES}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 text-[11px] font-bold flex items-center gap-1 transition"
          >
            <span>Next Page</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 25 Questions Page List */}
      <div className="space-y-4">
        {pageQuestions.map((q, idx) => {
          const globalIdx = startIndex + idx;
          const userSelected = userAnswers[globalIdx];
          const isAnswered = userSelected !== null;

          return (
            <div
              key={q.id}
              className={`p-5 sm:p-6 rounded-2xl border transition shadow-xs space-y-4 bg-white page-break-inside-avoid ${
                isAnswered ? 'border-slate-300' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="w-8 h-8 rounded-lg bg-sky-900 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    {q.id}
                  </span>
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                      {q.section}
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-relaxed">
                      {q.q}
                    </h3>
                  </div>
                </div>

                {!testSubmitted && isAnswered && (
                  <button
                    onClick={() => handleClearSelection(globalIdx)}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition shrink-0 no-print"
                    title="Clear selection for this question"
                  >
                    ✕ Clear
                  </button>
                )}
              </div>

              {/* Options List (Clean presentation without question keys) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {q.opts.map((optText, optIdx) => {
                  const isSelected = userSelected === optIdx;
                  const isCorrect = optIdx === q.ans;

                  let optStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';

                  if (testSubmitted) {
                    if (isCorrect) {
                      optStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs';
                    } else if (isSelected) {
                      optStyle = 'bg-red-600 text-white border-red-600 font-bold';
                    }
                  } else if (isSelected) {
                    optStyle = 'bg-sky-50 border-sky-600 text-sky-950 font-extrabold shadow-xs';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={testSubmitted}
                      onClick={() => handleOptionSelect(globalIdx, optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition flex items-center gap-3 ${optStyle}`}
                    >
                      <span className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${
                        testSubmitted && isCorrect
                          ? 'bg-white border-white'
                          : testSubmitted && isSelected && !isCorrect
                          ? 'bg-white border-white'
                          : isSelected
                          ? 'bg-sky-700 border-sky-700'
                          : 'border-slate-400 bg-white'
                      }`}>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>

                      <span className="flex-1 font-medium">{optText}</span>
                    </button>
                  );
                })}
              </div>

              {/* Show correct answer status after test submission */}
              {testSubmitted && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Correct Answer:</strong> {q.opts[q.ans]}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Pagination & Submit Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 text-xs font-bold flex items-center gap-1 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Page</span>
          </button>

          <span className="text-xs font-bold text-slate-700 px-3">
            Page {currentPage} of {TOTAL_PAGES}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === TOTAL_PAGES}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 text-xs font-bold flex items-center gap-1 transition"
          >
            <span>Next Page</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {!testSubmitted && (
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-7 py-3 rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Submit Full Test (100 MCQs)</span>
          </button>
        )}
      </div>

      {/* Result Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 no-print">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-8 h-8 text-emerald-700" />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">Ministry of Defence Test Completed!</h2>
              <p className="text-xs text-slate-500 mt-1">Written Exam Practice Result (100 MCQs)</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <div className="text-4xl font-black text-emerald-700">{correctCount} <span className="text-base text-slate-500 font-normal">/ 100</span></div>
              <p className="text-xs font-bold text-slate-700">
                Score: {percentage}% — {percentage >= 50 ? '✅ Passed' : '❌ Needs Improvement'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-bold text-slate-700">
              <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <span className="block text-emerald-800 font-black text-sm">{correctCount}</span>
                <span className="text-[10px] text-emerald-700">Correct</span>
              </div>
              <div className="bg-red-50 p-2.5 rounded-xl border border-red-200">
                <span className="block text-red-800 font-black text-sm">{wrongCount}</span>
                <span className="text-[10px] text-red-700">Wrong</span>
              </div>
              <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                <span className="block text-slate-800 font-black text-sm">{skippedCount}</span>
                <span className="text-[10px] text-slate-600">Skipped</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-3 rounded-xl transition shadow"
              >
                🔍 Review All 4 Pages
              </button>
              <button
                onClick={handleRetry}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 rounded-xl transition border border-slate-200"
              >
                🔄 Retry Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-center no-print">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Share Ministry of Defence Mock Test with Candidates</span>
        </h3>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          Help candidates preparing for Ministry of Defence (MOD) written recruitment exams by sharing this free 100-question practice test paper!
        </p>
        <div className="flex justify-center pt-1">
          <ShareButtons
            url={shareUrl}
            title={shareTitle}
            description={shareDescription}
          />
        </div>
      </div>

    </div>
  );
}
