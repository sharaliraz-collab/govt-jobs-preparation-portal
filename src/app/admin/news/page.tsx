'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '@/components/Loader';
import { useAuth } from '@/context/AuthContext';
import {
  Newspaper,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Pin,
  CheckCircle,
  AlertTriangle,
  Upload
} from 'lucide-react';
import { INews } from '@/lib/types';

export default function ManageNewsPage() {
  const { token } = useAuth();
  const [news, setNews] = useState<INews[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<INews | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<INews | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form Data (No Urdu fields)
  const [formData, setFormData] = useState({
    titleEn: '',
    bodyEn: '',
    category: 'General' as 'Result' | 'Notification' | 'Deadline Extension' | 'General',
    coverImage: '',
    pinned: false
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/news');
      setNews(res.data);
    } catch (err) {
      console.error('Error fetching news:', err);
      showToast('Failed to load news articles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item: INews | null = null) => {
    if (item) {
      setEditingNews(item);
      setFormData({
        titleEn: item.titleEn || '',
        bodyEn: item.bodyEn || '',
        category: item.category || 'General',
        coverImage: item.coverImage || '',
        pinned: item.pinned || false
      });
    } else {
      setEditingNews(null);
      setFormData({
        titleEn: '',
        bodyEn: '',
        category: 'General',
        coverImage: '',
        pinned: false
      });
    }
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const data = new FormData();
    data.append('file', selected);

    setUploadingImage(true);
    try {
      const res = await axios.post('/api/upload', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormData(prev => ({ ...prev, coverImage: res.data.url }));
      showToast('Cover image uploaded!');
    } catch (err: any) {
      showToast('Failed to upload image', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleEn || !formData.bodyEn) {
      showToast('Please provide news title and content body', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (editingNews) {
        await axios.put(`/api/news/${editingNews._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('News article updated!');
      } else {
        await axios.post('/api/news', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('New article published!');
      }
      setModalOpen(false);
      fetchNews();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to save news article', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (item: INews) => {
    setNewsToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!newsToDelete) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/news/${newsToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('News article deleted');
      setDeleteModalOpen(false);
      setNewsToDelete(null);
      fetchNews();
    } catch (err: any) {
      showToast('Failed to delete news article', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const togglePinned = async (item: INews) => {
    try {
      await axios.put(`/api/news/${item._id}`, { pinned: !item.pinned }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNews();
      showToast(`Article ${!item.pinned ? 'pinned' : 'unpinned'}`);
    } catch (err) {
      showToast('Failed to update pinned state', 'error');
    }
  };

  const filteredNews = news.filter(item => {
    const matchesSearch =
      item.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bodyEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-xs font-bold text-white transition animate-bounce ${
          toast.type === 'success' ? 'bg-purple-700' : 'bg-red-600'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-purple-700" />
            Manage News & Announcements
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Publish test results, notices, and official news announcements</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Article</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search news by title or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-purple-600"
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-purple-600"
          >
            <option value="all">All News Categories</option>
            <option value="Result">Result</option>
            <option value="Notification">Notification</option>
            <option value="Deadline Extension">Deadline Extension</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>

      {/* News Table */}
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Article Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Published Date</th>
                  <th className="p-4 text-center">Pinned</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredNews.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                      No matching news articles found.
                    </td>
                  </tr>
                ) : (
                  filteredNews.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          {item.pinned && (
                            <span className="bg-purple-100 text-purple-800 text-[10px] px-2 py-0.5 rounded font-bold">
                              PINNED
                            </span>
                          )}
                          <span>{item.titleEn}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{item.bodyEn}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">
                        {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => togglePinned(item)}
                          className={`p-1.5 rounded-lg transition ${
                            item.pinned ? 'text-purple-700 bg-purple-100 hover:bg-purple-200' : 'text-slate-300 hover:text-purple-600'
                          }`}
                          title={item.pinned ? 'Unpin' : 'Pin to top'}
                        >
                          <Pin className={`w-4 h-4 ${item.pinned ? 'fill-purple-700' : ''}`} />
                        </button>
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

      {/* Add / Edit Modal (Clean & Simple) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-purple-700" />
                {editingNews ? 'Edit Article' : 'Publish News Article'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Article Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-600"
                >
                  <option value="General">General News</option>
                  <option value="Notification">Official Notification</option>
                  <option value="Result">Test Result Announcement</option>
                  <option value="Deadline Extension">Deadline Extension Notice</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-600"
                  placeholder="e.g. FPSC CSS Exam 2026 Date Sheet Released"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Content Body *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.bodyEn}
                  onChange={(e) => setFormData({ ...formData, bodyEn: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-600"
                  placeholder="Detailed announcement text..."
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Cover Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  {uploadingImage && <span className="text-xs text-purple-700 animate-pulse font-bold">Uploading...</span>}
                  {formData.coverImage && (
                    <span className="text-xs text-purple-800 font-bold bg-purple-50 px-2 py-1 rounded border border-purple-200">
                      ✓ Attached
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pinned"
                  checked={formData.pinned}
                  onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <label htmlFor="pinned" className="font-bold text-slate-700 cursor-pointer">
                  Pin this article to top ticker banner
                </label>
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
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg shadow transition"
                >
                  {submitting ? 'Publishing...' : editingNews ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && newsToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-900">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold">Confirm Delete</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900">{newsToDelete.titleEn}</strong>?
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
