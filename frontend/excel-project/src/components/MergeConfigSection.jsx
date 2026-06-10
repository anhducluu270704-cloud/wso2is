import { useState } from 'react';
import ConfigGroup from './ConfigGroup';

const MergeConfigSection = ({ showConfig, mergeConfig, onConfigChange, onClose }) => {
  if (!showConfig) return null;

  const handleConfigChange = (key, value) => {
    onConfigChange({
      ...mergeConfig,
      [key]: value
    });
  };

  return (
    <div className="config-section">
      <div className="config-content">
        <h3>Cấu hình Parse File</h3>
        
        <ConfigGroup title="Cấu hình chung">
          <div className="config-row">
            <label>
              Header Row (Hàng chứa header):
              <input
                type="number"
                value={mergeConfig?.headerRow || 1}
                onChange={(e) => handleConfigChange('headerRow', parseInt(e.target.value) || 1)}
                min="1"
              />
            </label>
          </div>
          
          <div className="config-row">
            <label>
              Start Row (Hàng bắt đầu đọc dữ liệu):
              <input
                type="number"
                value={mergeConfig?.startRow || 3}
                onChange={(e) => handleConfigChange('startRow', parseInt(e.target.value) || 3)}
                min="1"
              />
            </label>
          </div>
          
          <div className="config-row">
            <label>
              Start Column (Cột bắt đầu):
              <input
                type="text"
                value={mergeConfig?.startColumn || 'A'}
                onChange={(e) => handleConfigChange('startColumn', e.target.value.toUpperCase())}
                placeholder="A"
                maxLength="2"
              />
            </label>
          </div>
          
          <div className="config-row">
            <label>
              End Column (Cột kết thúc):
              <input
                type="text"
                value={mergeConfig?.endColumn || 'N'}
                onChange={(e) => handleConfigChange('endColumn', e.target.value.toUpperCase())}
                placeholder="N"
                maxLength="2"
              />
            </label>
          </div>
        </ConfigGroup>

        <div className="config-actions">
          <button type="button" className="btn secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default MergeConfigSection;

