const mongoose = require('mongoose');

const ProcessingHistorySchema = new mongoose.Schema({
  // Thông tin user (nếu có auth sau này)
  userId: {
    type: String,
    default: null,
    index: true
  },
  userName: {
    type: String,
    default: null
  },

  // URLs của các file
  fileUrls: {
    leaveFileUrl: {
      type: String,
      required: true
    },
    attendanceFileUrl: {
      type: String,
      required: true
    },
    resultFileUrl: {
      type: String,
      required: true
    },
    resultFilePublicId: {
      type: String,
      required: true
    }
  },

  // Tên file gốc
  originalFiles: {
    leaveFileName: {
      type: String,
      required: true
    },
    attendanceFileName: {
      type: String,
      required: true
    }
  },

  // Kết quả xử lý
  summary: {
    totalLeaveRows: {
      type: Number,
      required: true
    },
    totalAttendanceRows: {
      type: Number,
      required: true
    },
    issuesFound: {
      type: Number,
      required: true,
      default: 0
    },
    mnvWithIssues: [{
      type: String
    }]
  },

  // Chi tiết kết quả check từng dòng (lưu đầy đủ để có thể xem lại sau)
  checkResults: [{
    leaveIndex: Number,
    rowNumber: Number,
    mnv: String,
    hasIssue: Boolean,
    message: String,
    datesWithAttendance: [{
      date: String,
      in1: String,
      out1: String,
      pay1: Number,
      issues: String
    }]
  }],

  // Metadata về khoảng ngày nghỉ
  leaveDateRange: {
    earliestDate: {
      type: Date,
      default: null
    },
    latestDate: {
      type: Date,
      default: null
    },
    totalDays: {
      type: Number,
      default: 0
    }
  },

  // Thời gian xử lý (milliseconds)
  processingTime: {
    type: Number,
    required: true
  },

  // Config đã sử dụng
  config: {
    leaveFileConfig: {
      type: Object,
      default: {}
    },
    attendanceFileConfig: {
      type: Object,
      default: {}
    }
  },

  // Trạng thái
  status: {
    type: String,
    enum: ['success', 'error', 'partial'],
    default: 'success'
  },

  // Thông báo lỗi (nếu có)
  errorMessage: {
    type: String,
    default: null
  }
}, {
  timestamps: true, // Tự động thêm createdAt và updatedAt
  collection: 'processing_history'
});

// Index để tìm kiếm nhanh
ProcessingHistorySchema.index({ createdAt: -1 }); // Sắp xếp theo thời gian mới nhất
ProcessingHistorySchema.index({ userId: 1, createdAt: -1 }); // Tìm theo user
ProcessingHistorySchema.index({ 'summary.issuesFound': 1 }); // Tìm theo số lỗi
ProcessingHistorySchema.index({ 'summary.mnvWithIssues': 1 }); // Tìm theo MNV

// Virtual để tính số ngày từ khi xử lý
ProcessingHistorySchema.virtual('daysAgo').get(function() {
  const now = new Date();
  const created = this.createdAt;
  const diffTime = Math.abs(now - created);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('ProcessingHistory', ProcessingHistorySchema);

