import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SITE_CONFIG } from '@/config/site';
import { submitContactForm } from '@/actions/contact';
import { MapPin, Phone, Mail, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await submitContactForm({ name, email, subject, message });
    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } else {
      setErrorMsg(res.error.message);
    }
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#171717]">Contact & Visit</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Have an inquiry regarding custom orders, sizing, or visiting our boutique? Get in touch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Contact Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-base font-bold text-[#171717]">Send Us a Message</h2>

            {isSuccess && (
              <div className="p-3 bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0] rounded-[9px] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you! Your message was sent to our local shop manager.</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-red-50 text-[#DC2626] border border-red-200 rounded-[9px] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <Input
              label="Your Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Eleanor"
              required
            />
            <Input
              label="Email Address *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="eleanor@example.com"
              required
            />
            <Input
              label="Subject *"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Inquiry regarding bespoke sizing"
              required
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#171717]">
                Message *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help you today?"
                rows={4}
                required
                className="w-full rounded-[9px] border border-[#E5E7EB] bg-white p-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <Button type="submit" isLoading={isSubmitting} className="w-full">
              Send Message
            </Button>
          </form>
        </Card>

        {/* Location & Shop Info */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-base font-bold text-[#171717]">Shop Information</h2>
            <div className="space-y-3 text-xs text-[#6B7280]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#171717] block">Boutique & Workshop</strong>
                  <span>{SITE_CONFIG.contact.address}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#171717] block">Business Hours</strong>
                  <span>{SITE_CONFIG.contact.hours}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#171717] block">Telephone & WhatsApp</strong>
                  <span>{SITE_CONFIG.contact.phone}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#171717] block">Direct Email</strong>
                  <span>{SITE_CONFIG.contact.email}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
