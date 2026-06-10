const IssuesList = ({ checkResults }) => {
  const issues = checkResults?.filter((item) => item.hasIssue) || [];

  if (issues.length === 0) return null;

  const handleCopyMnvs = async () => {
    // Gom nhóm theo MNV và kèm lỗi chi tiết
    const grouped = issues.reduce((acc, item) => {
      if (!item.mnv) return acc;
      if (!acc[item.mnv]) acc[item.mnv] = [];
      acc[item.mnv].push(item);
      return acc;
    }, {});

    const mnvs = Object.keys(grouped);
    if (mnvs.length === 0) return;

    const lines = mnvs.flatMap((mnv) => {
      const header = `MNV ${mnv}:`;
      const detailLines = grouped[mnv].map((issue) => {
        const row = issue.rowNumber ? `Dòng ${issue.rowNumber}: ` : '';
        return `- ${row}${issue.message || ''}`;
      });
      return [header, ...detailLines, '']; // dòng trống giữa các MNV
    });

    const text = lines.join('\n');

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        // Optional: có thể thay bằng toast sau này
        window.alert('Đã copy MNV và lỗi chi tiết vào clipboard');
      } else {
        // Fallback khi không hỗ trợ clipboard
        window.prompt('Copy MNV và lỗi chi tiết:', text);
      }
    } catch (err) {
      window.prompt('Copy MNV và lỗi chi tiết:', text);
    }
  };

  return (
    <div className="issues-section">
      <div className="issues-header">
        <strong className="issues-title">Chi tiết lỗi:</strong>
        <button type="button" className="copy-mnv-btn" onClick={handleCopyMnvs}>
          Copy MNV + lỗi chi tiết
        </button>
      </div>
      <div className="issues-list">
        {issues.map((item, index) => (
          <div key={index} className="issue-item">
            <strong>MNV {item.mnv}:</strong> {item.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IssuesList;

