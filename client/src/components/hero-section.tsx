import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ToolsGrid from "@/components/tools-grid";

export default function HeroSection() {
  return (
    <section className="hero-gradient min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-6xl mx-auto text-center">
        {/* Hero Content */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-[var(--brand-primary)] mb-6 leading-tight">
            Vibe Coding
            <span className="text-[var(--brand-secondary)]"> Tools</span>
          </h1>
          <div className="overflow-hidden mb-8 max-w-4xl mx-auto">
            <div className="animate-slide-text text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed whitespace-nowrap">
              Discover today's most innovative coding experiences! &nbsp;&nbsp;&nbsp;&nbsp; What AI Agent do you use most? Vote for it! &nbsp;&nbsp;&nbsp;&nbsp; Discover today's most innovative coding experiences! &nbsp;&nbsp;&nbsp;&nbsp; What AI Agent do you use most? Vote for it! &nbsp;&nbsp;&nbsp;&nbsp;
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

        {/* Email Subscription */}
        <Card className="shadow-xl max-w-xl mx-auto">
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
