
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { SentimentBadge } from "./SentimentBadge";
import { FeedbackResponse } from "./FeedbackResponse";

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

type FeedbackTableProps = {
  feedbacks: Feedback[];
  selectedFeedback: string | null;
  response: string;
  onResponseChange: (value: string) => void;
  onSubmitResponse: (id: string) => void;
  onUpdateStatus: (id: string, status: Feedback['status']) => void;
  onSelectFeedback: (id: string, response: string) => void;
  onCancelResponse: () => void;
};

export const FeedbackTable = ({
  feedbacks,
  selectedFeedback,
  response,
  onResponseChange,
  onSubmitResponse,
  onUpdateStatus,
  onSelectFeedback,
  onCancelResponse,
}: FeedbackTableProps) => (
  <div className="bg-white rounded-lg shadow">
    <Table>
      <TableCaption>Lista dei feedback ricevuti</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Titolo</TableHead>
          <TableHead>Contenuto</TableHead>
          <TableHead>Sentiment</TableHead>
          <TableHead>Stato</TableHead>
          <TableHead>Tipo</TableHead>
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
              {feedback.sentiment && (
                <SentimentBadge sentiment={feedback.sentiment} />
              )}
            </TableCell>
            <TableCell>
              <StatusBadge status={feedback.status} />
            </TableCell>
            <TableCell>
              <Badge variant={feedback.is_anonymous ? "secondary" : "outline"}>
                {feedback.is_anonymous ? "Anonimo" : "Identificato"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="space-x-2">
                {feedback.status === 'pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateStatus(feedback.id, 'in_review')}
                  >
                    Prendi in carico
                  </Button>
                )}
                {(feedback.status === 'pending' || feedback.status === 'in_review') && (
                  <>
                    {!feedback.is_anonymous && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectFeedback(feedback.id, feedback.response || '')}
                      >
                        Rispondi
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateStatus(feedback.id, 'archived')}
                    >
                      Archivia
                    </Button>
                  </>
                )}
              </div>
              
              {selectedFeedback === feedback.id && !feedback.is_anonymous && (
                <FeedbackResponse
                  response={response}
                  onResponseChange={onResponseChange}
                  onSubmit={() => onSubmitResponse(feedback.id)}
                  onCancel={onCancelResponse}
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
