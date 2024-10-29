import React, { useState, useEffect } from "react";
import "./Project.scss";
import img from "./img.png";
import CustomModal from "../Modal/Modal";
import { AddProject } from "./AddProject/AddProject";

interface Project {
  id?: number | null;
  title: string;
  description: string | null;
  from_date: string | null;
  to_date: string | null;
  is_delete?: number | null;
}

interface ProjectsProps {
  projects: Project[];
  updateProjectList: (projects: Project[]) => void;
  disableUpdate?:boolean;
}

export const Project: React.FC<ProjectsProps> = ({
  projects,
  updateProjectList,
  disableUpdate
}) => {
  const [modalShow, setModalShow] = useState(false);
  const [projectList, setProjectList] = useState<Project[]>([]);

  useEffect(() => {
    if (projects) {
      setProjectList(projects);
    }
  }, [projects]);

  const toggleModal = () => setModalShow(!modalShow);

  const handleProjectUpdate = (newProjects: Project[]) => {
    setProjectList(newProjects);
    updateProjectList(newProjects);
  };

  return (
    <div className="projects-container">
      <div className="projects-content">
        <div className="projects-title">Projects</div>
        {projectList.length > 0 ? (
          projectList
            .filter((project) => !project.is_delete)
            .map((project, index) => (
              <React.Fragment key={index}>
                <div className="sc-project-item">
                  <div className="sc-project-title">{project.title}</div>
                  <div className="sc-project-duration">
                    {`${project.from_date} - ${project.to_date}`}
                  </div>
                  <div className="sc-project-description">
                    {project.description}
                  </div>
                </div>
                <hr />
              </React.Fragment>
            ))
        ) : (
          <div className="no-projects">No projects available</div>
        )}
{ !disableUpdate &&       <button className="image-button" onClick={toggleModal}>
          <img src={img} alt="Button icon" className="button-image" />
        </button>}

        <CustomModal
          show={modalShow}
          toggle={toggleModal}
          ModalHeader="Add Project"
          size={"lg"}
        >
          <AddProject
            projects={projectList}
            onProjectUpdate={handleProjectUpdate}
          />
        </CustomModal>
      </div>
    </div>
  );
};
