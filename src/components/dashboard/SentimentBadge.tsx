
import { Badge } from "@/components/ui/badge";

const sentimentColors = {
  positive: "bg-green-100 text-green-800",
  negative: "bg-red-100 text-red-800",
  neutral: "bg-gray-100 text-gray-800",
};

const sentimentLabels = {
  positive: "Positivo",
  negative: "Negativo",
  neutral: "Neutro",
};

type SentimentBadgeProps = {
  sentiment: keyof typeof sentimentColors;
};

export const SentimentBadge = ({ sentiment }: SentimentBadgeProps) => (
  <Badge
    variant="secondary"
    className={sentimentColors[sentiment]}
  >
    {sentimentLabels[sentiment]}
  </Badge>
);
