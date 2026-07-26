'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '@/components/Loader';
import { useAuth } from '@/context/AuthContext';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  CheckCircle,
  AlertTriangle,
  Check,
  Filter
} from 'lucide-react';
import { IQuestion } from '@/lib/types';

export default function ManageQuestionsPage() {
  const { token } = useAuth();
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<IQuestion | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<IQuestion | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form Data
  const [formData, setFormData] = useState({
    textEn: '',
    textUr: '',
    optionsEn: ['', '', '', ''],
    optionsUr: ['', '', '', ''],
    correctIndex: 0,
    subject: 'General Knowledge',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    explanationEn: '',
    explanationUr: ''
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/questions');
      setQuestions(res.data);
    } catch (err) {
      console.error('Error fetching questions:', err);
      showToast('Failed to load Question Bank', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (q: IQuestion | null = null) => {
    if (q) {
      setEditingQuestion(q);
      setFormData({
        textEn: q.textEn || '',
        textUr: q.textUr || '',
        optionsEn: q.optionsEn && q.optionsEn.length === 4 ? q.optionsEn : ['', '', '', ''],
        optionsUr: q.optionsUr && q.optionsUr.length === 4 ? q.optionsUr : ['', '', '', ''],
        correctIndex: q.correctIndex || 0,
        subject: q.subject || 'General Knowledge',
        difficulty: q.difficulty || 'easy',
        explanationEn: q.explanationEn || '',
        explanationUr: q.explanationUr || ''
      });
    } else {
      setEditingQuestion(null);
      setFormData({
        textEn: '',
        textUr: '',
        optionsEn: ['', '', '', ''],
        optionsUr: ['', '', '', ''],
        correctIndex: 0,
        subject: 'General Knowledge',
        difficulty: 'easy',
        explanationEn: '',
        explanationUr: ''
      });
    }
    setModalOpen(true);
  };

  const handleOptionChange = (index: number, val: string, lang: 'en' | 'ur') => {
    if (lang === 'en') {
      const newOpts = [...formData.optionsEn];
      newOpts[index] = val;
      setFormData({ ...formData, optionsEn: newOpts });
    } else {
      const newOpts = [...formData.optionsUr];
      newOpts[index] = val;
      setFormData({ ...formData, optionsUr: newOpts });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.textEn || formData.optionsEn.some(o => !o.trim())) {
      showToast('Please provide question text and all 4 options', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (editingQuestion) {
        await axios.put(`/api/questions/${editingQuestion._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('MCQ Question updated!');
      } else {
        await axios.post('/api/questions', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('New MCQ Question added!');
      }
      setModalOpen(false);
      fetchQuestions();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to save question', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (q: IQuestion) => {
    setQuestionToDelete(q);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!questionToDelete) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/questions/${questionToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Question deleted');
      setDeleteModalOpen(false);
      setQuestionToDelete(null);
      fetchQuestions();
    } catch (err) {
      showToast('Failed to delete question', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.textEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || q.subject === subjectFilter;
    const matchesDifficulty = difficultyFilter === 'all' || q.difficulty === difficultyFilter;
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-xs font-bold text-white transition animate-bounce ${
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-govt-emerald" />
            Manage Question Bank (MCQs)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Create, edit, and organize bilingual multiple-choice questions for entry test prep</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-govt-emerald hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New MCQ</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search questions by text or key phrase..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-govt-emerald"
          />
        </div>

        <div>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-govt-emerald"
          >
            <option value="all">All Subjects</option>
            <option value="General Knowledge">General Knowledge</option>
            <option value="Pakistan Studies">Pakistan Studies</option>
            <option value="Islamic Studies">Islamic Studies</option>
            <option value="English">English</option>
            <option value="Computer Science">Computer Science</option>
          </select>
        </div>

        <div>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-govt-emerald"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Questions Table */}
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Question Text</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Difficulty</th>
                  <th className="p-4">Correct Answer</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredQuestions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                      No matching questions found in bank.
                    </td>
                  </tr>
                ) : (
                  filteredQuestions.map((q) => (
                    <tr key={q._id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 max-w-md">
                        <div className="font-bold text-slate-900">{q.textEn}</div>
                        <div className="text-[11px] text-slate-500 font-urdu mt-0.5">{q.textUr}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {q.subject}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          q.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-800' :
                          q.difficulty === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {q.difficulty.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-emerald-700">
                        {q.optionsEn && q.optionsEn[q.correctIndex] ? q.optionsEn[q.correctIndex] : `Option #${q.correctIndex + 1}`}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(q)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition"
                            title="Edit MCQ"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(q)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition"
                            title="Delete MCQ"
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
                <HelpCircle className="w-5 h-5 text-govt-emerald" />
                {editingQuestion ? 'Edit MCQ Question' : 'Add New MCQ Question'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Question Statement (English) *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.textEn}
                  onChange={(e) => setFormData({ ...formData, textEn: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-govt-emerald"
                  placeholder="e.g. Which city serves as the capital of Pakistan?"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Question Statement (Urdu)</label>
                <textarea
                  rows={2}
                  value={formData.textUr}
                  onChange={(e) => setFormData({ ...formData, textUr: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg font-urdu text-right focus:outline-none focus:border-govt-emerald"
                  placeholder="پاکستان کا دارالحکومت کونسا شہر ہے؟"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-govt-emerald"
                  >
                    <option value="General Knowledge">General Knowledge</option>
                    <option value="Pakistan Studies">Pakistan Studies</option>
                    <option value="Islamic Studies">Islamic Studies</option>
                    <option value="English">English</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Everyday Science">Everyday Science</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Difficulty Level</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-govt-emerald"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* 4 Options Grid */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="font-bold text-slate-800 block">MCQ Answer Options (Select radio for correct answer) *</label>
                {formData.optionsEn.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={formData.correctIndex === idx}
                      onChange={() => setFormData({ ...formData, correctIndex: idx })}
                      className="w-4 h-4 text-govt-emerald focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="font-bold text-slate-500 w-5">#{idx + 1}</span>
                    <input
                      type="text"
                      required
                      placeholder={`Option ${idx + 1} (English)`}
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value, 'en')}
                      className="flex-1 p-2 bg-white border border-slate-200 rounded text-xs focus:outline-none focus:border-govt-emerald"
                    />
                    <input
                      type="text"
                      placeholder={`آپشن ${idx + 1} (اردو)`}
                      value={formData.optionsUr[idx]}
                      onChange={(e) => handleOptionChange(idx, e.target.value, 'ur')}
                      className="flex-1 p-2 bg-white border border-slate-200 rounded font-urdu text-right text-xs focus:outline-none focus:border-govt-emerald"
                    />
                  </div>
                ))}
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
                  className="px-5 py-2 bg-govt-emerald hover:bg-emerald-800 text-white font-bold rounded-lg shadow transition"
                >
                  {submitting ? 'Saving...' : editingQuestion ? 'Update Question' : 'Add Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteModalOpen && questionToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-900">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold">Confirm Delete Question</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete this MCQ question from the Question Bank?
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
                {deleting ? 'Deleting...' : 'Delete Question'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
