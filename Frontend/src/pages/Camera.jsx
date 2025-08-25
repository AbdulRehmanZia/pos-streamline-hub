import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library';

// Main App component
export default function App() {
  // State for the camera stream, captured image, and any errors
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  // New state for the barcode reader result
  const [barcodeResult, setBarcodeResult] = useState(null);

  // Refs for the video and canvas elements
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const codeReaderRef = useRef(null); // Ref to hold the ZXing code reader instance

  // Function to start the camera stream and barcode scanner
  const startCamera = useCallback(async () => {
    // Reset previous state
    setCapturedImage(null);
    setBarcodeResult(null);
    setError(null);

    // Check for mediaDevices support
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        // Request access to the user's camera
        const streamData = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' } // Prefer back-facing camera for scanning
        });
        setStream(streamData);
        setIsCameraOn(true);
        // Assign the stream to the video element's srcObject
        if (videoRef.current) {
          videoRef.current.srcObject = streamData;
        }
      } catch (err) {
        // Handle errors (e.g., user denies permission)
        console.error("Error accessing camera:", err);
        let errorMessage = "Could not access the camera. ";
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          errorMessage += "Please grant camera permission in your browser settings.";
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          errorMessage += "No camera found on this device.";
        } else {
          errorMessage += "An unexpected error occurred.";
        }
        setError(errorMessage);
        setIsCameraOn(false);
      }
    } else {
      setError("Your browser does not support camera access.");
      setIsCameraOn(false);
    }
  }, []);

  // Function to stop the camera stream
  const stopCamera = useCallback(() => {
    if (stream) {
      // Stop all tracks in the stream
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    // Clean up the code reader if it exists
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }
    setIsCameraOn(false);
  }, [stream]);


  // Effect to manage the barcode reader and video stream lifecycle
  useEffect(() => {
    if (isCameraOn && videoRef.current) {
      // Set up a hint to prefer QR Codes for faster detection
      const hints = new Map();
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.QR_CODE, BarcodeFormat.AZTEC, BarcodeFormat.DATA_MATRIX,
        BarcodeFormat.CODE_39, BarcodeFormat.CODE_93, BarcodeFormat.CODE_128,
        BarcodeFormat.EAN_8, BarcodeFormat.EAN_13, BarcodeFormat.UPC_A, BarcodeFormat.UPC_E,
        BarcodeFormat.ITF, BarcodeFormat.PDF_417, BarcodeFormat.RSS_14
      ]);
      
      // Create a new reader instance if one doesn't exist
      if (!codeReaderRef.current) {
        codeReaderRef.current = new BrowserMultiFormatReader(hints);
      }

      // Start decoding the video stream
      const decode = async () => {
        try {
          await codeReaderRef.current.decodeFromStream(stream, videoRef.current, (result, error) => {
            if (result) {
              setBarcodeResult(result.getText());
              stopCamera(); // Stop camera and scanner on success
            }
            // Error handling can be added here if needed, but the scanner
            // will just keep trying to find a code if it fails to decode.
          });
        } catch (err) {
          console.error('Barcode scanning error:', err);
          setError("Failed to initialize barcode scanner.");
          stopCamera();
        }
      };

      decode();
    }

    // Cleanup function to stop the camera and reader when component unmounts
    return () => {
      stopCamera();
    };
  }, [isCameraOn, videoRef, stream, stopCamera]);


  // Function to capture a photo from the video stream
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas dimensions to match the video feed
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current video frame onto the canvas
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      // Convert the canvas content to a data URL (JPEG format)
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageDataUrl);

      // Stop the camera after taking the photo
      stopCamera();
    }
  };

  // Function to retake the photo
  const retakePhoto = () => {
    startCamera();
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-cyan-400">React Scanner & Photo Booth</h1>

        {/* Error Message Display */}
        {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center">
            {/* Display captured image if available */}
            {capturedImage ? (
                <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            ) : (
                <>
                    {/* Display barcode result if available */}
                    {barcodeResult ? (
                      <div className="text-center p-4">
                        <h2 className="text-2xl font-semibold text-green-400">Barcode Scanned!</h2>
                        <p className="mt-2 text-xl break-words">{barcodeResult}</p>
                      </div>
                    ) : (
                      <>
                        {/* Video feed */}
                        <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${!isCameraOn && 'hidden'}`}></video>
                        {/* Placeholder when camera is off */}
                        {!isCameraOn && !error && (
                            <div className="text-gray-500 flex flex-col items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
                                <p className="mt-2">Camera is off</p>
                            </div>
                        )}
                      </>
                    )}
                </>
            )}
        </div>

        {/* Hidden canvas for capturing the image */}
        <canvas ref={canvasRef} className="hidden"></canvas>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!isCameraOn && !capturedImage && !barcodeResult && (
                <button onClick={startCamera} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                    Start Camera
                </button>
            )}

            {isCameraOn && (
                <>
                    <button onClick={takePhoto} className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
                        Take Photo
                    </button>
                    <button onClick={stopCamera} className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out">
                        Stop Camera
                    </button>
                </>
            )}

            {(capturedImage || barcodeResult) && (
                <button onClick={retakePhoto} className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                    Retake
                </button>
            )}
        </div>
      </div>
    </div>
  );
}
