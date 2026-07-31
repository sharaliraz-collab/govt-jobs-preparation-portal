'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import {
  Sun, Search, Eye, ChevronDown, Users,
  CheckCircle2, Clock, XCircle, RefreshCw, Download
} from 'lucide-react';

interface Application {
  id: string;
  applicationNo: string;
  fullName: string;
  surname: string;
  cnic: string;
  mobile: string;
  district: string;
  tehsil: string;
  capacity: string;
  discoCompany: string;
  connectionType: string;
  status: string;
  submittedAt: string;
  photoUrl?: string;
  fatherHusband: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  unionCouncil?: string;
  village?: string;
  consumerNo?: string;
  email?: string;
  relation: string;
}

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Approved: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  Rejected: 'bg-red-100 text-red-800 border-red-300',
  'Under Review': 'bg-blue-100 text-blue-800 border-blue-300',
};

export default function AdminSolarApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Application | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (search.trim()) params.set('search', search.trim());
      const res = await axios.get(`/api/solar-applications?${params.toString()}`);
      setApplications(res.data.applications || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('Error fetching solar applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications();
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingStatus(true);
    try {
      await axios.patch(`/api/solar-applications/${id}`, { status });
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
    } catch (err) {
      console.error('Status update error:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const exportCSV = () => {
    const headers = ['App No','Full Name','CNIC','Mobile','District','Tehsil','Capacity','DISCO','Status','Submitted'];
    const rows = applications.map(a => [
      a.applicationNo, `${a.fullName} ${a.surname}`, a.cnic, a.mobile,
      a.district, a.tehsil, a.capacity, a.discoCompany, a.status,
      new Date(a.submittedAt).toLocaleDateString('en-PK')
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solar-applications-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusIcon = (status: string) => {
    if (status === 'Approved') return <CheckCircle2 className="w-3.5 h-3.5" />;
    if (status === 'Rejected') return <XCircle className="w-3.5 h-3.5" />;
    return <Clock className="w-3.5 h-3.5" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 text-white rounded-2xl p-5 shadow-md border border-emerald-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sun className="w-7 h-7 text-yellow-300" />
            <div>
              <h1 className="text-lg font-black">Sindh Solar Energy Program</h1>
              <p className="text-xs text-emerald-200">Submitted Applications — Admin View</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/10 px-4 py-2 rounded-lg text-center">
              <p className="text-xs text-emerald-200">Total Applications</p>
              <p className="text-2xl font-black text-yellow-300">{total}</p>
            </div>
            <button onClick={exportCSV} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-xs font-bold border border-white/20 transition">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <form onSubmit={handleSearch} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, CNIC, app no, district..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Under Review">Under Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2 rounded-lg transition">
          Search
        </button>
        <button type="button" onClick={() => { setSearch(''); setStatusFilter(''); setTimeout(fetchApplications, 50); }} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg transition flex items-center gap-1">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </form>

      {/* Applications Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm text-slate-500 font-semibold">No applications found.</p>
            <Link href="/forms/sindh-solar" className="text-xs text-emerald-600 hover:underline font-bold">→ Go to Application Form</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['App No', 'Applicant', 'CNIC', 'Mobile', 'District', 'Capacity', 'Status', 'Submitted', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-bold text-slate-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono font-bold text-slate-800 whitespace-nowrap">{app.applicationNo}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{app.fullName} {app.surname}</div>
                      <div className="text-[10px] text-slate-500">{app.fatherHusband}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-700">{app.cnic}</td>
                    <td className="px-4 py-3 text-slate-700">{app.mobile}</td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{app.district}, {app.tehsil}</td>
                    <td className="px-4 py-3 font-bold text-slate-800">{app.capacity}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full border text-[10px] font-extrabold flex items-center gap-1 w-fit ${STATUS_COLORS[app.status] || 'bg-slate-100 text-slate-700'}`}>
                        {statusIcon(app.status)}
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(app.submittedAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(app)}
                        className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-lg border border-emerald-200 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-5 rounded-t-2xl flex items-center justify-between">
              <div>
                <h2 className="font-black text-base">Application Detail</h2>
                <p className="text-emerald-200 text-xs">{selected.applicationNo}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/70 hover:text-white text-xl font-bold">✕</button>
            </div>

            <div className="p-5 space-y-5 text-xs">
              {/* Photo */}
              {selected.photoUrl && (
                <div className="flex justify-center">
                  <img src={selected.photoUrl} alt="Applicant" className="w-28 h-32 rounded-xl object-cover border-2 border-emerald-300 shadow" />
                </div>
              )}

              {/* Detail rows */}
              {[
                ['Full Name', `${selected.fullName} ${selected.surname}`],
                ['Father / Husband', `${selected.fatherHusband} (${selected.relation})`],
                ['CNIC', selected.cnic],
                ['Date of Birth', selected.dateOfBirth],
                ['Gender', selected.gender],
                ['Mobile', selected.mobile],
                ['Email', selected.email || '—'],
                ['Address', selected.address],
                ['District', selected.district],
                ['Tehsil', selected.tehsil],
                ['Union Council', selected.unionCouncil || '—'],
                ['Village', selected.village || '—'],
                ['Consumer No.', selected.consumerNo || '—'],
                ['DISCO', selected.discoCompany],
                ['Connection Type', selected.connectionType],
                ['Capacity', selected.capacity],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4 border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-medium w-1/3 shrink-0">{label}</span>
                  <span className="font-bold text-slate-900 text-right flex-1">{value}</span>
                </div>
              ))}

              {/* Status Update */}
              <div className="pt-2">
                <p className="font-bold text-slate-700 mb-2">Update Status:</p>
                <div className="flex flex-wrap gap-2">
                  {['Pending', 'Under Review', 'Approved', 'Rejected'].map(s => (
                    <button
                      key={s}
                      disabled={updatingStatus || selected.status === s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold transition disabled:opacity-50 ${
                        selected.status === s
                          ? STATUS_COLORS[s] + ' border'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
