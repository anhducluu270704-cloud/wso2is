const ProcessingHistory = require("../models/ProcessingHistory");

/**
 * Lấy danh sách lịch sử xử lý
 * GET /api/check/history
 * Query params:
 *   - page: số trang (default: 1)
 *   - limit: số item mỗi trang (default: 10)
 *   - userId: filter theo user (nếu có auth)
 *   - issuesFound: filter theo số lỗi (ví dụ: issuesFound=0 để lấy các bản ghi không có lỗi)
 *   - startDate: filter từ ngày (ISO format)
 *   - endDate: filter đến ngày (ISO format)
 */
const getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }
    
    if (req.query.issuesFound !== undefined) {
      filter['summary.issuesFound'] = parseInt(req.query.issuesFound);
    }
    
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) {
        filter.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.createdAt.$lte = new Date(req.query.endDate);
      }
    }

    // Query với pagination
    // Nếu includeDetails=true thì lấy cả checkResults, nếu không thì bỏ qua để giảm kích thước response
    const includeDetails = req.query.includeDetails === 'true';
    const selectFields = includeDetails 
      ? '' // Lấy tất cả fields
      : '-checkResults'; // Bỏ checkResults để giảm kích thước response
    
    const [history, total] = await Promise.all([
      ProcessingHistory.find(filter)
        .select(selectFields)
        .sort({ createdAt: -1 }) // Mới nhất trước
        .skip(skip)
        .limit(limit)
        .lean(), // Dùng lean() để trả về plain object, nhanh hơn
      ProcessingHistory.countDocuments(filter)
    ]);

    return res.json({
      success: true,
      data: history,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy lịch sử",
      error: error.message
    });
  }
};

/**
 * Lấy chi tiết một bản ghi lịch sử (luôn bao gồm checkResults chi tiết)
 * GET /api/check/history/:id
 */
const getHistoryById = async (req, res) => {
  try {
    const history = await ProcessingHistory.findById(req.params.id).lean();
    
    if (!history) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lịch sử xử lý"
      });
    }

    // Luôn trả về đầy đủ checkResults khi lấy chi tiết
    return res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết lịch sử:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy chi tiết lịch sử",
      error: error.message
    });
  }
};

/**
 * Xóa một bản ghi lịch sử
 * DELETE /api/check/history/:id
 */
const deleteHistory = async (req, res) => {
  try {
    const history = await ProcessingHistory.findById(req.params.id);
    
    if (!history) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lịch sử xử lý"
      });
    }

    // TODO: Có thể xóa file trên Cloudinary nếu cần
    // await deleteFileFromCloudinary(history.fileUrls.resultFilePublicId);

    await ProcessingHistory.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: "Đã xóa lịch sử xử lý"
    });
  } catch (error) {
    console.error("Lỗi khi xóa lịch sử:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa lịch sử",
      error: error.message
    });
  }
};

/**
 * Lấy thống kê tổng quan
 * GET /api/check/history/stats
 */
const getStats = async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate);
    }

    const [total, withIssues, avgProcessingTime, avgIssues] = await Promise.all([
      ProcessingHistory.countDocuments(filter),
      ProcessingHistory.countDocuments({ ...filter, 'summary.issuesFound': { $gt: 0 } }),
      ProcessingHistory.aggregate([
        { $match: filter },
        { $group: { _id: null, avg: { $avg: '$processingTime' } } }
      ]),
      ProcessingHistory.aggregate([
        { $match: filter },
        { $group: { _id: null, avg: { $avg: '$summary.issuesFound' } } }
      ])
    ]);

    return res.json({
      success: true,
      data: {
        totalProcessings: total,
        processingsWithIssues: withIssues,
        processingsWithoutIssues: total - withIssues,
        averageProcessingTime: avgProcessingTime[0]?.avg || 0,
        averageIssues: avgIssues[0]?.avg || 0
      }
    });
  } catch (error) {
    console.error("Lỗi khi lấy thống kê:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thống kê",
      error: error.message
    });
  }
};

module.exports = {
  getHistory,
  getHistoryById,
  deleteHistory,
  getStats
};

