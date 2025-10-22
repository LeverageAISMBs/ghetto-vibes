import React, { useState } from 'react';

interface CodePanelProps {
  activeFileContent: string | null;
  onContentChange: (newContent: string) => void;
  previewHtml: string;
}

type Tab = 'editor' | 'preview';

const CodePanel: React.FC<CodePanelProps> = ({ activeFileContent, onContentChange, previewHtml }) => {
  const [activeTab, setActiveTab] = useState<Tab>('editor');

  const renderContent = () => {
    if (activeTab === 'preview') {
      return (
        <iframe
          srcDoc={previewHtml}
          title="Preview"
          className="w-full h-full bg-white"
          sandbox="allow-scripts allow-same-origin"
        />
      );
    }

    if (activeFileContent === null) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-800 text-gray-400">
          <p>Select a file to view or edit its content. Or view the live Preview.</p>
        </div>
      );
    }

    return (
       <textarea
        value={activeFileContent}
        onChange={(e) => onContentChange(e.target.value)}
        className="w-full h-full p-4 bg-transparent text-gray-200 font-mono resize-none focus:outline-none"
        placeholder="Code will appear here..."
        spellCheck="false"
      />
    );
  };
  
  return (
    <div className="h-full bg-gray-800 flex flex-col">
       <div className="flex border-b border-gray-700">
        <button 
          onClick={() => setActiveTab('editor')}
          className={`px-4 py-2 text-sm ${activeTab === 'editor' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}
        >
          Editor
        </button>
        <button 
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 text-sm ${activeTab === 'preview' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}
        >
          Preview
        </button>
      </div>
      <div className="flex-grow h-0">
         {renderContent()}
      </div>
    </div>
  );
};

export default CodePanel;
