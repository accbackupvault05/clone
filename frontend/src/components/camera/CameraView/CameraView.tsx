import React, { useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useCamera } from '../../../hooks/useCamera';
import { Button } from '../../common/Button';
import { CameraViewProps, CameraState } from './CameraView.types';
import {
  CameraContainer,
  CameraViewport,
  WebcamWrapper,
  CameraOverlay,
  TopControls,
  BottomControls,
  ControlButton,
  CaptureButtonContainer,
  MainCaptureButton,
  FilterCarouselContainer,
  RecordingTimer,
  ErrorMessage,
  LoadingSpinner,
  PermissionPrompt,
} from './CameraView.styles';

// Icons (you can replace with react-icons)
const FlashIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 2v11h3v9l7-12h-4l4-8z" />
  </svg>
);

const SwitchCameraIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3z" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

const TimerIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
  </svg>
);

/**
 * CameraView component with full-featured camera controls
 * Supports photo/video capture, filters, and responsive design
 */
export const CameraView: React.FC<CameraViewProps> = ({
  onCapture,
  onVideoCapture,
  onError,
  className,
  showControls = true,
  autoStart = true,
}) => {
  const {
    webcamRef,
    isReady,
    isCapturing,
    error,
    settings,
    capabilities,
    capturePhoto,
    startVideoRecording,
    stopVideoRecording,
    switchCamera,
    requestPermissions,
  } = useCamera();

  const [cameraState, setCameraState] = useState<CameraState>({
    isRecording: false,
    recordingDuration: 0,
    flashEnabled: false,
    timerEnabled: false,
    timerDuration: 3,
    zoomLevel: 1,
    activeFilter: null,
  });

  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);

  // Format recording duration
  const formatDuration = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Handle photo capture
  const handlePhotoCapture = useCallback(async () => {
    try {
      const imageSrc = await capturePhoto();
      if (imageSrc && onCapture) {
        onCapture(imageSrc);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to capture photo';
      if (onError) {
        onError(errorMessage);
      }
    }
  }, [capturePhoto, onCapture, onError]);

  // Handle video recording toggle
  const handleVideoToggle = useCallback(async () => {
    if (cameraState.isRecording) {
      // Stop recording
      try {
        const videoBlob = await stopVideoRecording();
        if (videoBlob && onVideoCapture) {
          onVideoCapture(videoBlob);
        }
        
        if (recordingInterval) {
          clearInterval(recordingInterval);
          setRecordingInterval(null);
        }
        
        setCameraState(prev => ({
          ...prev,
          isRecording: false,
          recordingDuration: 0,
        }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to stop recording';
        if (onError) {
          onError(errorMessage);
        }
      }
    } else {
      // Start recording
      try {
        await startVideoRecording();
        
        const interval = setInterval(() => {
          setCameraState(prev => ({
            ...prev,
            recordingDuration: prev.recordingDuration + 1,
          }));
        }, 1000);
        
        setRecordingInterval(interval);
        setCameraState(prev => ({ ...prev, isRecording: true }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to start recording';
        if (onError) {
          onError(errorMessage);
        }
      }
    }
  }, [
    cameraState.isRecording,
    stopVideoRecording,
    startVideoRecording,
    onVideoCapture,
    onError,
    recordingInterval,
  ]);

  // Handle main capture button (photo or video)
  const handleMainCapture = useCallback(() => {
    if (cameraState.isRecording) {
      handleVideoToggle();
    } else {
      handlePhotoCapture();
    }
  }, [cameraState.isRecording, handleVideoToggle, handlePhotoCapture]);

  // Toggle flash
  const toggleFlash = useCallback(() => {
    setCameraState(prev => ({ ...prev, flashEnabled: !prev.flashEnabled }));
  }, []);

  // Toggle timer
  const toggleTimer = useCallback(() => {
    setCameraState(prev => ({ ...prev, timerEnabled: !prev.timerEnabled }));
  }, []);

  // Handle camera switch
  const handleSwitchCamera = useCallback(() => {
    if (capabilities.hasMultipleCameras) {
      switchCamera();
    }
  }, [capabilities.hasMultipleCameras, switchCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
    };
  }, [recordingInterval]);

  // Video constraints for webcam
  const videoConstraints = {
    facingMode: settings.facingMode,
    width: { ideal: settings.width },
    height: { ideal: settings.height },
  };

  // Render permission prompt
  if (!isReady && !error) {
    return (
      <CameraContainer className={className}>
        <PermissionPrompt>
          <h3>Camera Access Required</h3>
          <p>Please allow camera access to take photos and videos.</p>
          <Button onClick={requestPermissions} variant="primary">
            Enable Camera
          </Button>
        </PermissionPrompt>
      </CameraContainer>
    );
  }

  // Render error state
  if (error) {
    return (
      <CameraContainer className={className}>
        <ErrorMessage>
          <h3>Camera Error</h3>
          <p>{error}</p>
          <Button onClick={requestPermissions} variant="primary" size="small">
            Retry
          </Button>
        </ErrorMessage>
      </CameraContainer>
    );
  }

  return (
    <CameraContainer className={className}>
      <CameraViewport>
        <WebcamWrapper $isRecording={cameraState.isRecording}>
          <Webcam
            ref={webcamRef}
            audio={settings.audio}
            videoConstraints={videoConstraints}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.8}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          
          {!isReady && <LoadingSpinner />}
        </WebcamWrapper>

        <CameraOverlay>
          {cameraState.isRecording && (
            <RecordingTimer>
              {formatDuration(cameraState.recordingDuration)}
            </RecordingTimer>
          )}
        </CameraOverlay>

        {showControls && (
          <>
            <TopControls>
              <ControlButton onClick={toggleFlash} $variant={cameraState.flashEnabled ? 'primary' : 'secondary'}>
                <FlashIcon />
              </ControlButton>
              
              <ControlButton onClick={toggleTimer} $variant={cameraState.timerEnabled ? 'primary' : 'secondary'}>
                <TimerIcon />
              </ControlButton>
              
              <ControlButton onClick={() => window.history.back()}>
                <CloseIcon />
              </ControlButton>
            </TopControls>

            <BottomControls>
              <FilterCarouselContainer>
                {/* Filter carousel will be implemented separately */}
              </FilterCarouselContainer>
              
              <CaptureButtonContainer>
                {capabilities.hasMultipleCameras && (
                  <ControlButton onClick={handleSwitchCamera}>
                    <SwitchCameraIcon />
                  </ControlButton>
                )}
                
                <MainCaptureButton
                  $isRecording={cameraState.isRecording}
                  onClick={handleMainCapture}
                  disabled={isCapturing}
                />
                
                <ControlButton
                  onMouseDown={handleVideoToggle}
                  onTouchStart={handleVideoToggle}
                  $variant="danger"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                  </svg>
                </ControlButton>
              </CaptureButtonContainer>
            </BottomControls>
          </>
        )}
      </CameraViewport>
    </CameraContainer>
  );
};

export default CameraView;