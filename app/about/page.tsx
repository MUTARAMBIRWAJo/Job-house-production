'use client'

import { Users, Target, Heart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="space-y-20 py-12">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            About <span className="text-secondary">JOB HOUSE PRODUCTION</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Elevating Gospel Music in Rwanda through professional production, artist collaboration, and community building.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-muted/50 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'Our Mission',
                description: 'To elevate gospel music production standards in Rwanda and provide aspiring artists with professional resources and mentorship.',
              },
              {
                icon: Heart,
                title: 'Our Vision',
                description: 'A thriving gospel music community where talented artists can create, collaborate, and share their faith through quality music.',
              },
              {
                icon: Users,
                title: 'Our Values',
                description: 'Excellence, integrity, collaboration, and a deep commitment to advancing gospel music in East Africa.',
              },
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <div key={idx} className="text-center">
                  <Icon className="w-12 h-12 mx-auto mb-4 text-secondary" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h2 className="text-4xl font-bold text-foreground mb-6">Our Story</h2>
          <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
            <p>
              JOB HOUSE PRODUCTION was founded with a simple vision: to help gospel artists in Rwanda achieve professional-quality music production. Our founders, deeply passionate about both technology and faith, recognized the untapped potential in Rwanda's gospel music scene.
            </p>
            <p>
              Starting as a small studio in Kigali, we've grown to become a comprehensive platform serving artists, producers, and music enthusiasts across the region. Today, we provide everything from studio recording facilities to a digital platform for discovering and sharing gospel music.
            </p>
            <p>
              Our commitment to excellence has earned us recognition as one of the leading gospel music platforms in East Africa. We continue to invest in technology, talent, and community to ensure that gospel artists have access to world-class resources.
            </p>
          </div>
        </div>
      </section>

      {/* Team Highlights */}
      <section className="bg-muted/50 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-4xl font-bold text-foreground text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'Moses Kabanda',
                role: 'Founder & Music Director',
                bio: 'Music producer with 15+ years in gospel production',
              },
              {
                name: 'Grace Mukama',
                role: 'Operations Director',
                bio: 'Experienced in artist management and community building',
              },
              {
                name: 'David Kwizera',
                role: 'Technical Director',
                bio: 'Sound engineer and studio technology expert',
              },
              {
                name: 'Sarah Niyigena',
                role: 'Community Manager',
                bio: 'Passionate about connecting artists and fans',
              },
            ].map((member, idx) => (
              <div key={idx} className="bg-card rounded-xl p-6 border border-border text-center hover:border-secondary transition-colors">
                <div className="w-16 h-16 bg-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-secondary font-semibold mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { label: 'Gospel Songs', value: '200+' },
            { label: 'Active Artists', value: '50+' },
            { label: 'Studio Hours', value: '1000+' },
            { label: 'Monthly Listeners', value: '50K+' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">{stat.value}</div>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-4xl font-bold">Join Our Community</h2>
          <p className="text-lg text-gray-200">
            Whether you're an artist, producer, or gospel music enthusiast, there's a place for you here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/artists">
              <Button className="bg-secondary hover:bg-secondary/90 text-primary font-semibold">
                Discover Artists
              </Button>
            </Link>
            <Link href="/studio">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Book Studio Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
