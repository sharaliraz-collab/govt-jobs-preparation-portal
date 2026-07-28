'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Loader from '@/components/Loader';
import ShareButtons from '@/components/ShareButtons';
import { useAuth } from '@/context/AuthContext';
import { Clock, CheckCircle2, XCircle, ArrowLeft, ArrowRight, Award, RotateCcw } from 'lucide-react';
import { IQuiz } from '@/lib/types';
import { absoluteUrl } from '@/lib/seo';

export default function QuizAttemptClient({ id, initialQuiz }: { id: string; initialQuiz?: IQuiz | null }) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { user, token } = useAuth();
  const isUr = i18n.language === 'ur';

  const [quiz, setQuiz] = useState<IQuiz | null>(initialQuiz || null);
  const [loading, setLoading] = useState(!initialQuiz);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(initialQuiz ? (initialQuiz.timeLimitMinutes || 15) * 60 : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (initialQuiz) return;
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`/api/quizzes/${id}`);
        setQuiz(res.data);
        setTimeLeft((res.data.timeLimitMinutes || 15) * 60);
      } catch (err) {
        console.error('Error fetching quiz:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, initialQuiz]);

  const handleSubmitQuiz = useCallback(async () => {
    if (!user) {
      alert('Please log in to submit your quiz attempt and record your performance score.');
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        answers: Object.entries(selectedAnswers).map(([questionId, selectedIndex]) => ({
          questionId,
          selectedIndex
        }))
      };

      const res = await axios.post(`/api/quizzes/${id}/submit`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(res.data);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error submitting quiz.');
    } finally {
      setIsSubmitting(false);
    }
  }, [user, router, selectedAnswers, id, token]);

  useEffect(() => {
    if (!quiz || result || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, result, timeLeft, handleSubmitQuiz]);

  if (loading) return <Loader />;

  if (!quiz) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-govt-red font-semibold">Quiz not found.</p>
        <Link href="/quizzes" className="inline-block text-xs bg-govt-emerald text-white px-4 py-2 rounded">
          Return to Quizzes
        </Link>
      </div>
    );
  }

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (result) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIndex
    });
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const currentQuestion = quiz.questions[currentIndex] as any;
  const title = isUr && quiz.titleUr ? quiz.titleUr : quiz.titleEn;
  const shareUrl = absoluteUrl(`/quizzes/${quiz._id}`);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white p-5 rounded-xl border border-govt-border shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-xs bg-yellow-100 text-yellow-800 font-bold px-2 py-0.5 rounded">
              {quiz.subject}
            </span>
            <h1 className={`text-lg font-bold text-govt-charcoal mt-1 ${isUr ? 'font-urdu' : ''}`}>
              {title}
            </h1>
          </div>

          {!result && (
            <div className="flex items-center gap-2 bg-govt-emerald/10 text-govt-emerald border border-govt-emerald px-4 py-2 rounded-lg font-mono font-bold text-sm">
              <Clock className="w-4 h-4 animate-pulse" />
              <span>{timerDisplay}</span>
            </div>
          )}
        </div>

        {!result && (
          <ShareButtons
            url={shareUrl}
            title={title}
            description={`${quiz.subject} MCQ quiz — ${quiz.questions.length} questions, ${quiz.timeLimitMinutes} min`}
          />
        )}
      </div>

      {result ? (
        <div className="bg-white rounded-xl border border-govt-border p-6 md:p-8 shadow-sm space-y-6">
          <div className={`p-6 rounded-xl border text-center space-y-3 ${result.passed ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-red-50 border-red-300 text-red-900'}`}>
            <Award className="w-12 h-12 mx-auto fill-current" />
            <h2 className="text-xl font-black">
              {result.passed ? t('quizzes.passed') : t('quizzes.failed')}
            </h2>
            <div className="flex justify-center items-center gap-6 text-sm font-bold pt-2">
              <div>
                <p className="text-xs font-normal text-gray-500">{t('quizzes.score')}</p>
                <p className="text-2xl">{result.score} / {result.totalQuestions}</p>
              </div>
              <div className="border-r border-gray-300 h-8"></div>
              <div>
                <p className="text-xs font-normal text-gray-500">Percentage</p>
                <p className="text-2xl">{result.percentage}%</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="font-bold text-base border-b border-gray-200 pb-2">
              Questions Answer Key & Explanations
            </h3>

            {result.detailedResults.map((item: any, idx: number) => {
              const qText = isUr && item.textUr ? item.textUr : item.textEn;
              const options = isUr && item.optionsUr?.length === 4 ? item.optionsUr : item.optionsEn;
              const explanation = isUr && item.explanationUr ? item.explanationUr : item.explanationEn;

              return (
                <div key={item.questionId} className={`p-4 rounded-lg border text-xs space-y-3 ${item.isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50/50 border-red-200'}`}>
                  <div className="flex items-start gap-2 font-bold text-sm">
                    {item.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <span>Q{idx + 1}. {qText}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7">
                    {options.map((opt: string, optIdx: number) => {
                      let optStyle = 'bg-white border-gray-200 text-gray-700';
                      if (optIdx === item.correctIndex) {
                        optStyle = 'bg-emerald-100 border-emerald-400 font-bold text-emerald-900';
                      } else if (optIdx === item.selectedIndex && !item.isCorrect) {
                        optStyle = 'bg-red-100 border-red-400 font-bold text-red-900';
                      }

                      return (
                        <div key={optIdx} className={`p-2 rounded border ${optStyle}`}>
                          Option {optIdx + 1}: {opt}
                        </div>
                      );
                    })}
                  </div>

                  {explanation && (
                    <div className="ml-7 p-2.5 bg-amber-50 rounded border border-amber-200 text-amber-900 font-medium">
                      💡 <span className="font-bold">{t('quizzes.explanation')}: </span>{explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-between">
            <Link href="/quizzes" className="text-xs bg-slate-100 text-slate-700 px-4 py-2 rounded font-bold hover:bg-slate-200">
              ← Back to Quizzes
            </Link>
            <button
              onClick={() => {
                setResult(null);
                setSelectedAnswers({});
                setCurrentIndex(0);
                setTimeLeft(quiz.timeLimitMinutes * 60);
              }}
              className="text-xs bg-govt-emerald text-white px-4 py-2 rounded font-bold hover:bg-govt-emerald-dark flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" /> Retake Test
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-govt-border p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between text-xs text-govt-muted border-b border-gray-100 pb-3">
            <span>{t('quizzes.question')} {currentIndex + 1} of {quiz.questions.length}</span>
            <div className="flex gap-1">
              {quiz.questions.map((q: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-6 h-6 rounded-full text-[11px] font-bold ${
                    idx === currentIndex
                      ? 'bg-govt-emerald text-white'
                      : selectedAnswers[q._id] !== undefined
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {currentQuestion && (
            <div className="space-y-4">
              <h2 className={`text-base md:text-lg font-bold text-govt-charcoal leading-relaxed ${isUr ? 'font-urdu' : ''}`}>
                Q{currentIndex + 1}. {isUr && currentQuestion.textUr ? currentQuestion.textUr : currentQuestion.textEn}
              </h2>

              <div className="space-y-2.5 pt-2">
                {(isUr && currentQuestion.optionsUr?.length === 4 ? currentQuestion.optionsUr : currentQuestion.optionsEn).map((optionText: string, optIdx: number) => {
                  const isSelected = selectedAnswers[currentQuestion._id] === optIdx;

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(currentQuestion._id, optIdx)}
                      className={`w-full text-left p-3.5 rounded-lg border text-xs md:text-sm transition flex items-center gap-3 ${
                        isSelected
                          ? 'border-govt-emerald bg-emerald-50 text-govt-emerald-dark font-bold shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 bg-white text-govt-charcoal'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold ${isSelected ? 'border-govt-emerald bg-govt-emerald text-white' : 'border-gray-400 text-gray-500'}`}>
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className={isUr ? 'font-urdu' : ''}>{optionText}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="text-xs bg-slate-100 disabled:opacity-50 text-slate-700 font-bold px-4 py-2 rounded-lg transition flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('quizzes.prev')}</span>
            </button>

            {currentIndex === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting}
                className="text-xs bg-govt-gold hover:bg-yellow-400 text-govt-emerald-dark font-black px-6 py-2.5 rounded-lg transition shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Grading...' : t('quizzes.submitQuiz')}</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(quiz.questions.length - 1, prev + 1))}
                className="text-xs bg-govt-emerald hover:bg-govt-emerald-dark text-white font-bold px-4 py-2 rounded-lg transition flex items-center gap-1"
              >
                <span>{t('quizzes.next')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
