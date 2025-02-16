
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FeedbackForm } from "@/components/FeedbackForm";

const FeedbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Invia un feedback</h1>
        <p className="text-gray-600 mb-8">
          I tuoi feedback ci aiutano a migliorare. Puoi scegliere di inviare il feedback in modo anonimo.
        </p>
        <FeedbackForm />
      </div>
    </div>
  );
};

export default FeedbackPage;
