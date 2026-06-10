const { mergeMonthlyData } = require("../services/mergeMonthlyData");
const { generateMergedExcel } = require("../services/generateMergedExcel");
const { uploadFileToCloudinary } = require("../utils/cloudinaryHelper");
const fs = require("fs");
const ExcelJS = require("exceljs");

/**
 * Upload và gộp dữ liệu từ 1 file Excel có nhiều sheet (12 tháng)
 * Request body:
 * - excelFile: 1 file Excel chứa nhiều sheet
 * - monthNames: JSON string array ["Tháng 1", "Tháng 2", ...] (optional, sẽ dùng tên sheet nếu không có)
 * - sheetIndices: JSON string array [0, 1, 2, ...] các sheet cần đọc (optional, sẽ đọc tất cả nếu không có)
 * - mergeConfig: JSON string config cho parse file (không bao gồm sheetIndex)
 * - dataColumns: JSON string array các cột cần hiển thị (optional)
 */
const mergeMonthlyFiles = async (req, res) => {
  const startTime = Date.now();

  try {
    // Lấy file từ request
    const excelFile = req.files?.excelFile?.[0];
    
    if (!excelFile) {
      return res.status(400).json({
        message: "Thiếu file upload. Cần upload 1 file Excel chứa nhiều sheet.",
        debug: {
          hasFiles: !!req.files,
          filesKeys: req.files ? Object.keys(req.files) : []
        }
      });
    }

    // Đọc file buffer
    let fileBuffer;
    if (excelFile.path && fs.existsSync(excelFile.path)) {
      fileBuffer = fs.readFileSync(excelFile.path);
      console.log(`Đọc file từ disk: ${excelFile.path}, size: ${fileBuffer.length} bytes`);
    } else if (excelFile.buffer) {
      fileBuffer = excelFile.buffer;
      console.log(`Đọc file từ buffer, size: ${fileBuffer.length} bytes`);
    } else {
      throw new Error(`Không thể đọc file: ${excelFile.originalname}`);
    }

    // Validate buffer
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error(`File buffer rỗng hoặc không hợp lệ: ${excelFile.originalname}`);
    }

    // Kiểm tra magic bytes để log thông tin (không throw error ngay)
    const magicBytes = fileBuffer.slice(0, 2).toString('hex');
    const isXLSX = magicBytes === '504b'; // PK (ZIP signature) = .xlsx
    const isXLS = magicBytes === 'd0cf'; // .xls (Excel 97-2003)
    const fileExtension = excelFile.originalname.split('.').pop()?.toLowerCase();
    
    console.log(`File info:`, {
      fileName: excelFile.originalname,
      fileExtension: fileExtension,
      fileSize: fileBuffer.length,
      magicBytes: magicBytes,
      isXLSX: isXLSX,
      isXLS: isXLS,
      magicBytesMatch: isXLSX || isXLS ? 'yes' : 'no'
    });

    // Load workbook để lấy thông tin sheet
    // Để ExcelJS tự xử lý và báo lỗi nếu file không hợp lệ
    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.load(fileBuffer);
    } catch (loadError) {
      console.error(`Lỗi khi load workbook:`, {
        error: loadError.message,
        errorStack: loadError.stack,
        fileName: excelFile.originalname,
        fileExtension: fileExtension,
        fileSize: fileBuffer.length,
        magicBytes: magicBytes,
        isXLSX: isXLSX,
        isXLS: isXLS
      });
      
      // Nếu magic bytes là .xls nhưng extension là .xlsx, file đã bị rename
      if (isXLS && fileExtension === 'xlsx') {
        throw new Error(`File có extension .xlsx nhưng thực chất là file .xls (Excel 97-2003). File có thể đã bị rename. Vui lòng mở file trong Excel và lưu lại dưới định dạng .xlsx (Excel Workbook) để chuyển đổi đúng định dạng.`);
      }
      
      // Nếu magic bytes là .xls
      if (isXLS) {
        throw new Error(`File là định dạng .xls (Excel 97-2003). ExcelJS chỉ hỗ trợ .xlsx. Vui lòng chuyển đổi file sang định dạng .xlsx (Excel 2007+) để tiếp tục.`);
      }
      
      // Các lỗi khác
      if (loadError.message.includes('end of central directory') || loadError.message.includes('zip')) {
        throw new Error(`File Excel bị corrupt hoặc không đúng định dạng. Vui lòng kiểm tra lại file. Chi tiết: ${loadError.message}`);
      }
      
      throw new Error(`Không thể load file Excel. File có thể bị corrupt hoặc không phải định dạng hợp lệ. Chi tiết: ${loadError.message}`);
    }
    const totalSheets = workbook.worksheets.length;
    const sheetNames = workbook.worksheets.map(ws => ws.name);

    console.log(`File có ${totalSheets} sheet(s):`, sheetNames);

    // Parse config từ request body
    let mergeConfig = {
      headerRow: 1,
      startRow: 3, // Dựa vào ảnh, dữ liệu bắt đầu từ hàng 3
      startColumn: "A",
      endColumn: "N"
    };

    if (req.body.mergeConfig) {
      try {
        const parsedConfig = JSON.parse(req.body.mergeConfig);
        mergeConfig = { ...mergeConfig, ...parsedConfig };
        // Đảm bảo không có sheetIndex trong config (sẽ được set tự động)
        delete parsedConfig.sheetIndex;
      } catch (e) {
        console.warn("Không parse được mergeConfig, dùng config mặc định:", e.message);
      }
    }

    // Parse sheetIndices (optional)
    let sheetIndices = null;
    if (req.body.sheetIndices) {
      try {
        sheetIndices = JSON.parse(req.body.sheetIndices);
        // Validate sheet indices
        if (!Array.isArray(sheetIndices)) {
          throw new Error("sheetIndices phải là array");
        }
        if (sheetIndices.some(idx => idx < 0 || idx >= totalSheets)) {
          throw new Error(`sheetIndices chứa index không hợp lệ. File chỉ có ${totalSheets} sheet(s)`);
        }
      } catch (e) {
        console.warn("Không parse được sheetIndices, sẽ đọc tất cả các sheet:", e.message);
        sheetIndices = null;
      }
    }

    // Parse monthNames (optional)
    let monthNames = [];
    if (req.body.monthNames) {
      try {
        monthNames = JSON.parse(req.body.monthNames);
        if (!Array.isArray(monthNames)) {
          throw new Error("monthNames phải là array");
        }
      } catch (e) {
        console.warn("Không parse được monthNames, sẽ dùng tên sheet:", e.message);
        monthNames = [];
      }
    }

    // Nếu không có monthNames, tự động tạo từ tên sheet hoặc số thứ tự
    if (monthNames.length === 0) {
      const sheetsToUse = sheetIndices || Array.from({ length: totalSheets }, (_, i) => i);
      monthNames = sheetsToUse.map((sheetIdx, index) => {
        const sheetName = workbook.worksheets[sheetIdx]?.name || `Sheet${sheetIdx + 1}`;
        // Thử extract tên tháng từ tên sheet (ví dụ: "Dec-22" -> "Dec-22")
        const monthMatch = sheetName.match(/(\w+)-(\d+)/i);
        if (monthMatch) {
          return monthMatch[0]; // Trả về "Dec-22"
        }
        // Nếu tên sheet có chứa số, dùng tên sheet
        if (/\d/.test(sheetName)) {
          return sheetName;
        }
        return `Tháng ${index + 1}`;
      });
    }

    // Parse dataColumns (optional)
    let dataColumns = null;
    if (req.body.dataColumns) {
      try {
        dataColumns = JSON.parse(req.body.dataColumns);
      } catch (e) {
        console.warn("Không parse được dataColumns:", e.message);
      }
    }

    // Gộp dữ liệu
    const sheetsToProcess = sheetIndices || Array.from({ length: totalSheets }, (_, i) => i);
    console.log(`Bắt đầu gộp ${sheetsToProcess.length} sheet(s)...`);
    const mergedResult = await mergeMonthlyData(fileBuffer, monthNames, sheetsToProcess, mergeConfig, "MNV");

    // Tạo file Excel output
    console.log(`Tạo file Excel output cho ${mergedResult.totalEmployees} nhân viên...`);
    const excelBuffer = await generateMergedExcel(mergedResult, monthNames, dataColumns);

    // Upload lên Cloudinary
    const originalName = `merged_data_${Date.now()}.xlsx`;
    const uploadResult = await uploadFileToCloudinary(
      excelBuffer,
      originalName,
      'excel-uploads'
    );

    // Cleanup: Xóa file tạm từ disk
    if (excelFile.path && fs.existsSync(excelFile.path)) {
      try {
        fs.unlinkSync(excelFile.path);
      } catch (err) {
        console.warn(`Không thể xóa file tạm ${excelFile.path}:`, err.message);
      }
    }

    const processingTime = Date.now() - startTime;
    const resultFileUrl = uploadResult.secure_url || uploadResult.url;

    return res.json({
      message: "Gộp dữ liệu thành công!",
      summary: {
        totalSheets: sheetsToProcess.length,
        sheetNames: sheetsToProcess.map(idx => workbook.worksheets[idx]?.name),
        totalEmployees: mergedResult.totalEmployees,
        monthNames: monthNames,
        processingTime: processingTime
      },
      downloadUrl: resultFileUrl,
      publicId: uploadResult.public_id
    });

  } catch (error) {
    console.error("Lỗi khi gộp file:", error);
    res.status(500).json({
      message: "Lỗi server khi gộp file",
      error: error.message
    });
  }
};

module.exports = {
  mergeMonthlyFiles
};
