'use client';

import { useState } from 'react';
import { generateTripPDF, downloadPDF, previewPDF } from '@/lib/pdf-export';
import toast from 'react-hot-toast';
import { 
  DocumentArrowDownIcon, 
  EyeIcon, 
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

export default function PDFExportButton({ 
  tripData, 
  buttonText = "Export PDF", 
  variant = "primary",
  showPreview = true 
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleExport = async (action = 'download') => {
    if (!tripData) {
      toast.error('No trip data available for export');
      return;
    }

    setIsGenerating(true);
    setShowOptions(false);

    try {
      // Add loading toast
      const loadingToast = toast.loading('Generating PDF...');

      // Generate PDF
      const pdfBytes = await generateTripPDF(tripData);
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Perform the requested action
      if (action === 'download') {
        const filename = `${tripData.title || 'trip-itinerary'}.pdf`;
        downloadPDF(pdfBytes, filename);
        toast.success('PDF downloaded successfully!');
      } else if (action === 'preview') {
        previewPDF(pdfBytes);
        toast.success('PDF opened in new tab');
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const buttonClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    outline: "border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white bg-transparent"
  };

  const selectedClasses = buttonClasses[variant] || buttonClasses.primary;

  if (showPreview) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowOptions(!showOptions)}
          disabled={isGenerating}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${selectedClasses}`}
        >
          {isGenerating ? (
            <ArrowPathIcon className="h-4 w-4 animate-spin" />
          ) : (
            <DocumentArrowDownIcon className="h-4 w-4" />
          )}
          <span>{isGenerating ? 'Generating...' : buttonText}</span>
        </button>

        {/* Dropdown Options */}
        {showOptions && !isGenerating && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="py-1">
              <button
                onClick={() => handleExport('download')}
                className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
              >
                <DocumentArrowDownIcon className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => handleExport('preview')}
                className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
              >
                <EyeIcon className="h-4 w-4" />
                <span>Preview PDF</span>
              </button>
            </div>
          </div>
        )}

        {/* Overlay to close dropdown */}
        {showOptions && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowOptions(false)}
          />
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => handleExport('download')}
      disabled={isGenerating}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${selectedClasses}`}
    >
      {isGenerating ? (
        <ArrowPathIcon className="h-4 w-4 animate-spin" />
      ) : (
        <DocumentArrowDownIcon className="h-4 w-4" />
      )}
      <span>{isGenerating ? 'Generating...' : buttonText}</span>
    </button>
  );
}