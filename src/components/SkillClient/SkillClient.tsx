import { useEffect, useState } from "react";
import "./SkillClient.scss";
import { getAllSkillApi } from "../../services/skill.service";
import { ErrorNotification } from "../ErrorNotification/ErrorNotification";
import { BsX } from "react-icons/bs";
import img from "../../assets/search.png";

interface Skill {
  id: number;
  skill: string;
}

interface AddSkillsProps {
  skills: Skill[];
  onSkillUpdate: (skills: Skill[]) => void;
  close: () => void;
}

export const SkillClient: React.FC<AddSkillsProps> = ({
  skills,
  onSkillUpdate,
  close,
}) => {
  const [skillList, setSkillList] = useState<Skill[]>(skills);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [newSkillList, setNewSkillList] = useState<Skill[]>([]);

  const getAllSkills = async (keyword: string) => {
    const skills: any = await getAllSkillApi(keyword);
    if (skills.status === 200) {
      setNewSkillList(skills.data.data);
    } else {
      ErrorNotification(skills.message);
    }
  };

  useEffect(() => {
    if (searchKeyword) {
      getAllSkills(searchKeyword);
    } else {
      setNewSkillList([]);
    }
  }, [searchKeyword]);

  const addSkill = (skill: Skill) => {
    if (!skillList.find((s) => s.id === skill.id)) {
      const updatedSkills = [...skillList, skill];
      setSkillList(updatedSkills);
      onSkillUpdate(updatedSkills);
    }
    setSearchKeyword("");
    setNewSkillList([]);
  };

  const removeSkill = (id: number) => {
    const updatedSkills = skillList.filter((skill) => skill.id !== id);
    setSkillList(updatedSkills);
  };

  const onSave = () => {
    const skillIds = skillList.map((skill) => skill.id);
    const data = {
      required_skills: skillIds,
    };
  };

  return (
    <div className="add-skills-container">
      <div className="search-bar-container">
        <div className="search-bar-inner">
          <div className="input-box">
            <img className="search-icon" src={img} alt="Search icon" />
            <input
              className="search-input"
              type="text"
              placeholder="Search your skills"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            {newSkillList.length > 0 && (
              <ul className="dropdown-menu-bs show">
                {newSkillList.map((skill) => (
                  <li
                    key={skill.id}
                    className="dropdown-item"
                    onClick={() => addSkill(skill)}
                  >
                    {skill.skill}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="sc-skills-container">
        {skillList.map((skill) => (
          <div key={skill.id} className="sc-button-container">
            <div className="sc-button-background d-flex justify-content-between align-items-center ps-2 pe-2">
              <div className="sc-button-text">{skill.skill}</div>
              <div onClick={() => removeSkill(skill.id)}>
                <BsX />
              </div>
              {/* <div className="sc-button-content">
              <div className="sc-button-text">{skill.skill}</div>
              <button
                className="sc-button-icon"
                onClick={() => removeSkill(skill.id)}
              >
                
              </button>
            </div> */}
            </div>
          </div>
        ))}
      </div>
      <div className="button-container">
        <button className="task-btn" onClick={close}>
          <span>Save changes</span>
        </button>
      </div>
    </div>
  );
};
