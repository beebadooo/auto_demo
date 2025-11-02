import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Star, ThumbsUp, TrendingUp } from "lucide-react";

export function ServiceAnalytics() {
  const performanceMetrics = [
    {
      title: "Service Efficiency",
      value: "92%",
      description: "Average completion time",
      icon: Activity,
      trend: "+5% improvement"
    },
    {
      title: "Customer Satisfaction",
      value: "4.8/5",
      description: "Based on 156 reviews",
      icon: Star,
      trend: "Consistently high"
    },
    {
      title: "First-Time Fix Rate",
      value: "87%",
      description: "Issues resolved first time",
      icon: ThumbsUp,
      trend: "+3% from last month"
    },
    {
      title: "Revenue Growth",
      value: "₹1.2M",
      description: "This month",
      icon: TrendingUp,
      trend: "+15% from last month"
    }
  ];

  const renderMetricCard = (metric: typeof performanceMetrics[0]) => {
    const Icon = metric.icon;
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {metric.title}
          </CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metric.value}</div>
          <p className="text-xs text-muted-foreground">{metric.description}</p>
          <p className="text-xs text-green-600 mt-1">{metric.trend}</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Performance Analytics</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {performanceMetrics.map((metric, index) => (
          renderMetricCard(metric)
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Monthly Service Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Chart component will be added here to show service trends over time
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Customer Feedback Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Chart component will be added here to show customer satisfaction metrics
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}