
import { ArrowRight, MessageSquare, BarChart2, Shield } from "lucide-react";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-4xl mx-auto text-center space-y-8 fade-in">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Make Your Voice Heard
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Anonymous feedback platform for a better workplace
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-6 rounded-lg hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <feature.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <Button
          size="lg"
          className="group"
          onClick={() => window.location.href = '/feedback'}
        >
          Share Feedback
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

const features = [
  {
    title: "Anonymous Feedback",
    description: "Share your thoughts safely and securely, without fear of identification.",
    icon: Shield
  },
  {
    title: "Real-time Insights",
    description: "See how your feedback contributes to workplace improvements.",
    icon: BarChart2
  },
  {
    title: "Open Communication",
    description: "Bridge the gap between employees and management effectively.",
    icon: MessageSquare
  }
];

export default Hero;
