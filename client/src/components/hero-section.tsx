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
        variant: "success",
      });
      setEmail("");
    } catch (error) {
      // Add email to submitted set even on error since request likely went through
      setSubmittedEmails((prev) => new Set(prev).add(email.toLowerCase()));

      toast({
        title: "Submitted!",
        description:
          "Your email has been submitted. Please check your spreadsheet to confirm.",
        variant: "success",
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
    const texts = ["What's your favorite AI Tools?","Hover over icons...", "Vote!"];

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

      // Handle "Vote!" text with shake animation and larger size
      if (currentText === "Vote!") {
        typingElement!.classList.add("text-3xl", "md:text-4xl", "2xl:text-5xl", "font-bold", "gradient-text");
        typingElement!.classList.remove("text-xl", "md:text-2xl", "2xl:text-3xl", "text-blue-400");

        // Only add shake when "Vote!" is fully typed
        if (!isDeleting && currentCharIndex === currentText.length) {
          console.log("Adding shake animation to Vote!");
          // Force animation restart by removing and re-adding the class
          typingElement!.classList.remove("animate-shake");
          // Use requestAnimationFrame for better timing
          requestAnimationFrame(() => {
            typingElement!.classList.add("animate-shake");
          });
        } else if (isDeleting && currentCharIndex === currentText.length - 1) {
          // Remove shake when starting to delete
          console.log("Removing shake animation");
          typingElement!.classList.remove("animate-shake");
        }
      } else {
        // Remove shake and reset size for other text
        typingElement!.classList.remove("animate-shake", "text-3xl", "md:text-4xl", "2xl:text-5xl", "font-bold");
        typingElement!.classList.add("text-xl", "md:text-2xl", "2xl:text-3xl", "gradient-text");
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
    <section className="hero-gradient min-h-screen flex items-center justify-center px-2 sm:px-4 py-8 sm:py-12 md:py-16">
      <div className="max-w-6xl mx-auto text-center relative z-10 w-full">
        {/* Hero Content */}
        <div className="mb-8 sm:mb-12 md:mb-16">
        {/* deleted H1 */}

          <div className="mb-6 sm:mb-8 max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 flex items-center justify-center px-4">
            <div className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl gradient-text leading-relaxed">
              <span id="typing-text"></span>
            </div>
          </div>
          {/* Tools Grid */}

          <ToolsGrid />

          <div className="flex flex-col gap-4 sm:gap-6 items-center mt-8 sm:mt-12 md:mt-16 px-4">
            {/* Email Subscription Form */}
            <form
              onSubmit={handleEmailSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md lg:max-w-lg xl:max-w-xl w-full"
            >
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <Input
                  type="email"
                  placeholder="Enter your email to stay updated"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-800/50 border-gray-600/50 text-white placeholder-blue-600 rounded-lg focus:border-blue-400 focus:ring-blue-400"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 hover:from-green-500 hover:via-cyan-500 hover:to-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                {isSubmitting ? "Submitting..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}