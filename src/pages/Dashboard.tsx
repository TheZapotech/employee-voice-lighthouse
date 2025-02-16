
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { FeedbackTable } from "@/components/dashboard/FeedbackTable";

type Feedback = {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'in_review' | 'addressed' | 'archived';
  is_anonymous: boolean;
  created_at: string;
  response?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    positive: 0,
    negative: 0,
    neutral: 0,
    anonymous: 0,
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    
    checkUser();
    fetchFeedbacks();
  }, [navigate]);

  const fetchFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFeedbacks(data || []);
      
      // Calcola le statistiche
      const stats = data.reduce((acc, feedback) => {
        acc.total++;
        if (feedback.sentiment) acc[feedback.sentiment]++;
        if (feedback.is_anonymous) acc.anonymous++;
        return acc;
      }, { total: 0, positive: 0, negative: 0, neutral: 0, anonymous: 0 });
      
      setStats(stats);
    } catch (error) {
      console.error('Errore nel caricamento dei feedback:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile caricare i feedback.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFeedbackStatus = async (id: string, status: Feedback['status']) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setFeedbacks(feedbacks.map(f => 
        f.id === id ? { ...f, status } : f
      ));

      toast({
        title: "Stato aggiornato",
        description: "Lo stato del feedback è stato aggiornato con successo.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile aggiornare lo stato del feedback.",
      });
    }
  };

  const submitResponse = async (id: string) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ 
          response,
          status: 'addressed'
        })
        .eq('id', id);

      if (error) throw error;

      setFeedbacks(feedbacks.map(f => 
        f.id === id ? { ...f, response, status: 'addressed' } : f
      ));
      setSelectedFeedback(null);
      setResponse("");

      toast({
        title: "Risposta inviata",
        description: "La tua risposta è stata salvata con successo.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile salvare la risposta.",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <p>Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-2xl font-bold mb-6">Dashboard Feedback</h1>
      
      <StatsOverview {...stats} />
      
      <FeedbackTable
        feedbacks={feedbacks}
        selectedFeedback={selectedFeedback}
        response={response}
        onResponseChange={setResponse}
        onSubmitResponse={submitResponse}
        onUpdateStatus={updateFeedbackStatus}
        onSelectFeedback={(id, initialResponse) => {
          setSelectedFeedback(id);
          setResponse(initialResponse);
        }}
        onCancelResponse={() => {
          setSelectedFeedback(null);
          setResponse("");
        }}
      />
    </div>
  );
};

export default Dashboard;
