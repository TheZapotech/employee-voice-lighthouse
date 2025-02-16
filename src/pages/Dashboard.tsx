
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { it } from "date-fns/locale";

type Feedback = {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'in_review' | 'addressed' | 'archived';
  is_anonymous: boolean;
  created_at: string;
  response?: string;
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  in_review: "bg-blue-100 text-blue-800",
  addressed: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-800",
};

const statusLabels = {
  pending: "In attesa",
  in_review: "In revisione",
  addressed: "Gestito",
  archived: "Archiviato",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const [response, setResponse] = useState("");

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
      
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableCaption>Lista dei feedback ricevuti</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Titolo</TableHead>
              <TableHead>Contenuto</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead>Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbacks.map((feedback) => (
              <TableRow key={feedback.id}>
                <TableCell className="whitespace-nowrap">
                  {format(new Date(feedback.created_at), 'dd MMM yyyy', { locale: it })}
                </TableCell>
                <TableCell className="font-medium">{feedback.title}</TableCell>
                <TableCell className="max-w-md">
                  <p className="truncate">{feedback.content}</p>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={statusColors[feedback.status]}
                  >
                    {statusLabels[feedback.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-x-2">
                    {feedback.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateFeedbackStatus(feedback.id, 'in_review')}
                      >
                        Prendi in carico
                      </Button>
                    )}
                    {(feedback.status === 'pending' || feedback.status === 'in_review') && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedFeedback(feedback.id);
                            setResponse(feedback.response || '');
                          }}
                        >
                          Rispondi
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateFeedbackStatus(feedback.id, 'archived')}
                        >
                          Archivia
                        </Button>
                      </>
                    )}
                  </div>
                  
                  {selectedFeedback === feedback.id && (
                    <div className="mt-4 space-y-2">
                      <Textarea
                        placeholder="Scrivi una risposta..."
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="space-x-2">
                        <Button
                          size="sm"
                          onClick={() => submitResponse(feedback.id)}
                        >
                          Invia risposta
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedFeedback(null);
                            setResponse("");
                          }}
                        >
                          Annulla
                        </Button>
                      </div>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
