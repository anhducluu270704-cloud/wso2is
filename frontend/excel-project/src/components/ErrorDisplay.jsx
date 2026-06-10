const ErrorDisplay = ({ error }) => {
  if (!error) return null;

  return (
    <div className="result error">
      <h3>❌ Lỗi</h3>
      <p>{error}</p>
    </div>
  );
};

export default ErrorDisplay;

