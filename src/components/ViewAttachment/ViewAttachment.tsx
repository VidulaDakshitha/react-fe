import React from "react";
import doc from "../../assets/doc.png";
import "./ViewAttachment.scss";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export const ViewAttachment = ({ attachments }: any) => {
  console.log(attachments)
  const getFileType = (file: any) => {
    if (file) {
      const extension = file.split(".").pop().toLowerCase();
      switch (extension) {
        case "xlsx":
        case "xls":
          return { type: "Microsoft Excel", icon: doc };
        case "docx":
        case "doc":
          return { type: "Microsoft Docx", icon: doc };
        case "pptx":
        case "ppt":
          return { type: "Microsoft Pptx", icon: doc };
        case "pdf":
          return { type: "Microsoft Pdf", icon: doc };
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
          return { type: "Image", icon: doc };
        default:
          return { type: "Unknown File", icon: doc };
      }
    } else return { type: "", icon: doc };
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    const folder:any = zip.folder("attachments");

    for (const attachment of attachments) {
      const response = await fetch(attachment.file_url);
      const blob = await response.blob();
      folder.file(attachment.file.split("/").pop(), blob);
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "attachments.zip");
    });
  };

  return (
    <div>
      <div className="attachment-section">
        <div className="row">
          {attachments &&
            attachments.length > 0 &&
            attachments.map((attachment: any) => {
              const { type, icon } = getFileType(attachment.file);
              return (
                <div className="col" key={attachment.id}>
                  <div className="attachment d-flex">
                    <div>
                      <img width={"60%"} src={icon} alt={type} />
                    </div>
                    <div className="doc-name d-flex align-items-center">
                      <div>
                        {type}
                        <div className="doc-size">234kb</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        {attachments && attachments.length == 0 && (
          <div className="no-submit">No Submissions Available</div>
        )}
      </div>
      {attachments && attachments.length > 0 && (
        <div className="download-txt" onClick={handleDownloadAll}>
          Download All
        </div>
      )}
    </div>
  );
};
