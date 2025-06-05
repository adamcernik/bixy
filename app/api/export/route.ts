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

    // Set column widths and style for modelNumber/modelName
    columns.forEach((col: string, idx: number) => {
      if (col === 'modelNumber') {
        worksheet.getColumn(idx + 1).width = 22;
      } else if (col === 'modelName') {
        worksheet.getColumn(idx + 1).width = 32;
      } else {
        worksheet.getColumn(idx + 1).width = 16;
      }
      worksheet.getColumn(idx + 1).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    });

    // Add data with alternating row colors and model name as hyperlink
    bikes.forEach((bike, i) => {
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
            // Add hyperlink if link exists
            if (bike.link) {
              row.push({ text: bike.modelName || '', hyperlink: bike.link });
            } else {
              row.push(bike.modelName || '');
            }
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
      const addedRow = worksheet.addRow(row);
      // Double color (striped rows)
      if (i % 2 === 1) {
        addedRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF5F5F5' }
        };
      }
      // Increase row height for padding
      addedRow.height = 24;
    });

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    worksheet.getRow(1).height = 28;

    // Freeze header row and model number column
    worksheet.views = [
      { state: 'frozen', xSplit: columns.indexOf('modelNumber') + 1, ySplit: 1 }
    ];

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