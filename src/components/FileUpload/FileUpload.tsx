import React, { useRef, useState } from "react";
import "./FileUpload.scss";
import doc from "../../assets/doc.png";
import { BsPaperclip } from "react-icons/bs";

// Define the interface for component props
interface ImageUploadProps {
  onFilesChange: (files: { file: string; name: string }[]) => void;
}

// Component
const ImageUpload: React.FC<ImageUploadProps> = ({ onFilesChange }) => {
  const [uploadedFiles, setUploadedFiles] = useState<{ file: string; name: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file uploads
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const promises = fileArray.map((file) => convertToBase64(file));

      Promise.all(promises).then((base64Files) => {
        const newFiles = base64Files.map((base64, index) => ({
          file: base64 as string,
          name: fileArray[index].name
        }));
        setUploadedFiles((prevFiles) => {
          const updatedFiles = [...prevFiles, ...newFiles];
          onFilesChange(updatedFiles);
          return updatedFiles;
        });
      });
    }
  };

  // Convert file to base64
  const convertToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleLinkClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to get the document type based on file extension
  const getDocumentType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'doc':
      case 'docx':
        return 'Microsoft Word';
      case 'xls':
      case 'xlsx':
        return 'Microsoft Excel';
      case 'ppt':
      case 'pptx':
        return 'Microsoft PowerPoint';
      case 'pdf':
        return 'PDF Document';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'Image';
      default:
        return 'Unknown File';
    }
  };

  return (
    <div>
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
      </div>

      <div className="doc-btn" onClick={handleLinkClick}>
        <BsPaperclip /> Upload Documents
      </div>
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

export default ImageUpload;
