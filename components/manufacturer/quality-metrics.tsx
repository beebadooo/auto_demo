import { Card } from "@/components/ui/card";

export function QualityMetrics() {
  // Sample data - in a real app, this would come from your backend
  const metrics = {
    defectRate: 0.5,
    passRate: 99.5,
    inspectionsCompleted: 1250,
    criticalIssues: 3,
  };

  const chartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Pass Rate",
        data: [99.2, 99.4, 99.5, 99.5],
      },
      {
        label: "Defect Rate",
        data: [0.8, 0.6, 0.5, 0.5],
      },
    ],
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">Pass Rate</p>
          <p className="text-2xl font-bold text-green-600">{metrics.passRate}%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Defect Rate</p>
          <p className="text-2xl font-bold text-red-600">{metrics.defectRate}%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Inspections</p>
          <p className="text-2xl font-bold">{metrics.inspectionsCompleted}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Critical Issues</p>
          <p className="text-2xl font-bold text-orange-600">{metrics.criticalIssues}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-2">Trending Data</h3>
        <div className="text-sm text-gray-600">
          <p>Week 1: Pass Rate 99.2% | Defect Rate 0.8%</p>
          <p>Week 2: Pass Rate 99.4% | Defect Rate 0.6%</p>
          <p>Week 3: Pass Rate 99.5% | Defect Rate 0.5%</p>
          <p>Week 4: Pass Rate 99.5% | Defect Rate 0.5%</p>
        </div>
      </div>
    </div>
  );
}