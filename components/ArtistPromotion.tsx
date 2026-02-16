'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, Crown, Music, Zap, Check, Loader2 } from 'lucide-react'
import { PromotionType, PromotionStatus } from '@/lib/types'

interface ArtistPromotionProps {
  artistId: string
  artistName: string
  onPromotionRequested?: () => void
}

const PROMOTION_OPTIONS = {
  featured_artist: {
    title: 'Featured Artist',
    description: 'Get your artist profile featured on the homepage and in search results',
    price: 50000,
    duration: true,
    icon: Star,
    features: [
      'Homepage placement for 1 month',
      'Priority in search results',
      'Featured badge on profile',
      'Social media promotion'
    ]
  },
  featured_song: {
    title: 'Featured Song',
    description: 'Promote a specific song to reach more listeners',
    price: 30000,
    duration: true,
    icon: Music,
    features: [
      'Song placement in "Trending" section',
      'Homepage rotation for 1 month',
      'Priority in lyrics search',
      'Social media spotlight'
    ]
  },
  verified_profile: {
    title: 'Verified Profile',
    description: 'Get the verified badge to build trust with fans',
    price: 75000,
    duration: false,
    icon: Crown,
    features: [
      'Permanent verified badge',
      'Priority support',
      'Enhanced profile features',
      'Verification certificate'
    ]
  }
}

export default function ArtistPromotion({ artistId, artistName, onPromotionRequested }: ArtistPromotionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionType | ''>('')
  const [duration, setDuration] = useState(1)
  const [customMessage, setCustomMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const selectedOption = selectedPromotion ? PROMOTION_OPTIONS[selectedPromotion] : null
  const totalPrice = selectedOption ? selectedOption.price * (selectedOption.duration ? duration : 1) : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPromotion) {
      setSubmitStatus({ type: 'error', message: 'Please select a promotion type' })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('/api/artist-promotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artist_id: artistId,
          promotion_type: selectedPromotion,
          duration_months: selectedOption?.duration ? duration : 1,
          custom_message: customMessage
        })
      })

      const data = await response.json()

      if (data.success) {
        setSubmitStatus({ 
          type: 'success', 
          message: 'Promotion request submitted successfully! We will contact you within 24 hours.' 
        })
        onPromotionRequested?.()
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setIsOpen(false)
          setSubmitStatus(null)
          setSelectedPromotion('')
          setDuration(1)
          setCustomMessage('')
        }, 3000)
      } else {
        setSubmitStatus({ type: 'error', message: data.error || 'Failed to submit promotion request' })
      }
    } catch (error) {
      console.error('Promotion submission error:', error)
      setSubmitStatus({ type: 'error', message: 'Network error. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary font-semibold">
          <Zap className="w-4 h-4 mr-2" />
          Promote Artist
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-secondary" />
            Promote {artistName}
          </DialogTitle>
          <DialogDescription>
            Choose a promotion package to increase your visibility and reach more fans
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Promotion Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(PROMOTION_OPTIONS).map(([type, option]) => {
              const Icon = option.icon
              const isSelected = selectedPromotion === type
              const price = option.price * (option.duration ? duration : 1)
              
              return (
                <Card 
                  key={type}
                  className={`cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-secondary bg-secondary/10' 
                      : 'hover:border-secondary/50'
                  }`}
                  onClick={() => setSelectedPromotion(type as PromotionType)}
                >
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-2">
                      <Icon className="w-8 h-8 text-secondary" />
                    </div>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        RWF {price.toLocaleString()}
                      </div>
                      {option.duration && (
                        <div className="text-sm text-muted-foreground">
                          for {duration} month{duration > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {option.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Duration Selection */}
          {selectedOption?.duration && (
            <div>
              <label className="text-sm font-medium">Duration (months)</label>
              <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 3, 6, 12].map((months) => (
                    <SelectItem key={months} value={months.toString()}>
                      {months} month{months > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Custom Message */}
          <div>
            <label className="text-sm font-medium">Additional Message (Optional)</label>
            <Textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Tell us about your goals and any specific requirements..."
              rows={3}
            />
          </div>

          {/* Status Messages */}
          {submitStatus && (
            <div className={`p-4 rounded-lg ${
              submitStatus.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {submitStatus.type === 'success' ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                )}
                <span className="font-medium">{submitStatus.message}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !selectedPromotion}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Submit Promotion Request - RWF {totalPrice.toLocaleString()}
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Payment will be processed after review. You'll receive an email with payment instructions within 24 hours.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
