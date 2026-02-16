'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mic2, Music, Users, Zap, Check } from 'lucide-react'
import MultiStepForm from '@/components/MultiStepForm'
import WhatsAppButton from '@/components/WhatsAppButton'
import { Button } from '@/components/ui/button'

function StudioPageContent() {
  const [showForm, setShowForm] = useState(false)
  const searchParams = useSearchParams()
  const service = searchParams.get('service')
  
  // Determine WhatsApp context based on URL parameter
  const getWhatsAppContext = () => {
    if (service === 'event-coverage') return 'event-coverage'
    return 'studio'
  }

  const services = [
    {
      icon: Mic2,
      title: 'Studio Recording',
      description:
        'Professional recording facilities with state-of-the-art equipment and experienced sound engineers to capture your best performance.',
      features: [
        'High-quality recording equipment',
        'Experienced sound engineers',
        'Comfortable recording environment',
        'Technical support included',
      ],
      price: 'Starting at $200/day',
    },
    {
      icon: Music,
      title: 'Music Production',
      description:
        'Complete music production services from arrangement and composition to mixing and mastering for a polished final product.',
      features: [
        'Professional arrangement',
        'Beat production',
        'Mixing services',
        'Mastering included',
      ],
      price: 'Starting at $500/project',
    },
    {
      icon: Users,
      title: 'Collaboration Services',
      description:
        'Connect with other artists, producers, and musicians in our community to collaborate on new projects and expand your reach.',
      features: [
        'Artist networking',
        'Producer matching',
        'Collaboration studio',
        'Project coordination',
      ],
      price: 'Free for members',
    },
    {
      icon: Zap,
      title: 'Promotion & Distribution',
      description:
        'Get your music heard by distributing to major streaming platforms and leveraging our marketing network.',
      features: [
        'Multi-platform distribution',
        'Marketing support',
        'Social media promotion',
        'Analytics dashboard',
      ],
      price: 'Starting at $150/release',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Button variant="outline" className="mb-6 border-white text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          <h1 className="text-4xl font-bold mb-2">Studio Services</h1>
          <p className="text-gray-200">
            Professional music production services for gospel artists
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, idx) => {
            const Icon = service.icon
            return (
              <div
                key={idx}
                className="bg-card rounded-xl border border-border overflow-hidden hover:border-secondary transition-colors"
              >
                <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
                  <Icon className="w-8 h-8 mb-3 text-secondary" />
                  <h3 className="text-2xl font-bold">{service.title}</h3>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-muted-foreground">{service.description}</p>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground text-sm">Includes:</h4>
                    {service.features.map((feature, fidx) => (
                      <div key={fidx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-secondary font-semibold text-sm">{service.price}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary via-primary to-primary/80 text-white rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto">
            Fill out our form and our team will contact you within 24 hours to discuss your
            project and find the perfect solution for your music.
          </p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-secondary hover:bg-secondary/90 text-primary font-semibold px-8 py-6 text-lg"
          >
            Request Studio Services
          </Button>
        </div>
      </div>

      {/* Multi-Step Form Modal */}
      {showForm && <MultiStepForm onClose={() => setShowForm(false)} />}

      {/* FAQ Section */}
      <div className="bg-muted/50 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'How do I book a studio session?',
                a: 'Click "Request Studio Services" and fill out the form with your project details. Our team will review your request and contact you with pricing and availability.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept bank transfers, mobile money (MTN, Airtel), and credit/debit cards. Payment is required to secure your booking.',
              },
              {
                q: 'Can I cancel or reschedule my booking?',
                a: 'Yes, you can cancel or reschedule up to 48 hours before your session for a full refund. Cancellations within 48 hours will incur a 50% fee.',
              },
              {
                q: 'Do you offer online sessions?',
                a: 'Yes, we offer remote production and consultation services. Some services like recording require in-studio sessions.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-card rounded-lg p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Context-Aware WhatsApp Button */}
      <WhatsAppButton 
        context={getWhatsAppContext()}
        className="fixed bottom-6 right-6 z-40"
      />
    </div>
  )
}

export default function StudioPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudioPageContent />
    </Suspense>
  )
}
