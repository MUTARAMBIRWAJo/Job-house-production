'use client';

import { useState } from 'react';
import { MessageCircle, X, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface WhatsAppButtonProps {
  context?: 'general' | 'studio' | 'event-coverage' | 'artist-promotion' | 'public';
  customMessage?: string;
  className?: string;
}

export default function WhatsAppButton({ 
  context = 'general', 
  customMessage,
  className = "fixed bottom-6 right-6 z-40"
}: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const phoneNumber = '+250788000000'; // Replace with actual number
  
  const getContextMessage = () => {
    switch (context) {
      case 'studio':
        return "Hi JOB HOUSE PRODUCTION! I'm interested in booking studio services.";
      case 'event-coverage':
        return "Hi JOB HOUSE PRODUCTION! I need audio/video coverage for an event.";
      case 'artist-promotion':
        return "Hi JOB HOUSE PRODUCTION! I'm interested in artist promotion services.";
      default:
        return "Hi JOB HOUSE PRODUCTION! I'm interested in your services.";
    }
  };

  const getDialogTitle = () => {
    switch (context) {
      case 'studio':
        return 'Book Studio Services';
      case 'event-coverage':
        return 'Request Event Coverage';
      case 'artist-promotion':
        return 'Artist Promotion Inquiry';
      default:
        return 'Contact Us';
    }
  };

  const getDialogDescription = () => {
    switch (context) {
      case 'studio':
        return 'Get in touch with us about recording, production, and other studio services.';
      case 'event-coverage':
        return 'Request professional audio and video coverage for your gospel event.';
      case 'artist-promotion':
        return 'Learn about our artist promotion and featured placement services.';
      default:
        return 'Chat with us about any of our services or general inquiries.';
    }
  };

  const handleWhatsAppChat = (directMessage?: string) => {
    const finalMessage = directMessage || message || getContextMessage();
    const fullMessage = name ? `${name}: ${finalMessage}` : finalMessage;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(fullMessage)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleEmailContact = () => {
    const subject = encodeURIComponent(getDialogTitle());
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message || getContextMessage()}`);
    window.location.href = `mailto:info@jobhouseproduction.com?subject=${subject}&body=${body}`;
  };

  const handlePhoneCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleWhatsAppChat();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button
            className={`${className} bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 flex items-center justify-center`}
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              {getDialogTitle()}
            </DialogTitle>
            <DialogDescription>
              {getDialogDescription()}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name (Optional)</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Email (Optional)</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={getContextMessage()}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat on WhatsApp
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleEmailContact}
                  className="text-xs"
                >
                  <Mail className="w-3 h-3 mr-1" />
                  Email
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePhoneCall}
                  className="text-xs"
                >
                  <Phone className="w-3 h-3 mr-1" />
                  Call
                </Button>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              Quick response time: Usually within 2 hours during business hours
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
