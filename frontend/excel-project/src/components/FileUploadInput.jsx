import { useRef } from 'react';

const FileUploadInput = ({
  id,
  label,
  icon,
  file,
  accept = '.xlsx,.xls',
  inputKey,
  onFileChange,
  onFileRemove,
  onDragOver,
  onDrop
}) => {
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDragOver) onDragOver(e);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
      if (onDrop) onDrop(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && onFileChange) {
      onFileChange(selectedFile);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFileRemove) onFileRemove();
  };

  return (
    <div className="file-input-wrapper">
      <label
        htmlFor={id}
        className="file-input-label"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="file-icon">{icon}</div>
        <div className="file-label-text">{label}</div>
        <div className="file-name">
          {file ? (
            <div className="file-details">
              <span>{file.name}</span>
              <button
                type="button"
                className="remove-file-btn"
                onClick={handleRemove}
              >
                ✕
              </button>
            </div>
          ) : (
            'Chưa chọn file'
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          id={id}
          accept={accept}
          onChange={handleFileChange}
          className="file-input"
          key={inputKey}
        />
      </label>
    </div>
  );
};

export default FileUploadInput;

