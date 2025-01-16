import "./AcceptTerms.scss";
import { useState } from "react";
import Button from "../../../../core/Button/Button";
import { UpdateTaskApi } from "../../../../services/task.service";
import { ErrorNotification } from "../../../../components/ErrorNotification/ErrorNotification";
import { toast } from "react-toastify";

interface AcceptTermsProps {
  exit_criteria: string;
  id: string;
  closeModal: () => void;
  recallData: () => void;
}

export const AcceptTerms = ({
  exit_criteria,
  id,
  closeModal,
  recallData,
}: AcceptTermsProps) => {
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    let values = {
      is_worker_accepted: 1,
    };
    const task_request: any = await UpdateTaskApi(values, parseInt(id));
    setIsLoading(false);
    if (task_request.status == 200) {
      toast.success("Task updated successfully");
      closeModal();
      recallData();
    } else {
      ErrorNotification(task_request.message);
    }
  };

  return (
    <div className="accept-terms-container">
      <div
        className="exit-criteria-content"
        dangerouslySetInnerHTML={{ __html: exit_criteria }}
      />

      <div className="terms-acceptance">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={isTermsAccepted}
            onChange={(e) => setIsTermsAccepted(e.target.checked)}
          />
          <span className="checkbox-text">
            I have read and accept the exit criteria terms and conditions
          </span>
        </label>
      </div>

      <div className="submit-section">
        <Button
          buttonText="Accept Terms"
          className="task-btn"
          isDisabled={!isTermsAccepted || isLoading}
          onClickHandler={handleSubmit}
          type="button"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
