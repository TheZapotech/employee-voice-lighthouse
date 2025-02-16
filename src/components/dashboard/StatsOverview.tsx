
import { StatsCard } from "./StatsCard";

type StatsProps = {
  total: number;
  positive: number;
  negative: number;
  neutral: number;
  anonymous: number;
};

export const StatsOverview = ({ total, positive, negative, neutral, anonymous }: StatsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
    <StatsCard
      title="Totale Feedback"
      value={total}
      className="bg-white"
    />
    <StatsCard
      title="Sentiment Positivo"
      value={positive}
      className="bg-green-50"
    />
    <StatsCard
      title="Sentiment Negativo"
      value={negative}
      className="bg-red-50"
    />
    <StatsCard
      title="Sentiment Neutro"
      value={neutral}
      className="bg-gray-50"
    />
    <StatsCard
      title="Feedback Anonimi"
      value={anonymous}
      className="bg-blue-50"
    />
  </div>
);
