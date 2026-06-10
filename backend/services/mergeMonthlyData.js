const ExcelJS = require("exceljs");
const { columnToNumber, numberToColumn } = require("./excelParser");

/**
 * Gộp dữ liệu từ nhiều sheet trong 1 file Excel theo MNV
 * @param {Buffer} fileBuffer - Buffer chứa file Excel
 * @param {Array<string>} monthNames - Mảng tên tháng tương ứng với các sheet (ví dụ: ["Tháng 1", "Tháng 2", ...])
 * @param {Array<number>} sheetIndices - Mảng index của các sheet cần đọc (ví dụ: [0, 1, 2, ...])
 * @param {Object} config - Cấu hình parse file (không bao gồm sheetIndex)
 * @param {string} keyColumn - Tên cột dùng làm key để gộp (mặc định: "MNV")
 * @returns {Promise<Object>} - Object chứa dữ liệu đã gộp theo MNV
 */
const mergeMonthlyData = async (fileBuffer, monthNames, sheetIndices, config, keyColumn = "MNV") => {
  const mergedData = {}; // Key: MNV, Value: Object chứa thông tin cơ bản + dữ liệu các tháng
  const allHeaders = new Set(); // Tập hợp tất cả các header từ tất cả các sheet

  // Load workbook một lần
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(fileBuffer);
  } catch (error) {
    console.error(`Lỗi khi load workbook:`, error.message);
    throw new Error(`Không thể load file Excel. File có thể bị corrupt. Chi tiết: ${error.message}`);
  }

  // Kiểm tra số lượng sheet
  const totalSheets = workbook.worksheets.length;
  console.log(`File có ${totalSheets} sheet(s)`);

  // Nếu không chỉ định sheetIndices, đọc tất cả các sheet
  const sheetsToProcess = sheetIndices && sheetIndices.length > 0 
    ? sheetIndices 
    : Array.from({ length: totalSheets }, (_, i) => i);

  // Parse từng sheet và gộp dữ liệu
  for (let i = 0; i < sheetsToProcess.length; i++) {
    const sheetIndex = sheetsToProcess[i];
    const monthName = monthNames[i] || workbook.worksheets[sheetIndex]?.name || `Tháng ${i + 1}`;

    try {
      // Kiểm tra sheet có tồn tại không
      if (sheetIndex >= totalSheets) {
        console.warn(`Sheet index ${sheetIndex} không tồn tại, bỏ qua`);
        continue;
      }

      const worksheet = workbook.worksheets[sheetIndex];
      console.log(`Đang xử lý sheet ${sheetIndex}: "${worksheet.name}" (${monthName})`);

      // Parse sheet trực tiếp từ worksheet (không load lại workbook)
      const {
        headerRow = 1,
        startRow = null,
        startColumn = "A",
        endColumn = null,
      } = config;

      const actualStartRow = startRow || headerRow + 1;
      const startColIndex = columnToNumber(startColumn);
      const endColIndex = endColumn ? columnToNumber(endColumn) : worksheet.columnCount;

      // Đọc header từ hàng headerRow
      const headerRowData = worksheet.getRow(headerRow);
      const headers = {};
      for (let colIndex = startColIndex; colIndex <= endColIndex; colIndex++) {
        const headerCell = headerRowData.getCell(colIndex);
        const columnLetter = numberToColumn(colIndex);
        const headerValue = headerCell?.value;
        headers[colIndex] = headerValue?.toString()?.trim() || columnLetter;
      }

      // Đọc dữ liệu từ sheet
      const data = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber < actualStartRow) return; // Bỏ qua các hàng trước startRow

        const rowData = {};
        
        // Đọc từng cột trong phạm vi đã định
        for (let colIndex = startColIndex; colIndex <= endColIndex; colIndex++) {
          const cell = row.getCell(colIndex);
          const columnLetter = numberToColumn(colIndex);
          const headerName = headers[colIndex] || columnLetter;
          
          // Chỉ lấy giá trị đã tính toán, không lấy formula
          // Nếu cell có formula, lấy result (giá trị đã tính)
          let cellValue = cell.value;
          
          // Nếu cell có formula, lấy result thay vì formula object
          if (cell.formula) {
            // Ưu tiên lấy result nếu có, nếu không thì lấy value
            cellValue = cell.result !== undefined ? cell.result : cell.value;
          }
          
          rowData[headerName] = cellValue;
          rowData[`_col_${columnLetter}`] = cellValue; // Giữ cả tên cột dạng A, B, C...
        }

        // Chỉ thêm hàng nếu có ít nhất 1 giá trị
        if (Object.values(rowData).some(val => val !== null && val !== undefined && val !== "")) {
          rowData._rowNumber = rowNumber;
          data.push(rowData);
        }
      });
      
      // Lưu tất cả các header để biết cấu trúc dữ liệu
      if (data.length > 0) {
        Object.keys(data[0]).forEach(header => {
          if (!header.startsWith('_')) { // Bỏ qua các header internal như _rowNumber, _col_A
            allHeaders.add(header);
          }
        });
      }

      // Gộp dữ liệu theo MNV
      data.forEach((row) => {
        const key = row[keyColumn]?.toString()?.trim() || row[`_col_B`]?.toString()?.trim(); // MNV thường ở cột B
        
        if (!key) {
          console.warn(`Bỏ qua hàng không có ${keyColumn}:`, row);
          return;
        }

        // Nếu chưa có trong mergedData, tạo mới với thông tin cơ bản
        if (!mergedData[key]) {
          mergedData[key] = {
            // Thông tin cơ bản (lấy từ sheet đầu tiên có nhân viên này)
            TT: row["TT"] || row["_col_A"],
            MNV: key,
            "Họ và tên": row["Họ và tên"] || row["_col_C"],
            "Join date": row["Join date"] || row["_col_D"],
            // Lưu tất cả các cột gốc từ sheet đầu tiên
            baseData: { ...row },
            // Dữ liệu theo tháng
            monthlyData: {}
          };
        }

        // Lưu dữ liệu của tháng này (với prefix tên tháng)
        mergedData[key].monthlyData[monthName] = { ...row };
      });

      console.log(`Đã xử lý ${monthName} (sheet ${sheetIndex}): ${data.length} hàng`);
    } catch (error) {
      console.error(`Lỗi khi parse sheet ${sheetIndex} (${monthName}):`, error.message);
      throw new Error(`Lỗi khi parse sheet ${sheetIndex} (${monthName}): ${error.message}`);
    }
  }

  return {
    mergedData,
    allHeaders: Array.from(allHeaders),
    totalEmployees: Object.keys(mergedData).length
  };
};

module.exports = {
  mergeMonthlyData
};
