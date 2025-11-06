import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';

export interface CameraSettings {
  facingMode: 'user' | 'environment';
  width: number;
  height: number;
  audio: boolean;
}

export interface CameraCapabilities {
  hasMultipleCameras: boolean;
  supportsFacingMode: boolean;
  supportsFlash: boolean;
  supportsZoom: boolean;
}

export interface UseCameraReturn {
  webcamRef: React.RefObject<Webcam>;
  isReady: boolean;
  isCapturing: boolean;
  error: string | null;
  settings: CameraSettings;
  capabilities: CameraCapabilities;
  capturePhoto: () => Promise<string | null>;
  startVideoRecording: () => Promise<void>;
  stopVideoRecording: () => Promise<Blob | null>;
  switchCamera: () => void;
  updateSettings: (newSettings: Partial<CameraSettings>) => void;
  requestPermissions: () => Promise<boolean>;
}

const DEFAULT_SETTINGS: CameraSettings = {
  facingMode: 'user',
  width: 1920,
  height: 1080,
  audio: true,
};

export const useCamera = (): UseCameraReturn => {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  
  const [isReady, setIsReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<CameraSettings>(DEFAULT_SETTINGS);
  const [capabilities, setCapabilities] = useState<CameraCapabilities>({
    hasMultipleCameras: false,
    supportsFacingMode: false,
    supportsFlash: false,
    supportsZoom: false,
  });

  // Check device capabilities
  const checkCapabilities = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      setCapabilities({
        hasMultipleCameras: videoDevices.length > 1,
        supportsFacingMode: videoDevices.some(device => 
          device.label.toLowerCase().includes('front') || 
          device.label.toLowerCase().includes('back')
        ),
        supportsFlash: 'torch' in navigator.mediaDevices.getSupportedConstraints(),
        supportsZoom: 'zoom' in navigator.mediaDevices.getSupportedConstraints(),
      });
    } catch (err) {
      console.error('Error checking camera capabilities:', err);
    }
  }, []);

  // Request camera permissions
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: settings.facingMode,
          width: { ideal: settings.width },
          height: { ideal: settings.height },
        },
        audio: settings.audio,
      });
      
      // Stop the stream immediately as we just wanted to check permissions
      stream.getTracks().forEach(track => track.stop());
      
      setIsReady(true);
      await checkCapabilities();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Camera access denied';
      setError(errorMessage);
      setIsReady(false);
      return false;
    }
  }, [settings, checkCapabilities]);

  // Capture photo
  const capturePhoto = useCallback(async (): Promise<string | null> => {
    try {
      if (!webcamRef.current) {
        throw new Error('Camera not ready');
      }

      setIsCapturing(true);
      const imageSrc = webcamRef.current.getScreenshot({
        width: settings.width,
        height: settings.height,
      });
      
      if (!imageSrc) {
        throw new Error('Failed to capture photo');
      }

      return imageSrc;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to capture photo';
      setError(errorMessage);
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, [settings]);

  // Start video recording
  const startVideoRecording = useCallback(async (): Promise<void> => {
    try {
      if (!webcamRef.current?.stream) {
        throw new Error('Camera stream not available');
      }

      recordedChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(webcamRef.current.stream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsCapturing(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start recording';
      setError(errorMessage);
    }
  }, []);

  // Stop video recording
  const stopVideoRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: 'video/webm',
        });
        setIsCapturing(false);
        resolve(blob);
      };

      mediaRecorderRef.current.stop();
    });
  }, []);

  // Switch camera (front/back)
  const switchCamera = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      facingMode: prev.facingMode === 'user' ? 'environment' : 'user',
    }));
  }, []);

  // Update camera settings
  const updateSettings = useCallback((newSettings: Partial<CameraSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Initialize camera on mount
  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);

  // Handle webcam ready state
  const handleWebcamReady = useCallback(() => {
    setIsReady(true);
    setError(null);
  }, []);

  // Handle webcam errors
  const handleWebcamError = useCallback((error: string | DOMException) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    setError(errorMessage);
    setIsReady(false);
  }, []);

  return {
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
    updateSettings,
    requestPermissions,
  };
};