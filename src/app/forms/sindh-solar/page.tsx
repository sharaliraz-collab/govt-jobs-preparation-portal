'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Printer, RefreshCw, CheckCircle2, Sun, Zap, Lock, Upload, User, MapPin, Bolt } from 'lucide-react';
import axios from 'axios';

interface FormData {
  fullName: string;
  surname: string;
  fatherHusband: string;
  relation: string;
  cnic: string;
  dateOfBirth: string;
  gender: string;
  mobile: string;
  email: string;
  address: string;
  district: string;
  tehsil: string;
  unionCouncil: string;
  village: string;
  consumerNo: string;
  discoCompany: string;
  connectionType: string;
  capacity: string;
}

const defaultForm: FormData = {
  fullName: '', surname: '', fatherHusband: '', relation: 'Father',
  cnic: '', dateOfBirth: '', gender: 'Male', mobile: '', email: '',
  address: '', district: '', tehsil: '', unionCouncil: '', village: '',
  consumerNo: '', discoCompany: 'HESCO', connectionType: 'Domestic', capacity: '3 KW'
};

export default function SindhSolarFormPage() {
  const [form, setForm] = useState<FormData>(defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationNo, setApplicationNo] = useState('');
  const [submitError, setSubmitError] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);
  const slipRef = useRef<HTMLDivElement>(null);

  const set = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!form.surname.trim()) newErrors.surname = 'Surname is required.';
    if (!form.fatherHusband.trim()) newErrors.fatherHusband = 'Father / Husband name is required.';
    if (!/^\d{13}$/.test(form.cnic)) newErrors.cnic = 'CNIC must be exactly 13 digits.';
    if (!form.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required.';
    if (!/^03\d{9}$/.test(form.mobile)) newErrors.mobile = 'Enter valid 11-digit mobile starting with 03.';
    if (!form.address.trim()) newErrors.address = 'Address is required.';
    if (!form.district.trim()) newErrors.district = 'District is required.';
    if (!form.tehsil.trim()) newErrors.tehsil = 'Tehsil is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) {
      const firstError = document.querySelector('.field-error');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      // Upload photo if any
      let photoUrl = '';
      if (photoFile) {
        const fd = new FormData();
        fd.append('file', photoFile);
        try {
          const uploadRes = await axios.post('/api/upload', fd);
          photoUrl = uploadRes.data.url || '';
        } catch {
          // Photo upload optional — continue
        }
      }

      const res = await axios.post('/api/solar-applications', {
        ...form,
        photoUrl
      });

      setApplicationNo(res.data.applicationNo);
      setSubmitted(true);
      setTimeout(() => {
        slipRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(defaultForm);
    setErrors({});
    setPhotoFile(null);
    setPhotoPreview('');
    setSubmitted(false);
    setApplicationNo('');
    setSubmitError('');
  };

  const handlePrint = () => window.print();

  const fields = (
    <div className="space-y-0">
      {/* Header */}
      <div
        className="text-white rounded-t-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #046a38 0%, #024d29 100%)', borderBottom: '5px solid #c8a24a' }}
      >
        {/* Gold stripe */}
        <div style={{ height: 4, background: 'repeating-linear-gradient(90deg,#c8a24a 0 20px,transparent 20px 40px)' }} />
        <div className="py-7 px-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sun className="w-7 h-7 text-yellow-300" />
            <Zap className="w-5 h-5 text-yellow-200" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-wide uppercase">Sindh Solar Energy Program</h1>
          <h2 className="font-sindhi text-xl" style={{ direction: 'rtl', lineHeight: '2', fontWeight: 400 }}>سنڌ سولر توانائي جو منصوبو</h2>
          <p className="text-xs text-green-100 tracking-wide">Government of Sindh &nbsp;|&nbsp; Application Form for Solar Panel Installation</p>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} noValidate className="bg-white rounded-b-2xl border border-t-0 border-slate-200 shadow-md overflow-hidden">

        {/* === SECTION 1 === */}
        <div className="bg-emerald-50 border-y border-emerald-200 px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>Applicant Photograph &amp; Basic Information</span>
          </div>
          <span className="font-sindhi text-sm text-emerald-800" style={{ direction: 'rtl' }}>درخواست ڏيندڙ جو فوٽو ۽ بنيادي معلومات</span>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Photo Upload */}
          <div className="sm:col-span-2 flex flex-col sm:flex-row gap-5 items-start">
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-32 h-36 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-emerald-400 transition"
                onClick={() => photoInputRef.current?.click()}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Applicant" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-slate-400 text-xs p-2">
                    <Upload className="w-6 h-6 mx-auto mb-1" />
                    <span>Passport<br />Photo</span>
                  </div>
                )}
              </div>
              <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="text-[11px] font-bold text-emerald-700 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition"
              >
                Upload Photo
              </button>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Full Name (CNIC) <span className="text-red-500">*</span></label>
                <span className="label-sindhi">پورو نالو (سي اين آءِ سي مطابق)</span>
                <input type="text" value={form.fullName} onChange={e => set('fullName', e.target.value)} className={`sf-input ${errors.fullName ? 'sf-input-error' : ''}`} placeholder="Muhammad Asif" />
                {errors.fullName && <p className="field-error">{errors.fullName}</p>}
              </div>

              <div>
                <label className="field-label">Surname / Caste <span className="text-red-500">*</span></label>
                <span className="label-sindhi">سرنيم / ذات</span>
                <input type="text" value={form.surname} onChange={e => set('surname', e.target.value)} className={`sf-input ${errors.surname ? 'sf-input-error' : ''}`} placeholder="Solangi" />
                {errors.surname && <p className="field-error">{errors.surname}</p>}
              </div>
            </div>
          </div>

          <div>
            <label className="field-label">Father / Husband Name <span className="text-red-500">*</span></label>
            <span className="label-sindhi">پيءُ / مڙس جو نالو</span>
            <input type="text" value={form.fatherHusband} onChange={e => set('fatherHusband', e.target.value)} className={`sf-input ${errors.fatherHusband ? 'sf-input-error' : ''}`} placeholder="Full name" />
            {errors.fatherHusband && <p className="field-error">{errors.fatherHusband}</p>}
          </div>

          <div>
            <label className="field-label">Relationship <span className="label-sindhi" style={{ fontWeight: 400 }}>لاڳاپو</span></label>
            <div className="flex gap-6 mt-2">
              {['Father', 'Husband'].map(r => (
                <label key={r} className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input type="radio" name="relation" value={r} checked={form.relation === r} onChange={() => set('relation', r)} className="accent-emerald-600 w-4 h-4" />
                  <span>{r}</span>
                  <span className="font-sindhi text-sm text-slate-500">{r === 'Father' ? 'پيءُ' : 'مڙس'}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label">CNIC Number (13 digits) <span className="text-red-500">*</span></label>
            <span className="label-sindhi">سي اين آءِ سي نمبر</span>
            <input
              type="text" inputMode="numeric" maxLength={13}
              value={form.cnic}
              onChange={e => set('cnic', e.target.value.replace(/\D/g, '').slice(0, 13))}
              className={`sf-input ${errors.cnic ? 'sf-input-error' : ''}`}
              placeholder="4130112345671"
            />
            <p className="hint-text">13 digits, no dashes</p>
            {errors.cnic && <p className="field-error">{errors.cnic}</p>}
          </div>

          <div>
            <label className="field-label">Date of Birth <span className="text-red-500">*</span></label>
            <span className="label-sindhi">ڄم جي تاريخ</span>
            <input type="date" value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} className={`sf-input ${errors.dateOfBirth ? 'sf-input-error' : ''}`} />
            {errors.dateOfBirth && <p className="field-error">{errors.dateOfBirth}</p>}
          </div>

          <div>
            <label className="field-label">Gender <span className="label-sindhi" style={{ fontWeight: 400 }}>جنس</span></label>
            <select value={form.gender} onChange={e => set('gender', e.target.value)} className="sf-input">
              <option value="Male">Male / مرد</option>
              <option value="Female">Female / عورت</option>
              <option value="Other">Other / ٻيو</option>
            </select>
          </div>

          <div>
            <label className="field-label">Mobile Number <span className="text-red-500">*</span></label>
            <span className="label-sindhi">موبائل نمبر</span>
            <input
              type="tel" inputMode="numeric" maxLength={11}
              value={form.mobile}
              onChange={e => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 11))}
              className={`sf-input ${errors.mobile ? 'sf-input-error' : ''}`}
              placeholder="03001234567"
            />
            <p className="hint-text">Format: 03XXXXXXXXX</p>
            {errors.mobile && <p className="field-error">{errors.mobile}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="field-label">Email Address (optional) <span className="label-sindhi" style={{ fontWeight: 400 }}>اي ميل پتو (اختياري)</span></label>
            <input type="text" value={form.email} onChange={e => set('email', e.target.value)} className="sf-input" placeholder="example@email.com" />
          </div>
        </div>

        {/* === SECTION 2 === */}
        <div className="bg-emerald-50 border-y border-emerald-200 px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Address &amp; Location Details</span>
          </div>
          <span className="font-sindhi text-sm text-emerald-800" style={{ direction: 'rtl' }}>پتو ۽ جاءِ جي تفصيل</span>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="field-label">Complete Residential Address <span className="text-red-500">*</span></label>
            <span className="label-sindhi">مڪمل رهائشي پتو</span>
            <textarea value={form.address} onChange={e => set('address', e.target.value)} rows={2} className={`sf-input resize-none ${errors.address ? 'sf-input-error' : ''}`} placeholder="House No, Street, Village / Town" />
            {errors.address && <p className="field-error">{errors.address}</p>}
          </div>

          <div>
            <label className="field-label">District <span className="text-red-500">*</span></label>
            <span className="label-sindhi">ضلعو</span>
            <input type="text" value={form.district} onChange={e => set('district', e.target.value)} className={`sf-input ${errors.district ? 'sf-input-error' : ''}`} placeholder="e.g. Khairpur" />
            {errors.district && <p className="field-error">{errors.district}</p>}
          </div>

          <div>
            <label className="field-label">Tehsil / Taluka <span className="text-red-500">*</span></label>
            <span className="label-sindhi">تحصيل / تعلقو</span>
            <input type="text" value={form.tehsil} onChange={e => set('tehsil', e.target.value)} className={`sf-input ${errors.tehsil ? 'sf-input-error' : ''}`} placeholder="e.g. Thari Mirwah" />
            {errors.tehsil && <p className="field-error">{errors.tehsil}</p>}
          </div>

          <div>
            <label className="field-label">Union Council (UC) <span className="label-sindhi" style={{ fontWeight: 400 }}>يونين ڪائونسل</span></label>
            <input type="text" value={form.unionCouncil} onChange={e => set('unionCouncil', e.target.value)} className="sf-input" placeholder="UC name / number" />
          </div>

          <div>
            <label className="field-label">Village / Town <span className="label-sindhi" style={{ fontWeight: 400 }}>ڳوٺ / شهر</span></label>
            <input type="text" value={form.village} onChange={e => set('village', e.target.value)} className="sf-input" placeholder="Village or town name" />
          </div>
        </div>

        {/* === SECTION 3 === */}
        <div className="bg-emerald-50 border-y border-emerald-200 px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
            <Bolt className="w-4 h-4" />
            <span>Electricity &amp; Solar System Details</span>
          </div>
          <span className="font-sindhi text-sm text-emerald-800" style={{ direction: 'rtl' }}>بجلي ۽ سولر سسٽم جا تفصيل</span>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Electricity Consumer No. <span className="label-sindhi" style={{ fontWeight: 400 }}>بجلي ڪنزيومر نمبر</span></label>
            <input type="text" value={form.consumerNo} onChange={e => set('consumerNo', e.target.value)} className="sf-input" placeholder="HESCO/SEPCO ref no." />
          </div>

          <div>
            <label className="field-label">Power Distribution Company <span className="label-sindhi" style={{ fontWeight: 400 }}>بجلي ڪمپني</span></label>
            <select value={form.discoCompany} onChange={e => set('discoCompany', e.target.value)} className="sf-input">
              <option value="HESCO">HESCO</option>
              <option value="SEPCO">SEPCO</option>
              <option value="K-Electric">K-Electric</option>
              <option value="Other">Other / ٻيو</option>
            </select>
          </div>

          <div>
            <label className="field-label">Connection Type <span className="label-sindhi" style={{ fontWeight: 400 }}>ڪنيڪشن جو قسم</span></label>
            <select value={form.connectionType} onChange={e => set('connectionType', e.target.value)} className="sf-input">
              <option value="Domestic">Domestic / گھريلو</option>
              <option value="Commercial">Commercial / ڪمرشل</option>
              <option value="Agricultural">Agricultural / زرعي</option>
            </select>
          </div>

          <div>
            <label className="field-label">Solar System Capacity <span className="label-sindhi" style={{ fontWeight: 400 }}>سولر سسٽم جي گنجائش</span></label>
            <select value={form.capacity} onChange={e => set('capacity', e.target.value)} className="sf-input">
              <option value="1 KW">1 KW</option>
              <option value="2 KW">2 KW</option>
              <option value="3 KW">3 KW</option>
              <option value="5 KW">5 KW</option>
              <option value="Other">Other / Not sure</option>
            </select>
          </div>
        </div>

        {/* Declaration */}
        <div className="mx-5 mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed space-y-2">
          <p><strong>Declaration:</strong> I hereby declare that the information provided above is true and correct to the best of my knowledge. Any false information may lead to rejection of my application.</p>
          <p className="font-sindhi text-sm text-amber-800" style={{ direction: 'rtl', lineHeight: '2' }}>
            بيان: مان انهيءَ ڳالهه جو اقرار ڪريان ٿو ته مٿي ڏنل معلومات درست آهي. ڪا به غلط معلومات ملڻ تي منهنجي درخواست رد ٿي سگهي ٿي.
          </p>
        </div>

        {submitError && (
          <div className="mx-5 mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-xs text-red-800 font-semibold">
            ⚠️ {submitError}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center px-5 pb-7 pt-2 print:hidden">
          <button type="submit" disabled={submitting} className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold px-7 py-2.5 rounded-xl transition shadow disabled:opacity-60">
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
          </button>
          <button type="button" onClick={handlePrint} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition">
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
          <button type="button" onClick={handleReset} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold px-5 py-2.5 rounded-xl transition">
            <RefreshCw className="w-4 h-4" />
            <span>Reset Form</span>
          </button>
        </div>
      </form>
    </div>
  );

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div ref={slipRef} className="bg-white rounded-2xl border border-emerald-300 shadow-lg overflow-hidden" id="ack-slip">
          {/* Slip Header */}
          <div className="text-white py-6 px-6 text-center" style={{ background: 'linear-gradient(135deg, #046a38, #024d29)', borderBottom: '4px solid #c8a24a' }}>
            <Sun className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
            <h2 className="text-lg font-black tracking-wide uppercase">Application Acknowledgment</h2>
            <p className="text-xs text-green-100 mt-1">Sindh Solar Energy Program — Government of Sindh</p>
            <p className="font-sindhi text-base mt-1" style={{ direction: 'rtl', lineHeight: '2' }}>سنڌ سولر توانائي پروگرام — درخواست جي تصديق</p>
          </div>

          {/* Success Message */}
          <div className="p-7 space-y-6">
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-emerald-900 text-sm">✅ Application Submitted Successfully!</p>
                <p className="text-xs text-emerald-700 mt-0.5">Your application has been received and will be reviewed by the relevant department.</p>
              </div>
            </div>

            {/* Application Number */}
            <div className="text-center bg-slate-900 text-white rounded-xl p-5 space-y-1">
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Application ID</p>
              <p className="text-2xl font-black tracking-wider text-yellow-300">{applicationNo}</p>
              <p className="text-xs text-slate-400 font-sindhi" style={{ direction: 'rtl', lineHeight: 1.8 }}>مٿي ڏنل آئي ڊي کي محفوظ ڪريو</p>
            </div>

            {/* Applicant Summary */}
            <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs overflow-hidden">
              {[
                ['Applicant Name', `${form.fullName} ${form.surname}`],
                ['Father / Husband', form.fatherHusband],
                ['CNIC', form.cnic],
                ['Mobile', form.mobile],
                ['District', form.district],
                ['Tehsil', form.tehsil],
                ['Capacity Requested', form.capacity],
                ['DISCO', form.discoCompany],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-slate-500 font-medium">{label}</span>
                  <span className="font-bold text-slate-900 text-right">{value}</span>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-[11px] text-amber-900 leading-relaxed font-medium">
              ⚠️ Please keep this acknowledgment slip for your records. You may print this page as a PDF for future reference.
            </div>

            <div className="flex flex-wrap gap-3 justify-center print:hidden">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-xl transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Submit Another Application</span>
              </button>
              <Link href="/forms" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Forms</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6">
      <style>{`
        .sf-input {
          width: 100%;
          padding: 8px 11px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 13px;
          background: #fafcfb;
          transition: border 0.15s, box-shadow 0.15s;
          outline: none;
          margin-top: 4px;
        }
        .sf-input:focus {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5,150,105,0.12);
        }
        .sf-input-error {
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 3px rgba(239,68,68,0.10) !important;
        }
        .field-label {
          font-size: 12px;
          font-weight: 700;
          color: #1a2a1f;
          display: block;
        }
        .label-sindhi {
          font-family: 'Lateef', 'Noto Naskh Arabic', serif;
          font-size: 14px;
          color: #4a6050;
          direction: rtl;
          display: block;
          line-height: 1.8;
        }
        .field-error {
          font-size: 11px;
          color: #c0392b;
          margin-top: 3px;
          font-weight: 600;
        }
        .hint-text {
          font-size: 11px;
          color: #78858b;
          margin-top: 3px;
        }
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white; }
        }
      `}</style>

      <div className="print:hidden mb-5">
        <Link href="/forms" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Forms</span>
        </Link>
      </div>

      {fields}
    </div>
  );
}
