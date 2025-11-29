import './ResumePage.css';
import { Document, Page, pdfjs } from 'react-pdf';
import { useState, useEffect, useRef } from 'react';
import { FaSearchPlus, FaSearchMinus, FaHandPaper } from 'react-icons/fa';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function ResumePage({ darkMode }: { darkMode: boolean }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(900);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panMode, setPanMode] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [scrollStart, setScrollStart] = useState<{ left: number; top: number }>({ left: 0, top: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const resumePath = `${import.meta.env.BASE_URL}resume.pdf`;
  
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  // Update page width based on screen size and available height
  useEffect(() => {
    function updatePageWidth() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const availableHeight = height - 160;
      const pdfAspectRatio = 8.5 / 11;
      const widthFromHeight = availableHeight * pdfAspectRatio;
      
      if (width < 768) {
        setPageWidth(Math.min(width * 0.9, widthFromHeight));
      } else if (width < 1200) {
        setPageWidth(Math.min(width * 0.7, widthFromHeight));
      } else {
        setPageWidth(Math.min(900, widthFromHeight));
      }
    }

    updatePageWidth();
    window.addEventListener('resize', updatePageWidth);
    return () => window.removeEventListener('resize', updatePageWidth);
  }, []);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const togglePanMode = () => {
    setPanMode(prev => !prev);
  };

  // Panning functionality - only works in pan mode
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only pan if in pan mode or if clicking on the container background (not text)
    if (!containerRef.current || !panMode) return;
    
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
    setScrollStart({
      left: containerRef.current.scrollLeft,
      top: containerRef.current.scrollTop
    });
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || !containerRef.current) return;
    
    const dx = e.clientX - panStart.x;
    const dy = e.clientY - panStart.y;
    
    containerRef.current.scrollLeft = scrollStart.left - dx;
    containerRef.current.scrollTop = scrollStart.top - dy;
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleMouseLeave = () => {
    setIsPanning(false);
  };

  // Touch support for mobile panning
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current || !panMode) return;
    const touch = e.touches[0];
    setIsPanning(true);
    setPanStart({ x: touch.clientX, y: touch.clientY });
    setScrollStart({
      left: containerRef.current.scrollLeft,
      top: containerRef.current.scrollTop
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPanning || !containerRef.current) return;
    
    const touch = e.touches[0];
    const dx = touch.clientX - panStart.x;
    const dy = touch.clientY - panStart.y;
    
    containerRef.current.scrollLeft = scrollStart.left - dx;
    containerRef.current.scrollTop = scrollStart.top - dy;
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
  };

  return (
    <div className={`resume-container ${darkMode ? 'dark' : ''}`}>
      <div className="resume-controls">  
        <button 
          onClick={handleZoomOut}
          className="resume-control-button"
          title="Zoom Out"
          disabled={zoomLevel <= 0.5}
        >
          <FaSearchMinus />
        </button>
        
        <button 
          onClick={handleResetZoom}
          className="resume-control-button zoom-level"
          title="Reset Zoom"
        >
          {Math.round(zoomLevel * 100)}%
        </button>
        
        <button 
          onClick={handleZoomIn}
          className="resume-control-button"
          title="Zoom In"
          disabled={zoomLevel >= 3}
        >
          <FaSearchPlus />
        </button>

        {zoomLevel > 1 && (
          <button
            onClick={togglePanMode}
            className={`resume-control-button pan-toggle ${panMode ? 'active' : ''}`}
            title={panMode ? "Pan Mode (Click to Select Text)" : "Select Text Mode (Click to Pan)"}
          >
            <FaHandPaper />
          </button>
        )}
      </div>

      {zoomLevel > 1 && (
        <div className="mode-indicator">
          {panMode ? "Pan Mode - Drag to move" : "Select Mode - Click text to select"}
        </div>
      )}

      <div 
        ref={containerRef}
        className={`resume-pdf-container ${darkMode ? 'dark' : ''} ${isPanning ? 'panning' : ''} ${panMode ? 'pan-mode' : 'select-mode'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
          cursor: panMode 
            ? (isPanning ? 'grabbing' : 'grab') 
            : 'text'
        }}
      >
        <Document
          file={resumePath}
          onLoadSuccess={onDocumentLoadSuccess}
          className="resume-document"
        >
          {Array.from(new Array(numPages), (_, index) => (
            <div key={`page_${index + 1}`} className="resume-page-wrapper">
              <Page 
                pageNumber={index + 1}
                width={pageWidth * zoomLevel}
                renderTextLayer={true}
                renderAnnotationLayer={false}
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}

export default ResumePage;