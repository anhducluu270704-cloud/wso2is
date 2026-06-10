import IssuesList from './IssuesList';

const ResultDisplay = ({ result, onDownload }) => {
  if (!result) return null;

  const { message, summary, downloadUrl } = result;

  return (
    <div className="result success">
      <h3>✅ {message}</h3>

      <div className="result-info">
        <strong>Tổng số dòng:</strong> {summary?.totalLeaveRows || 0}
      </div>

      <div className="result-info">
        <strong>Số dòng có lỗi:</strong> {summary?.issuesFound || 0}
      </div>

      {summary?.mnvWithIssues && summary.mnvWithIssues.length > 0 && (
        <div className="result-info">
          <strong>MNV có lỗi:</strong> {summary.mnvWithIssues.join(', ')}
        </div>
      )}

      {summary?.issuesFound > 0 && (
        <IssuesList checkResults={summary.checkResults} />
      )}

      <div className="download-buttons">
        {downloadUrl && (
          <button onClick={() => onDownload(downloadUrl)} className="download-btn">
            📥 Tải File Nghỉ Phép đã cập nhật
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;

