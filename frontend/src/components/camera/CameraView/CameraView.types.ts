export interface CameraViewProps {
  onCapture?: (imageSrc: string) => void;
  onVideoCapture?: (videoBlob: Blob) => void;
  onError?: (error: string) => void;
  className?: string;
  showControls?: boolean;
  autoStart?: boolean;
}

export interface CameraFilter {
  id: string;
  name: string;
  preview: string;
  effect: string;
}

export interface CameraState {
  isRecording: boolean;
  recordingDuration: number;
  flashEnabled: boolean;
  timerEnabled: boolean;
  timerDuration: number;
  zoomLevel: number;
  activeFilter: string | null;
}