'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const RECIPIENT = 'binariclabs@gmail.com';

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({
  label, name, type = 'text', placeholder, value, error, touched, onChange, onBlur, required,
}: {
  label: string; name: string; type?: string; placeholder: string; value: string;
  error?: string; touched?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const hasError = !!(error && touched);
  const isFilled = value.length > 0;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <label className="text-[10px] tracking-[0.3em] text-white/30 font-light">
          {label}{required && <span className="text-white/20 ml-1">*</span>}
        </label>
        <AnimatePresence>
          {hasError && (
            <motion.span
              initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="text-[9px] tracking-[0.2em] text-white/40 font-light"
            >
              {error}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="relative">
        <input
          type={type} name={name} value={value}
          onChange={onChange}
          onBlur={(e) => { setFocused(false); onBlur(e); }}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          className="w-full px-0 py-3 bg-transparent text-white/80 text-sm font-light placeholder-white/15 focus:outline-none tracking-wide"
          style={{ caretColor: 'rgba(255,255,255,0.6)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.08]" />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px"
          animate={{ scaleX: focused || isFilled ? 1 : 0, opacity: hasError ? 0 : 1, backgroundColor: focused ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.18)' }}
          style={{ originX: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-white/25"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: hasError ? 1 : 0 }}
          style={{ originX: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

// ─── Success state ────────────────────────────────────────────────────────────
function SuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="py-16 flex flex-col items-center text-center gap-8"
    >
      <div className="relative w-16 h-16">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 border border-white/15 rounded-full" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 border border-white/10 rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
        </div>
      </div>
      <div>
        <p className="text-white/80 text-sm tracking-[0.25em] font-light mb-2">TRANSMISSION READY</p>
        <p className="text-white/25 text-xs tracking-[0.2em] font-light">Your email app has opened — hit send when ready.</p>
      </div>
      <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <p className="text-white/15 text-[10px] tracking-[0.3em]">BINARIC LABS</p>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DemoForm() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', hearAboutUs: '' });
  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [touched,    setTouched]    = useState<Record<string, boolean>>({});
  const [submitted,  setSubmitted]  = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'firstName': if (!value.trim()) return 'Required'; if (value.length < 2) return 'Too short'; break;
      case 'lastName':  if (!value.trim()) return 'Required'; if (value.length < 2) return 'Too short'; break;
      case 'email':     if (!value.trim()) return 'Required'; if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email'; break;
    }
    return '';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, formData[name as keyof typeof formData]) }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    const required = ['firstName', 'lastName', 'email'];
    setTouched(required.reduce((a, k) => ({ ...a, [k]: true }), {} as Record<string, boolean>));
    const newErrors: Record<string, string> = {};
    required.forEach(k => {
      const err = validateField(k, formData[k as keyof typeof formData]);
      if (err) newErrors[k] = err;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 700));

    // Build mailto URI
    const subject = encodeURIComponent(
      `Demo Request — ${formData.firstName} ${formData.lastName}`
    );
    const body = encodeURIComponent(
`Hi Binaric Labs,

I'd like to schedule a demo.

──────────────────────
Name:   ${formData.firstName} ${formData.lastName}
Email:  ${formData.email}${formData.hearAboutUs ? `\nFound you via: ${formData.hearAboutUs}` : ''}
──────────────────────

Looking forward to connecting.

— ${formData.firstName}`
    );

    window.location.href = `mailto:${RECIPIENT}?subject=${subject}&body=${body}`;

    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) return <SuccessState />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>

      {/* Header */}
      <div className="mb-10">
        <motion.span
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-[10px] tracking-[0.35em] text-white/20 block mb-5"
        >
          INITIATE CONTACT
        </motion.span>
        <div className="overflow-hidden">
          <motion.h2
            initial={{ y: 60 }} animate={{ y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl font-bold tracking-tighter leading-none"
          >
            <span className="text-white block">SCHEDULE</span>
            <span className="text-white/25 block">A DEMO</span>
          </motion.h2>
        </div>
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="h-px bg-gradient-to-r from-white/20 to-transparent mt-6 max-w-xs"
          style={{ originX: 0 }}
        />
      </div>

      {/* Fields */}
      <div className="space-y-8 mb-10">
        <div className="grid grid-cols-2 gap-8">
          <Field label="FIRST NAME" name="firstName" placeholder="Alex"
            value={formData.firstName} error={errors.firstName} touched={touched.firstName}
            onChange={handleChange} onBlur={handleBlur} required />
          <Field label="LAST NAME" name="lastName" placeholder="Johnson"
            value={formData.lastName} error={errors.lastName} touched={touched.lastName}
            onChange={handleChange} onBlur={handleBlur} required />
        </div>
        <Field label="WORK EMAIL" name="email" type="email" placeholder="alex@company.com"
          value={formData.email} error={errors.email} touched={touched.email}
          onChange={handleChange} onBlur={handleBlur} required />
        <Field label="HOW DID YOU FIND US" name="hearAboutUs" placeholder="LinkedIn, Google, Referral..."
          value={formData.hearAboutUs} onChange={handleChange} onBlur={handleBlur} />
      </div>

      {/* Submit */}
      <motion.button
        onClick={handleSubmit}
        whileHover="hover"
        whileTap={{ scale: 0.98 }}
        disabled={submitting}
        className="group relative w-full px-8 py-5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="absolute inset-0 border border-white/12 group-hover:border-white/30 transition-colors duration-300" />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          variants={{ hover: { scaleX: 1, opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } } }}
        />
        <div className="relative flex items-center justify-between">
          <span className="text-white/70 tracking-[0.25em] text-xs uppercase font-light">
            {submitting ? 'Preparing...' : 'Schedule Demo'}
          </span>
          {submitting ? (
            <motion.div
              animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-3.5 h-3.5 border border-white/30 border-t-white/70 rounded-full"
            />
          ) : (
            <motion.div
              variants={{ hover: { x: 5 } }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="flex items-center gap-3"
            >
              <motion.span
                className="text-white/40 text-xs tracking-[0.2em] uppercase font-light"
                initial={{ opacity: 0, width: 0 }}
                variants={{ hover: { opacity: 1, width: 'auto', transition: { delay: 0.08 } } }}
                style={{ overflow: 'hidden' }}
              >
                Begin
              </motion.span>
              <ArrowRight className="w-3.5 h-3.5 text-white/50 group-hover:text-white/80 transition-colors duration-200" />
            </motion.div>
          )}
        </div>
      </motion.button>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.6 }}
        className="text-white/15 text-[9px] tracking-[0.25em] text-center mt-6 font-light"
      >
        NO COMMITMENT · RESPONSE WITHIN 24 HOURS
      </motion.p>

    </motion.div>
  );
}
