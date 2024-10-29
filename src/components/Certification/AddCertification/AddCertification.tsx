import React, { useState } from "react";
import "./AddCertification.scss";
import img from "./img.png";
import { ErrorNotification } from "../../ErrorNotification/ErrorNotification";
import {
  certificationAttributes,
  localeAttributes,
  updateCertificationAPIAttributes,
  updateLanguageAPIAttributes,
} from "../../../types/api_types";
import { UpdateLanguageApi } from "../../../services/language.service";
import { toast } from "react-toastify";
import { UpdateCertificationApi } from "../../../services/certification.service";
import { BsPlusLg, BsXLg } from "react-icons/bs";

interface Certification {
  id?: number | null;
  title: string;
  institution: string | null;
  description: string | null;
  from_date: string | null;
  to_date: string | null;
  is_delete?: number | null;
  is_new?: boolean;
}

interface AddCertificationsProps {
  certifications: Certification[];
  onCertificationUpdate: (certifications: Certification[]) => void;
}

const formatDateForInput = (date: string | null): string => {
  if (!date) return "";
  const [day, month, year] = date.split("-");
  return `${year}-${month}-${day}`;
};

const formatDateForOutput = (date: string | null): string => {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
};

export const AddCertification: React.FC<AddCertificationsProps> = ({
  certifications,
  onCertificationUpdate,
}) => {
  const [certificationList, setCertificationList] =
    useState<Certification[]>(certifications);
  const [newCertification, setNewCertification] = useState<Certification>({
    id: certificationList.length + 1,
    title: "",
    institution: "",
    description: "",
    from_date: "",
    to_date: "",
    is_delete: 0,
    is_new: true,
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedCertifications = [...certificationList];
    if (field === "from_date" || field === "to_date") {
      updatedCertifications[index] = {
        ...updatedCertifications[index],
        [field]: formatDateForOutput(value),
      };
    } else {
      updatedCertifications[index] = {
        ...updatedCertifications[index],
        [field]: value,
      };
    }
    setCertificationList(updatedCertifications);
  };

  const handleNewInputChange = (field: string, value: string) => {
    if (field === "from_date" || field === "to_date") {
      setNewCertification({
        ...newCertification,
        [field]: formatDateForOutput(value),
      });
    } else {
      setNewCertification({ ...newCertification, [field]: value });
    }
  };

  const validateNewCertification = (): boolean => {
    if (
      !newCertification.title ||
      !newCertification.institution ||
      !newCertification.from_date ||
      !newCertification.to_date
    ) {
      ErrorNotification("All fields must be filled.");
      return false;
    }
    setError(null);
    return true;
  };

  const addNewCertification = () => {
    if (validateNewCertification()) {
      setCertificationList([...certificationList, newCertification]);
      setNewCertification({
        id: certificationList.length + 2,
        title: "",
        institution: "",
        description: "",
        from_date: "",
        to_date: "",
        is_delete: 0,
        is_new: true,
      });
    }
  };

  const removeCertification = (id: number | null) => {
    if (id !== null) {
      const updatedCertifications = certificationList.map((certification) =>
        certification?.id === id
          ? { ...certification, is_delete: 1 }
          : certification
      );
      setCertificationList(updatedCertifications);
    }
  };

  const onSave = () => {
    const saveCertificationList: certificationAttributes[] =
      certificationList.map((certification) => {
        const saveCertification: certificationAttributes = {
          title: certification.title,
          institution: certification.institution || "",
          description: certification.institution || "",
          from_date: certification.from_date || "",
          to_date: certification.to_date || "",
          is_delete: certification.is_delete || 0,
        };
        if (
          certification.is_new !== true &&
          certification.id !== undefined &&
          certification.id !== null
        ) {
          saveCertification.id = certification.id;
        }
        return saveCertification;
      });
    saveChanges({ certifications: saveCertificationList });
  };

  const saveChanges = async (values: updateCertificationAPIAttributes) => {
    const certification_request: any = await UpdateCertificationApi(values);
    if (certification_request.status === 200) {
      toast.success("Certifications updated successfully");
      onCertificationUpdate(certificationList);
    } else {
      ErrorNotification(certification_request.message);
    }
  };

  return (
    <div>
      <div className="sc-container">
        <div className="sc-innerContainer">
          <div className="sc-row">
            <div className="sc-column">
              <div className="sc-label">Institution</div>
              <input
                type="text"
                className="sc-input"
                placeholder={"Institution"}
                value={newCertification.institution || ""}
                onChange={(e) =>
                  handleNewInputChange("institution", e.target.value)
                }
              />
            </div>
            <div className="sc-column">
              <div className="sc-label">Program</div>
              <input
                type="text"
                className="sc-input sc-input-light"
                placeholder={"Program"}
                value={newCertification.title || ""}
                onChange={(e) => handleNewInputChange("title", e.target.value)}
              />
            </div>
          </div>
          <div className="sc-row">
            <div className="sc-column">
              <div className="sc-label">From</div>
              <input
                type="date"
                className="sc-input"
                value={formatDateForInput(newCertification.from_date)}
                onChange={(e) =>
                  handleNewInputChange("from_date", e.target.value)
                }
              />
            </div>
            <div className="sc-column">
              <div className="sc-label">To</div>
              <input
                type="date"
                className="sc-input"
                value={formatDateForInput(newCertification.to_date)}
                onChange={(e) =>
                  handleNewInputChange("to_date", e.target.value)
                }
              />
            </div>
          </div>
          {/* <button className="sc-add-button" onClick={addNewCertification}>
                    </button> */}
          <div className="sc-add-button" onClick={addNewCertification}>
            {" "}
            <BsPlusLg />
          </div>
        </div>
      </div>
      {certificationList
        .filter((certification) => !certification.is_delete)
        .map((certification, index) => (
          <div key={index} className="sc-container">
            {/* <button
                        className="sc-close-button"
                        onClick={() => removeCertification(certification.id || null)}
                    /> */}
            <div
              className="sc-close-button"
              onClick={() => removeCertification(certification.id || null)}
            >
              {" "}
              <BsXLg />
            </div>
            <div className="sc-innerContainer">
              <div className="sc-row">
                <div className="sc-column">
                  <div className="sc-label">Institution</div>
                  <input
                    type="text"
                    className="sc-input"
                    value={certification.institution || ""}
                    onChange={(e) =>
                      handleInputChange(index, "institution", e.target.value)
                    }
                  />
                </div>
                <div className="sc-column">
                  <div className="sc-label">Program</div>
                  <input
                    type="text"
                    className="sc-input sc-input-light"
                    value={certification.title || ""}
                    onChange={(e) =>
                      handleInputChange(index, "title", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="sc-row">
                <div className="sc-column">
                  <div className="sc-label">From</div>
                  <input
                    type="date"
                    className="sc-input"
                    value={formatDateForInput(certification.from_date)}
                    onChange={(e) =>
                      handleInputChange(index, "from_date", e.target.value)
                    }
                  />
                </div>
                <div className="sc-column">
                  <div className="sc-label">To</div>
                  <input
                    type="date"
                    className="sc-input"
                    value={formatDateForInput(certification.to_date)}
                    onChange={(e) =>
                      handleInputChange(index, "to_date", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      <div className="button-container">
        <button className="task-btn" onClick={onSave}>
          Save changes
        </button>
      </div>
    </div>
  );
};
