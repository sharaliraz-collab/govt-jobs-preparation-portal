export interface IUser {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  savedJobs?: (string | IJob)[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IJob {
  _id: string;
  id?: string;
  titleEn: string;
  titleUr: string;
  department: string;
  descriptionEn: string;
  descriptionUr: string;
  location: string;
  category: string;
  qualification: string;
  vacancies: number;
  deadline: string;
  adFile?: string;
  source?: string;
  status: 'open' | 'closing_soon' | 'closed';
  featured: boolean;
  postedBy?: string | IUser;
  createdAt?: string;
  updatedAt?: string;
}

export interface INews {
  _id: string;
  id?: string;
  titleEn: string;
  titleUr: string;
  bodyEn: string;
  bodyUr: string;
  category: 'Result' | 'Notification' | 'Deadline Extension' | 'General';
  coverImage?: string;
  pinned: boolean;
  publishedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IFormDoc {
  _id: string;
  id?: string;
  titleEn: string;
  titleUr: string;
  descriptionEn?: string;
  descriptionUr?: string;
  category: 'Admission' | 'Scholarship' | 'Verification' | 'Application' | 'General';
  file: string;
  relatedTo?: string;
  downloadCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMaterial {
  _id: string;
  id?: string;
  titleEn: string;
  titleUr: string;
  subject: string;
  descriptionEn?: string;
  descriptionUr?: string;
  file: string;
  relatedCategory?: string;
  downloadCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IQuestion {
  _id: string;
  id?: string;
  textEn: string;
  textUr: string;
  optionsEn: string[];
  optionsUr: string[];
  correctIndex: number;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanationEn?: string;
  explanationUr?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IQuiz {
  _id: string;
  id?: string;
  titleEn: string;
  titleUr: string;
  subject: string;
  questions: (string | IQuestion)[];
  timeLimitMinutes: number;
  passPercentage: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IQuizAttempt {
  _id: string;
  user: string | IUser;
  quiz: string | IQuiz;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  answers: {
    question: string | IQuestion;
    selectedIndex: number;
    correct: boolean;
  }[];
  attemptedAt: string;
}
