
type StatsCardProps = {
  title: string;
  value: number;
  className?: string;
};

export const StatsCard = ({ title, value, className = "" }: StatsCardProps) => (
  <div className={`p-4 rounded-lg shadow ${className}`}>
    <div className="text-sm text-gray-500">{title}</div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);
