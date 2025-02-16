
import { ArrowRight, MessageSquare, BarChart2, Shield } from "lucide-react";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-4xl mx-auto text-center space-y-8 fade-in">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Fai Sentire la Tua Voce
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Piattaforma di feedback anonimo per un ambiente di lavoro migliore
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
          Condividi Feedback
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

const features = [
  {
    title: "Feedback Anonimo",
    description: "Condividi i tuoi pensieri in modo sicuro e anonimo, senza timore di essere identificato.",
    icon: Shield
  },
  {
    title: "Analisi in Tempo Reale",
    description: "Osserva come il tuo feedback contribuisce al miglioramento dell'ambiente lavorativo.",
    icon: BarChart2
  },
  {
    title: "Comunicazione Aperta",
    description: "Colma il divario tra dipendenti e management in modo efficace.",
    icon: MessageSquare
  }
];

export default Hero;
