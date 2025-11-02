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
import { Calendar, Clock } from "lucide-react";

export function AppointmentsList() {
  const appointments = [
    {
      id: "APT001",
      vehicleNumber: "KA01AB1234",
      customerName: "John Doe",
      serviceType: "Regular Maintenance",
      date: "2025-11-03",
      time: "10:00 AM",
      status: "confirmed"
    },
    {
      id: "APT002",
      vehicleNumber: "KA01CD5678",
      customerName: "Jane Smith",
      serviceType: "Oil Change",
      date: "2025-11-03",
      time: "11:30 AM",
      status: "pending"
    },
    {
      id: "APT003",
      vehicleNumber: "KA01EF9012",
      customerName: "Robert Johnson",
      serviceType: "Brake Service",
      date: "2025-11-03",
      time: "02:00 PM",
      status: "completed"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          View Calendar
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Appointment ID</TableHead>
            <TableHead>Vehicle Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Service Type</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.id}</TableCell>
              <TableCell>{appointment.vehicleNumber}</TableCell>
              <TableCell>{appointment.customerName}</TableCell>
              <TableCell>{appointment.serviceType}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{appointment.date}</span>
                  <Clock className="ml-4 mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{appointment.time}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    appointment.status === "confirmed"
                      ? "default"
                      : appointment.status === "completed"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {appointment.status}
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