const ExcelJS = require("exceljs");
const path = require("path");

/**
 * Đếm số nhãn expected có trong hàng (so khớp chuỗi, không phân biệt hoa thường)
 */
const countMatchingHeadersInRow = (worksheet, rowNumber, startColIndex, endColIndex, expectedLabels) => {
  if (!expectedLabels || expectedLabels.length === 0) return 0;
  const row = worksheet.getRow(rowNumber);
  let count = 0;
  const normalizedExpected = expectedLabels.map((l) => String(l).toLowerCase().trim());
  for (let colIndex = startColIndex; colIndex <= endColIndex; colIndex++) {
    const cell = row.getCell(colIndex);
    const val = cell?.value?.toString()?.trim()?.toLowerCase() || "";
    if (!val) continue;
    const matched = normalizedExpected.some((label) => val === label || val.includes(label) || label.includes(val));
    if (matched) count++;
  }
  return count;
};

/**
 * Parse file Excel và trả về dữ liệu theo cấu hình
 * @param {string|Buffer} filePathOrBuffer - Đường dẫn đến file Excel hoặc Buffer chứa file
 * @param {Object} config - Cấu hình parse
 * @param {number} config.sheetIndex - Index của sheet cần đọc (mặc định: 0)
 * @param {number} config.headerRow - Hàng chứa header (mặc định: 1)
 * @param {number} config.startRow - Hàng bắt đầu đọc dữ liệu (mặc định: headerRow + 1)
 * @param {string} config.startColumn - Cột bắt đầu (ví dụ: 'A', 'B', mặc định: 'A')
 * @param {string} config.endColumn - Cột kết thúc (ví dụ: 'D', 'E', mặc định: null - đọc đến hết)
 * @param {string[]} [expectedHeaderLabels] - Tùy chọn: danh sách tên cột mong đợi để tự động tìm hàng header
 * @returns {Promise<Array>} - Mảng các object chứa dữ liệu từng hàng
 */
const parseExcelFile = async (filePathOrBuffer, config = {}, expectedHeaderLabels = null) => {
  const {
    sheetIndex = 0,
    headerRow = 1, // Mặc định header ở hàng 1
    startRow = null, // Nếu null, sẽ tự động = headerRow + 1
    startColumn = "A",
    endColumn = null, // null = đọc đến hết
  } = config;

  const workbook = new ExcelJS.Workbook();

  if (Buffer.isBuffer(filePathOrBuffer)) {
    await workbook.xlsx.load(filePathOrBuffer);
  } else {
    await workbook.xlsx.readFile(filePathOrBuffer);
  }

  const worksheet = workbook.worksheets[sheetIndex];
  if (!worksheet) {
    throw new Error(`Sheet index ${sheetIndex} không tồn tại`);
  }

  const startColIndex = columnToNumber(startColumn);
  const endColIndex = endColumn ? columnToNumber(endColumn) : worksheet.columnCount;
  const scanFrom = Math.max(1, headerRow - 2);
  const scanTo = Math.min(worksheet.rowCount || 20, headerRow + 6);

  // Hàng header mặc định (dùng khi không tìm được match theo cột)
  let fallbackHeaderRow = headerRow;
  if (expectedHeaderLabels && expectedHeaderLabels.length > 0) {
    let bestCount = 0;
    for (let r = scanFrom; r <= scanTo; r++) {
      const count = countMatchingHeadersInRow(worksheet, r, startColIndex, endColIndex, expectedHeaderLabels);
      if (count > bestCount) {
        bestCount = count;
        fallbackHeaderRow = r;
      }
    }
    if (bestCount > 0 && fallbackHeaderRow !== headerRow) {
      console.log(`[excelParser] Fallback header row: ${fallbackHeaderRow} (${bestCount} matches)`);
    }
  }

  const actualStartRow = startRow || fallbackHeaderRow + 1;
  const data = [];
  const normalizedExpected = (expectedHeaderLabels || []).map((l) => String(l).toLowerCase().trim());

  // Với mỗi cột, chọn header từ hàng có ô khớp expectedHeaderLabels (hỗ trợ nhiều hàng header)
  const headers = {};
  const usedKeys = new Set();
  for (let colIndex = startColIndex; colIndex <= endColIndex; colIndex++) {
    const columnLetter = numberToColumn(colIndex);
    let key = null;
    let keyFromRow = null;
    for (let r = scanFrom; r <= scanTo; r++) {
      const cell = worksheet.getRow(r).getCell(colIndex);
      const val = cell?.value;
      const rawStr = val?.toString()?.trim() || "";
      if (!rawStr || typeof val === "number" || val instanceof Date) continue;
      if (normalizedExpected.length > 0) {
        const valLower = rawStr.toLowerCase();
        const matched = normalizedExpected.some(
          (label) => valLower === label || valLower.includes(label) || label.includes(valLower)
        );
        if (matched) {
          key = rawStr;
          keyFromRow = r;
          break;
        }
      } else {
        key = rawStr;
        keyFromRow = r;
        break;
      }
    }
    if (!key) {
      const headerCell = worksheet.getRow(fallbackHeaderRow).getCell(colIndex);
      const headerValue = headerCell?.value;
      const rawStr = headerValue?.toString()?.trim() || "";
      const isNumericOrDate = rawStr === "" || !isNaN(Number(rawStr)) || headerValue instanceof Date;
      key = rawStr && !isNumericOrDate ? rawStr : columnLetter;
    }
    if (usedKeys.has(key)) key = `${key}_${columnLetter}`;
    usedKeys.add(key);
    headers[colIndex] = key;
    if (keyFromRow != null && keyFromRow !== fallbackHeaderRow && colIndex >= 13) {
      console.log(`[excelParser] Col ${columnLetter}: header "${key}" from row ${keyFromRow}`);
    }
  }

  // Đọc từng hàng dữ liệu
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber < actualStartRow) return; // Bỏ qua các hàng trước startRow

    const rowData = {};
    
    // Đọc từng cột trong phạm vi đã định
    for (let colIndex = startColIndex; colIndex <= endColIndex; colIndex++) {
      const cell = row.getCell(colIndex);
      const columnLetter = numberToColumn(colIndex);
      const headerName = headers[colIndex] || columnLetter;
      rowData[headerName] = cell.value;
      rowData[`_col_${columnLetter}`] = cell.value;
    }

    // Chỉ thêm hàng nếu có ít nhất 1 giá trị
    if (Object.values(rowData).some(val => val !== null && val !== undefined && val !== "")) {
      rowData._rowNumber = rowNumber;
      data.push(rowData);
    }
  });

  return data;
};

/**
 * Chuyển đổi tên cột (A, B, C...) sang số (1, 2, 3...)
 */
const columnToNumber = (column) => {
  let result = 0;
  for (let i = 0; i < column.length; i++) {
    result = result * 26 + (column.charCodeAt(i) - "A".charCodeAt(0) + 1);
  }
  return result;
};

/**
 * Chuyển đổi số (1, 2, 3...) sang tên cột (A, B, C...)
 */
const numberToColumn = (number) => {
  let result = "";
  while (number > 0) {
    number--;
    result = String.fromCharCode(65 + (number % 26)) + result;
    number = Math.floor(number / 26);
  }
  return result;
};

module.exports = {
  parseExcelFile,
  columnToNumber,
  numberToColumn,
};

