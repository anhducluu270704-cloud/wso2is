const formatDateTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('vi-VN', {
    hour12: false,
  });
};

const formatDuration = (ms) => {
  if (!ms && ms !== 0) return '—';
  if (ms < 1000) return `${ms} ms`;
  const seconds = (ms / 1000).toFixed(1);
  return `${seconds}s`;
};

const HistorySection = ({
  history,
  stats,
  loading,
  error,
  onRefresh,
  onDownload,
  onViewDetail,
}) => {
  return (
    <section className="history-section">
      <div className="history-header">
        <div>
          <h2>Lịch sử xử lý</h2>
          <p>Xem lại các lần kiểm tra trước đây</p>
        </div>
        <div
          className={`refresh-icon ${loading ? 'disabled' : ''}`}
          onClick={() => { if (!loading) onRefresh(); }}
          aria-label="Làm mới lịch sử"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (!loading && (e.key === 'Enter' || e.key === ' ')) {
              onRefresh();
            }
          }}
        >
          <svg
            fill="#51d2a7"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#51d2a7"
            width="20"
            height="20"
          >
            <path d="M19.146 4.854l-1.489 1.489A8 8 0 1 0 12 20a8.094 8.094 0 0 0 7.371-4.886 1 1 0 1 0-1.842-.779A6.071 6.071 0 0 1 12 18a6 6 0 1 1 4.243-10.243l-1.39 1.39a.5.5 0 0 0 .354.854H19.5A.5.5 0 0 0 20 9.5V5.207a.5.5 0 0 0-.854-.353z"></path>
          </svg>
        </div>
      </div>

      {stats && (
        <div className="history-stats">
          <div className="stat-card">
            <span>Tổng lượt xử lý</span>
            <strong>{stats.totalProcessings || 0}</strong>
          </div>
          <div className="stat-card">
            <span>Lượt có lỗi</span>
            <strong className="text-danger">{stats.processingsWithIssues || 0}</strong>
          </div>
          <div className="stat-card">
            <span>Lượt không lỗi</span>
            <strong className="text-success">{stats.processingsWithoutIssues || 0}</strong>
          </div>
          <div className="stat-card">
            <span>Thời gian xử lý TB</span>
            <strong>{formatDuration(stats.averageProcessingTime)}</strong>
          </div>
          <div className="stat-card">
            <span>Số lỗi TB / lượt</span>
            <strong>{(stats.averageIssues || 0).toFixed ? stats.averageIssues.toFixed(1) : stats.averageIssues || 0}</strong>
          </div>
        </div>
      )}

      {error && (
        <div className="history-error">
          {error}
        </div>
      )}

      <div className="history-table-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>File nghỉ phép</th>
              <th>File chấm công</th>
              <th>Số lỗi</th>
              <th>Thời gian xử lý</th>
              <th>Kết quả</th>
            </tr>
          </thead>
          <tbody>
            {history && history.length > 0 ? (
              history.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="history-time">
                      <strong>{formatDateTime(item.createdAt)}</strong>
                      <small>{item.summary?.mnvWithIssues?.length || 0} MNV lỗi</small>
                    </div>
                  </td>
                  <td>{item.originalFiles?.leaveFileName || '—'}</td>
                  <td>{item.originalFiles?.attendanceFileName || '—'}</td>
                  <td className={item.summary?.issuesFound ? 'text-danger' : 'text-success'}>
                    {item.summary?.issuesFound ?? 0}
                  </td>
                  <td>{formatDuration(item.processingTime)}</td>
                  <td>
                    <div className="history-actions">
                      <button
                        type="button"
                        className="link-btn"
                        onClick={() => onViewDetail(item._id)}
                      >
                        Xem chi tiết
                      </button>
                      {item.fileUrls?.resultFileUrl && (
                        <button
                          type="button"
                          className="link-btn secondary"
                          onClick={() => onDownload(item.fileUrls.resultFileUrl)}
                        >
                          Tải file
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="empty-history">
                  {loading ? 'Đang tải lịch sử...' : 'Chưa có lịch sử xử lý'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default HistorySection;

