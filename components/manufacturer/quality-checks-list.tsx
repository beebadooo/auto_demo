import { Badge } from "@/components/ui/badge";

export function QualityChecksList() {
  // Sample data - in a real app, this would come from your backend
  const checks = [
    {
      id: 1,
      vehicleId: "VIN123456",
      inspector: "John Doe",
      date: "2025-11-02",
      status: "passed",
      type: "Final Assembly",
    },
    {
      id: 2,
      vehicleId: "VIN123457",
      inspector: "Jane Smith",
      date: "2025-11-02",
      status: "failed",
      type: "Paint Quality",
    },
    {
      id: 3,
      vehicleId: "VIN123458",
      inspector: "Mike Johnson",
      date: "2025-11-02",
      status: "pending",
      type: "Safety Systems",
    },
  ];

  return (
    <div className="space-y-4">
      {checks.map((check) => (
        <div
          key={check.id}
          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-300 hover:text-zinc-900"
        >
          <div>
            <p className="font-medium">{check.vehicleId}</p>
            <p className="text-sm text-gray-600">{check.type}</p>
            <p className="text-xs text-gray-500">
              {check.inspector} • {check.date}
            </p>
          </div>
          <Badge
            variant={
              check.status === "passed"
                ? "default"
                : check.status === "failed"
                ? "destructive"
                : "secondary"
            }
          >
            {check.status}
          </Badge>
        </div>
      ))}
    </div>
  );
}