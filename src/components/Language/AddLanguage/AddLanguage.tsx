import "./AddLanguage.scss";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import {
  getAllLanguageApi,
  UpdateLanguageApi,
} from "../../../services/language.service";
import { ErrorNotification } from "../../ErrorNotification/ErrorNotification";
import close from "./close.png";
import add from "./add.png";
import {
  localeAttributes,
  updateLanguageAPIAttributes,
} from "../../../types/api_types";
import { toast } from "react-toastify";
import { BsPlusLg, BsX, BsXLg } from "react-icons/bs";

interface NewLanguage {
  id: number;
  language: string;
  symbol: string;
}

interface LanguageOption {
  value: number;
  label: string;
}

interface Language {
  id?: number | null;
  language: string | null;
  expertise_level: string | null;
  language_id: number | null;
  is_delete?: number | null;
}

interface AddLanguageProps {
  languages: Language[];
  onLanguageUpdate: (languages: Language[]) => void;
}

export const AddLanguage: React.FC<AddLanguageProps> = ({
  languages,
  onLanguageUpdate,
}) => {
  const [languageOptions, setLanguageOptions] = useState<LanguageOption[]>([]);
  const [languageList, setLanguageList] = useState<Language[]>(languages);
  const [loading, setLoading] = useState<boolean>(true);

  const defaultNewLanguage: Language = {
    id: null,
    language: null,
    expertise_level: null,
    language_id: null,
  };

  const [newLanguage, setNewLanguage] = useState<Language>(defaultNewLanguage);

  const proficiencyOptions = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  const getAllLanguages = async () => {
    try {
      const response = await getAllLanguageApi();
      if (response.status === 200) {
        const language_data = response.data.data;
        const formattedLanguages = language_data.map(
          (language: NewLanguage) => ({
            value: language.id,
            label: language.language,
          })
        );
        setLanguageOptions(formattedLanguages);
      } else {
        ErrorNotification(response.message);
      }
    } catch (error) {
      ErrorNotification("Failed to fetch languages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllLanguages();
  }, []);

  const handleAddLanguage = () => {
    if (
      newLanguage.language_id !== null &&
      newLanguage.expertise_level !== null
    ) {
      const existingLanguage = languageList.find(
        (lang) => lang.language_id === newLanguage.language_id
      );
      if (existingLanguage) {
        ErrorNotification("Language already exists.");
      } else {
        const newLanguageEntry: Language = {
          language:
            languageOptions.find(
              (option) => option.value === newLanguage.language_id
            )?.label || "",
          expertise_level: newLanguage.expertise_level,
          language_id: newLanguage.language_id,
        };
        setLanguageList([...languageList, newLanguageEntry]);
        setNewLanguage({ ...defaultNewLanguage }); // Reset form
      }
    } else {
      ErrorNotification("Please select both language and expertise level.");
    }
  };

  const removeLanguage = (id: number | null) => {
    if (id !== null) {
      const updatedLanguages = languageList.map((language) =>
        language.language_id === id ? { ...language, is_delete: 1 } : language
      );
      setLanguageList(updatedLanguages);
    }
  };

  const updateLanguage = (
    id: number | null,
    key: "language_id" | "expertise_level",
    value: any
  ) => {
    if (id !== null) {
      const existingLanguage = languageList.find(
        (lang) => lang.language_id === value
      );
      if (
        key === "language_id" &&
        existingLanguage &&
        existingLanguage.language_id !== id
      ) {
        ErrorNotification("Language already exists.");
        return;
      }
      const updatedLanguages = languageList.map((language) =>
        language.language_id === id ? { ...language, [key]: value } : language
      );
      setLanguageList(updatedLanguages);
    }
  };

  const onSave = () => {
    const saveLanguageList: localeAttributes[] = languageList.map(
      (language) => {
        const saveLanguage: localeAttributes = {
          language: language.language_id || 0,
          expertise_level: language.expertise_level || "",
          is_delete: language.is_delete || 0,
        };
        if (language.id !== null) {
          saveLanguage.id = language.id;
        }
        return saveLanguage;
      }
    );
    saveChanges({ locales: saveLanguageList });
  };


  const saveChanges = async (values: updateLanguageAPIAttributes) => {
    const language_request: any = await UpdateLanguageApi(values);
    if (language_request.status === 200) {
      toast.success("Languages updated successfully");
      localStorage.setItem(
        "has_languages",
        "1"
      );
    
      onLanguageUpdate(languageList);
    } else {
      ErrorNotification(language_request.message);
    }
  };

  return (
    <div>
      <div className="al-parent-container">
        <div className="al-language-list">
          <div className="al-container-background">
            <div className="al-container">
              <div className="al-box al-box1">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <Select
                    className="al-select"
                    options={proficiencyOptions}
                    placeholder="Proficiency"
                    value={
                      proficiencyOptions.find(
                        (option) => option.value === newLanguage.expertise_level
                      ) || null
                    }
                    isClearable
                    onChange={(selectedOption) =>
                      setNewLanguage({
                        ...newLanguage,
                        expertise_level: selectedOption?.value || null,
                      })
                    }
                  />
                )}
              </div>
              <div className="al-box al-box2">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <Select
                    className="al-select"
                    options={languageOptions}
                    placeholder="Language"
                    value={
                      languageOptions.find(
                        (option) => option.value === newLanguage.language_id
                      ) || null
                    }
                    isClearable
                    onChange={(selectedOption) =>
                      setNewLanguage({
                        ...newLanguage,
                        language_id: selectedOption?.value || null,
                      })
                    }
                  />
                )}
              </div>
              {/* <button className="al-rotated-box" onClick={handleAddLanguage}>
                <img
                  src={add}
                  alt="Add Language"
                  className="al-rotated-image"
                />
              </button> */}
              <div className="al-rotated-box" onClick={handleAddLanguage}>
                <BsPlusLg />
              </div>
            </div>
          </div>
        </div>

        <div className="al-language-list">
          {languageList
            .filter((language) => !language.is_delete)
            .map((language) => (
              <div
                className="al-container-background"
                key={language.language_id}
              >
                <div className="al-container">
                  <div className="al-box al-box1">
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <Select
                        className="al-select"
                        options={proficiencyOptions}
                        placeholder="Proficiency"
                        defaultValue={proficiencyOptions.find(
                          (option) => option.value === language.expertise_level
                        )}
                        onChange={(selectedOption) =>
                          updateLanguage(
                            language.language_id,
                            "expertise_level",
                            selectedOption?.value || null
                          )
                        }
                      />
                    )}
                  </div>
                  <div className="al-box al-box2">
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <Select
                        className="al-select"
                        options={languageOptions}
                        placeholder="Language"
                        defaultValue={languageOptions.find(
                          (option) => option.value === language.language_id
                        )}
                        onChange={(selectedOption) =>
                          updateLanguage(
                            language.language_id,
                            "language_id",
                            selectedOption?.value || null
                          )
                        }
                      />
                    )}
                  </div>
                  {/* <button
                    className="al-rotated-box"
                    onClick={() => removeLanguage(language.language_id)}
                  >
                    <img
                      src={close}
                      alt="Close Language"
                      className="al-rotated-image"
                    />
                  </button> */}
                  <div className="al-rotated-box d-flex align-items-center" onClick={() => removeLanguage(language.language_id)}>
                    <BsXLg />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="al-button-container">
        <button className="task-btn" onClick={onSave}>
          Save changes
          {/* <span className="al-button-text">Save changes</span> */}
        </button>
      </div>
    </div>
  );
};
