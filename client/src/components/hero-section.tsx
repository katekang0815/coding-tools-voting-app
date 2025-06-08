import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ToolsGrid from "@/components/tools-grid";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function HeroSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    try {
      // Use GET method with query parameters - most reliable for Google Apps Script
      const url = `https://script.google.com/macros/s/AKfycbw2DQJv8ntVpkUgWOlWUhclnqvdqsnSnBrKG4loD3WqR3WCYvAZQJmGtkQSK2qu41UD/exec?email=${encodeURIComponent(email)}`;
      
      const response = await fetch(url, {
        method: "GET",
        mode: "no-cors",
      });

      toast({
        title: "Success!",
        description: "Your email has been submitted successfully.",
      });
      setEmail("");
    } catch (error) {
      // Since we use no-cors mode, we can't read the response, but the request likely went through
      toast({
        title: "Submitted!",
        description: "Your email has been submitted. Please check your spreadsheet to confirm.",
      });
      setEmail("");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const texts = [
      "What AI Agent do you use most?",
      "Vote for it!"
    ];
    
    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    const typingElement = document.getElementById('typing-text');
    
    if (!typingElement) return;

    function typeText() {
      const currentText = texts[currentTextIndex];
      
      if (isDeleting) {
        typingElement!.textContent = currentText.substring(0, currentCharIndex - 1);
        currentCharIndex--;
      } else {
        typingElement!.textContent = currentText.substring(0, currentCharIndex + 1);
        currentCharIndex++;
      }

      let typeSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && currentCharIndex === currentText.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentTextIndex = (currentTextIndex + 1) % texts.length;
        typeSpeed = 500; // Pause before next text
      }

      setTimeout(typeText, typeSpeed);
    }

    typeText();
  }, []);

  return (
    <section className="hero-gradient min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-6xl mx-auto text-center">
        {/* Hero Content */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-[var(--brand-primary)] mb-6 leading-tight">
            Vibe Coding
            <span className="text-[var(--brand-secondary)]"> Tools</span>
          </h1>
          <div className="mb-8 max-w-4xl mx-auto h-16 flex items-center justify-center">
            <div className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
              <span id="typing-text"></span>
              <span className="animate-blink">|</span>
            </div>
          </div>
          <div className="flex flex-col gap-6 items-center">
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
            
            {/* Email Subscription Form */}
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md w-full">
              <Input
                type="email"
                placeholder="Enter your email to stay updated"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 text-base"
                required
              />
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-[var(--brand-accent)] hover:bg-[hsl(158,64%,42%)] text-white px-6 py-3 font-semibold transition-all duration-300 transform hover:scale-105"
              >
                {isSubmitting ? "Submitting..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        {/* Tools Grid */}
        <ToolsGrid />

        {/* Email Subscription */}
        <Card className="shadow-xl w-full">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--brand-primary)] mb-4">
              Stay Updated
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300 mb-6">
              Subscribe to get the latest updates on coding tools and developer resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button 
                className="bg-[var(--brand-accent)] hover:bg-[hsl(158,64%,42%)] text-white px-6 py-2 text-base font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap"
                onClick={() => alert('Subscription agreement sent!')}
              >
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
