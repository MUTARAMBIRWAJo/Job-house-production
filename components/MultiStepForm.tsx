'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// moved to server via API route; client components use fetch to interact with backend
import { Loader2 } from 'lucide-react';

interface FormData {
  projectType: string;
  budgetRange: string;
  description: string;
  name: string;
  email: string;
  phone: string;
}

interface MultiStepFormProps {
  onClose?: () => void;
}

export default function MultiStepForm({ onClose }: MultiStepFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formData, setFormData] = useState<FormData>({
    projectType: '',
    budgetRange: '',
    description: '',
    name: '',
    email: '',
    phone: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setIsSubmitting(true)
    try {
      // call server-side API route to create lead
      const res = await fetch('/api/studio-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artist_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service_type: formData.projectType,
          budget: parseInt(formData.budgetRange.split('-')[0]) || 0,
          description: formData.description,
        }),
      })

      if (!res.ok) {
        throw new Error('Request failed')
      }

      setSubmitStatus({
        type: 'success',
        message: 'Thank you! We will contact you shortly.',
      })
      setFormData({
        projectType: '',
        budgetRange: '',
        description: '',
        name: '',
        email: '',
        phone: '',
      })
      setStep(1)
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit form. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <div>
              <CardTitle>Book Our Studio Services</CardTitle>
              <CardDescription>Step {step} of 3</CardDescription>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${i <= step ? 'bg-secondary' : 'bg-border'
                    }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {submitStatus && (
            <div
              className={`mb-6 p-4 rounded-lg ${submitStatus.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
                }`}
            >
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Project Details */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Project Type *
                  </label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  >
                    <option value="">Select project type</option>
                    <option value="Single">Single Recording</option>
                    <option value="Album">Album Production</option>
                    <option value="Video">Music Video</option>
                    <option value="Event">Event Coverage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Budget Range *
                  </label>
                  <select
                    name="budgetRange"
                    value={formData.budgetRange}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  >
                    <option value="">Select budget range</option>
                    <option value="Below 500K">Below 500K RWF</option>
                    <option value="500K - 1M">500K - 1M RWF</option>
                    <option value="1M - 3M">1M - 3M RWF</option>
                    <option value="Above 3M">Above 3M RWF</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Description */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Project Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell us about your project, vision, and specific needs..."
                    rows={6}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Contact Information */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+250 XXX XXX XXX"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={step === 1 || isSubmitting}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-secondary hover:bg-secondary/90 text-primary font-semibold"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {step === 3
                  ? isSubmitting
                    ? 'Submitting...'
                    : 'Submit Inquiry'
                  : 'Next'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
