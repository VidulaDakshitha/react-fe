import React, { useState, useEffect } from "react";
import "./Certification.scss";
import img from "./img.png";
import { AddSkills } from "../Skills/AddSkillTask/AddSkills";
import CustomModal from "../Modal/Modal";
import { AddCertification } from "./AddCertification/AddCertification";

interface Certification {
  id?: number | null;
  title: string;
  institution: string | null;
  description: string | null;
  from_date: string | null;
  to_date: string | null;
  is_delete?: number | null;
}

interface CertificationsProps {
  certifications: Certification[];
  updateCertificationList: (certifications: Certification[]) => void;
  disableUpdate?:boolean;
}

export const Certification: React.FC<CertificationsProps> = ({
  certifications,
  updateCertificationList,
  disableUpdate
}) => {
  const [modalShow, setModalShow] = useState(false);
  const [certificationList, setCertificationList] = useState<Certification[]>(
    []
  );

  useEffect(() => {
    if (certifications) {
      setCertificationList(certifications);
    }
  }, [certifications]);

  const toggleModal = () => setModalShow(!modalShow);

  const handleCertificationUpdate = (newCertifications: Certification[]) => {
    setCertificationList(newCertifications);
    updateCertificationList(newCertifications);
  };

  return (
    <div className="certifications-container">
      <div className="certifications-content">
        <div className="certifications-title">Certifications</div>
        {certificationList.length > 0 ? (
          certificationList
            .filter((certification) => !certification.is_delete)
            .map((certification, index) => (
              <React.Fragment key={index}>
                <div className="sc-certification-item">
                  <div className="sc-certification-title">
                    {certification.title}
                  </div>
                  <div className="sc-certification-duration">
                    {`${certification.from_date} - ${certification.to_date}`}{" "}
                    <strong>{certification.institution}</strong>
                  </div>
                </div>
                <hr />
              </React.Fragment>
            ))
        ) : (
          <div className="no-certifications">No certifications available</div>
        )}
{!disableUpdate &&        <button className="image-button" onClick={toggleModal}>
          <img src={img} alt="Button icon" className="button-image" />
        </button>}

        <CustomModal
          show={modalShow}
          toggle={toggleModal}
          ModalHeader="Add Certification"
          size={"lg"}
        >
          <AddCertification
            certifications={certificationList}
            onCertificationUpdate={handleCertificationUpdate}
          />
        </CustomModal>
      </div>
    </div>
  );
};
