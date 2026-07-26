'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '@/components/Loader';
import { useAuth } from '@/context/AuthContext';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  HelpCircle,
  Percent
} from 'lucide-react';
import { IQuiz, IQuestion } from '@/lib/types';

export default function ManageQuizzesPage() {
  const { token } = useAuth();
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<IQuiz | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<IQuiz | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form Data (No Urdu title)
  const [formData, setFormData] = useState({
    titleEn: '',
    subject: 'General Knowledge',
    questions: [] as string[],
    timeLimitMinutes: 15,
    passPercentage: 60
  });

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [quizzesRes, questionsRes] = await Promise.all([
        axios.get('/api/quizzes'),
        axios.get('/api/questions')
      ]);
      setQuizzes(quizzesRes.data);
      setQuestions(questionsRes.data);
    } catch (err) {
      console.error('Error fetching quiz data:', err);
      showToast('Failed to load quizzes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (quiz: IQuiz | null = null) => {
    if (quiz) {
      setEditingQuiz(quiz);
      const qIds = quiz.questions.map((q: any) => (typeof q === 'string' ? q : q._id));
      setFormData({
        titleEn: quiz.titleEn || '',
        subject: quiz.subject || 'General Knowledge',
        questions: qIds,
        timeLimitMinutes: quiz.timeLimitMinutes || 15,
        passPercentage: quiz.passPercentage || 60
      });
    } else {
      setEditingQuiz(null);
      setFormData({
        titleEn: '',
        subject: 'General Knowledge',
        questions: [],
        timeLimitMinutes: 15,
        passPercentage: 60
      });
    }
    setModalOpen(true);
  };

  const handleQuestionToggle = (qId: string) => {
    setFormData(prev => {
      const exists = prev.questions.includes(qId);
      if (exists) {
        return { ...prev, questions: prev.questions.filter(id => id !== qId) };
      } else {
        return { ...prev, questions: [...prev.questions, qId] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleEn || formData.questions.length === 0) {
      showToast('Please provide quiz title and select at least 1 question', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (editingQuiz) {
        await axios.put(`/api/quizzes/${editingQuiz._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('Quiz updated!');
      } else {
        await axios.post('/api/quizzes', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('New mock quiz created!');
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to save quiz', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (quiz: IQuiz) => {
    setQuizToDelete(quiz);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!quizToDelete) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/quizzes/${quizToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Quiz deleted');
      setDeleteModalOpen(false);
      setQuizToDelete(null);
      fetchData();
    } catch (err) {
      showToast('Failed to delete quiz', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredQuizzes = quizzes.filter(q =>
    q.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-xs font-bold text-white transition animate-bounce ${
          toast.type === 'success' ? 'bg-amber-600' : 'bg-red-600'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-700" />
            Manage Online Entry Tests & Quizzes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Create mock tests, set time limits, passing thresholds, and assign MCQs</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Quiz</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-7 top-7" />
        <input
          type="text"
          placeholder="Search quizzes by title or subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-amber-600"
        />
      </div>

      {/* Table */}
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Quiz Title</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4 text-center">Questions</th>
                  <th className="p-4 text-center">Time Limit</th>
                  <th className="p-4 text-center">Pass Threshold</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredQuizzes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                      No online quizzes found.
                    </td>
                  </tr>
                ) : (
                  filteredQuizzes.map((quiz) => (
                    <tr key={quiz._id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 font-bold text-slate-900">{quiz.titleEn}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {quiz.subject}
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-slate-900">
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          <HelpCircle className="w-3 h-3 text-slate-500" />
                          {quiz.questions ? quiz.questions.length : 0} MCQs
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-slate-700">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          {quiz.timeLimitMinutes} mins
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-slate-700">
                        <span className="inline-flex items-center gap-1">
                          <Percent className="w-3.5 h-3.5 text-emerald-600" />
                          {quiz.passPercentage}%
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(quiz)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(quiz)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-700" />
                {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Quiz Title *</label>
                <input
                  type="text"
                  required
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-600"
                  placeholder="e.g. FPSC General Knowledge Model Test 1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-600"
                  >
                    <option value="General Knowledge">General Knowledge</option>
                    <option value="Pakistan Studies">Pakistan Studies</option>
                    <option value="Islamic Studies">Islamic Studies</option>
                    <option value="English">English</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time Limit (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.timeLimitMinutes}
                    onChange={(e) => setFormData({ ...formData, timeLimitMinutes: parseInt(e.target.value) || 10 })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pass Threshold (%)</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={formData.passPercentage}
                    onChange={(e) => setFormData({ ...formData, passPercentage: parseInt(e.target.value) || 50 })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              {/* MCQs Selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Select MCQs from Question Bank ({formData.questions.length} selected) *
                </label>
                <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50">
                  {questions.length === 0 ? (
                    <p className="text-slate-400 italic">No MCQs found in question bank.</p>
                  ) : (
                    questions.map((q) => {
                      const isSelected = formData.questions.includes(q._id);
                      return (
                        <div
                          key={q._id}
                          onClick={() => handleQuestionToggle(q._id)}
                          className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between text-xs transition ${
                            isSelected
                              ? 'bg-amber-50 border-amber-400 font-bold text-amber-900'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="truncate pr-4">
                            <span className="font-semibold text-slate-900">{q.textEn}</span>
                            <span className="text-[10px] text-slate-400 block">{q.subject} • {q.difficulty}</span>
                          </div>
                          <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold border ${
                            isSelected ? 'bg-amber-600 text-white border-amber-600' : 'border-slate-300'
                          }`}>
                            {isSelected ? '✓' : ''}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg shadow transition"
                >
                  {submitting ? 'Saving...' : editingQuiz ? 'Update Quiz' : 'Create Quiz'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteModalOpen && quizToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-900">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold">Confirm Delete</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900">{quizToDelete.titleEn}</strong>?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow transition"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
