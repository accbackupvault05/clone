import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CameraView } from '../components/camera/CameraView';

const CameraPage: React.FC = () => {
  const navigate = useNavigate();

  const handlePhotoCapture = useCallback((imageSrc: string) => {
    // TODO: Navigate to snap editor with captured image
    console.log('Photo captured:', imageSrc);
    // navigate('/snap/edit', { state: { imageSrc, type: 'photo' } });
  }, []);

  const handleVideoCapture = useCallback((videoBlob: Blob) => {
    // TODO: Navigate to snap editor with captured video
    console.log('Video captured:', videoBlob);
    // navigate('/snap/edit', { state: { videoBlob, type: 'video' } });
  }, []);

  const handleError = useCallback((error: string) => {
    console.error('Camera error:', error);
    // TODO: Show error toast or modal
  }, []);

  return (
    <CameraView
      onCapture={handlePhotoCapture}
      onVideoCapture={handleVideoCapture}
      onError={handleError}
      showControls={true}
      autoStart={true}
    />
  );
};

export default CameraPage;