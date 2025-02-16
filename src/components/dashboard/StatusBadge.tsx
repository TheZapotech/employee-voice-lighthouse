
import { Badge } from "@/components/ui/badge";

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

type StatusBadgeProps = {
  status: keyof typeof statusColors;
};

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <Badge
    variant="secondary"
    className={statusColors[status]}
  >
    {statusLabels[status]}
  </Badge>
);
