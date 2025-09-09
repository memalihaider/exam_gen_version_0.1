'use client';

import React, { useState, useEffect, useRef } from 'react';

// Define types for the different shapes to ensure type safety
interface BoxShape {
  type: 'box';
  x: number;
  y: number;
  width: number;
  height: number;
}

interface LineShape {
  type: 'line';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface CircleShape {
  type: 'circle';
  x: number;
  y: number;
  radius: number;
}

interface TriangleShape {
  type: 'triangle';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
}

// Create a union type for all possible shapes
type Shape = BoxShape | LineShape | CircleShape | TriangleShape;

// Define a type for the drawing mode state
type DrawingMode = 'none' | 'box' | 'line' | 'circle' | 'triangle';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('none');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [message, setMessage] = useState<string>('');
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // A custom message box to provide user feedback
  const showMessage = (text: string) => {
    setMessage(text);
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    messageTimeoutRef.current = setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  // Function to draw an individual shape on the canvas
  const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape) => {
    ctx.beginPath();
    ctx.lineWidth = 2;

    if (shape.type === 'box') {
      ctx.fillStyle = '#60a5fa'; // Blue
      ctx.strokeStyle = '#2563eb'; // Darker blue
      ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === 'line') {
      ctx.strokeStyle = '#f59e0b'; // Yellow
      ctx.lineWidth = 4;
      ctx.moveTo(shape.x1, shape.y1);
      ctx.lineTo(shape.x2, shape.y2);
      ctx.stroke();
    } else if (shape.type === 'circle') {
      ctx.fillStyle = '#10b981'; // Green
      ctx.strokeStyle = '#047857'; // Darker green
      ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    } else if (shape.type === 'triangle') {
      ctx.fillStyle = '#ef4444'; // Red
      ctx.strokeStyle = '#dc2626'; // Darker red
      ctx.moveTo(shape.x1, shape.y1);
      ctx.lineTo(shape.x2, shape.y2);
      ctx.lineTo(shape.x3, shape.y3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  };

  // Function to clear the canvas and redraw all stored shapes
  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(shape => drawShape(ctx, shape));
  };

  // Effect to manage canvas event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (drawingMode !== 'none') {
        setIsDrawing(true);
        setStartPoint({ x: e.offsetX, y: e.offsetY });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing) return;
      redraw();

      if (drawingMode === 'box') {
        const width = e.offsetX - startPoint.x;
        const height = e.offsetY - startPoint.y;
        ctx.fillStyle = 'rgba(96, 165, 250, 0.5)';
        ctx.fillRect(startPoint.x, startPoint.y, width, height);
      } else if (drawingMode === 'line') {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
      } else if (drawingMode === 'circle') {
        const radius = Math.sqrt(Math.pow(e.offsetX - startPoint.x, 2) + Math.pow(e.offsetY - startPoint.y, 2));
        ctx.fillStyle = 'rgba(16, 185, 129, 0.5)';
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
        ctx.fill();
      } else if (drawingMode === 'triangle') {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.lineTo(startPoint.x, e.offsetY);
        ctx.closePath();
        ctx.fill();
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDrawing) return;
      setIsDrawing(false);

      if (drawingMode === 'box') {
        const width = e.offsetX - startPoint.x;
        const height = e.offsetY - startPoint.y;
        if (Math.abs(width) > 5 && Math.abs(height) > 5) {
          setShapes(prevShapes => [
            ...prevShapes,
            { type: 'box', x: startPoint.x, y: startPoint.y, width, height }
          ]);
        }
      } else if (drawingMode === 'line') {
        setShapes(prevShapes => [
          ...prevShapes,
          { type: 'line', x1: startPoint.x, y1: startPoint.y, x2: e.offsetX, y2: e.offsetY }
        ]);
      } else if (drawingMode === 'circle') {
        const radius = Math.sqrt(Math.pow(e.offsetX - startPoint.x, 2) + Math.pow(e.offsetY - startPoint.y, 2));
        if (radius > 5) {
          setShapes(prevShapes => [
            ...prevShapes,
            { type: 'circle', x: startPoint.x, y: startPoint.y, radius }
          ]);
        }
      } else if (drawingMode === 'triangle') {
        setShapes(prevShapes => [
          ...prevShapes,
          { type: 'triangle', x1: startPoint.x, y1: startPoint.y, x2: e.offsetX, y2: e.offsetY, x3: startPoint.x, y3: e.offsetY }
        ]);
      }
      setDrawingMode('none');
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDrawing, drawingMode, startPoint]);

  useEffect(() => {
    redraw();
  }, [shapes]);

  useEffect(() => {
    const setCanvasSize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        redraw();
      }
    };
    window.addEventListener('resize', setCanvasSize);
    setCanvasSize();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  const handleClear = () => {
    if (shapes.length > 0) {
      setShapes([]);
      showMessage('Canvas cleared!');
    } else {
      showMessage('Canvas is already empty!');
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || shapes.length === 0) {
      showMessage('Nothing to download. Please draw a diagram first.');
      return;
    }
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'diagram.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 font-sans relative">
      <h1 className="text-4xl font-bold text-gray-800 my-6">Diagram Generator</h1>

      {message && (
        <div className="absolute top-4 w-full max-w-sm bg-gray-800 text-white text-center py-2 px-4 rounded-lg shadow-lg transition-opacity duration-300">
          {message}
        </div>
      )}

      <div className="w-full max-w-4xl h-[600px] border-2 border-gray-300 rounded-xl shadow-lg bg-white relative overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full"></canvas>

        {/* Floating Toolbar */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2 bg-white rounded-xl shadow-lg p-2">
          <button
            onClick={() => { setDrawingMode('box'); showMessage('Drawing mode: Box'); }}
            className={`p-3 rounded-lg transition-colors ${drawingMode === 'box' ? 'bg-blue-200 text-blue-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            aria-label="Draw Box"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" >
              <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
            </svg>
          </button>
          <button
            onClick={() => { setDrawingMode('line'); showMessage('Drawing mode: Line'); }}
            className={`p-3 rounded-lg transition-colors ${drawingMode === 'line' ? 'bg-yellow-200 text-yellow-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            aria-label="Draw Line"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16L16 4" />
            </svg>
          </button>
          <button
            onClick={() => { setDrawingMode('circle'); showMessage('Drawing mode: Circle'); }}
            className={`p-3 rounded-lg transition-colors ${drawingMode === 'circle' ? 'bg-green-200 text-green-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            aria-label="Draw Circle"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" >
              <circle cx="12" cy="12" r="10" />
            </svg>
          </button>
          <button
            onClick={() => { setDrawingMode('triangle'); showMessage('Drawing mode: Triangle'); }}
            className={`p-3 rounded-lg transition-colors ${drawingMode === 'triangle' ? 'bg-red-200 text-red-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            aria-label="Draw Triangle"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4.5l8.5 15H3.5L12 4.5z" />
            </svg>
          </button>
        </div>

        {/* Floating Actions */}
        <div className="absolute bottom-4 right-4 flex flex-row space-x-2 bg-white rounded-xl shadow-lg p-2">
          <button
            onClick={handleClear}
            className="p-3 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            aria-label="Clear Canvas"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.013 21H7.987a2 2 0 01-1.92-1.858L5 7m5 4v6m4-6v6m1-9H8m-3 0h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={handleDownload}
            className="p-3 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
            aria-label="Download as PNG"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}
