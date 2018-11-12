import React from "react";
import { Button, UncontrolledTooltip } from "reactstrap";
import ProjectCardModal from "./ProjectCardModal";
import { FaEye } from "react-icons/fa";

/**
 * View Project button with a tooltip - opens a modal with more information about the project
 */
export default ({ project, statusColors, onView, modal, className }) => (
  <Button
    id={"view-" + project.id}
    color="link"
    size="lg"
    style={{ color: "white" }}
    className="p-1 mt-0"
    onClick={onView}
  >
    <FaEye />
    <UncontrolledTooltip placement="top" target={"view-" + project.id}>
      View Project
    </UncontrolledTooltip>

    <ProjectCardModal
      project={project}
      statusColors={statusColors}
      modal={modal}
      className={className}
      onView={onView}
    />
  </Button>
);
