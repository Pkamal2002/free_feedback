'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Star, ThumbsUp } from 'lucide-react';

export default function FeedbackHome() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="px-4 py-24 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Your Voice Shapes Our Future
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          At FeedbackHub, we value your insights. Help us grow by sharing what matters most to you.
        </p>
        <Button size="lg">
          <MessageSquare className="mr-2 h-5 w-5" />
          Discover How We Use Feedback
        </Button>
      </section>

      {/* Info Sections */}
      <section className="px-4 py-16 bg-muted/40">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          {[
            {
              title: 'Why Feedback Matters',
              desc: 'Your opinions guide innovation, helping us stay relevant and user-focused.',
            },
            {
              title: 'A Place for Every Voice',
              desc: 'From praises to problems, every message is read, reviewed, and respected.',
            },
            {
              title: 'Together, We Improve',
              desc: 'With your help, we continuously evolve to meet your expectations.',
            },
          ].map((item, i) => (
            <div key={i} className="space-y-3">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">What People Say</h2>
        <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              quote: 'Simple and effective feedback system.',
              author: 'Sarah J.',
            },
            {
              quote: 'Submitted my thoughts in under a minute!',
              author: 'Michael C.',
            },
            {
              quote: 'My feedback actually gets implemented.',
              author: 'David W.',
            },
          ].map((testimonial, index) => (
            <Card key={index} className="shadow-md border">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-3 text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4" />
                  ))}
                </div>
                <p className="italic text-sm mb-4 text-muted-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ThumbsUp className="h-4 w-4 text-primary" />
                  <span>{testimonial.author}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted py-16 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Join the Conversation?
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Share your thoughts, shape our services, and be part of our evolving journey.
          </p>
          <Button size="lg">
            <MessageSquare className="mr-2 h-5 w-5" />
            Give Your Feedback
          </Button>
        </div>
      </section>
    </div>
  );
}
