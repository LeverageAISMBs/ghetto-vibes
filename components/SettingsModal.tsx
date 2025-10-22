
import React, { useState, useEffect } from 'react';
import { AppSettings, GeminiModel } from '../types';
import { DEFAULT_SYSTEM_PROMPT } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [currentSettings, setCurrentSettings] = useState(settings);

  useEffect(() => {
    setCurrentSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(currentSettings);
    onClose();
  };
  
  const handleResetPrompt = () => {
    setCurrentSettings(prev => ({...prev, systemPrompt: DEFAULT_SYSTEM_PROMPT}));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 flex flex-col max-h-[90vh]">
        <h2 className="text-2xl font-semibold mb-4 text-white">Settings</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-1">Model</label>
          <select
            value={currentSettings.model}
            onChange={(e) => setCurrentSettings(s => ({ ...s, model: e.target.value as GeminiModel }))}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"
          >
            {Object.values(GeminiModel).map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
        
        <div className="flex-grow flex flex-col mb-4">
          <div className="flex justify-between items-center mb-1">
             <label className="block text-sm font-medium text-gray-400">System Prompt</label>
             <button onClick={handleResetPrompt} className="text-xs text-cyan-400 hover:text-cyan-500">Reset to Default</button>
          </div>
          <textarea
            value={currentSettings.systemPrompt}
            onChange={(e) => setCurrentSettings(s => ({ ...s, systemPrompt: e.target.value }))}
            rows={15}
            className="w-full h-full bg-gray-900 border border-gray-600 text-white rounded-md p-2 font-mono text-sm resize-none focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
