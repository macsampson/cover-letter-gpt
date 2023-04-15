import { useState, useEffect } from "react";

// prop interface for passing file to parent component through prop called onFileUpload
type Props = {
  onFileUpload: (file: File | null) => void;
};

function ResumeUpload({ onFileUpload }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // use effect for passing file to parent component
  useEffect(() => {
    onFileUpload(file);
  }, [file]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.dataTransfer;
    const file = files[0];
    if (
      file.type === "application/pdf" ||
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setFile(file);
    }
    setIsDragging(false);
  };

  const handleBrowseClick = () => {
    const input =
      document.querySelector<HTMLInputElement>('input[type="file"]');
    input && input.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const file = files ? files[0] : null;
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      setFile(file);
    }
  };

  return (
    <div
      style={{
        padding: "7px",
        backgroundColor: "white",
        borderRadius: "10px",
      }}
    >
      <div
        className={`drag-and-drop-container ${isDragging ? "dragging" : ""}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <svg
          className="dropIcon"
          viewBox="0 0 1024 1024"
          focusable="false"
          data-icon="inbox"
          width="3em"
          height="3em"
          fill="#1677ff"
          aria-hidden="true"
        >
          <path d="M885.2 446.3l-.2-.8-112.2-285.1c-5-16.1-19.9-27.2-36.8-27.2H281.2c-17 0-32.1 11.3-36.9 27.6L139.4 443l-.3.7-.2.8c-1.3 4.9-1.7 9.9-1 14.8-.1 1.6-.2 3.2-.2 4.8V830a60.9 60.9 0 0060.8 60.8h627.2c33.5 0 60.8-27.3 60.9-60.8V464.1c0-1.3 0-2.6-.1-3.7.4-4.9 0-9.6-1.3-14.1zm-295.8-43l-.3 15.7c-.8 44.9-31.8 75.1-77.1 75.1-22.1 0-41.1-7.1-54.8-20.6S436 441.2 435.6 419l-.3-15.7H229.5L309 210h399.2l81.7 193.3H589.4zm-375 76.8h157.3c24.3 57.1 76 90.8 140.4 90.8 33.7 0 65-9.4 90.3-27.2 22.2-15.6 39.5-37.4 50.7-63.6h156.5V814H214.4V480.1z"></path>
        </svg>
        <p>Drop your PDF or Word Resume</p>
        <div style={{ paddingTop: "10px" }}>
          <a
            // id="browseFiles"
            href="#"
            onClick={handleBrowseClick}
          >
            Browse my Computer
          </a>
        </div>
        <input
          type="file"
          accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
        />
        {file && <p id="resume">{file.name}</p>}
      </div>
    </div>
  );
}

export default ResumeUpload;
