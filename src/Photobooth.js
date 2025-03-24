import React, { useRef, useState, useEffect } from 'react';
import socket from './WebSocket';

const Photobooth = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  
  useEffect(() => {
    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    };
    startCamera();
  }, []);

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photo = canvas.toDataURL('image/png');
    socket.emit('capturePhoto', photo);

    setPhotos((prev) => [...prev, photo]);
  };

  useEffect(() => {
    socket.on('photoCaptured', (photo) => {
      setPhotos((prev) => [...prev, photo]);
    });

    return () => {
      socket.off('photoCaptured');
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
      <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }} />
      <button onClick={capturePhoto}>Capture Photo</button>
      <div className="photo-strip">
        {photos.map((photo, index) => (
          <img key={index} src={photo} alt={`Photo ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default Photobooth;
