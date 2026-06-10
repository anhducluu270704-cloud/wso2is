const { checkPayrollComponents } = require("../services/checkPayrollComponents");
const fs = require("fs");
const path = require("path");

/**
 * Controller để check tính đúng đắn của các thành phần tiền trong bảng lương
 * POST /api/payroll/check
 */
const checkPayroll = async (req, res) => {
  try {
    const payrollFile = req.files?.payrollFile?.[0];

    if (!payrollFile) {
      return res.status(400).json({
        success: false,
        message: "Thiếu file bảng lương. Vui lòng upload file payrollFile.",
      });
    }

    // Lấy config từ request body hoặc dùng mặc định
    const config = req.body.config
      ? JSON.parse(req.body.config)
      : {
          sheetIndex: parseInt(req.body.sheetIndex) || 0,
          headerRow: parseInt(req.body.headerRow) || 4, // Thường header ở hàng 4-5
          startRow: parseInt(req.body.startRow) || 9, // Dữ liệu bắt đầu từ hàng 9
          startColumn: req.body.startColumn || "A",
          endColumn: req.body.endColumn || null,
        };

    // Lấy column mapping từ request body
    const columnMapping = req.body.columnMapping
      ? JSON.parse(req.body.columnMapping)
      : {
          // Mặc định dùng tên cột hoặc có thể dùng column letter
          empCode: req.body.empCodeColumn || "Mã nhân viên / Emp Code",
          fullName: req.body.fullNameColumn || "Họ tên / Full Name",
          basicSalary: req.body.basicSalaryColumn || "Lương cơ bản / Basic Salary",
          seniorityAllowance:
            req.body.seniorityAllowanceColumn || "Tiền thâm niên / Seniority Allowance",
          responsibilityAllowance:
            req.body.responsibilityAllowanceColumn ||
            "Phụ cấp trách nhiệm / Responsibility allowance",
          bhxh8Employee:
            req.body.bhxh8EmployeeColumn ||
            "BHXH 8% / Người lao động trả / 0.08",
          bhtn1Employee:
            req.body.bhtn1EmployeeColumn || "BHTN 1% / Người lao động trả / 0.01",
          bhyt15Employee:
            req.body.bhyt15EmployeeColumn ||
            "BHYT 1.5% / Người lao động trả / 0.015",
          bhxh175Company:
            req.body.bhxh175CompanyColumn || "BHXH 17.5% Công ty trả / 0.175",
          bhtn1Company:
            req.body.bhtn1CompanyColumn || "BHTN 1% Công ty trả / 0.01",
          bhyt3Company: req.body.bhyt3CompanyColumn || "BHYT 3% Công ty trả / 0.03",
          tradeUnion2Company:
            req.body.tradeUnion2CompanyColumn ||
            "Công đoàn công ty 2% / Trade Union paid by employer",
        };

    // Log config và column mapping
    console.log('=== PAYROLL CHECK REQUEST ===');
    console.log('Config:', JSON.stringify(config, null, 2));
    console.log('Column Mapping:', JSON.stringify(columnMapping, null, 2));
    console.log('File name:', payrollFile.originalname);
    console.log('File size:', payrollFile.size, 'bytes');

    // Đọc file buffer
    const fileBuffer = fs.readFileSync(payrollFile.path);

    // Thực hiện check
    const checkResult = await checkPayrollComponents(
      fileBuffer,
      config,
      columnMapping
    );

    // Xóa file tạm
    try {
      fs.unlinkSync(payrollFile.path);
    } catch (unlinkError) {
      console.error("Lỗi khi xóa file tạm:", unlinkError);
    }

    return res.json({
      success: true,
      message: "Kiểm tra hoàn tất",
      data: checkResult,
    });
  } catch (error) {
    console.error("Lỗi khi check payroll:", error);

    // Xóa file tạm nếu có lỗi
    if (req.files?.payrollFile?.[0]?.path) {
      try {
        fs.unlinkSync(req.files.payrollFile[0].path);
      } catch (unlinkError) {
        console.error("Lỗi khi xóa file tạm sau lỗi:", unlinkError);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Lỗi server khi kiểm tra bảng lương",
      error: error.message,
    });
  }
};

module.exports = {
  checkPayroll,
};

