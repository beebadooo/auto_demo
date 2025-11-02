export function QualityDefectLog() {
  // Sample data - in a real app, this would come from your backend
  const defects = [
    {
      id: 1,
      vehicleId: "VIN123457",
      component: "Paint",
      severity: "minor",
      description: "Surface scratches on hood",
      reportedBy: "Jane Smith",
      date: "2025-11-02",
    },
    {
      id: 2,
      vehicleId: "VIN123459",
      component: "Braking System",
      severity: "critical",
      description: "Irregular brake pad wear",
      reportedBy: "Mike Johnson",
      date: "2025-11-02",
    },
    {
      id: 3,
      vehicleId: "VIN123460",
      component: "Dashboard",
      severity: "moderate",
      description: "Display flickering intermittently",
      reportedBy: "John Doe",
      date: "2025-11-02",
    },
  ];

  return (
    <div className="space-y-4">
      {defects.map((defect) => (
        <div
          key={defect.id}
          className="p-3 border rounded-lg hover:hover:bg-gray-300 hover:text-zinc-900"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium">{defect.vehicleId}</p>
            <span
              className={`text-xs px-2 py-1 rounded ${
                defect.severity === "critical"
                  ? "bg-red-100 text-red-800"
                  : defect.severity === "moderate"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {defect.severity}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">{defect.component}:</span>{" "}
            {defect.description}
          </p>
          <p className="text-xs text-gray-500">
            {defect.reportedBy} • {defect.date}
          </p>
        </div>
      ))}
    </div>
  );
}