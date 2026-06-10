import ConfigGroup from './ConfigGroup';

const ExcelConfigSection = ({
  showConfig,
  leaveConfig,
  attendanceConfig,
  onLeaveConfigChange,
  onAttendanceConfigChange,
  onClose
}) => {
  if (!showConfig) return null;

  return (
    <div className="config-section">
      <ConfigGroup
        title="📄 File Nghỉ Phép (Leave File)"
        config={leaveConfig}
        onConfigChange={onLeaveConfigChange}
      />

      <ConfigGroup
        title="📋 File Chấm Công (Attendance File)"
        config={attendanceConfig}
        onConfigChange={onAttendanceConfigChange}
      />

      <div className="config-actions">
        <button
          type="button"
          className="btn secondary"
          onClick={onClose}
        >
          Đóng cấu hình
        </button>
      </div>
    </div>
  );
};

export default ExcelConfigSection;

