"use client";

// Add useEffect import
import { useState, useEffect } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useRouter } from 'next/navigation';
import { useUser } from "@/contexts/UserContext"; // Add this import

export default function DefaultPaperSettings() {
  const layoutOptions = Array.from({ length: 32 }, (_, i) => `Layout ${i + 1}`);

  // Update the font arrays with proper font objects
  const headerFontStyles = [
    { name: "Default", family: "system-ui" },
    { name: "Arial", family: "Arial, sans-serif" },
    { name: "Algerian", family: "Algerian, serif" },
    { name: "Times New Roman", family: "'Times New Roman', serif" },
    { name: "Verdana", family: "Verdana, sans-serif" },
    { name: "Stencil", family: "Stencil, fantasy" },
    { name: "Old English", family: "'Old English Text MT', fantasy" },
    { name: "Cooper Black", family: "'Cooper Black', fantasy" },
    { name: "Brush Script", family: "'Brush Script MT', cursive" },
    { name: "Calibri", family: "Calibri, sans-serif" },
    { name: "Georgia", family: "Georgia, serif" },
    {
      name: "Jameel Noori Nastaleeq",
      family: "'Jameel Noori Nastaleeq', serif",
    },
  ];

  const englishFontStyles = [
    { name: "Default", family: "system-ui" },
    { name: "Arial", family: "Arial, sans-serif" },
    { name: "Cambria", family: "Cambria, serif" },
    { name: "Calibri", family: "Calibri, sans-serif" },
    { name: "Century Schoolbook", family: "'Century Schoolbook', serif" },
    { name: "Comic Sans MS", family: "'Comic Sans MS', cursive" },
    { name: "Georgia", family: "Georgia, serif" },
    { name: "Helvetica", family: "Helvetica, sans-serif" },
    { name: "Times New Roman", family: "'Times New Roman', serif" },
    { name: "Trebuchet MS", family: "'Trebuchet MS', sans-serif" },
    { name: "Verdana", family: "Verdana, sans-serif" },
  ];

  const urduFontStyles = [
    { name: "Default", family: "system-ui" },
    {
      name: "Jameel Noori Nastaleeq",
      family: "'Jameel Noori Nastaleeq', serif",
    },
    { name: "Noto Nastaliq Urdu", family: "'Noto Nastaliq Urdu', serif" },
    { name: "Noto Kufi Arabic", family: "'Noto Kufi Arabic', sans-serif" },
    { name: "Noto Naskh Arabic", family: "'Noto Naskh Arabic', serif" },
  ];

  const textFormats = ["Normal", "Bold", "Italic", "Small Caps"];
  const fontColors = [
    "Black",
    "Green",
    "Khaki",
    "Slate Grey",
    "Blue",
    "Orange",
    "Red",
    "Brown",
  ];
  const watermarkTypes = [
    "Text Watermark",
    "Picture Watermark",
    "No Watermark",
  ];
  const opacityOptions = [
    "0.1",
    "0.2",
    "0.3",
    "0.4",
    "0.5",
    "0.6",
    "0.7",
    "0.8",
    "0.9",
    "1",
  ];

  // Add headingFontStyles array
  const headingFontStyles = [
    { name: "Default", family: "system-ui" },
    { name: "Arial", family: "Arial, sans-serif" },
    { name: "Times New Roman", family: "'Times New Roman', serif" },
    { name: "Helvetica", family: "Helvetica, sans-serif" },
    { name: "Georgia", family: "Georgia, serif" },
    { name: "Calibri", family: "Calibri, sans-serif" },
    { name: "Verdana", family: "Verdana, sans-serif" },
  ];

  // Update the settings state to include headingFontStyle
  const [settings, setSettings] = useState({
    paperHeaderLayout: "Layout 1", // Modified default
    headerFontSize: "18",
    headerFontStyle: "Default",
    textFontSize: "12",
    textFormatting: "Normal",
    paperFontColor: "Black",
    headingFontSize: "15",
    watermark: "Picture Watermark",
    pinWatermarkOpacity: "0.1",
    logoHeight: "150", // Updated default value
    logoWidth: "150", // Updated default value
    englishTextFontStyle: "Default",
    urduTextFontStyle: "Default",
    pinWatermarkHeight: "90",
    pinWatermarkWidth: "110",
    lineHeight: "1.5",
    importantNote: "",
    footerText: "",
    showConceptualMark: true,
    showPhotoNumber: false,
    showQuestionBorder: true,
    showChapterName: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add save handler
  const handleSaveSettings = () => {
    // Save to localStorage
    localStorage.setItem("paperDefaultSettings", JSON.stringify(settings));

    // Show success notification
    alert("Settings saved successfully!");
  };

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("paperDefaultSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);


  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/login'); // Changed from router.push to router.replace
    }
  }, []);  // Changed dependency array to only run once on mount

  if (!user) {
    return null;  // Return null immediately if no user
  }



  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        {/* Enhanced Header Section */}
        <div className="mb-16 text-center space-y-4">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x">
            Default Paper Settings
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Customize your paper's appearance and layout settings to create
            professional and consistent documents.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm mt-4">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 font-medium">
              Default Paper Settings
            </span>
          </div>
        </div>

        {/* Enhanced Instructions */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-xl shadow-sm">
            <p className="text-blue-700 flex items-center gap-3 text-lg">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Configure your paper's appearance, including text formatting,
              layout, and visual elements.
            </p>
          </div>
        </div>

        {/* Enhanced Settings Form */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300">
            {/* Text Types Section */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                Text Types Configuration
              </h3>

              {/* Keep the three text type sections */}
              <div className="bg-slate-50 p-6 rounded-lg mb-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Paper Header</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Header Font Style:</label>
                    <select name="headerFontStyle" value={settings.headerFontStyle} onChange={handleChange} 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                      {headerFontStyles.map((font) => (
                        <option key={font.name} value={font.name} style={{ fontFamily: font.family }}>{font.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Header Font Size:</label>
                    <input type="number" name="headerFontSize" value={settings.headerFontSize} onChange={handleChange} 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
                  </div>
                </div>
              </div>

              {/* Section Headings (Choose the correct option, etc.) */}
              <div className="bg-slate-50 p-6 rounded-lg mb-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Section Headings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heading Font Style:</label>
                    <select name="headingFontStyle" value={settings.headingFontStyle} onChange={handleChange} 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                      {headingFontStyles.map((font) => (
                        <option key={font.name} value={font.name} style={{ fontFamily: font.family }}>{font.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heading Font Size:</label>
                    <input type="number" name="headingFontSize" value={settings.headingFontSize} onChange={handleChange} 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
                  </div>
                </div>
              </div>

              {/* Question Text */}
              <div className="bg-slate-50 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Question Text</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Text Font Style:</label>
                    <select name="englishTextFontStyle" value={settings.englishTextFontStyle} onChange={handleChange} 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                      {englishFontStyles.map((font) => (
                        <option key={font.name} value={font.name} style={{ fontFamily: font.family }}>{font.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Text Font Size:</label>
                    <input type="number" name="textFontSize" value={settings.textFontSize} onChange={handleChange} 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Remove the duplicate Font Sizes Section */}
            {/* Start Layout Settings directly after Text Types */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                Layout Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paper Header Layout:</label>
                  <select name="paperHeaderLayout" value={settings.paperHeaderLayout} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                    {layoutOptions.map((layout) => (
                      <option key={layout} value={layout}>{layout}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Line Height:</label>
                  <input type="number" name="lineHeight" value={settings.lineHeight} onChange={handleChange} step="0.1" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paper Font Color:</label>
                  <select name="paperFontColor" value={settings.paperFontColor} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                    {fontColors.map((color) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Rest of your existing sections (Additional Settings, Checkboxes, etc.) */}
            <div className="mt-12 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Important Note:
                  </label>
                  <textarea
                    name="importantNote"
                    value={settings.importantNote}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-white"
                    placeholder="e.g. For your 1st Term/Annual/Final exam..."
                  />
                </div>

                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Footer Text:
                  </label>
                  <textarea
                    name="footerText"
                    value={settings.footerText}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-white"
                    placeholder="Enter your Institution Name"
                  />
                </div>
              </div>

              {/* Checkboxes Section */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-800 mb-8 flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Additional Options
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="showConceptualMark"
                      checked={settings.showConceptualMark}
                      onChange={handleChange}
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700">
                      Show Conceptual Question's Mark with Every Question
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="showPhotoNumber"
                      checked={settings.showPhotoNumber}
                      onChange={handleChange}
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700">
                      Hide Photo Number on Paper
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="showQuestionBorder"
                      checked={settings.showQuestionBorder}
                      onChange={handleChange}
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700">
                      Question Heading Bottom Border
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="showChapterName"
                      checked={settings.showChapterName}
                      onChange={handleChange}
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700">
                      Show Chapter Name With Every Question
                    </span>
                  </label>
                </div>
              </div>

              {/* Update Button */}
              <div className="flex justify-end pt-6">
                <button
                  onClick={handleSaveSettings}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 flex items-center gap-3 font-medium"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}