'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '@/components/Loader';
import { useAuth } from '@/context/AuthContext';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Briefcase,
  Upload,
  Calendar,
  MapPin,
  Star,
  FileText
} from 'lucide-react';
import { IJob } from '@/lib/types';

export default function ManageJobsPage() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<IJob | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirmation State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<IJob | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Alert State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    titleEn: '',
    department: '',
    descriptionEn: '',
    location: 'Islamabad',
    category: 'Federal',
    qualification: 'Bachelor',
    vacancies: 1,
    deadline: '',
    source: '',
    featured: false,
    adFile: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('Error loading jobs:', err);
      showToast('Failed to load job postings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (job: IJob | null = null) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        titleEn: job.titleEn || '',
        department: job.department || '',
        descriptionEn: job.descriptionEn || '',
        location: job.location || 'Islamabad',
        category: job.category || 'Federal',
        qualification: job.qualification || 'Bachelor',
        vacancies: job.vacancies || 1,
        deadline: job.deadline ? job.deadline.split('T')[0] : '',
        source: job.source || '',
        featured: job.featured || false,
        adFile: job.adFile || ''
      });
    } else {
      setEditingJob(null);
      setFormData({
        titleEn: '',
        department: '',
        descriptionEn: '',
        location: 'Islamabad',
        category: 'Federal',
        qualification: 'Bachelor',
        vacancies: 1,
        deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        source: '',
        featured: false,
        adFile: ''
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
      setFormData(prev => ({ ...prev, adFile: res.data.url }));
      showToast('Advertisement file attached!');
    } catch (err: any) {
      console.warn('Auto upload delayed to form submission');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleEn.trim() || !formData.department.trim()) {
      showToast('Title and department are required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      let adFileUrl = formData.adFile;

      if (!adFileUrl && selectedFile) {
        const data = new FormData();
        data.append('file', selectedFile);
        const res = await axios.post('/api/upload', data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        adFileUrl = res.data.url;
      }

      const payload = {
        ...formData,
        deadline: formData.deadline || new Date(Date.now() + 14 * 86400000).toISOString(),
        adFile: adFileUrl ? adFileUrl.replace(/\\/g, '/') : ''
      };

      if (editingJob) {
        await axios.put(`/api/jobs/${editingJob._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('Job posting updated!');
      } else {
        await axios.post('/api/jobs', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('New job posting created!');
      }
      setModalOpen(false);
      fetchJobs();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (job: IJob) => {
    setJobToDelete(job);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/jobs/${jobToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Job posting deleted');
      setDeleteModalOpen(false);
      setJobToDelete(null);
      fetchJobs();
    } catch (err: any) {
      showToast('Failed to delete job', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const toggleFeatured = async (job: IJob) => {
    try {
      await axios.put(`/api/jobs/${job._id}`, { featured: !job.featured }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchJobs();
      showToast(`Job ${!job.featured ? 'featured' : 'unfeatured'}`);
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-xs font-bold text-white transition animate-bounce ${
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-govt-emerald" />
            Manage Job Postings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Post, update, filter, or remove official recruitment advertisements</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-govt-emerald hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Job</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search jobs by title, department, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-govt-emerald"
          />
        </div>

        <div className="relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-govt-emerald"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="closing_soon">Closing Soon</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Title & Department</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Vacancies</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Featured</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                      No matching job postings found.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr key={job._id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{job.titleEn}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{job.department}</div>
                      </td>
                      <td className="p-4 text-slate-700">{job.location}</td>
                      <td className="p-4 font-bold text-slate-900">{job.vacancies}</td>
                      <td className="p-4 text-slate-600">
                        {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          job.status === 'open' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          job.status === 'closing_soon' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {job.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => toggleFeatured(job)}
                          className={`p-1.5 rounded-lg transition ${
                            job.featured ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : 'text-slate-300 hover:text-amber-400'
                          }`}
                          title={job.featured ? 'Unmark Featured' : 'Mark Featured'}
                        >
                          <Star className={`w-4 h-4 ${job.featured ? 'fill-amber-500' : ''}`} />
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(job)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition"
                            title="Edit Job"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(job)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition"
                            title="Delete Job"
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

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-govt-emerald" />
                {editingJob ? 'Edit Job Posting' : 'Post New Job'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-govt-emerald"
                  placeholder="e.g. Assistant Director (BPS-17)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department / Ministry *</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-govt-emerald"
                    placeholder="e.g. FIA / FPSC / FBR"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location / Station</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-govt-emerald"
                    placeholder="Islamabad / Punjab"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vacancies</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.vacancies}
                    onChange={(e) => setFormData({ ...formData, vacancies: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-govt-emerald"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-govt-emerald"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Qualification</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-govt-emerald"
                    placeholder="Bachelor / Master"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-govt-emerald"
                  placeholder="Key responsibilities and guidelines..."
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Upload Job Advertisement File (PDF/Image)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-govt-emerald hover:file:bg-emerald-100"
                  />
                  {uploadingFile && <span className="text-xs text-emerald-600 animate-pulse font-bold">Uploading...</span>}
                  {(formData.adFile || selectedFile) && (
                    <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                      ✓ Attached
                    </span>
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
                  className="px-5 py-2 bg-govt-emerald hover:bg-emerald-800 text-white font-bold rounded-lg shadow transition"
                >
                  {submitting ? 'Saving...' : editingJob ? 'Update Job' : 'Publish Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && jobToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-900">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold">Confirm Delete Posting</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900">{jobToDelete.titleEn}</strong>?
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
