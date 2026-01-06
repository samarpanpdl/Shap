import React, { useState } from 'react';
import { FaMagic, FaRegTimesCircle, FaCheckCircle, FaRobot } from 'react-icons/fa';

// --- Static Constants ---
const BRAND = "Brand";
const CATEGORY = "Category";
const SKIN_TYPE = "Skin Type";
const WARRANTY = "Warranty"; 
const ANALYSIS = "Skin AI"; 

const filterData = {
  [BRAND]: ["nivea", "loreal", "olay", "dove", "clinique", "himalaya", "bareanatomy", "cetaphil", "aveeno", "cerave"],
  [CATEGORY]: ["body", "lips", "face"],
  [SKIN_TYPE]: ["oily", "dry", "mixed", "sensitive", "normal"],
  [WARRANTY]: ["none", "seller", "brand"],
};

// --- Helper Component: CheckboxGroup ---
const CheckboxGroup = ({ title, options = [], selected = [], onChange }) => (
  <div className="flex flex-col space-y-1">
    <span className="font-bold text-base mb-2 text-gray-800">{title}</span>
    {options.map(option => (
      <div key={option} className="flex items-center hover:bg-rose-50 rounded px-1 transition-colors">
        <input 
          type='checkbox' 
          id={`${title}-${option}`}
          onChange={() => onChange(option)} 
          checked={selected?.includes(option)}
          className="mr-2 h-4 w-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500 cursor-pointer"
        />
        <label htmlFor={`${title}-${option}`} className="capitalize text-sm cursor-pointer py-1 flex-1 text-gray-600">
          {option}
        </label>
      </div>
    ))}
  </div>
);

// --- Main Component: FilterSidebar ---
const FilterSidebar = ({
  selectedCategories = [], handleCategoryChange,
  selectedSkinTypes = [], handleSkinTypeChange,
  selectedbrand = [], handleBrandChange,
  selectedWarranties = [], handleWarrantyChange,
  image, setImage, handleSkinAnalysis, // Changed to handleSkinAnalysis to match your Store function
  loadingAnalysis, analysisError, analysisResult
}) => {
  const [activeFilter, setActiveFilter] = useState(null); 
  const [dropdownPosition, setDropdownPosition] = useState({ left: 0, width: 0 });

  const toggleFilter = (filterName, event) => {
    if (activeFilter === filterName) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filterName);
      const buttonRect = event.currentTarget.getBoundingClientRect();
      const scrollContainer = event.currentTarget.parentNode;
      const containerLeft = scrollContainer.getBoundingClientRect().left;
      setDropdownPosition({
        left: buttonRect.left + buttonRect.width / 2 - containerLeft,
        width: 280 
      });
    }
  };

  // --- Reusable Skin Analysis View ---
  const SkinAnalysisSection = () => (
    <div className="flex flex-col space-y-3 p-1">
      <div className="flex items-center gap-2 text-rose-600 mb-1">
        <FaMagic />
        <span className="font-bold text-base">{ANALYSIS}</span>
      </div>
      <p className="text-[11px] text-gray-500 leading-tight">
        Upload a clear selfie for an AI-powered skin type analysis.
      </p>
      
      <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50 hover:bg-rose-50 transition-colors group">
        <input 
          type="file" accept="image/*"
          onChange={(e) => { e.target.files && e.target.files[0] && setImage(e.target.files[0]); }} 
          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
        />
        <div className="text-center">
          <FaRobot className="mx-auto text-gray-300 mb-2 group-hover:text-rose-300 transition-colors" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
            {image ? `File: ${image.name.substring(0, 10)}...` : "Select Photo"}
          </span>
        </div>
      </div>

      <button 
        onClick={handleSkinAnalysis} 
        disabled={loadingAnalysis || !image}
        className="w-full py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black disabled:bg-gray-200 transition-all text-sm shadow-sm flex items-center justify-center gap-2"
      >
        {loadingAnalysis ? (
          <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</>
        ) : 'Analyze Now'}
      </button>

      {/* --- Error & Result Display --- */}
      {analysisError && (
        <div className="text-red-500 text-[10px] mt-2 bg-red-50 p-2 rounded-lg border border-red-100 font-medium">
          ⚠️ {analysisError}
        </div>
      )}

      {analysisResult && (
        <div className="mt-3 p-3 bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2 mb-2 text-green-700">
            <FaCheckCircle className="text-xs" />
            <h4 className="font-bold text-[11px] uppercase tracking-wider">Analysis Complete</h4>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-600">Detected Skin Type:</p>
            <p className="text-sm font-extrabold text-gray-900 capitalize">
                {analysisResult.skin_type || "Normal"}
            </p>
            {analysisResult.recommendation && (
                <p className="text-[10px] text-gray-500 italic mt-1 leading-tight">
                    {analysisResult.recommendation}
                </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderFilterContent = (filter) => {
    switch (filter) {
      case BRAND: return <CheckboxGroup title={BRAND} options={filterData[BRAND]} selected={selectedbrand} onChange={handleBrandChange} />;
      case CATEGORY: return <CheckboxGroup title={CATEGORY} options={filterData[CATEGORY]} selected={selectedCategories} onChange={handleCategoryChange} />;
      case SKIN_TYPE: return <CheckboxGroup title={SKIN_TYPE} options={filterData[SKIN_TYPE]} selected={selectedSkinTypes} onChange={handleSkinTypeChange} />;
      case WARRANTY: return <CheckboxGroup title={WARRANTY} options={filterData[WARRANTY]} selected={selectedWarranties} onChange={handleWarrantyChange} />;
      case ANALYSIS: return <SkinAnalysisSection />;
      default: return null;
    }
  };

  return (
    <>
      {/* ----------------------------------------------------- */}
      {/* MOBILE FILTER BAR */}
      <div className="md:hidden sticky top-0 z-10 w-full bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="relative px-4">
          <div className="flex overflow-x-auto no-scrollbar py-3 space-x-2">
            {[BRAND, CATEGORY, SKIN_TYPE, WARRANTY, ANALYSIS].map(title => (
              <button
                key={title}
                onClick={(e) => toggleFilter(title, e)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-[11px] font-bold transition-all border ${
                  activeFilter === title 
                    ? 'bg-rose-500 text-white border-rose-500 shadow-md' 
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {title}
              </button>
            ))}
          </div>
          
          {activeFilter && (
            <div 
              className="absolute top-full mt-2 p-5 bg-white shadow-2xl rounded-3xl z-20 border border-gray-100 w-72"
              style={{ left: `${dropdownPosition.left}px`, transform: 'translateX(-50%)' }}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Filter By</span>
                <FaRegTimesCircle className="text-gray-300 cursor-pointer text-lg" onClick={() => setActiveFilter(null)} />
              </div>
              {renderFilterContent(activeFilter)}
            </div>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------- */}
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-100px)] sticky top-24 overflow-y-auto no-scrollbar pr-4 pb-10">
        <div className="flex flex-col space-y-6">
          
          {/* Analysis Section Card */}
          <div className="p-5 bg-gradient-to-br from-rose-50 to-white rounded-[2rem] border border-rose-100 shadow-sm">
            <SkinAnalysisSection />
          </div>

          <div className="p-5 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
            <CheckboxGroup title={CATEGORY} options={filterData[CATEGORY]} selected={selectedCategories} onChange={handleCategoryChange} />
          </div>

          <div className="p-5 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
            <CheckboxGroup title={BRAND} options={filterData[BRAND]} selected={selectedbrand} onChange={handleBrandChange} />
          </div>

          <div className="p-5 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
            <CheckboxGroup title={SKIN_TYPE} options={filterData[SKIN_TYPE]} selected={selectedSkinTypes} onChange={handleSkinTypeChange} />
          </div>

          <div className="p-5 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
            <CheckboxGroup title={WARRANTY} options={filterData[WARRANTY]} selected={selectedWarranties} onChange={handleWarrantyChange} />
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;