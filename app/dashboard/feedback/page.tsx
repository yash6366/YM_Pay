'use client';

import { useState } from 'react';
import { ChevronDown, Send, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';

export default function FeedbackPage() {
  const [feedbackType, setFeedbackType] = useState<'general' | 'feature' | 'bug'>('general');
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedbackText.trim()) {
      toast.error('Please enter your feedback before submitting');
      return;
    }
    
    if (feedbackType === 'general' && rating === null) {
      toast.error('Please provide a rating');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Log feedback data (would be sent to API in real implementation)
      console.log({
        type: feedbackType,
        text: feedbackText,
        rating,
        timestamp: new Date().toISOString()
      });
      
      // Clear form
      setFeedbackText('');
      setRating(null);
      
      toast.success('Thank you for your feedback!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Feedback</h1>
        <p className="text-muted-foreground">
          We value your feedback to improve our services. Let us know your thoughts, report issues, or suggest new features.
        </p>
      </div>

      <Card className="mb-8">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Submit Feedback</CardTitle>
            <CardDescription>
              Please select the type of feedback you'd like to provide
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup 
              defaultValue="general" 
              value={feedbackType}
              onValueChange={(value) => setFeedbackType(value as 'general' | 'feature' | 'bug')}
              className="grid grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem value="general" id="general" className="peer sr-only" />
                <Label
                  htmlFor="general"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <ThumbsUp className="mb-3 h-6 w-6" />
                  <div className="font-medium">General</div>
                  <div className="text-xs text-center mt-1 text-muted-foreground">Overall experience</div>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem value="feature" id="feature" className="peer sr-only" />
                <Label
                  htmlFor="feature"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Send className="mb-3 h-6 w-6" />
                  <div className="font-medium">Feature</div>
                  <div className="text-xs text-center mt-1 text-muted-foreground">Request new features</div>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem value="bug" id="bug" className="peer sr-only" />
                <Label
                  htmlFor="bug"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <ThumbsDown className="mb-3 h-6 w-6" />
                  <div className="font-medium">Bug</div>
                  <div className="text-xs text-center mt-1 text-muted-foreground">Report issues</div>
                </Label>
              </div>
            </RadioGroup>

            {feedbackType === 'general' && (
              <div className="space-y-2">
                <Label>How would you rate your experience?</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant={rating === value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRating(value)}
                      className="h-10 w-10 rounded-full p-0"
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="feedback">Your Feedback</Label>
              <Textarea
                id="feedback"
                placeholder={
                  feedbackType === 'general'
                    ? "Tell us about your experience with YM-Pay..."
                    : feedbackType === 'feature'
                    ? "Describe the feature you'd like to see..."
                    : "Please describe the issue you're experiencing..."
                }
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Submitting...
                </>
              ) : (
                <>Submit Feedback</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="faqs">
          <AccordionTrigger>
            <h2 className="text-xl font-medium">Frequently Asked Questions</h2>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-6">
            <div className="space-y-2">
              <h3 className="font-medium">What happens after I submit feedback?</h3>
              <p className="text-muted-foreground">
                Our team reviews all feedback regularly. While we may not respond to each submission individually, your input helps shape our product roadmap.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">How can I track the status of my bug report?</h3>
              <p className="text-muted-foreground">
                Critical bugs are prioritized for immediate fixes. For status updates on specific issues, please contact our support team.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Can I submit anonymous feedback?</h3>
              <p className="text-muted-foreground">
                Yes, feedback is submitted with your account information, but you can request it to be treated anonymously in your submission.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">How are feature requests evaluated?</h3>
              <p className="text-muted-foreground">
                We consider user demand, strategic alignment, and technical feasibility. Popular requests are more likely to be implemented in future updates.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="contact">
          <AccordionTrigger>
            <h2 className="text-xl font-medium">Other Ways to Contact Us</h2>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-6">
            <div className="space-y-2">
              <h3 className="font-medium">Customer Support</h3>
              <p className="text-muted-foreground">
                For urgent issues requiring immediate assistance, please contact our support team at support@ympay.com or call +1-800-YM-SUPPORT.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Social Media</h3>
              <p className="text-muted-foreground">
                Connect with us on social media for updates, tips, and alternative ways to provide feedback:
              </p>
              <div className="flex gap-4 pt-2">
                <Button variant="outline" size="sm">Twitter</Button>
                <Button variant="outline" size="sm">Facebook</Button>
                <Button variant="outline" size="sm">LinkedIn</Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
} 