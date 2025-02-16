
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type FeedbackResponseProps = {
  response: string;
  onResponseChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export const FeedbackResponse = ({
  response,
  onResponseChange,
  onSubmit,
  onCancel,
}: FeedbackResponseProps) => (
  <div className="mt-4 space-y-2">
    <Textarea
      placeholder="Scrivi una risposta..."
      value={response}
      onChange={(e) => onResponseChange(e.target.value)}
      className="min-h-[100px]"
    />
    <div className="space-x-2">
      <Button size="sm" onClick={onSubmit}>
        Invia risposta
      </Button>
      <Button variant="outline" size="sm" onClick={onCancel}>
        Annulla
      </Button>
    </div>
  </div>
);
