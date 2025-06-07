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
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover the modern development tools that power today's most innovative coding experiences
          </p>
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
        <Card className="shadow-xl max-w-2xl mx-auto">
          <CardContent className="p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--brand-primary)] mb-6">
              Stay Updated
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Subscribe to get the latest updates on coding tools and developer resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button 
                size="lg"
                className="bg-[var(--brand-accent)] hover:bg-[hsl(158,64%,42%)] text-white px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap"
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
