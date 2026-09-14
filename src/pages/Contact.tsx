import { useState } from 'react';
import type { FormEvent } from 'react';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle, Github, Linkedin, Twitter, ArrowUpRight, FileText } from 'lucide-react';
import { site } from '@/data/site';
import SectionTag from '@/components/SectionTag';
import { usePageMeta } from '@/hooks/usePageMeta';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const tones = {
  blue: {
    border: 'hover:border-blue/30',
    badge: 'bg-blue/10 text-blue',
    arrow: 'group-hover:text-blue',
  },
  gold: {
    border: 'hover:border-gold/30',
    badge: 'bg-gold/10 text-gold',
    arrow: 'group-hover:text-gold',
  },
} as const;

export default function Contact() {
  usePageMeta('Contact | Hamza Syed', "Get in touch, whether it's a project, an opportunity, or just a good conversation.");

  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const formspreeId = site.contact.formspreeId;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formspreeId) {
      // No Formspree ID configured yet, fall back to opening the user's email client.
      const body = `${form.message}\n\nFrom: ${form.name} (${form.email})`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 6000);
    } catch {
      setStatus('error');
    }
  };

  const socials = [
    { icon: Linkedin, label: 'LinkedIn', handle: site.socials.linkedin.handle, href: site.socials.linkedin.url },
    { icon: Github, label: 'GitHub', handle: site.socials.github.handle, href: site.socials.github.url },
    { icon: Twitter, label: 'X / Twitter', handle: site.socials.twitter.handle, href: site.socials.twitter.url },
    { icon: Mail, label: 'Email', handle: site.email, href: site.email.startsWith('[') ? '' : `mailto:${site.email}` },
  ].filter((s) => s.href);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-16 lg:pt-44">
        <div className="pointer-events-none absolute top-1/4 right-0 h-[450px] w-[450px] rounded-full bg-gold/[0.15] blur-[120px]" />
        <div className="pointer-events-none absolute -top-10 left-0 h-[400px] w-[400px] rounded-full bg-blue/[0.16] blur-[110px]" />
        <div className="relative mx-auto max-w-5xl px-6 lg:px-6">
          <SectionTag>Contact</SectionTag>
          <h1 className="font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl lg:text-6xl animate-fade-up text-balance">
            {site.contact.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted animate-fade-up" style={{ animationDelay: '0.08s' }}>
            {site.contact.body}
          </p>
        </div>
      </section>

      {/* Contact Form + Social Links */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-6 lg:pb-28">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-border bg-surface p-7 lg:p-9">
              <h2 className="mb-7 font-display text-2xl font-medium text-ink">Send a message</h2>

              {status === 'sent' && (
                <div className="mb-6 flex items-center gap-3 rounded-md border border-live/30 bg-live/10 px-4 py-3 text-sm text-live animate-fade-in">
                  <CheckCircle2 size={18} />
                  {site.contact.confirmation}
                </div>
              )}
              {status === 'error' && (
                <div className="mb-6 flex items-center gap-3 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-fade-in">
                  <AlertCircle size={18} />
                  Something went wrong. Try again, or email {site.email} directly.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm text-ink-muted">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-ink-muted/50 transition-colors duration-200 focus:border-blue/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm text-ink-muted">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@email.com"
                      className="w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-ink-muted/50 transition-colors duration-200 focus:border-blue/50 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm text-ink-muted">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="What's this about?"
                    className="w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-ink-muted/50 transition-colors duration-200 focus:border-blue/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm text-ink-muted">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project, timeline, and goals..."
                    className="w-full resize-none rounded-md border border-border bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-ink-muted/50 transition-colors duration-200 focus:border-blue/50 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group flex w-full items-center justify-center gap-2 rounded-md bg-gradient-duotone px-6 py-4 text-sm font-medium text-bg transition-opacity duration-200 hover:opacity-90 disabled:opacity-60"
                >
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                  {status !== 'sending' && (
                    <Send size={16} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Social & Direct Links */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <h2 className="mb-2 font-display text-xl font-medium text-ink">Or reach me directly</h2>

              {socials.map(({ icon: Icon, label, handle, href }, i) => {
                const tone = tones[i % 2 === 0 ? 'blue' : 'gold'];
                return (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noreferrer' : undefined}
                    className={`group flex items-center gap-4 rounded-xl border border-border bg-surface p-5 transition-colors duration-200 ${tone.border}`}
                  >
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${tone.badge}`}>
                      <Icon size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink">{label}</p>
                      <p className="truncate text-sm text-ink-muted">{handle}</p>
                    </div>
                    <ArrowUpRight size={16} className={`text-ink-muted transition-colors duration-200 ${tone.arrow}`} />
                  </a>
                );
              })}

              {site.resumeUrl && (
                <a
                  href={site.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-5 transition-colors duration-200 hover:border-gold/30"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-gold/10 text-gold">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">Resume</p>
                    <p className="truncate text-sm text-ink-muted">View or download PDF</p>
                  </div>
                  <ArrowUpRight size={16} className="text-ink-muted transition-colors duration-200 group-hover:text-gold" />
                </a>
              )}

              <div className="rounded-xl border border-border bg-surface p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-blue/10 text-blue">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">Location</p>
                    <p className="text-sm text-ink-muted">{site.location}</p>
                  </div>
                </div>
              </div>

              {site.availability.open && (
                <div className="rounded-xl border border-live/20 bg-live/5 p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-2 w-2 rounded-full bg-live animate-pulse" />
                    <p className="text-sm text-live">{site.availability.label}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
