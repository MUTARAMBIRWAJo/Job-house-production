'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (error) {
      console.error('[v0] Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-20 py-12">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            Get in <span className="text-secondary">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about our services? Want to collaborate? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            {[
              {
                icon: Mail,
                title: 'Email',
                content: 'info@jobhouseproduction.com',
                link: 'mailto:info@jobhouseproduction.com',
              },
              {
                icon: Phone,
                title: 'Phone',
                content: '+250 (0) 788 123 456',
                link: 'tel:+250788123456',
              },
              {
                icon: MapPin,
                title: 'Location',
                content: 'Kigali, Rwanda',
                link: null,
              },
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="bg-card rounded-xl p-6 border border-border hover:border-secondary transition-colors"
                >
                  <Icon className="w-8 h-8 text-secondary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  {item.link ? (
                    <a
                      href={item.link}
                      className="text-muted-foreground hover:text-secondary transition-colors"
                    >
                      {item.content}
                    </a>
                  ) : (
                    <p className="text-muted-foreground">{item.content}</p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-foreground"
                >
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border-border focus:border-secondary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-foreground"
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border-border focus:border-secondary"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-foreground"
                  >
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+250..."
                    value={formData.phone}
                    onChange={handleChange}
                    className="border-border focus:border-secondary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="subject"
                  className="block text-sm font-semibold text-foreground"
                >
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="What is this about?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="border-border focus:border-secondary"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-foreground"
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="border-border focus:border-secondary"
                />
              </div>

              {submitted && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
                  Thank you! We've received your message and will respond shortly.
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary hover:bg-secondary/90 text-primary font-semibold"
              >
                {loading ? 'Sending...' : 'Send Message'}
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="bg-muted/50 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground">Business Hours</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-4">Studio Services</h3>
              <p className="text-muted-foreground mb-2">Monday - Friday</p>
              <p className="text-lg font-semibold text-foreground">9:00 AM - 6:00 PM</p>
              <p className="text-muted-foreground mt-4">Saturday</p>
              <p className="text-lg font-semibold text-foreground">10:00 AM - 4:00 PM</p>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-4">Customer Support</h3>
              <p className="text-muted-foreground mb-2">Monday - Friday</p>
              <p className="text-lg font-semibold text-foreground">8:00 AM - 5:00 PM</p>
              <p className="text-muted-foreground mt-4">Emergency Contact</p>
              <p className="text-lg font-semibold text-secondary">WhatsApp Available 24/7</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
