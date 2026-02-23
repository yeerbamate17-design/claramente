import { getStatusLabel, getStatusColor } from "@/lib/utils";

export default function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
