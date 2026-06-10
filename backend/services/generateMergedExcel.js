const ExcelJS = require("exceljs");

/**
 * Tạo file Excel từ dữ liệu đã gộp
 * @param {Object} mergedResult - Kết quả từ mergeMonthlyData
 * @param {Array<string>} monthNames - Mảng tên tháng
 * @param {Array<string>} dataColumns - Mảng các cột dữ liệu cần hiển thị (ví dụ: ["T.Lương, Phụ cấp TG BHXH", "2% công đoàn"])
 * @returns {Promise<Buffer>} - Buffer chứa file Excel
 */
const generateMergedExcel = async (mergedResult, monthNames, dataColumns = null) => {
  const { mergedData, allHeaders } = mergedResult;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Gộp dữ liệu");

  // Xác định các cột dữ liệu cần hiển thị
  // Nếu không chỉ định, sẽ lấy tất cả các cột trừ các cột cơ bản
  const basicColumns = ["TT", "MNV", "Họ và tên", "Join date"];
  const columnsToShow = dataColumns || allHeaders.filter(h => !basicColumns.includes(h) && !h.startsWith('_'));

  // Tạo header
  const headerRow = worksheet.addRow([]);
  let colIndex = 1;

  // Header cột cơ bản
  basicColumns.forEach(col => {
    const cell = headerRow.getCell(colIndex);
    cell.value = col;
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    colIndex++;
  });

  // Header cho từng tháng
  monthNames.forEach(monthName => {
    columnsToShow.forEach(col => {
      const cell = headerRow.getCell(colIndex);
      cell.value = `${monthName} - ${col}`;
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFE4B5' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      colIndex++;
    });
  });

  // Đóng băng hàng header
  worksheet.views = [
    {
      state: 'frozen',
      ySplit: 1
    }
  ];

  // Thêm dữ liệu
  const sortedKeys = Object.keys(mergedData).sort((a, b) => {
    // Sắp xếp theo TT nếu có, nếu không thì theo MNV
    const ttA = mergedData[a].TT;
    const ttB = mergedData[b].TT;
    if (ttA && ttB) {
      return Number(ttA) - Number(ttB);
    }
    return a.localeCompare(b);
  });

  sortedKeys.forEach((key) => {
    const employee = mergedData[key];
    const row = worksheet.addRow([]);
    let colIndex = 1;

    // Cột cơ bản
    basicColumns.forEach(col => {
      const cell = row.getCell(colIndex);
      const value = employee[col] || employee.baseData[col] || '';
      cell.value = value;
      
      // Format ngày tháng
      if (col === "Join date" && value) {
        if (value instanceof Date) {
          cell.numFmt = 'dd/mm/yyyy';
        } else if (typeof value === 'string' && value.includes('/')) {
          cell.value = value; // Giữ nguyên format string
        }
      }
      
      colIndex++;
    });

    // Dữ liệu theo tháng
    monthNames.forEach(monthName => {
      const monthData = employee.monthlyData[monthName] || {};
      
      columnsToShow.forEach(col => {
        const cell = row.getCell(colIndex);
        // Tìm giá trị từ monthData, ưu tiên header name, sau đó tìm trong các key khác
        let value = monthData[col];
        
        // Nếu không tìm thấy, thử tìm trong các key khác (có thể có format khác)
        if (value === undefined || value === null || value === '') {
          // Tìm trong tất cả các key của monthData
          for (const key in monthData) {
            if (key === col || key.includes(col)) {
              value = monthData[key];
              break;
            }
          }
        }
        
        if (value === undefined || value === null) {
          value = '';
        }
        
        // Đảm bảo chỉ gán giá trị đơn giản, không gán object phức tạp (như formula)
        // Nếu value là object, thử lấy giá trị từ nó
        if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
          // Nếu là object có result (từ formula), lấy result
          if (value.result !== undefined) {
            value = value.result;
          } else if (value.value !== undefined) {
            value = value.value;
          } else {
            // Nếu không có result hoặc value, convert sang string
            value = String(value);
          }
        }
        
        // Format số (giữ nguyên format string với dấu chấm nếu là string)
        if (typeof value === 'string' && value.trim() !== '' && value !== '-') {
          // Kiểm tra xem có phải là số không (có thể có dấu chấm phân cách hàng nghìn)
          const numericValue = value.replace(/\./g, '');
          if (/^\d+$/.test(numericValue)) {
            cell.value = value; // Giữ nguyên format string với dấu chấm
          } else {
            cell.value = value;
          }
        } else if (typeof value === 'number') {
          cell.value = value;
          cell.numFmt = '#,##0';
        } else if (value instanceof Date) {
          cell.value = value;
          cell.numFmt = 'dd/mm/yyyy';
        } else {
          // Đảm bảo là giá trị đơn giản
          cell.value = value === null || value === undefined ? '' : String(value);
        }
        
        colIndex++;
      });
    });
  });

  // Điều chỉnh độ rộng cột
  worksheet.columns.forEach((column, index) => {
    if (index < basicColumns.length) {
      column.width = 15;
    } else {
      column.width = 20;
    }
  });

  // Tạo buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

module.exports = {
  generateMergedExcel
};

