import React, { useState, useEffect } from "react";
import "./Skills.scss";
import img from "./img.png";
import { AddSkills } from "./AddSkillTask/AddSkills";
import CustomModal from "../Modal/Modal";

interface Skill {
  id: number;
  skill: string;
}

interface SkillsProps {
  skills: Skill[];
  updateSkillList: (skills: Skill[]) => void;
  disableUpdate?: boolean;
  isOrganizationSkills?: boolean;
}

export const Skills: React.FC<SkillsProps> = ({ skills, updateSkillList, disableUpdate, isOrganizationSkills }) => {
  const [modalShow, setModalShow] = useState(false);
  const [skillList, setSkillList] = useState<Skill[]>([]);

  useEffect(() => {
    if (skills) {
      setSkillList(skills);
    }
  }, [skills]);

  const toggleModal = () => setModalShow(!modalShow);

  const handleSkillUpdate = (newSkills: Skill[]) => {
    setSkillList(newSkills);
    updateSkillList(newSkills);
  };

  return (
    <div className="skills-container">
      <div className="background-container">
        <div className="small-square">
          <div className="small-square-inner"></div>
        </div>
        <div className="background"></div>
      </div>
      <div className="skills-content">
        <div className="skills-title">{isOrganizationSkills ? "Organization Proficiency" : "Skills"}</div>
        {skillList.length > 0 ? (
          skillList.map((skill, index) => (
            <div key={index} className="skill">
              <div className="skill-text">{skill.skill}</div>
            </div>
          ))
        ) : (
          <div className="no-skills">No skills available</div>
        )}
        {!disableUpdate && (
          <button className="image-button" onClick={toggleModal}>
            <img src={img} alt="Button icon" className="button-image" />
          </button>
        )}

        <CustomModal
          show={modalShow}
          toggle={toggleModal}
          ModalHeader={isOrganizationSkills ? "Add Organization Proficiency" : "Add Skills"}
          size={"md"}
        >
          <AddSkills skills={skillList} onSkillUpdate={handleSkillUpdate} isOrganizationSkills={isOrganizationSkills} />
        </CustomModal>
      </div>
    </div>
  );
};
