import { useState } from 'react';
import FileUploadInput from './FileUploadInput';
import MergeConfigSection from './MergeConfigSection';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/check';

const defaultMergeConfig = {
  headerRow: 1,
  startRow: 3,
  startColumn: 'A',
  endColumn: 'N'
};

const MergeMonthlySection = ({ onDownload }) => {
  const [excelFile, setExcelFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [mergeConfig, setMergeConfig] = useState(defaultMergeConfig);
  const [monthNames, setMonthNames] = useState('');
  const [sheetIndices, setSheetIndices] = useState('');
  const [fileInputKey, setFileInputKey] = useState(0);

  const handleFileChange = (file) => {
    setExcelFile(file);
    setError(null);
    setResult(null);
  };

  const handleFileRemove = () => {
    setExcelFile(null);
    setFileInputKey(prev => prev + 1);
    setError(null);
    setResult(null);
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

    if (!excelFile) {
      setError('Vui lòng chọn file Excel chứa nhiều sheet!');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('excelFile', excelFile);
    formData.append('mergeConfig', JSON.stringify(mergeConfig));

    // Thêm monthNames nếu có
    if (monthNames.trim()) {
      try {
        const parsed = JSON.parse(monthNames);
        if (Array.isArray(parsed)) {
          formData.append('monthNames', monthNames);
        }
      } catch (e) {
        console.warn('monthNames không phải JSON hợp lệ, bỏ qua');
      }
    }

    // Thêm sheetIndices nếu có
    if (sheetIndices.trim()) {
      try {
        const parsed = JSON.parse(sheetIndices);
        if (Array.isArray(parsed)) {
          formData.append('sheetIndices', sheetIndices);
        }
      } catch (e) {
        console.warn('sheetIndices không phải JSON hợp lệ, bỏ qua');
      }
    }

    try {
      const apiBase = API_URL.replace(/\/$/, '');
      const response = await fetch(`${apiBase}/merge`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || data.error || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError('Lỗi kết nối: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="merge-section">
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="upload-section">
          <FileUploadInput
            id="excelFile"
            label="File Excel (Nhiều Sheet)"
            icon="📊"
            file={excelFile}
            inputKey={fileInputKey}
            onFileChange={handleFileChange}
            onFileRemove={handleFileRemove}
          />
        </div>

        <div className="merge-options">
          <div className="option-group">
            <label>
              <strong>Tên tháng (JSON Array, optional):</strong>
              <small>Ví dụ: ["Tháng 1", "Tháng 2", ...] hoặc ["Jan-23", "Feb-23", ...]</small>
              <textarea
                value={monthNames}
                onChange={(e) => setMonthNames(e.target.value)}
                placeholder='["Tháng 1", "Tháng 2", "Tháng 3"]'
                rows="2"
              />
            </label>
          </div>

          <div className="option-group">
            <label>
              <strong>Sheet Indices (JSON Array, optional):</strong>
              <small>Ví dụ: [0, 1, 2, ...] để chỉ định sheet cần đọc. Để trống sẽ đọc tất cả.</small>
              <textarea
                value={sheetIndices}
                onChange={(e) => setSheetIndices(e.target.value)}
                placeholder='[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]'
                rows="2"
              />
            </label>
          </div>
        </div>

        <div className="config-toggle">
          <button
            type="button"
            className="config-btn"
            onClick={() => setShowConfig(!showConfig)}
          >
            {showConfig ? '▼' : '▶'} Cấu hình Parse File
          </button>
        </div>

        <MergeConfigSection
          showConfig={showConfig}
          mergeConfig={mergeConfig}
          onConfigChange={setMergeConfig}
          onClose={() => setShowConfig(false)}
        />

        <div className="upload-actions">
          <button
            type="submit"
            className="btn"
            disabled={loading || !excelFile}
          >
            {loading ? 'Đang xử lý...' : 'Gộp Dữ Liệu'}
          </button>
          <button
            type="button"
            className="btn secondary"
            onClick={handleFileRemove}
            disabled={!excelFile}
          >
            Xóa file
          </button>
        </div>
      </form>

      {loading && <LoadingSpinner />}
      <ErrorDisplay error={error} />

      {result && (
        <div className="result-section">
          <div className="result-card success">
            <h3>✅ Gộp dữ liệu thành công!</h3>
            <div className="result-summary">
              <p><strong>Tổng số sheet:</strong> {result.summary?.totalSheets || 'N/A'}</p>
              <p><strong>Tổng số nhân viên:</strong> {result.summary?.totalEmployees || 'N/A'}</p>
              <p><strong>Thời gian xử lý:</strong> {result.summary?.processingTime ? `${(result.summary.processingTime / 1000).toFixed(2)}s` : 'N/A'}</p>
              {result.summary?.sheetNames && (
                <div>
                  <strong>Sheet đã xử lý:</strong>
                  <ul>
                    {result.summary.sheetNames.map((name, idx) => (
                      <li key={idx}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {result.downloadUrl && (
              <button
                className="btn"
                onClick={() => onDownload(result.downloadUrl)}
              >
                📥 Tải File Đã Gộp
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MergeMonthlySection;

