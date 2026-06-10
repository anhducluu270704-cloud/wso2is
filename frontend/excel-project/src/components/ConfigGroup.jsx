const ConfigGroup = ({ title, config, onConfigChange, children }) => {
  // Nếu có children, render children (dùng như wrapper)
  if (children) {
    return (
      <div className="config-group">
        {title && <h3>{title}</h3>}
        {children}
      </div>
    );
  }

  // Nếu không có config hoặc onConfigChange, không render gì
  if (!config || !onConfigChange) {
    return null;
  }

  // Default values để tránh lỗi undefined
  const safeConfig = {
    sheetIndex: config.sheetIndex ?? 0,
    headerRow: config.headerRow ?? 1,
    startRow: config.startRow ?? 1,
    startColumn: config.startColumn ?? 'A',
    endColumn: config.endColumn ?? 'S',
    ...config
  };

  const handleChange = (field, value) => {
    const updatedConfig = { ...safeConfig };
    
    if (field === 'sheetIndex' || field === 'headerRow' || field === 'startRow') {
      updatedConfig[field] = parseInt(value) || 0;
    } else {
      updatedConfig[field] = value.toUpperCase();
    }
    
    onConfigChange(updatedConfig);
  };

  return (
    <div className="config-group">
      {title && <h3>{title}</h3>}
      <div className="config-inputs">
        <div className="config-input">
          <label>Sheet Index:</label>
          <input
            type="number"
            value={safeConfig.sheetIndex}
            onChange={(e) => handleChange('sheetIndex', e.target.value)}
            min="0"
          />
        </div>
        <div className="config-input">
          <label>Header Row:</label>
          <input
            type="number"
            value={safeConfig.headerRow}
            onChange={(e) => handleChange('headerRow', e.target.value)}
            min="1"
          />
        </div>
        <div className="config-input">
          <label>Start Row:</label>
          <input
            type="number"
            value={safeConfig.startRow}
            onChange={(e) => handleChange('startRow', e.target.value)}
            min="1"
          />
        </div>
        <div className="config-input">
          <label>Start Column:</label>
          <input
            type="text"
            value={safeConfig.startColumn}
            onChange={(e) => handleChange('startColumn', e.target.value)}
            maxLength="2"
            placeholder="A"
          />
        </div>
        <div className="config-input">
          <label>End Column:</label>
          <input
            type="text"
            value={safeConfig.endColumn}
            onChange={(e) => handleChange('endColumn', e.target.value)}
            maxLength="2"
            placeholder="S"
          />
        </div>
      </div>
    </div>
  );
};

export default ConfigGroup;

