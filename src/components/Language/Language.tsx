import React, { useState, useEffect } from "react";
import "./Language.scss";
import img from "./img.png";

import CustomModal from "../Modal/Modal";
import { AddLanguage } from "./AddLanguage/AddLanguage";

interface Language {
  id?: number | null;
  language: string | null;
  expertise_level: string | null;
  language_id: number | null;
  is_delete?: number | null;

}

interface LanguageProps {
  languages: Language[];
  updateLanguageList: (languages: Language[]) => void;
  disableUpdate?:boolean;
}

export const Language: React.FC<LanguageProps> = ({
  languages,
  updateLanguageList,
  disableUpdate
}) => {
  const [modalShow, setModalShow] = useState(false);
  const [languageList, setLanguageList] = useState<Language[]>([]);

  useEffect(() => {
    if (languages) {
      setLanguageList(languages);
    }
  }, [languages]);

  const toggleModal = () => setModalShow(!modalShow);

  const handleLanguageUpdate = (newLanguage: Language[]) => {
    setLanguageList(newLanguage);
    updateLanguageList(newLanguage);
  };

  return (
    <div className="languages-container">
      <div className="background-container">
        <div className="small-square">
          <div className="small-square-inner"></div>
        </div>
        <div className="background"></div>
      </div>
      <div className="languages-content">
        <div className="languages-title">Language</div>
        {languageList.length > 0 ? (
          languageList
            .filter((language) => !language.is_delete)
            .map((language, index) => (
              <div key={index} className="language">
                <div className="language-text">
                  <strong>{language.language}</strong> :{" "}
                  {language.expertise_level}
                </div>
              </div>
            ))
        ) : (
          <div className="no-languages">No languages available</div>
        )}
    {  !disableUpdate &&     <button className="image-button" onClick={toggleModal}>
          <img src={img} alt="Button icon" className="button-image" />
        </button>}

        <CustomModal
          show={modalShow}
          toggle={toggleModal}
          ModalHeader="Add Language"
          size={"md"}
        >
          <AddLanguage
            languages={languages}
            onLanguageUpdate={handleLanguageUpdate}
          />
        </CustomModal>
      </div>
    </div>
  );
};
