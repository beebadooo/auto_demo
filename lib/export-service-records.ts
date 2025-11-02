import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export interface ServiceRecord {
  id: string;
  vehicleNumber: string;
  serviceType: string;
  date: string;
  blockchainHash: string;
  verificationStatus: string;
  customerName?: string;
  serviceDetails?: string;
  cost?: number;
}

export function exportServiceRecords(records: ServiceRecord[], format: 'xlsx' | 'csv' | 'pdf') {
  switch (format) {
    case 'xlsx':
      exportToExcel(records);
      break;
    case 'csv':
      exportToCsv(records);
      break;
    case 'pdf':
      exportToPdf(records);
      break;
  }
}

function exportToExcel(records: ServiceRecord[]) {
  const worksheet = XLSX.utils.json_to_sheet(records);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Service Records");
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 
         'service-records.xlsx');
}

function exportToCsv(records: ServiceRecord[]) {
  const headers = ['ID', 'Vehicle Number', 'Service Type', 'Date', 'Blockchain Hash', 'Status'];
  const csvContent = [
    headers.join(','),
    ...records.map(record => [
      record.id,
      record.vehicleNumber,
      record.serviceType,
      record.date,
      record.blockchainHash,
      record.verificationStatus
    ].join(','))
  ].join('\n');

  saveAs(new Blob([csvContent], { type: 'text/csv;charset=utf-8' }), 'service-records.csv');
}

function exportToPdf(records: ServiceRecord[]) {
  // Implement PDF export using a library like pdfmake or jspdf
  console.log('PDF export to be implemented');
}