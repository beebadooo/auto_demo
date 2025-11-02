import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, FileWarning, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RtoIntegration() {
  const rtoData = {
    pucCertificates: {
      total: 156,
      pending: 12,
      expiringSoon: 8
    },
    challans: {
      total: 45,
      unresolved: 5,
      disputed: 2
    },
    ownershipTransfers: {
      total: 78,
      inProgress: 3,
      completed: 75
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">PUC Certificates</CardTitle>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rtoData.pucCertificates.total}</div>
          <p className="text-xs text-muted-foreground">
            {rtoData.pucCertificates.pending} Pending
          </p>
          <p className="text-xs text-orange-600 mt-1">
            {rtoData.pucCertificates.expiringSoon} Expiring Soon
          </p>
          <Button variant="outline" size="sm" className="mt-4 w-full">
            Manage Certificates
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Challans</CardTitle>
          <FileWarning className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rtoData.challans.total}</div>
          <p className="text-xs text-muted-foreground">
            {rtoData.challans.unresolved} Unresolved
          </p>
          <p className="text-xs text-orange-600 mt-1">
            {rtoData.challans.disputed} Disputed
          </p>
          <Button variant="outline" size="sm" className="mt-4 w-full">
            View Challans
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ownership Transfers</CardTitle>
          <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rtoData.ownershipTransfers.total}</div>
          <p className="text-xs text-muted-foreground">
            {rtoData.ownershipTransfers.inProgress} In Progress
          </p>
          <p className="text-xs text-green-600 mt-1">
            {rtoData.ownershipTransfers.completed} Completed
          </p>
          <Button variant="outline" size="sm" className="mt-4 w-full">
            Manage Transfers
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}