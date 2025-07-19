import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Shield,
  CheckCircle,
  Globe,
  Mail,
  ArrowRight,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const revealElements = () => {
      const reveals = document.querySelectorAll(".scroll-reveal");
      reveals.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
          element.classList.add("revealed");
        }
      });
    };

    window.addEventListener("scroll", revealElements);
    revealElements(); // Check on mount
    return () => window.removeEventListener("scroll", revealElements);
  }, []);

  const features = [
    {
      icon: Mail,
      title: "MX Record Verification",
      description:
        "Verify if email domains can receive emails through comprehensive MX record analysis",
    },
    {
      icon: Shield,
      title: "SPF & DMARC Validation",
      description:
        "Ensure domains are properly configured to prevent spoofing and maintain security",
    },
    {
      icon: CheckCircle,
      title: "Disposable Email Detection",
      description:
        "Detect temporary or throwaway email domains to maintain data quality",
    },
    {
      icon: Globe,
      title: "GeoLocation Lookup",
      description:
        "Get IP location of MX servers including country, region, and city information",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card"></div>
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 50% ${
            50 + scrollY * 0.1
          }%, hsl(var(--primary) / 0.1) 0%, transparent 50%)`,
        }}
      />

      {/* Navigation */}
      <nav className="relative z-50 flex justify-between items-center p-6 lg:px-12">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold glow-text">EmailValidator</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#about"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </a>
          <a
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#contact"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </a>
          <Button
            onClick={() => navigate("/check")}
            className="bg-primary hover:bg-primary/90 hover-glow"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] text-center px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="glow-text">Simple, fast</span>
              <span className="text-primary animate-pulse-glow"> ⚡ </span>
              <span className="glow-text">and secure</span>
              <br />
              <span className="glow-text">email validation service</span>
              <span className="text-primary animate-pulse-glow"> 🔒 </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Email Validation API: Clean Lists, Boost Deliverability & Maximize
              ROI. Remove fake emails and spam users from your email lists.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <Button
              onClick={() => navigate("/check")}
              size="lg"
              className="bg-primary hover:bg-primary/90 hover-glow text-lg px-8 py-4 group"
            >
              Get started for free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-sm text-muted-foreground">
              Includes 50 free credits • No credit card required!
            </p>
          </div>

          <div className="flex items-center justify-center space-x-6 mt-8 animate-fade-in">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">+10 users</span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>99.99% availability</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 glow-text">
              If you're running a newsletter, an e-commerce, a SaaS, or
              marketing campaigns, EmailValidator is for you.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-gradient rounded-lg p-6 hover-glow scroll-reveal glow-border"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mr-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center scroll-reveal">
          <div className="card-gradient rounded-2xl p-12 glow-border">
            <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <blockquote className="text-2xl font-medium mb-6 leading-relaxed">
              "EmailValidator delivers all we need in an email validation
              service: top security, scalability, performance, and extensive
              integrations"
            </blockquote>
            <cite className="text-muted-foreground">
              A happy customer, probably
            </cite>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center scroll-reveal">
          <h2 className="text-3xl font-bold mb-6 glow-text">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join thousands of developers and businesses who trust EmailValidator
            for their email validation needs.
          </p>
          <Button
            onClick={() => navigate("/check")}
            size="lg"
            className="bg-primary hover:bg-primary/90 hover-glow text-lg px-8 py-4"
          >
            Start validating emails now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary-glow rounded flex items-center justify-center">
              <Mail className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">EmailValidator</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 EmailValidator. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
