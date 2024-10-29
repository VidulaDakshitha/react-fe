import React, { useRef, useState } from "react";
import "./InvoiceUpload.scss";
import doc from "../../assets/doc.png";
import invoice from "../../assets/invoice.png";
import { BsPaperclip } from "react-icons/bs";

// Define the interface for component props
interface ImageUploadProps {
  onFilesChange: (files: { file: string; name: string }[]) => void;
}

// Component
const InvoiceUpload: React.FC<ImageUploadProps> = ({ onFilesChange }) => {
  const [uploadedFiles, setUploadedFiles] = useState<
    { file: string; name: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle file uploads
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFiles(files);
    }
  };

  // Handle dropped files
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files) {
      handleFiles(files);
    }
  };

  // Convert file to base64 and update state
  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    const promises = fileArray.map((file) => convertToBase64(file));

    Promise.all(promises).then((base64Files) => {
      const newFiles = base64Files.map((base64, index) => ({
        file: base64 as string,
        name: fileArray[index].name,
      }));
      setUploadedFiles((prevFiles) => {
        const updatedFiles = [...prevFiles, ...newFiles];
        onFilesChange(updatedFiles);
        return updatedFiles;
      });
    });
  };

  // Convert file to base64
  const convertToBase64 = (
    file: File
  ): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle drag events
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleLinkClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to get the document type based on file extension
  const getDocumentType = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "doc":
      case "docx":
        return "Microsoft Word";
      case "xls":
      case "xlsx":
        return "Microsoft Excel";
      case "ppt":
      case "pptx":
        return "Microsoft PowerPoint";
      case "pdf":
        return "PDF Document";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "Image";
      default:
        return "Unknown File";
    }
  };

  return (
    <div>
      <div className="attachment-section">
        <div className="row">
          {uploadedFiles.map((fileObj, index) => (
            <div className="col" key={index}>
              <div className="attachment d-flex">
                <div>
                  <img width={"60%"} src={doc} alt="document" />
                </div>
                <div className="doc-name d-flex align-items-center">
                  <div>
                    {getDocumentType(fileObj.name)}
                    <div className="doc-size">234kb</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {uploadedFiles.length == 0 && (
        <div
          className={`file-drop-zone ${isDragging ? "dragging" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleLinkClick}
        >
          <div>
            <div className="file-drop-message">
              <div className="d-flex justify-content-center">
                <img src={invoice} alt="Upload" />
              </div>
              <p className="invoice-txt d-flex justify-content-center">Drag and drop your invoice file here, or click to browse.</p>
              <p className="d-flex justify-content-center">Accepted formats: PDF, JPEG. Max size: 10 MB.</p>
            </div>
            <div className="d-flex justify-content-center">
            <button type="button" className="browse-button">Browse</button>
            </div>
          </div>
        </div>
      )}
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default InvoiceUpload;
