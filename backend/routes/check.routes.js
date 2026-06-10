const { Router } = require("express");
const router = Router();

const { fields } = require("../middleware/uploadExcel");
const { uploadTwoFiles, testLeaveFile, testAttendanceFile, downloadUpdatedFile } = require("../controllers/check.controller");
const { getHistory, getHistoryById, deleteHistory, getStats } = require("../controllers/history.controller");
const { mergeMonthlyFiles } = require("../controllers/merge.controller");

// Middleware để log request trước khi multer xử lý
const logRequest = (req, res, next) => {
  console.log('=== Request Info ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Content-Length:', req.headers['content-length']);
  console.log('Has body:', !!req.body);
  console.log('Raw headers:', req.headers);
  console.log('===================');
  next();
};

// Error handler middleware cho multer
const handleMulterError = (err, req, res, next) => {
  if (err) {
    console.error('Multer error:', err);
    console.error('Error code:', err.code);
    console.error('Error message:', err.message);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File quá lớn', error: err.message });
    }
    if (err.message && err.message.includes('Excel')) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(400).json({ 
      message: 'Lỗi khi upload file', 
      error: err.message,
      code: err.code,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
  next();
};

// Route test riêng file leaveFile
router.post(
  "/test-leave",
  logRequest,
  fields([
    { name: "leaveFile", maxCount: 1 }
  ]),
  handleMulterError,
  testLeaveFile
);

// Route test riêng file attendanceFile
router.post(
  "/test-attendance",
  fields([
    { name: "attendanceFile", maxCount: 1 }
  ]),
  handleMulterError,
  testAttendanceFile
);

// Route chính upload cả 2 file và check
router.post(
  "/leave",
  fields([
    { name: "leaveFile", maxCount: 1 },
    { name: "attendanceFile", maxCount: 1 }
  ]),
  handleMulterError,
  uploadTwoFiles
);

// Route download file đã được cập nhật
router.get("/download/:filename", downloadUpdatedFile);

// Routes cho lịch sử xử lý
router.get("/history", getHistory);
router.get("/history/stats", getStats);
router.get("/history/:id", getHistoryById);
router.delete("/history/:id", deleteHistory);

// Route gộp dữ liệu nhiều tháng (1 file Excel có nhiều sheet)
router.post(
  "/merge",
  fields([
    { name: "excelFile", maxCount: 1 } // Chỉ cần 1 file Excel chứa nhiều sheet
  ]),
  handleMulterError,
  mergeMonthlyFiles
);

module.exports = router;
