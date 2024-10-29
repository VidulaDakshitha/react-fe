import React, { useCallback, useRef, useState } from 'react';
import "./VerifyFaceID.scss";
import img from './img.png';
import { BsX } from 'react-icons/bs';
import Button from "../../core/Button/Button";
import Webcam from "react-webcam";
import { updateSkillAPIAttributes } from "../../types/api_types";
import { UpdateSkillApi } from "../../services/skill.service";
import { toast } from "react-toastify";
import { ErrorNotification } from "../ErrorNotification/ErrorNotification";
import { updateUserDetailsApi } from "../../services/user.service";

interface VerifyFaceIDProps {
    toggleFIdModal: () => void;
}

export const VerifyFaceID: React.FC<VerifyFaceIDProps> = ({ toggleFIdModal }) => {

    const [cameraOpen, setCameraOpen] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const webcamRef = useRef<Webcam>(null);
    const [isLoading, setIsLoading] = useState(false);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setCapturedImage(imageSrc);
            setCameraOpen(false);
        }
    }, [webcamRef]);

    const handleRetry = () => {
        setCapturedImage(null);
        setCameraOpen(true);
    };

    const handleUserUpdate = async (value: boolean) => {
        const obj = {
            is_face_id_verified: value,
            is_face_id_proceed: true
        }
        const user_request: any = await updateUserDetailsApi(obj);
    };

    const handleSubmit = async () => {
        if (capturedImage) {
            setIsLoading(true);
            const payload = {
                user_id: 1,
                product_id: 1,
                image: capturedImage
            };

            try {
                const response = await fetch('https://api-prod-faceid.sparetan.com/api/v1/verify/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();
                localStorage.setItem("is_face_id_proceed", "1");
                if (response.status === 201) {
                    await handleUserUpdate(true)
                    toast.success("Face ID verified successfully");
                    toggleFIdModal();
                } else {
                    await handleUserUpdate(false)
                    toast.error(`Error: ${result.message || 'Verification failed'}`);
                }

            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
                ErrorNotification('Network or server error');
            }
            setIsLoading(false);
        }
    };


    return (
        <div className="fid-modal-content">
            <h2 className="fid-modal-title">Face ID Verification</h2>

            {!cameraOpen && !capturedImage && (<div>
                <div className="fid-face-image">
                    <img src={img} alt="Face ID placeholder" />
                </div>
                <div className="fid-instructions">
                    <p>Instructions:</p>
                    <ol>
                        <li>1. Position your face within the frame.</li>
                        <li>2. Ensure you are in a well-lit area.</li>
                        <li>3. Avoid wearing hats or sunglasses.</li>
                    </ol>
                </div>
                <Button
                    className="intro-button"
                    buttonText="Get started"
                    onClickHandler={() => setCameraOpen(true)}
                />
            </div>)}

            {cameraOpen && (
                <div className="fid-camera">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="fid-webcam"
                    />
                    <Button
                        className="intro-button"
                        buttonText="Capture"
                        onClickHandler={capture}
                    />
                </div>
            )}

            {capturedImage && (
                <div className="fid-captured-image-container">
                    <img src={capturedImage} alt="Captured Face ID" className="fid-captured-image" />
                    <div className="fid-buttons-row">
                        <Button
                            className="fid-retry-button"
                            buttonText="Retry"
                            onClickHandler={handleRetry}
                        />
                        <Button
                            className="intro-button"
                            buttonText="Submit"
                            onClickHandler={handleSubmit}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};