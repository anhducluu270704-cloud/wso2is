const { parseExcelFile } = require("./excelParser");

/**
 * Kiểm tra tính đúng đắn của các thành phần tiền trong bảng lương
 * @param {Buffer} fileBuffer - Buffer chứa file Excel bảng lương
 * @param {Object} config - Cấu hình parse file
 * @param {Object} columnMapping - Mapping các cột cần check
 * @returns {Promise<Object>} - Kết quả kiểm tra
 */
const checkPayrollComponents = async (fileBuffer, config, columnMapping) => {
  try {
    console.log('=== START CHECK PAYROLL COMPONENTS ===');
    console.log('Config:', JSON.stringify(config, null, 2));
    console.log('Column Mapping:', JSON.stringify(columnMapping, null, 2));
    
    // Danh sách tên cột mong đợi để parser tự tìm đúng hàng header
    const expectedHeaderLabels = columnMapping ? Object.values(columnMapping).filter(Boolean) : [];
    const data = await parseExcelFile(fileBuffer, config, expectedHeaderLabels);
    
    console.log(`\n=== PARSED DATA ===`);
    console.log(`Total rows parsed: ${data.length}`);
    if (data.length > 0) {
       console.log('First row ALL keys:', Object.keys(data[0]));
      console.log('First row ALL values:');
      Object.entries(data[0]).forEach(([key, value]) => {
        console.log(`  ${key}: ${value} (type: ${typeof value})`);
      });
      console.log('\n--- Column Mapping đang tìm ---');
      console.log('empCode:', columnMapping.empCode);
      console.log('fullName:', columnMapping.fullName);
      console.log('basicSalary:', columnMapping.basicSalary);
      console.log('seniorityAllowance:', columnMapping.seniorityAllowance);
      console.log('responsibilityAllowance:', columnMapping.responsibilityAllowance);
    }

    const results = [];
    const errors = [];
    let totalRows = 0;
    let totalErrors = 0;

    // Chỉ check cột BHYT 3% Công ty trả (các cột khác tạm tắt)
    const componentsToCheck = [
      {
        name: "BHYT 3% (Công ty)",
        percentage: 0.03,
        columnKey: "bhyt3Company",
      },
    ];

    // Duyệt qua từng dòng dữ liệu
    data.forEach((row, index) => {
      totalRows++;
      const rowNumber = row._rowNumber || index + 1;
      const rowErrors = [];

      // Helper function để parse số từ string có dấu chấm (46.800.000 -> 46800000)
      const parseNumber = (value) => {
        if (value === null || value === undefined || value === '') return 0;
        if (value === '-' || value === '—' || value === '–') return 0;
        if (typeof value === 'number') return value;
        
        // Nếu là string, loại bỏ dấu chấm và dấu phẩy
        const cleaned = String(value).replace(/[.,]/g, '').trim();
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
      };

      // Helper: lấy giá trị và key đã match (để log debug). Trả về { value, matchedKey }.
      const getValueAndKey = (columnName) => {
        const lowerColumnName = String(columnName).toLowerCase();
        // 1. Khớp chính xác theo tên cột
        if (row[columnName] !== undefined && row[columnName] !== null && row[columnName] !== '') {
          return { value: row[columnName], matchedKey: columnName };
        }
        // 2. Partial match: chỉ chấp nhận key có >= 3 ký tự hoặc key giống tên cột (tránh khớp nhầm "A", "B" với "basic salary")
        for (const [key, value] of Object.entries(row)) {
          if (key.startsWith('_')) continue;
          const keyLower = key.toLowerCase();
          const keyIsShort = key.length <= 2 || /^[a-z]$/i.test(key.trim());
          const columnNameLong = lowerColumnName.length >= 10;
          if (keyIsShort && columnNameLong) continue; // không dùng key 1-2 chữ khi label dài (tránh "A" -> 501)
          if (keyLower.includes(lowerColumnName) || lowerColumnName.includes(keyLower)) {
            if (value !== null && value !== undefined && value !== '') {
              return { value, matchedKey: key };
            }
          }
        }
        if (row._col_ && row._col_[columnName] !== undefined) {
          return { value: row._col_[columnName], matchedKey: `_col_[${columnName}]` };
        }
        return { value: null, matchedKey: null };
      };

      const getValue = (columnName) => getValueAndKey(columnName).value;

      // Lấy các giá trị cơ bản (dùng getValueAndKey để có thể log key đã match)
      const basicSalaryInfo = getValueAndKey(columnMapping.basicSalary);
      const seniorityInfo = getValueAndKey(columnMapping.seniorityAllowance);
      const responsibilityInfo = getValueAndKey(columnMapping.responsibilityAllowance);
      const basicSalaryRaw = basicSalaryInfo.value;
      const seniorityAllowanceRaw = seniorityInfo.value;
      const responsibilityAllowanceRaw = responsibilityInfo.value;

      const basicSalary = parseNumber(basicSalaryRaw);
      const seniorityAllowance = parseNumber(seniorityAllowanceRaw);
      const responsibilityAllowance = parseNumber(responsibilityAllowanceRaw);

      // Log map dữ liệu chi tiết: vài dòng đầu + dòng có MNV 204780 (để kiểm tra đúng cột)
      const empCodeForLog = getValue(columnMapping.empCode);
      const shouldLogMapping = index < 3 || String(empCodeForLog) === '204780';
      if (shouldLogMapping) {
        console.log(`\n--- [MAP] Row ${rowNumber} (index ${index}) MNV=${empCodeForLog} ---`);
        console.log(`  basicSalary:        label="${columnMapping.basicSalary}" -> matchedKey="${basicSalaryInfo.matchedKey}" -> raw=${basicSalaryRaw} -> parsed=${basicSalary}`);
        console.log(`  seniorityAllowance: label="${columnMapping.seniorityAllowance}" -> matchedKey="${seniorityInfo.matchedKey}" -> raw=${seniorityAllowanceRaw} -> parsed=${seniorityAllowance}`);
        console.log(`  responsibility:     label="${columnMapping.responsibilityAllowance}" -> matchedKey="${responsibilityInfo.matchedKey}" -> raw=${responsibilityAllowanceRaw} -> parsed=${responsibilityAllowance}`);
      }
      if (index === 0) {
        console.log('  [Row 0] All row keys (no _):', Object.keys(row).filter(k => !k.startsWith('_')).join(', '));
      }

      // Tính tổng lương cơ bản (base amount)
      const baseAmount = basicSalary + seniorityAllowance + responsibilityAllowance;

      // Lấy mã nhân viên và tên (nếu có)
      const empCode = getValue(columnMapping.empCode) || `Row ${rowNumber}`;
      const fullName = getValue(columnMapping.fullName) || "";

      // Log chi tiết cho 5 dòng đầu tiên hoặc dòng có vấn đề
      const shouldLog = index < 5 || baseAmount > 0;
      if (shouldLog) {
        console.log(`\n--- Row ${rowNumber} (Index ${index}) ---`);
        console.log(`MNV: ${empCode}, Name: ${fullName}`);
        console.log(`Basic Salary (raw: ${basicSalaryRaw}): ${basicSalary}`);
        console.log(`Seniority (raw: ${seniorityAllowanceRaw}): ${seniorityAllowance}`);
        console.log(`Responsibility (raw: ${responsibilityAllowanceRaw}): ${responsibilityAllowance}`);
        console.log(`Base Amount: ${baseAmount}`);
      }

      // Ô không có số (dấu -, trống, 0 từ ô dash, ...) thì bỏ qua, không check
      const isEmptyOrDash = (val) => {
        if (val === null || val === undefined || val === '') return true;
        const s = String(val).trim();
        return s === '-' || s === '—' || s === '–' || (s.length <= 2 && !/\d/.test(s));
      };
      const hasNumericValue = (val) => !isEmptyOrDash(val) && (typeof val === 'number' || /\d/.test(String(val)));
      // Excel có thể trả về 0 khi ô hiển thị dấu -; bỏ qua khi actual=0 mà expected>0 (ô dash)
      const isZeroFromDashOrEmpty = (raw, parsed, expected) =>
        (parsed === 0 && expected > 0) && (raw === 0 || raw === '0' || raw === null || raw === undefined || raw === '' || isEmptyOrDash(raw));

      // Kiểm tra từng thành phần
      componentsToCheck.forEach((component) => {
        const expectedValue = baseAmount * component.percentage;
        const compInfo = getValueAndKey(columnMapping[component.columnKey]);
        const actualValueRaw = compInfo.value;

        // Bỏ qua nếu ô có dấu - hoặc không có số: chỉ check các ô có giá trị số
        if (!hasNumericValue(actualValueRaw)) {
          if (shouldLog) {
            console.log(`  ${component.name}: raw="${actualValueRaw}" -> bỏ qua (không có số)`);
          }
          return;
        }

        const actualValue = parseNumber(actualValueRaw);
        // Bỏ qua khi Excel trả về 0 cho ô hiển thị "-" (actual=0, expected>0, raw trống/0)
        if (isZeroFromDashOrEmpty(actualValueRaw, actualValue, expectedValue)) {
          if (shouldLog) {
            console.log(`  ${component.name}: raw="${actualValueRaw}" -> bỏ qua (0 từ ô dash/trống)`);
          }
          return;
        }

        // actualValue đã parse ở trên

        // So sánh với sai số cho phép (0.01 VND để tránh lỗi làm tròn)
        const difference = Math.abs(actualValue - expectedValue);
        const tolerance = 0.01;

        if (shouldLog) {
          console.log(`  ${component.name}:`);
          console.log(`    Column: ${columnMapping[component.columnKey]}`);
          if (shouldLogMapping) console.log(`    Matched key: "${compInfo.matchedKey}"`);
          console.log(`    Raw value: ${actualValueRaw}`);
          console.log(`    Actual: ${actualValue}`);
          console.log(`    Expected: ${expectedValue} (${baseAmount} × ${component.percentage})`);
          console.log(`    Difference: ${difference}`);
        }

        if (difference > tolerance) {
          rowErrors.push({
            component: component.name,
            expected: expectedValue,
            actual: actualValue,
            difference: difference,
            percentage: component.percentage,
          });
          
          if (shouldLog) {
            console.log(`    ❌ ERROR: Difference ${difference} > tolerance ${tolerance}`);
          }
        } else if (shouldLog) {
          console.log(`    ✅ OK`);
        }
      });

      // Nếu có lỗi, thêm vào danh sách
      if (rowErrors.length > 0) {
        totalErrors++;
        errors.push({
          rowNumber: rowNumber,
          empCode: empCode,
          fullName: fullName,
          baseAmount: baseAmount,
          basicSalary: basicSalary,
          seniorityAllowance: seniorityAllowance,
          responsibilityAllowance: responsibilityAllowance,
          errors: rowErrors,
        });
      }

      // Lưu thông tin cho mỗi dòng (kể cả không có lỗi)
      results.push({
        rowNumber: rowNumber,
        empCode: empCode,
        fullName: fullName,
        baseAmount: baseAmount,
        basicSalary: basicSalary,
        seniorityAllowance: seniorityAllowance,
        responsibilityAllowance: responsibilityAllowance,
        hasError: rowErrors.length > 0,
        errors: rowErrors,
      });
    });

    console.log(`\n=== CHECK COMPLETE ===`);
    console.log(`Total rows processed: ${totalRows}`);
    console.log(`Total errors found: ${totalErrors}`);
    if (errors.length > 0) {
      console.log(`\nError rows summary:`);
      errors.slice(0, 10).forEach(err => {
        console.log(`  Row ${err.rowNumber} (MNV: ${err.empCode}): ${err.errors.length} errors`);
      });
      if (errors.length > 10) {
        console.log(`  ... and ${errors.length - 10} more error rows`);
      }
    }

    return {
      success: true,
      totalRows: totalRows,
      totalErrors: totalErrors,
      errorRows: errors,
      allResults: results,
    };
  } catch (error) {
    console.error("Lỗi khi check payroll components:", error);
    console.error("Error stack:", error.stack);
    throw error;
  }
};

module.exports = {
  checkPayrollComponents,
};

