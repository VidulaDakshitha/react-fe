import React from "react";
import { Modal, Button } from "react-bootstrap";
import { ModalProps } from "../../types/types";
import "./Modal.scss";
function CustomModal({ show, toggle, children, ModalHeader,size }: ModalProps) {
  return (
    <Modal
      show={show}
      onHide={toggle}
      backdrop="static"
      keyboard={false}
      size={size?size:"xl"}
    >
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">{ModalHeader}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
}

export default CustomModal;
