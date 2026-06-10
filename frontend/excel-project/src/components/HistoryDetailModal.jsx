import { useState, useEffect } from 'react';

const HistoryDetailModal = ({ historyId, onClose, onDownload }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/check';

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const apiBase = API_URL.replace(/\/$/, '');
        const response = await fetch(`${apiBase}/history/${historyId}`);
        const data = await response.json();

        if (data.success) {
          setDetail(data.data);
        } else {
          setError(data.message || 'Không thể tải chi tiết');
        }
      } catch (err) {
        setError('Lỗi kết nối: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (historyId) {
      fetchDetail();
    }
  }, [historyId]);

  const formatDateTime = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString('vi-VN', {
      hour12: false,
    });
  };

  const formatDate = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('vi-VN');
  };

  if (!historyId) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Chi tiết lịch sử xử lý</h3>
          <button type="button" className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {loading && <div className="loading">Đang tải...</div>}
          {error && <div className="error-message">{error}</div>}
          
          {detail && (
            <>
              <div className="detail-section">
                <h4>Thông tin chung</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Thời gian xử lý:</label>
                    <span>{formatDateTime(detail.createdAt)}</span>
                  </div>
                  <div className="detail-item">
                    <label>File nghỉ phép:</label>
                    <span>{detail.originalFiles?.leaveFileName || '—'}</span>
                  </div>
                  <div className="detail-item">
                    <label>File chấm công:</label>
                    <span>{detail.originalFiles?.attendanceFileName || '—'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Tổng số dòng nghỉ phép:</label>
                    <span>{detail.summary?.totalLeaveRows || 0}</span>
                  </div>
                  <div className="detail-item">
                    <label>Tổng số dòng chấm công:</label>
                    <span>{detail.summary?.totalAttendanceRows || 0}</span>
                  </div>
                  <div className="detail-item">
                    <label>Số lỗi tìm thấy:</label>
                    <span className={detail.summary?.issuesFound ? 'text-danger' : ''}>
                      {detail.summary?.issuesFound || 0}
                    </span>
                  </div>
                  {detail.leaveDateRange?.earliestDate && (
                    <>
                      <div className="detail-item">
                        <label>Ngày nghỉ sớm nhất:</label>
                        <span>{formatDate(detail.leaveDateRange.earliestDate)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Ngày nghỉ muộn nhất:</label>
                        <span>{formatDate(detail.leaveDateRange.latestDate)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Tổng số ngày:</label>
                        <span>{detail.leaveDateRange.totalDays || 0} ngày</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {detail.summary?.mnvWithIssues && detail.summary.mnvWithIssues.length > 0 && (
                <div className="detail-section">
                  <div className="detail-section-header">
                    <h4>Danh sách MNV có lỗi ({detail.summary.mnvWithIssues.length})</h4>
                    <button
                      type="button"
                      className="copy-mnv-btn"
                      onClick={async () => {
                        // Gom nhóm theo MNV và kèm lỗi chi tiết (từ checkResults nếu có)
                        const resultsWithIssues = (detail.checkResults || []).filter(
                          (r) => r.hasIssue && r.mnv
                        );

                        const grouped =
                          resultsWithIssues.length > 0
                            ? resultsWithIssues.reduce((acc, item) => {
                                if (!item.mnv) return acc;
                                if (!acc[item.mnv]) acc[item.mnv] = [];
                                acc[item.mnv].push(item);
                                return acc;
                              }, {})
                            : detail.summary.mnvWithIssues.reduce((acc, mnv) => {
                                if (!mnv) return acc;
                                if (!acc[mnv]) acc[mnv] = [];
                                acc[mnv].push({});
                                return acc;
                              }, {});

                        const mnvs = Object.keys(grouped);
                        if (mnvs.length === 0) return;

                        const lines = mnvs.flatMap((mnv) => {
                          const header = `MNV ${mnv}:`;
                          const detailLines =
                            grouped[mnv].length > 0
                              ? grouped[mnv].map((issue) => {
                                  const row = issue.rowNumber ? `Dòng ${issue.rowNumber}: ` : '';
                                  const msg = issue.message || '';
                                  return `- ${row}${msg}`.trimEnd();
                                })
                              : ['- Có lỗi (xem chi tiết trong lịch sử)'];
                          return [header, ...detailLines, ''];
                        });

                        const text = lines.join('\n');
                        try {
                          if (navigator.clipboard?.writeText) {
                            await navigator.clipboard.writeText(text);
                            window.alert('Đã copy MNV và lỗi chi tiết vào clipboard');
                          } else {
                            window.prompt('Copy MNV và lỗi chi tiết:', text);
                          }
                        } catch (err) {
                          window.prompt('Copy MNV và lỗi chi tiết:', text);
                        }
                      }}
                    >
                      Copy MNV + lỗi chi tiết
                    </button>
                  </div>
                  <div className="mnv-list">
                    {detail.summary.mnvWithIssues.map((mnv, idx) => (
                      <span key={idx} className="mnv-badge">{mnv}</span>
                    ))}
                  </div>
                </div>
              )}

              {detail.checkResults && detail.checkResults.length > 0 && (
                <div className="detail-section">
                  <h4>Chi tiết từng dòng có lỗi ({detail.checkResults.filter(r => r.hasIssue).length})</h4>
                  <div className="check-results-list">
                    {detail.checkResults
                      .filter(result => result.hasIssue)
                      .map((result, idx) => (
                        <div key={idx} className="check-result-item">
                          <div className="result-header">
                            <strong>Dòng {result.rowNumber} - MNV: {result.mnv}</strong>
                            {result.message && (
                              <span className="result-message">{result.message}</span>
                            )}
                          </div>
                          {result.datesWithAttendance && result.datesWithAttendance.length > 0 && (
                            <div className="dates-list">
                              {result.datesWithAttendance.map((dateInfo, dateIdx) => (
                                <div key={dateIdx} className="date-item">
                                  <span className="date-label">{dateInfo.date}:</span>
                                  <span className="date-details">{dateInfo.issues}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {detail.fileUrls?.resultFileUrl && (
                <div className="detail-section">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => onDownload(detail.fileUrls.resultFileUrl)}
                  >
                    📥 Tải file kết quả
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryDetailModal;

