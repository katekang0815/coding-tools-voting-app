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

        {/* Call to Action */}
        <Card className="shadow-xl max-w-4xl mx-auto">
          <CardContent className="p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--brand-primary)] mb-6">
              Ready to Level Up Your Coding?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are already using these cutting-edge tools to build the next generation of applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-[var(--brand-accent)] hover:bg-[hsl(158,64%,42%)] text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Get Started Free
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 text-gray-700 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] dark:border-gray-600 dark:text-gray-300 dark:hover:border-[var(--brand-primary)] dark:hover:text-[var(--brand-primary)] px-8 py-4 text-lg font-semibold transition-all duration-300"
              >
                View Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
