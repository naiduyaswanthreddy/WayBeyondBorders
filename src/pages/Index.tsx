
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, CheckCircle, BarChart3, Truck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Hero from "@/components/dashboard/Hero";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/10 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-x-2">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-nexus-blue">
              <div className="absolute inset-0 animate-pulse rounded-md bg-nexus-blue opacity-50"></div>
              <span className="text-xl font-bold text-white">L</span>
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-gradient-blue">Logi</span>
              <span className="text-white">Nexus</span>
              <span className="text-gradient-teal">AI</span>
            </span>
          </Link>

          <nav className="hidden md:block">
            <ul className="flex items-center gap-x-8">
              <li>
                <Link to="#features" className="text-sm font-medium text-white hover:text-nexus-blue transition-colors duration-200">
                  Features
                </Link>
              </li>
              <li>
                <Link to="#solutions" className="text-sm font-medium text-white hover:text-nexus-blue transition-colors duration-200">
                  Solutions
                </Link>
              </li>
              <li>
                <Link to="#pricing" className="text-sm font-medium text-white hover:text-nexus-blue transition-colors duration-200">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="#about" className="text-sm font-medium text-white hover:text-nexus-blue transition-colors duration-200">
                  About
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-x-4">
            <Link to="/login" className="text-sm font-medium text-white hover:text-nexus-blue transition-colors duration-200">
              Sign In
            </Link>
            <Button className="nexus-button-primary">
              Get Started
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="px-4 pt-16">
          <Hero />
        </section>

        {/* Features Section */}
        <section className="py-24" id="features">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex animate-fade-in items-center rounded-full bg-white/5 px-4 py-1 text-sm text-nexus-purple backdrop-blur-sm">
                <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-nexus-purple"></span>
                Next-Generation Features
              </div>
              
              <h2 className="animate-fade-in text-3xl font-bold tracking-tight text-white sm:text-4xl [animation-delay:200ms]">
                Transforming Logistics with
                <span className="text-gradient-purple"> Artificial Intelligence</span>
              </h2>
              
              <p className="mt-4 animate-fade-in text-muted-foreground [animation-delay:300ms]">
                Our platform unifies AI optimization with intuitive interfaces, delivering unprecedented 
                efficiency and transparency for complex multi-modal shipments.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="nexus-card-blue p-6 animate-fade-in [animation-delay:400ms]">
                <div className="mb-4 inline-flex rounded-lg bg-nexus-blue/20 p-3">
                  <Truck className="h-6 w-6 text-nexus-blue" />
                </div>
                <h3 className="text-xl font-semibold text-white">Smart Route Selection</h3>
                <p className="mt-2 text-muted-foreground">
                  AI-powered route optimization that considers weather, border regulations, costs, and transit times.
                </p>
                <ul className="mt-4 space-y-2">
                  {["Real-time route updates", "Weather impact analysis", "Dynamic re-routing"].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-nexus-blue" />
                      <span className="text-sm text-white">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Feature 2 */}
              <div className="nexus-card-purple p-6 animate-fade-in [animation-delay:500ms]">
                <div className="mb-4 inline-flex rounded-lg bg-nexus-purple/20 p-3">
                  <BarChart3 className="h-6 w-6 text-nexus-purple" />
                </div>
                <h3 className="text-xl font-semibold text-white">Cost Optimization</h3>
                <p className="mt-2 text-muted-foreground">
                  Transparent breakdown of all costs with AI suggestions to maximize profit margins.
                </p>
                <ul className="mt-4 space-y-2">
                  {["Detailed cost analysis", "Profit optimization", "Duty & tax calculations"].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-nexus-purple" />
                      <span className="text-sm text-white">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Feature 3 */}
              <div className="nexus-card-teal p-6 animate-fade-in [animation-delay:600ms]">
                <div className="mb-4 inline-flex rounded-lg bg-nexus-teal/20 p-3">
                  <Zap className="h-6 w-6 text-nexus-teal" />
                </div>
                <h3 className="text-xl font-semibold text-white">Intelligent Rules Engine</h3>
                <p className="mt-2 text-muted-foreground">
                  Automated compliance management with smart cargo classification and regulatory guidance.
                </p>
                <ul className="mt-4 space-y-2">
                  {["Cargo-based restrictions", "Compliance assistance", "Automated documentation"].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-nexus-teal" />
                      <span className="text-sm text-white">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link to="/dashboard">
                <Button className="nexus-button-primary" size="lg">
                  Explore All Features
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-background via-background to-nexus-blue/20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to Transform Your Logistics Operations?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join forward-thinking companies that are already using LogiNexus AI
                to optimize their supply chains and maximize profits.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Link to="/dashboard">
                  <Button className="nexus-button-primary" size="lg">
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="border-white/10 bg-white/5 hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="flex items-center gap-x-2">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-nexus-blue">
                <div className="absolute inset-0 animate-pulse rounded-md bg-nexus-blue opacity-50"></div>
                <span className="text-xl font-bold text-white">L</span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="text-gradient-blue">Logi</span>
                <span className="text-white">Nexus</span>
                <span className="text-gradient-teal">AI</span>
              </span>
            </div>
            
            <div className="mt-6 flex space-x-8 md:mt-0">
              <Link to="#" className="text-sm text-muted-foreground hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-white transition-colors duration-200">
                Contact Us
              </Link>
            </div>
          </div>
          
          <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} LogiNexus AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
