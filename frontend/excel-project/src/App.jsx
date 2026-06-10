import { useState, useEffect } from 'react'
import './App.css'
import FileUploadInput from './components/FileUploadInput'
import ExcelConfigSection from './components/ExcelConfigSection'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorDisplay from './components/ErrorDisplay'
import ResultDisplay from './components/ResultDisplay'
import HistorySection from './components/HistorySection'
import HistoryDetailModal from './components/HistoryDetailModal'
import MergeMonthlySection from './components/MergeMonthlySection'
import PayrollCheckSection from './components/PayrollCheckSection'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/check';

const defaultLeaveConfig = {
  sheetIndex: 0,
  headerRow: 12,
  startRow: 13,
  startColumn: 'A',
  endColumn: 'S'
};

const defaultAttendanceConfig = {
  sheetIndex: 0,
  headerRow: 5,
  startRow: 6,
  startColumn: 'A',
  endColumn: 'R'
};

function App() {
  const [activeTab, setActiveTab] = useState('check'); // 'check', 'merge', or 'payroll'
  const [leaveFile, setLeaveFile] = useState(null);
  const [attendanceFile, setAttendanceFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyStats, setHistoryStats] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const fetchHistoryData = async () => {
    setHistoryLoading(true);
    setHistoryError(null);

    try {
      const apiBase = API_URL.replace(/\/$/, '');

      const [historyRes, statsRes] = await Promise.all([
        fetch(`${apiBase}/history?limit=10`),
        fetch(`${apiBase}/history/stats`),
      ]);

      const historyData = await historyRes.json();
      const statsData = await statsRes.json();

      if (historyRes.ok && historyData.success) {
        setHistory(historyData.data || []);
      } else {
        setHistoryError(historyData.message || 'Không thể tải lịch sử xử lý');
      }

      if (statsRes.ok && statsData.success) {
        setHistoryStats(statsData.data);
      }
    } catch (err) {
      setHistoryError('Lỗi tải lịch sử: ' + err.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const handleRefreshHistory = () => {
    fetchHistoryData();
  };
  
  // Config mặc định
  const [fileInputKeys, setFileInputKeys] = useState({
    leave: 0,
    attendance: 0
  });

  const [leaveConfig, setLeaveConfig] = useState(defaultLeaveConfig);
  const [attendanceConfig, setAttendanceConfig] = useState(defaultAttendanceConfig);

  const handleLeaveFileChange = (file) => {
    setLeaveFile(file);
  };

  const handleAttendanceFileChange = (file) => {
    setAttendanceFile(file);
  };

  const handleLeaveFileRemove = () => {
    setLeaveFile(null);
    setFileInputKeys((prev) => ({ ...prev, leave: prev.leave + 1 }));
  };

  const handleAttendanceFileRemove = () => {
    setAttendanceFile(null);
    setFileInputKeys((prev) => ({ ...prev, attendance: prev.attendance + 1 }));
  };

  const handleClearAllFiles = () => {
    setLeaveFile(null);
    setAttendanceFile(null);
    setFileInputKeys((prev) => ({
      leave: prev.leave + 1,
      attendance: prev.attendance + 1
    }));
  };

  const buildAbsoluteUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }
    const base = API_URL.replace(/\/$/, '');
    const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${base}${path}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!leaveFile || !attendanceFile) {
      setError('Vui lòng chọn đủ 2 file (nghỉ phép và chấm công)!');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('leaveFile', leaveFile);
    formData.append('attendanceFile', attendanceFile);
    
    // Thêm config vào formData
    formData.append('leaveFileConfig', JSON.stringify(leaveConfig));
    formData.append('attendanceFileConfig', JSON.stringify(attendanceConfig));

    try {
      const apiBase = API_URL.replace(/\/$/, '');
      const response = await fetch(`${apiBase}/leave`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        fetchHistoryData(); // Refresh history sau khi xử lý thành công
      } else {
        setError(data.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError('Lỗi kết nối: ' + err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleDownloadFile = (downloadUrl) => {
    if (!downloadUrl) {
      setError('Không tìm thấy đường dẫn tải xuống.');
      return;
    }

    const finalUrl = buildAbsoluteUrl(downloadUrl);

    if (!finalUrl) {
      setError('Đường dẫn tải xuống không hợp lệ.');
      return;
    }

    window.open(finalUrl, '_blank');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <h1>📊 Excel Processing Tool</h1>
        </div>
        <div className="header-right">
          <div className="tab-navigation">
            <button
              className={`tab-btn ${activeTab === 'check' ? 'active' : ''}`}
              onClick={() => setActiveTab('check')}
            >
              🔍 Check Files
            </button>
            <button
              className={`tab-btn ${activeTab === 'merge' ? 'active' : ''}`}
              onClick={() => setActiveTab('merge')}
            >
              📊 Gộp Dữ Liệu Tháng
            </button>
            <button
              className={`tab-btn ${activeTab === 'payroll' ? 'active' : ''}`}
              onClick={() => setActiveTab('payroll')}
            >
              💰 Kiểm Tra Bảng Lương
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        {activeTab === 'check' ? (
          <div className="app-layout">
            <aside className="layout-column config-column">
              <div className="config-toggle">
                <button 
                  type="button" 
                  className="config-btn"
                  onClick={() => setShowConfig(!showConfig)}
                >
                  {showConfig ? '▼' : '▶'} Cấu hình Excel
                </button>
              </div>

              <ExcelConfigSection
                showConfig={showConfig}
                leaveConfig={leaveConfig}
                attendanceConfig={attendanceConfig}
                onLeaveConfigChange={setLeaveConfig}
                onAttendanceConfigChange={setAttendanceConfig}
                onClose={() => setShowConfig(false)}
              />
            </aside>

            <main className="layout-column main-column">
              <form onSubmit={handleSubmit} className="upload-form">
                <div className="upload-section">
                  <FileUploadInput
                    id="leaveFile"
                    label="File Nghỉ Phép (Leave File)"
                    icon="📄"
                    file={leaveFile}
                    inputKey={fileInputKeys.leave}
                    onFileChange={handleLeaveFileChange}
                    onFileRemove={handleLeaveFileRemove}
                  />

                  <FileUploadInput
                    id="attendanceFile"
                    label="File Chấm Công (Attendance File)"
                    icon="📋"
                    file={attendanceFile}
                    inputKey={fileInputKeys.attendance}
                    onFileChange={handleAttendanceFileChange}
                    onFileRemove={handleAttendanceFileRemove}
                  />
                </div>

                <div className="upload-actions">
                  <button type="submit" className="btn" disabled={loading || !leaveFile || !attendanceFile}>
                    {loading ? 'Processing...' : 'Test'}
                  </button>
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={handleClearAllFiles}
                    disabled={!leaveFile && !attendanceFile}
                  >
                    Xóa tất cả file
                  </button>
                </div>
              </form>

              {loading && <LoadingSpinner />}
              <ErrorDisplay error={error} />
              <ResultDisplay result={result} onDownload={handleDownloadFile} />
            </main>

            <aside className="layout-column history-column">
              <HistorySection
                history={history}
                stats={historyStats}
                loading={historyLoading}
                error={historyError}
                onRefresh={handleRefreshHistory}
                onDownload={handleDownloadFile}
                onViewDetail={setSelectedHistoryId}
              />
            </aside>
          </div>
        ) : activeTab === 'merge' ? (
          <div className="app-layout-merge">
            <main className="layout-column main-column merge-main">
              <MergeMonthlySection onDownload={handleDownloadFile} />
            </main>
          </div>
        ) : (
          <div className="app-layout-merge">
            <main className="layout-column main-column merge-main">
              <PayrollCheckSection />
            </main>
          </div>
        )}

        {selectedHistoryId && (
          <HistoryDetailModal
            historyId={selectedHistoryId}
            onClose={() => setSelectedHistoryId(null)}
            onDownload={handleDownloadFile}
          />
        )}
      </div>
    </div>
  )
}

export default App
