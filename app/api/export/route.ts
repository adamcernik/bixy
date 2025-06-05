import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import ExcelJS from 'exceljs';
import { Bike } from '@/app/types/bike';

type ColumnId = keyof Omit<Bike, 'id'>;

export async function POST(request: Request) {
  try {
    const { columns } = await request.json();
    
    // Get data from Firestore
    const bikesRef = collection(db, 'bikes');
    const snapshot = await getDocs(bikesRef);
    const bikes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Bike[];

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventory');

    // Add headers
    const headers = columns.map((col: string) => {
      switch(col) {
        case 'modelNumber': return 'Model Number';
        case 'size': return 'Size';
        case 'modelName': return 'Model Name';
        case 'battery': return 'Battery';
        case 'pieces': return 'Pieces';
        case 'note': return 'Note';
        case 'priceRetail': return 'Price Retail';
        case 'priceAdam': return 'Price Adam';
        case 'priceAction': return 'Price Action';
        default: return col;
      }
    });
    worksheet.addRow(headers);

    // Add data
    bikes.forEach(bike => {
      const row: any[] = [];
      columns.forEach((col: string) => {
        switch(col) {
          case 'modelNumber':
            row.push(bike.modelNumber || '');
            break;
          case 'size':
            row.push(bike.size || '');
            break;
          case 'modelName':
            row.push(bike.modelName || '');
            break;
          case 'battery':
            row.push(bike.battery || '');
            break;
          case 'pieces':
            row.push(bike.pieces || 0);
            break;
          case 'note':
            row.push(bike.note || '');
            break;
          case 'priceRetail':
            row.push(bike.priceRetail || 0);
            break;
          case 'priceAdam':
            row.push(bike.priceAdam || 0);
            break;
          case 'priceAction':
            row.push(bike.priceAction || 0);
            break;
          default:
            row.push('');
        }
      });
      worksheet.addRow(row);
    });

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Return the Excel file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="bike-inventory-${new Date().toISOString().split('T')[0]}.xlsx"`
      }
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
} 