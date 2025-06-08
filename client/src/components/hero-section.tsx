import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ToolsGrid from "@/components/tools-grid";
import { useToast } from "@/hooks/use-toast";

export default function HeroSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Animation states
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isUntyping, setIsUntyping] = useState(false);
  
  const messages = [
    "Vote for it!",
    "What AI Agent do you use most?"
  ];

  useEffect(() => {
    const typingDuration = 3000; // Time for typing animation
    const pauseDuration = 1500; // Pause before reverse typing
    const untypingDuration = 1500; // Time for reverse typing animation
    const switchDuration = 500; // Time to switch to next message

    const interval = setInterval(() => {
      if (isTyping && !isUntyping) {
        // After typing is done, pause then start untyping
        setTimeout(() => {
          setIsUntyping(true);
          setIsTyping(false);
        }, pauseDuration);
      } else if (isUntyping && !isTyping) {
        // After untyping, switch message and start typing again
        setTimeout(() => {
          setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
          setIsUntyping(false);
          setIsTyping(true);
        }, switchDuration);
      }
    }, typingDuration + pauseDuration + untypingDuration + switchDuration);

    return () => clearInterval(interval);
  }, [isTyping, isUntyping, messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbw2DQJv8ntVpkUgWOlWUhclnqvdqsnSnBrKG4loD3WqR3WCYvAZQJmGtkQSK2qu41UD/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: email
        })
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Thank you for subscribing! You'll receive updates on the latest coding tools.",
        });
        setEmail("");
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="hero-gradient min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-6xl mx-auto text-center">
        {/* Hero Content */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-[var(--brand-primary)] mb-6 leading-tight">
            Vibe Coding
            <span className="text-[var(--brand-secondary)]"> Tools</span>
          </h1>
          <div className="mb-8 max-w-4xl mx-auto">
            <div className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed min-h-[2rem] flex items-center justify-center">
              <span className="typing-text">
                Discover today's most innovative coding experiences! {messages[currentMessageIndex]}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="bg-[var(--brand-secondary)] hover:bg-[hsl(244,79%,52%)] text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Explore Tools
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Tools Grid */}
        <ToolsGrid />

        {/* Call to Action */}
        <Card className="shadow-xl max-w-4xl mx-auto">
          <CardContent className="p-8 md:p-12">
            {/* Email Subscription */}
            <div className="border-t pt-8">
              <h3 className="text-xl font-semibold text-[var(--brand-primary)] mb-4">
                Stay Updated
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-300 mb-6">
                Subscribe to get the latest updates on coding tools and developer resources.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[var(--brand-accent)] hover:bg-[hsl(158,64%,42%)] text-white px-6 py-2 text-base font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}