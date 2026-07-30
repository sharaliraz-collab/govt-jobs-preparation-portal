'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '@/components/Loader';
import { AdminRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { Plus, Edit2, Trash2, X, HelpCircle, AlertTriangle, CheckCircle, Search, Zap } from 'lucide-react';
import { IQuestion } from '@/lib/types';

export default function ManageQuestionsPage() {
  const { token } = useAuth();
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<IQuestion | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Bulk Import State
  const [bulkText, setBulkText] = useState('');
  const [bulkSubject, setBulkSubject] = useState('General Knowledge');
  const [parsedQuestions, setParsedQuestions] = useState<any[]>([]);
  const [parseError, setParseError] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<IQuestion | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Notification Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [formData, setFormData] = useState({
    textEn: '',
    textUr: '',
    optionsEn: ['', '', '', ''],
    optionsUr: ['', '', '', ''],
    correctIndex: 0,
    subject: 'General Knowledge',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    explanationEn: '',
    explanationUr: ''
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get('/api/questions', { headers });
      setQuestions(res.data);
    } catch (err) {
      console.error('Error loading questions:', err);
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
        optionsEn: q.optionsEn?.length === 4 ? [...q.optionsEn] : ['', '', '', ''],
        optionsUr: q.optionsUr?.length === 4 ? [...q.optionsUr] : ['', '', '', ''],
        correctIndex: q.correctIndex || 0,
        subject: q.subject || 'General Knowledge',
        difficulty: q.difficulty || 'medium',
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
        difficulty: 'medium',
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

  const handleParseBulk = () => {
    setParseError('');
    if (!bulkText.trim()) {
      setParseError('Please paste content into the bulk text box.');
      return;
    }

    // Attempt 1: JSON Parse
    try {
      const parsed = JSON.parse(bulkText);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setParsedQuestions(parsed.map(q => ({ ...q, subject: q.subject || bulkSubject })));
        return;
      }
    } catch (e) {
      // Fall through to text block parsing
    }

    // Attempt 2: Formatted Block Parsing:
    // Question text?
    // A) Option 1
    // B) Option 2
    // C) Option 3
    // D) Option 4
    // Answer: C
    const items: any[] = [];
    const lines = bulkText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    let currentQText = '';
    let currentOpts: string[] = [];
    let currentAnsIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.match(/^[A-D]\)\s*/i)) {
        const optText = line.replace(/^[A-D]\)\s*/i, '').trim();
        currentOpts.push(optText);
      } else if (line.match(/^Answer:\s*/i)) {
        const ansChar = line.replace(/^Answer:\s*/i, '').trim().toUpperCase();
        if (ansChar === 'A') currentAnsIndex = 0;
        else if (ansChar === 'B') currentAnsIndex = 1;
        else if (ansChar === 'C') currentAnsIndex = 2;
        else if (ansChar === 'D') currentAnsIndex = 3;

        if (currentQText && currentOpts.length === 4) {
          items.push({
            textEn: currentQText,
            textUr: currentQText,
            optionsEn: [...currentOpts],
            optionsUr: [...currentOpts],
            correctIndex: currentAnsIndex,
            subject: bulkSubject,
            difficulty: 'medium'
          });
        }
        currentQText = '';
        currentOpts = [];
        currentAnsIndex = 0;
      } else if (line.includes('|')) {
        // Attempt 3: Pipe format
        const parts = line.split('|').map((p) => p.trim());
        if (parts.length >= 11) {
          items.push({
            textEn: parts[0],
            textUr: parts[1],
            optionsEn: [parts[2], parts[4], parts[6], parts[8]],
            optionsUr: [parts[3], parts[5], parts[7], parts[9]],
            correctIndex: parseInt(parts[10], 10) || 0,
            subject: parts[11] || bulkSubject,
            difficulty: parts[12] || 'medium'
          });
        }
      } else {
        if (!currentQText) {
          currentQText = line;
        } else {
          currentQText += ' ' + line;
        }
      }
    }

    if (items.length > 0) {
      setParsedQuestions(items);
    } else {
      setParseError('Could not parse any questions. Please format each question with A), B), C), D) options and "Answer: X".');
    }
  };

  const handleBulkSubmit = async () => {
    if (parsedQuestions.length === 0) return;
    setSubmitting(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post('/api/questions/bulk', { questions: parsedQuestions }, { headers });
      showToast(`Successfully imported ${parsedQuestions.length} questions!`);
      setBulkModalOpen(false);
      setBulkText('');
      setParsedQuestions([]);
      fetchQuestions();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error bulk importing questions.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.textEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || q.subject === subjectFilter;
    const matchesDifficulty = difficultyFilter === 'all' || q.difficulty === difficultyFilter;
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  return (
    <AdminRoute>
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setBulkText('');
                setParsedQuestions([]);
                setParseError('');
                setBulkModalOpen(true);
              }}
              className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-600 text-slate-900 text-xs font-extrabold px-3.5 py-2.5 rounded-lg shadow transition"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Bulk Add Questions</span>
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-govt-emerald hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add New MCQ</span>
            </button>
          </div>
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
                            {(q.difficulty || 'medium').toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-emerald-700">
                          {q.optionsEn && q.correctIndex !== undefined && q.optionsEn[q.correctIndex] ? q.optionsEn[q.correctIndex] : `Option #${(q.correctIndex ?? 0) + 1}`}
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

                {/* 4 Options Grid (Horizontal 2x2) */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <label className="font-bold text-slate-800 block">MCQ Answer Options (Select radio for correct answer) *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {formData.optionsEn.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <input
                          type="radio"
                          name="correctOption"
                          checked={formData.correctIndex === idx}
                          onChange={() => setFormData({ ...formData, correctIndex: idx })}
                          className="w-4 h-4 text-govt-emerald focus:ring-emerald-500 cursor-pointer shrink-0"
                        />
                        <span className="font-bold text-slate-500 shrink-0">#{String.fromCharCode(65 + idx)}</span>
                        <div className="flex-1 space-y-1.5">
                          <input
                            type="text"
                            required
                            placeholder={`Option ${String.fromCharCode(65 + idx)} (English)`}
                            value={opt}
                            onChange={(e) => handleOptionChange(idx, e.target.value, 'en')}
                            className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs focus:outline-none focus:border-govt-emerald"
                          />
                          <input
                            type="text"
                            placeholder={`آپشن ${String.fromCharCode(65 + idx)} (اردو)`}
                            value={formData.optionsUr[idx]}
                            onChange={(e) => handleOptionChange(idx, e.target.value, 'ur')}
                            className="w-full p-1.5 bg-white border border-slate-200 rounded font-urdu text-right text-xs focus:outline-none focus:border-govt-emerald"
                          />
                        </div>
                      </div>
                    ))}
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
                    className="px-5 py-2 bg-govt-emerald hover:bg-emerald-800 text-white font-bold rounded-lg shadow transition"
                  >
                    {submitting ? 'Saving...' : editingQuestion ? 'Update Question' : 'Add Question'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bulk Import Modal */}
        {bulkModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500 fill-current" />
                  <span>Bulk Import Questions</span>
                </h3>
                <button onClick={() => setBulkModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-600 leading-relaxed">
                  Paste multiple MCQs below in this block format:
                </p>
                <div className="bg-slate-800 text-emerald-300 p-3 rounded-lg text-[11px] font-mono whitespace-pre-wrap leading-relaxed shadow-inner">
                  {`Question text here?\nA) Option one\nB) Option two\nC) Option three\nD) Option four\nAnswer: C`}
                </div>

                {parseError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-bold">
                    {parseError}
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Target Section / Subject *</label>
                  <select
                    value={bulkSubject}
                    onChange={(e) => setBulkSubject(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-xs focus:outline-none focus:border-govt-emerald mb-3"
                  >
                    <option value="General Knowledge">General Knowledge</option>
                    <option value="Pakistan Studies">Pakistan Studies</option>
                    <option value="Islamic Studies">Islamic Studies</option>
                    <option value="English">English</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="General Ability">General Ability</option>
                    <option value="Everyday Science">Everyday Science</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Paste Questions Block:</label>
                  <textarea
                    rows={8}
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder={`When did Pakistan adopt its first constitution?\nA) 1947\nB) 1956\nC) 1962\nD) 1973\nAnswer: B`}
                    className="w-full p-3 border border-slate-200 rounded-lg font-mono text-xs focus:outline-none focus:border-govt-emerald"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleParseBulk}
                    className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-lg font-bold transition flex items-center gap-1.5"
                  >
                    <span>🔍 Parse & Preview Questions</span>
                  </button>
                  {parsedQuestions.length > 0 && (
                    <span className="font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300">
                      Detected {parsedQuestions.length} Valid Questions
                    </span>
                  )}
                </div>

                {/* Preview Parsed List */}
                {parsedQuestions.length > 0 && (
                  <div className="max-h-52 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                    <p className="font-bold text-slate-900">Preview ({parsedQuestions.length} Items):</p>
                    {parsedQuestions.map((q, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                        <p className="font-bold text-slate-900">Q{idx + 1}: {q.textEn}</p>
                        <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 pl-2">
                          <span>A) {q.optionsEn?.[0]}</span>
                          <span>B) {q.optionsEn?.[1]}</span>
                          <span>C) {q.optionsEn?.[2]}</span>
                          <span>D) {q.optionsEn?.[3]}</span>
                        </div>
                        <p className="text-emerald-700 font-bold pt-1">Correct Answer: Option #{(q.correctIndex ?? 0) + 1} ({q.optionsEn && q.correctIndex !== undefined ? q.optionsEn[q.correctIndex] : ''})</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setBulkModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={parsedQuestions.length === 0 || submitting}
                  onClick={handleBulkSubmit}
                  className="px-6 py-2 bg-govt-emerald hover:bg-emerald-800 text-white font-bold rounded-lg text-xs shadow transition disabled:opacity-50"
                >
                  {submitting ? 'Saving All...' : `Save All (${parsedQuestions.length} Questions)`}
                </button>
              </div>
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
    </AdminRoute>
  );
}
