import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle2, Clock, Star } from "lucide-react";

export function StatsGrid() {
  const stats = [
    {
      title: "Total Appointments",
      value: "245",
      description: "This month",
      icon: Calendar,
      trend: "+12% from last month"
    },
    {
      title: "Completed Services",
      value: "182",
      description: "This month",
      icon: CheckCircle2,
      trend: "+8% from last month"
    },
    {
      title: "Pending Verification",
      value: "18",
      description: "Active requests",
      icon: Clock,
      trend: "-3% from last month"
    },
    {
      title: "Average Rating",
      value: "4.8",
      description: "From 156 reviews",
      icon: Star,
      trend: "+0.2 from last month"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}