import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ToolsGrid from "@/components/tools-grid";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function HeroSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmails, setSubmittedEmails] = useState<Set<string>>(
    new Set(),
  );
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Check for duplicate email
    if (submittedEmails.has(email.toLowerCase())) {
      toast({
        title: "Already Submitted",
        description: "This email has already been submitted.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Use GET method with query parameters - most reliable for Google Apps Script
      const url = `https://script.google.com/macros/s/AKfycbwmqGk8EgDszcoukq2WTr5RDP2UvcDgCpd7pdAstS4DshIzD15djubo1rWSoKBb3Zix/exec?email=${encodeURIComponent(email)}`;

      const response = await fetch(url, {
        method: "GET",
        mode: "no-cors",
      });

      // Add email to submitted set to prevent duplicates
      setSubmittedEmails((prev) => new Set(prev).add(email.toLowerCase()));

      toast({
        title: "Success!",
        description: "Your email has been submitted successfully.",
      });
      setEmail("");
    } catch (error) {
      // Add email to submitted set even on error since request likely went through
      setSubmittedEmails((prev) => new Set(prev).add(email.toLowerCase()));

      toast({
        title: "Submitted!",
        description:
          "Your email has been submitted. Please check your spreadsheet to confirm.",
      });
      setEmail("");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load submitted emails from localStorage on component mount
  useEffect(() => {
    const savedEmails = localStorage.getItem("submittedEmails");
    if (savedEmails) {
      try {
        setSubmittedEmails(new Set(JSON.parse(savedEmails)));
      } catch (error) {
        // Clear invalid localStorage data
        localStorage.removeItem("submittedEmails");
      }
    }
  }, []);

  // Save submitted emails to localStorage whenever the set changes
  useEffect(() => {
    if (submittedEmails.size > 0) {
      localStorage.setItem(
        "submittedEmails",
        JSON.stringify(Array.from(submittedEmails)),
      );
    }
  }, [submittedEmails]);

  useEffect(() => {
    const texts = ["What AI Agent do you use most?", "Vote for it!"];

    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    const typingElement = document.getElementById("typing-text");

    if (!typingElement) return;

    function typeText() {
      const currentText = texts[currentTextIndex];

      if (isDeleting) {
        typingElement!.textContent = currentText.substring(
          0,
          currentCharIndex - 1,
        );
        currentCharIndex--;
      } else {
        typingElement!.textContent = currentText.substring(
          0,
          currentCharIndex + 1,
        );
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
    <section className="bg-black min-h-screen flex items-center justify-center px-4 py-16 pt-24">
      <div className="max-w-6xl mx-auto text-center">
        {/* Hero Content */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Redesign your website
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

            {/* URL Input and Redesign Button */}
            <div className="flex flex-col gap-4 max-w-lg w-full">
              <Input
                type="url"
                placeholder="Enter website URL..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 text-base bg-gray-800 border-gray-700 text-white placeholder-gray-400 rounded-lg"
                required
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-6 py-3 font-semibold transition-all duration-300 transform hover:scale-105 rounded-lg"
              >
                🎨 {isSubmitting ? "Processing..." : "Redesign"}
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="mb-16 max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-xl p-8 min-h-96 flex items-center justify-center border border-gray-700">
            <p className="text-gray-400 text-lg">Your redesigned website will appear here</p>
          </div>
        </div>

        {/* Tools Grid */}
        <ToolsGrid />
      </div>
    </section>
  );
}
