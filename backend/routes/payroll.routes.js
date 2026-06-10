const { Router } = require("express");
const router = Router();

const { fields } = require("../middleware/uploadExcel");
const { checkPayroll } = require("../controllers/payroll.controller");

// Error handler middleware cho multer
const handleMulterError = (err, req, res, next) => {
  if (err) {
    console.error('Multer error:', err);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File quá lớn', error: err.message });
    }
    return res.status(400).json({ 
      message: 'Lỗi khi upload file', 
      error: err.message 
    });
  }
  next();
};

// Route check bảng lương
router.post(
  "/check",
  fields([
    { name: "payrollFile", maxCount: 1 }
  ]),
  handleMulterError,
  checkPayroll
);

module.exports = router;

