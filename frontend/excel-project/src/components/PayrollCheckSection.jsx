import { useState } from 'react';
import FileUploadInput from './FileUploadInput';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import ConfigGroup from './ConfigGroup';

// Lấy base URL từ biến môi trường hoặc dùng mặc định
// Nếu VITE_API_URL có /api/check thì loại bỏ phần đó
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return 'http://localhost:3001';
  // Loại bỏ /api/check nếu có
  return envUrl.replace(/\/api\/check\/?$/, '').replace(/\/$/, '');
};
const API_URL = `${getBaseUrl()}/api/payroll`;

const defaultPayrollConfig = {
  sheetIndex: 0,
  headerRow: 4,
  startRow: 9,
  startColumn: 'A',
  endColumn: null
};

const defaultColumnMapping = {
  empCode: 'Mã nhân viên / Emp Code',
  fullName: 'Họ tên / Full Name',
  basicSalary: 'Lương cơ bản / Basic Salary',
  seniorityAllowance: 'Tiền thâm niên / Seniority Allowance',
  responsibilityAllowance: 'Phụ cấp trách nhiệm / Responsibility allowance',
  bhxh8Employee: 'BHXH 8% / Người lao động trả / 0.08',
  bhtn1Employee: 'BHTN 1% / Người lao động trả / 0.01',
  bhyt15Employee: 'BHYT 1.5% / Người lao động trả / 0.015',
  bhxh175Company: 'BHXH 17.5% Công ty trả / 0.175',
  bhtn1Company: 'BHTN 1% Công ty trả / 0.01',
  bhyt3Company: 'BHYT 3% Công ty trả / 0.03',
  tradeUnion2Company: 'Công đoàn công ty 2% / Trade Union paid by employer'
};

const PayrollCheckSection = () => {
  const [payrollFile, setPayrollFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState(defaultPayrollConfig);
  const [columnMapping, setColumnMapping] = useState(defaultColumnMapping);
  const [fileInputKey, setFileInputKey] = useState(0);

  const handleFileChange = (file) => {
    setPayrollFile(file);
    setError(null);
    setResult(null);
  };

  const handleFileRemove = () => {
    setPayrollFile(null);
    setFileInputKey(prev => prev + 1);
    setError(null);
    setResult(null);
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '—';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!payrollFile) {
      setError('Vui lòng chọn file bảng lương');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('payrollFile', payrollFile);
      formData.append('config', JSON.stringify(config));
      formData.append('columnMapping', JSON.stringify(columnMapping));

      // Đảm bảo URL đúng: /api/payroll/check
      const checkUrl = API_URL.endsWith('/check') ? API_URL : `${API_URL}/check`;
      console.log('=== PAYROLL CHECK REQUEST ===');
      console.log('API URL:', checkUrl);
      console.log('Config:', config);
      console.log('Column Mapping:', columnMapping);
      console.log('File:', payrollFile.name, payrollFile.size, 'bytes');
      
      const response = await fetch(checkUrl, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      console.log('=== PAYROLL CHECK RESPONSE ===');
      console.log('Response status:', response.status);
      console.log('Response data:', data);
      
      if (data.data) {
        console.log('Total rows:', data.data.totalRows);
        console.log('Total errors:', data.data.totalErrors);
        if (data.data.errorRows && data.data.errorRows.length > 0) {
          console.log('Error rows:', data.data.errorRows.slice(0, 5));
        }
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Lỗi khi kiểm tra bảng lương');
      }

      setResult(data.data);
    } catch (err) {
      setError(err.message || 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payroll-check-section">
      <div className="section-header">
        <h2>Kiểm tra tính đúng đắn các thành phần tiền</h2>
        <button
          type="button"
          className="config-btn"
          onClick={() => setShowConfig(!showConfig)}
        >
          {showConfig ? '▼' : '▶'} Cấu hình
        </button>
      </div>

      {showConfig && (
        <div className="config-section">
          <ConfigGroup title="Cấu hình file Excel">
            <div className="config-row">
              <label>
                Sheet Index:
                <input
                  type="number"
                  value={config.sheetIndex || 0}
                  onChange={(e) => setConfig({ ...config, sheetIndex: parseInt(e.target.value) || 0 })}
                />
              </label>
              <label>
                Header Row:
                <input
                  type="number"
                  value={config.headerRow || 4}
                  onChange={(e) => setConfig({ ...config, headerRow: parseInt(e.target.value) || 4 })}
                />
              </label>
            </div>
            <div className="config-row">
              <label>
                Start Row:
                <input
                  type="number"
                  value={config.startRow || 9}
                  onChange={(e) => setConfig({ ...config, startRow: parseInt(e.target.value) || 9 })}
                />
              </label>
              <label>
                Start Column:
                <input
                  type="text"
                  value={config.startColumn || 'A'}
                  onChange={(e) => setConfig({ ...config, startColumn: e.target.value })}
                />
              </label>
            </div>
            <div className="config-row">
              <label>
                End Column (để trống = đọc đến hết):
                <input
                  type="text"
                  value={config.endColumn || ''}
                  onChange={(e) => setConfig({ ...config, endColumn: e.target.value || null })}
                  placeholder="Ví dụ: Z"
                />
              </label>
            </div>
          </ConfigGroup>

          <ConfigGroup title="Mapping cột (tên cột trong Excel)">
            <div className="config-row">
              <label>
                Mã nhân viên:
                <input
                  type="text"
                  value={columnMapping.empCode}
                  onChange={(e) => setColumnMapping({ ...columnMapping, empCode: e.target.value })}
                />
              </label>
              <label>
                Họ tên:
                <input
                  type="text"
                  value={columnMapping.fullName}
                  onChange={(e) => setColumnMapping({ ...columnMapping, fullName: e.target.value })}
                />
              </label>
            </div>
            <div className="config-row">
              <label>
                Lương cơ bản:
                <input
                  type="text"
                  value={columnMapping.basicSalary}
                  onChange={(e) => setColumnMapping({ ...columnMapping, basicSalary: e.target.value })}
                />
              </label>
              <label>
                Tiền thâm niên:
                <input
                  type="text"
                  value={columnMapping.seniorityAllowance}
                  onChange={(e) => setColumnMapping({ ...columnMapping, seniorityAllowance: e.target.value })}
                />
              </label>
            </div>
            <div className="config-row">
              <label>
                Phụ cấp trách nhiệm:
                <input
                  type="text"
                  value={columnMapping.responsibilityAllowance}
                  onChange={(e) => setColumnMapping({ ...columnMapping, responsibilityAllowance: e.target.value })}
                />
              </label>
            </div>
            <div className="config-row">
              <label>
                BHXH 8% (NLĐ):
                <input
                  type="text"
                  value={columnMapping.bhxh8Employee}
                  onChange={(e) => setColumnMapping({ ...columnMapping, bhxh8Employee: e.target.value })}
                />
              </label>
              <label>
                BHTN 1% (NLĐ):
                <input
                  type="text"
                  value={columnMapping.bhtn1Employee}
                  onChange={(e) => setColumnMapping({ ...columnMapping, bhtn1Employee: e.target.value })}
                />
              </label>
            </div>
            <div className="config-row">
              <label>
                BHYT 1.5% (NLĐ):
                <input
                  type="text"
                  value={columnMapping.bhyt15Employee}
                  onChange={(e) => setColumnMapping({ ...columnMapping, bhyt15Employee: e.target.value })}
                />
              </label>
              <label>
                BHXH 17.5% (Công ty):
                <input
                  type="text"
                  value={columnMapping.bhxh175Company}
                  onChange={(e) => setColumnMapping({ ...columnMapping, bhxh175Company: e.target.value })}
                />
              </label>
            </div>
            <div className="config-row">
              <label>
                BHTN 1% (Công ty):
                <input
                  type="text"
                  value={columnMapping.bhtn1Company}
                  onChange={(e) => setColumnMapping({ ...columnMapping, bhtn1Company: e.target.value })}
                />
              </label>
              <label>
                BHYT 3% (Công ty):
                <input
                  type="text"
                  value={columnMapping.bhyt3Company}
                  onChange={(e) => setColumnMapping({ ...columnMapping, bhyt3Company: e.target.value })}
                />
              </label>
            </div>
            <div className="config-row">
              <label>
                Công đoàn 2% (Công ty):
                <input
                  type="text"
                  value={columnMapping.tradeUnion2Company}
                  onChange={(e) => setColumnMapping({ ...columnMapping, tradeUnion2Company: e.target.value })}
                />
              </label>
            </div>
          </ConfigGroup>
        </div>
      )}

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="upload-section">
          <FileUploadInput
            id="payrollFile"
            label="File Bảng Lương (Payroll File)"
            icon="💰"
            file={payrollFile}
            inputKey={fileInputKey}
            accept=".xlsx,.xls"
            onFileChange={handleFileChange}
            onFileRemove={handleFileRemove}
          />
        </div>

        <div className="upload-actions">
          <button type="submit" className="btn" disabled={loading || !payrollFile}>
            {loading ? 'Đang kiểm tra...' : 'Kiểm Tra'}
          </button>
          <button
            type="button"
            className="btn secondary"
            onClick={() => {
              setPayrollFile(null);
              setFileInputKey(prev => prev + 1);
              setError(null);
              setResult(null);
            }}
            disabled={!payrollFile}
          >
            Xóa file
          </button>
        </div>
      </form>

      {loading && <LoadingSpinner />}
      <ErrorDisplay error={error} />

      {result && (
        <div className="result-section">
          <div className="result-summary">
            <h3>Kết quả kiểm tra</h3>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Tổng số dòng:</span>
                <span className="stat-value">{result.totalRows}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Số dòng có lỗi:</span>
                <span className={`stat-value ${result.totalErrors > 0 ? 'text-danger' : 'text-success'}`}>
                  {result.totalErrors}
                </span>
              </div>
            </div>
          </div>

          {result.errorRows && result.errorRows.length > 0 && (
            <div className="error-rows-section">
              <h4>Chi tiết các dòng có lỗi ({result.errorRows.length})</h4>
              <div className="error-rows-list">
                {result.errorRows.map((row, index) => (
                  <div key={index} className="error-row-item">
                    <div className="error-row-header">
                      <strong>Dòng {row.rowNumber}</strong>
                      <span className="emp-code">MNV: {row.empCode}</span>
                      {row.fullName && <span className="emp-name">{row.fullName}</span>}
                    </div>
                    <div className="error-row-base">
                      <span>Tổng lương cơ bản: {formatCurrency(row.baseAmount)}</span>
                      <span>(Lương: {formatCurrency(row.basicSalary)} + Thâm niên: {formatCurrency(row.seniorityAllowance)} + Phụ cấp: {formatCurrency(row.responsibilityAllowance)})</span>
                    </div>
                    <div className="error-details">
                      {row.errors.map((err, errIndex) => (
                        <div key={errIndex} className="error-detail-item">
                          <span className="error-component">{err.component}:</span>
                          <span className="error-expected">Kỳ vọng: {formatCurrency(err.expected)}</span>
                          <span className="error-actual">Thực tế: {formatCurrency(err.actual)}</span>
                          <span className="error-diff">Sai lệch: {formatCurrency(err.difference)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.totalErrors === 0 && (
            <div className="success-message">
              ✅ Tất cả các thành phần tiền đều đúng!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PayrollCheckSection;

