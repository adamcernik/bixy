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
    const colMaxLens: number[] = Array(columns.length).fill(0);
    bikes.forEach((bike, i) => {
      const row: any[] = [];
      columns.forEach((col: string, colIdx: number) => {
        let cellValue = '';
        switch(col) {
          case 'modelNumber':
            cellValue = bike.modelNumber || '';
            row.push(cellValue);
            break;
          case 'size':
            cellValue = bike.size || '';
            row.push(cellValue);
            break;
          case 'modelName':
            cellValue = bike.modelName || '';
            if (bike.link) {
              row.push({ text: cellValue, hyperlink: bike.link, font: { color: { argb: 'FF0000FF' }, underline: true } });
            } else {
              row.push(cellValue);
            }
            break;
          case 'battery':
            cellValue = bike.battery || '';
            row.push(cellValue);
            break;
          case 'pieces':
            cellValue = (bike.pieces || 0).toString();
            row.push(cellValue);
            break;
          case 'note':
            cellValue = bike.note || '';
            row.push(cellValue);
            break;
          case 'priceRetail':
            cellValue = (bike.priceRetail || 0).toString();
            row.push(cellValue);
            break;
          case 'priceAdam':
            cellValue = (bike.priceAdam || 0).toString();
            row.push(cellValue);
            break;
          case 'priceAction':
            cellValue = (bike.priceAction || 0).toString();
            row.push(cellValue);
            break;
          default:
            row.push('');
        }
        // Track max length for auto-fit
        if (typeof cellValue === 'string' && cellValue.length > colMaxLens[colIdx]) {
          colMaxLens[colIdx] = cellValue.length;
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

    // Auto-fit column widths, with min/max and special cases
    columns.forEach((col: string, idx: number) => {
      let width = colMaxLens[idx] + 4; // Add padding
      if (col === 'modelName') width = Math.max(width, 30);
      if (col === 'modelNumber') width = Math.max(width, 18);
      if (['size', 'battery', 'pieces'].includes(col)) width = Math.min(width, 12);
      width = Math.max(8, Math.min(width, 40));
      worksheet.getColumn(idx + 1).width = width;
      worksheet.getColumn(idx + 1).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    });

    // Style hyperlinks in model name column
    const modelNameIdx = columns.indexOf('modelName');
    if (modelNameIdx !== -1) {
      worksheet.getColumn(modelNameIdx + 1).eachCell((cell, rowNumber) => {
        if (rowNumber > 1 && cell.hyperlink) {
          cell.font = { color: { argb: 'FF0000FF' }, underline: true };
        }
      });
    }

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