import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ServiceRecords() {
  const records = [
    {
      id: "SR001",
      vehicleNumber: "KA01AB1234",
      serviceType: "Regular Maintenance",
      date: "2025-11-01",
      blockchainHash: "0x1234...5678",
      verificationStatus: "verified"
    },
    {
      id: "SR002",
      vehicleNumber: "KA01CD5678",
      serviceType: "Engine Repair",
      date: "2025-10-28",
      blockchainHash: "0x5678...9012",
      verificationStatus: "pending"
    },
    {
      id: "SR003",
      vehicleNumber: "KA01EF9012",
      serviceType: "Brake Service",
      date: "2025-10-25",
      blockchainHash: "0x9012...3456",
      verificationStatus: "verified"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Service Records</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search records..." className="pl-8" />
          </div>
          <Button variant="outline" size="sm">Export Records</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Record ID</TableHead>
            <TableHead>Vehicle Number</TableHead>
            <TableHead>Service Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Blockchain Hash</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.id}</TableCell>
              <TableCell>{record.vehicleNumber}</TableCell>
              <TableCell>{record.serviceType}</TableCell>
              <TableCell>{record.date}</TableCell>
              <TableCell>
                <code className="text-sm">{record.blockchainHash}</code>
              </TableCell>
              <TableCell>
                <Badge
                  variant={record.verificationStatus === "verified" ? "default" : "outline"}
                >
                  {record.verificationStatus}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}