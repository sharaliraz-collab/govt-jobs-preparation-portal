'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '@/components/Loader';
import { useAuth } from '@/context/AuthContext';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  CheckCircle,
  AlertTriangle,
  Upload,
  Download
} from 'lucide-react';
import { IMaterial } from '@/lib/types';

export default function ManageMaterialsPage() {
  const { token } = useAuth();
  const [materials, setMaterials] = useState<IMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IMaterial | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<IMaterial | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form Data
  const [formData, setFormData] = useState({
    subject: 'General Knowledge',
    titleEn: '',
    descriptionEn: '',
    file: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/materials');
      setMaterials(res.data);
    } catch (err) {
      console.error('Error loading materials:', err);
      showToast('Failed to load study materials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item: IMaterial | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        subject: item.subject || 'General Knowledge',
        titleEn: item.titleEn || '',
        descriptionEn: item.descriptionEn || '',
        file: item.file || ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        subject: 'General Knowledge',
        titleEn: '',
        descriptionEn: '',
        file: ''
      });
    }
    setSelectedFile(null);
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setSelectedFile(selected);

    const data = new FormData();
    data.append('file', selected);

    setUploadingFile(true);
    try {
      const res = await axios.post('/api/upload', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormData(prev => ({ ...prev, file: res.data.url }));
      showToast('File attached successfully!');
    } catch (err: any) {
      console.warn('Auto upload delayed to form submission');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleEn.trim()) {
      showToast('Please enter a document title', 'error');
      return;
    }

    setSubmitting(true);
    try {
      let fileUrl = formData.file;

      if (!fileUrl && selectedFile) {
        const data = new FormData();
        data.append('file', selectedFile);
        const res = await axios.post('/api/upload', data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        fileUrl = res.data.url;
      }

      if (!fileUrl) {
        fileUrl = '/uploads/sample_study_material.pdf';
      }

      const payload = {
        ...formData,
        file: fileUrl
      };

      if (editingItem) {
        await axios.put(`/api/materials/${editingItem._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('Study material updated!');
      } else {
        await axios.post('/api/materials', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('New study material published!');
      }
      setModalOpen(false);
      fetchMaterials();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to save', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (item: IMaterial) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/materials/${itemToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Material deleted');
      setDeleteModalOpen(false);
      setItemToDelete(null);
      fetchMaterials();
    } catch (err) {
      showToast('Failed to delete material', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredMaterials = materials.filter(item => {
    const matchesSearch = item.titleEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || item.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-xs font-bold text-white transition animate-bounce ${
          toast.type === 'success' ? 'bg-blue-600' : 'bg-red-600'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-700" />
            Upload Study Material / Past Papers
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Upload exam prep notes, past paper PDFs, and syllabus documents</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Material</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search materials by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-600"
          >
            <option value="all">All Subjects</option>
            <option value="General Knowledge">General Knowledge</option>
            <option value="Pakistan Studies">Pakistan Studies</option>
            <option value="Islamic Studies">Islamic Studies</option>
            <option value="English">English</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Mathematics">Mathematics</option>
          </select>
        </div>
      </div>

      {/* Materials Table */}
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-center">Downloads</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredMaterials.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                      No study materials found. Click "Upload Material" to add one.
                    </td>
                  </tr>
                ) : (
                  filteredMaterials.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          {item.subject}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-900">{item.titleEn}</td>
                      <td className="p-4 text-slate-500 max-w-xs truncate">{item.descriptionEn || 'N/A'}</td>
                      <td className="p-4 text-center font-bold text-slate-800">
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          <Download className="w-3 h-3 text-slate-500" />
                          {item.downloadCount || 0}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(item)}
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
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-700" />
                {editingItem ? 'Edit Study Material' : 'Upload Study Material'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Step 1: Subject */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">1. Category / Subject *</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-none focus:border-blue-600"
                >
                  <option value="General Knowledge">General Knowledge</option>
                  <option value="Pakistan Studies">Pakistan Studies</option>
                  <option value="Islamic Studies">Islamic Studies</option>
                  <option value="English">English</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Everyday Science">Everyday Science</option>
                </select>
              </div>

              {/* Step 2: Title */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">2. Document Title *</label>
                <input
                  type="text"
                  required
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                  placeholder="e.g. FPSC Past Papers Solution Set (2020-2025)"
                />
              </div>

              {/* Step 3: Description */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">3. Description</label>
                <textarea
                  rows={3}
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                  placeholder="Brief summary of notes or past paper contents..."
                />
              </div>

              {/* Step 4: Select File */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">4. Select PDF File</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                  {uploadingFile && <span className="text-xs text-blue-700 animate-pulse font-bold">Uploading...</span>}
                  {(formData.file || selectedFile) && (
                    <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                      ✓ Ready
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
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
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg shadow transition"
                >
                  {submitting ? 'Saving...' : editingItem ? 'Update Material' : 'Upload Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-900">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold">Confirm Delete</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900">{itemToDelete.titleEn}</strong>?
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
