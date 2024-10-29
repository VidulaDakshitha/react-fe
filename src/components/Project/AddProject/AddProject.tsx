import React, { useState } from "react";
import "./AddProject.scss";
import { ErrorNotification } from "../../ErrorNotification/ErrorNotification";
import {
  projectAttributes,
  updateProjectAPIAttributes,
} from "../../../types/api_types";
import { toast } from "react-toastify";
import { UpdateProjectApi } from "../../../services/project.service";
import { BsPlusLg, BsXLg } from "react-icons/bs";

interface Project {
  id?: number | null;
  title: string;
  description: string | null;
  from_date: string | null;
  to_date: string | null;
  is_delete?: number | null;
  is_new?: boolean | null;
}

interface AddProjectsProps {
  projects: Project[];
  onProjectUpdate: (projects: Project[]) => void;
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

export const AddProject: React.FC<AddProjectsProps> = ({
  projects,
  onProjectUpdate,
}) => {
  const [projectList, setProjectList] = useState<Project[]>(projects);
  const [newProject, setNewProject] = useState<Project>({
    id: projectList.length + 1,
    title: "",
    description: "",
    from_date: "",
    to_date: "",
    is_delete: 0,
    is_new: true,
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedProjects = [...projectList];
    if (field === "from_date" || field === "to_date") {
      updatedProjects[index] = {
        ...updatedProjects[index],
        [field]: formatDateForOutput(value),
      };
    } else {
      updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    }
    setProjectList(updatedProjects);
  };

  const handleNewInputChange = (field: string, value: string) => {
    if (field === "from_date" || field === "to_date") {
      setNewProject({ ...newProject, [field]: formatDateForOutput(value) });
    } else {
      setNewProject({ ...newProject, [field]: value });
    }
  };

  const validateNewProject = (): boolean => {
    if (
      !newProject.title ||
      !newProject.description ||
      !newProject.from_date ||
      !newProject.to_date
    ) {
      ErrorNotification("All fields must be filled.");
      return false;
    }
    setError(null);
    return true;
  };

  const addNewProject = () => {
    if (validateNewProject()) {
      setProjectList([...projectList, newProject]);
      setNewProject({
        id: projectList.length + 2,
        title: "",
        description: "",
        from_date: "",
        to_date: "",
        is_delete: 0,
        is_new: true,
      });
    }
  };

  const removeProject = (id: number | null) => {
    if (id !== null) {
      const updatedProjects = projectList.map((project) =>
        project?.id === id ? { ...project, is_delete: 1 } : project
      );
      setProjectList(updatedProjects);
    }
  };

  const onSave = () => {
    const saveProjectList: projectAttributes[] = projectList.map((project) => {
      const saveProject: projectAttributes = {
        title: project.title,
        description: project.description || "",
        from_date: project.from_date || "",
        to_date: project.to_date || "",
        is_delete: project.is_delete || 0,
      };
      if (
        project.is_new !== true &&
        project.id !== undefined &&
        project.id !== null
      ) {
        saveProject.id = project.id;
      }
      return saveProject;
    });
    saveChanges({ projects: saveProjectList });
  };

  const saveChanges = async (values: updateProjectAPIAttributes) => {
    const project_request: any = await UpdateProjectApi(values);
    if (project_request.status === 200) {
      toast.success("Projects updated successfully");
      onProjectUpdate(projectList);
    } else {
      ErrorNotification(project_request.message);
    }
  };

  return (
    <div>
      <div className="sc-container">
        <div className="sc-innerContainer">
          <div className="sc-row">
            <div className="sc-column">
              <div className="sc-label">Title</div>
              <input
                type="text"
                className="sc-input sc-input-light"
                placeholder={"Title"}
                value={newProject.title || ""}
                onChange={(e) => handleNewInputChange("title", e.target.value)}
              />
            </div>
            <div className="sc-column">
              <div className="sc-label">Description</div>
              <input
                type="text"
                className="sc-input"
                placeholder={"Description"}
                value={newProject.description || ""}
                onChange={(e) =>
                  handleNewInputChange("description", e.target.value)
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
                value={formatDateForInput(newProject.from_date)}
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
                value={formatDateForInput(newProject.to_date)}
                onChange={(e) =>
                  handleNewInputChange("to_date", e.target.value)
                }
              />
            </div>
          </div>
          {/* <button className="sc-add-button" onClick={addNewProject}></button> */}
          <div className="sc-add-button" onClick={addNewProject}>
            {" "}
            <BsPlusLg />
          </div>
        </div>
      </div>
      {projectList
        .filter((project) => !project.is_delete)
        .map((project, index) => (
          <div key={index} className="sc-container">
            {/* <button
                        className="sc-close-button"
                        onClick={() => removeProject(project.id || null)}
                    /> */}
            <div
              className="sc-close-button"
              onClick={() => removeProject(project.id || null)}
            >
              {" "}
              <BsXLg />
            </div>
            <div className="sc-innerContainer">
              <div className="sc-row">
                <div className="sc-column">
                  <div className="sc-label">Title</div>
                  <input
                    type="text"
                    className="sc-input sc-input-light"
                    value={project.title || ""}
                    onChange={(e) =>
                      handleInputChange(index, "title", e.target.value)
                    }
                  />
                </div>
                <div className="sc-column">
                  <div className="sc-label">Description</div>
                  <input
                    type="text"
                    className="sc-input"
                    value={project.description || ""}
                    onChange={(e) =>
                      handleInputChange(index, "description", e.target.value)
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
                    value={formatDateForInput(project.from_date)}
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
                    value={formatDateForInput(project.to_date)}
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
        <button className="save-button" onClick={onSave}>
          <span className="button-text">Save changes</span>
        </button>
      </div>
    </div>
  );
};
