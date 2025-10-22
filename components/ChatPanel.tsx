import React, { useRef, useEffect } from 'react';
import { ChatMessage, FileNode, KnowledgeDocument } from '../types';
import FileTree from './FileTree';
import Icon from './Icon';

interface ChatPanelProps {
  chatHistory: ChatMessage[];
  files: FileNode[];
  knowledgeBase: KnowledgeDocument[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onFilesUpload: (files: FileList) => void;
  onLoadTemplate: () => void;
  onFileSelect: (path: string) => void;
  activeFile: string | null;
  onOpenSettings: () => void;
  onAddToKnowledgeBase: (file: FileNode) => void;
  onClearKnowledgeBase: () => void;
}

const ICONS = {
    send: "M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z",
    settings: "M9.594 3.94c.09-.542.56-1.043 1.11-1.212l.668-.18a.75.75 0 01.42.023l.805.402a.75.75 0 00.672 0l.805-.402a.75.75 0 01.42-.023l.668.18c.55.169 1.02.67 1.11 1.212l.09.542a.75.75 0 00.672.646l.805.161a.75.75 0 01.357.26l.502.869a.75.75 0 00.357.534l.768.444a.75.75 0 010 .866l-.768.444a.75.75 0 00-.357.534l-.502.869a.75.75 0 01-.357.26l-.805.161a.75.75 0 00-.672.646l-.09.542a1.5 1.5 0 01-1.11 1.212l-.668.18a.75.75 0 01-.42.023l-.805-.402a.75.75 0 00-.672 0l-.805.402a.75.75 0 01-.42.023l-.668-.18a1.5 1.5 0 01-1.11-1.212l-.09-.542a.75.75 0 00-.672-.646l-.805-.161a.75.75 0 01-.357-.26l-.502-.869a.75.75 0 00-.357-.534l-.768-.444a.75.75 0 010-.866l.768.444a.75.75 0 00.357.534l.502-.869a.75.75 0 01.357.26l.805.161a.75.75 0 00.672.646l.09-.542zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z",
    upload: "M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V6.75a3 3 0 013-3h9a3 3 0 013 3v10.5a3 3 0 01-3 3h-9a3 3 0 01-3-3z",
    trash: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.548 0c-.265 0-.53.019-.79.053m0 0L3 7l1.75 14.5M21 7l-1.75 14.5M14.456 5.79l-1.242-3.138A2.25 2.25 0 0010.85 1.5H9.15a2.25 2.25 0 00-2.364 1.152L5.544 5.79m9.912 0a48.108 48.108 0 00-3.478-.397m-12.548 0c-.265 0-.53.019-.79.053m10.298 0a48.093 48.093 0 00-3.046-3.046c-.71-.71-1.682-1.12-2.7-1.12H9.652c-1.017 0-1.99.41-2.7 1.12-1.013 1.013-1.685 2.45-1.758 4.02",
    template: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
};

const ChatPanel: React.FC<ChatPanelProps> = (props) => {
  const { chatHistory, files, knowledgeBase, isLoading, onSendMessage, onFilesUpload, onLoadTemplate, onFileSelect, activeFile, onOpenSettings, onAddToKnowledgeBase, onClearKnowledgeBase } = props;
  const [prompt, setPrompt] = React.useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = () => {
    if (prompt.trim() && !isLoading) {
      onSendMessage(prompt);
      setPrompt('');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-800 h-full flex flex-col border-r border-gray-700">
      <div className="p-2 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Vibe Coder</h1>
        <div className="flex items-center space-x-1">
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={(e) => e.target.files && onFilesUpload(e.target.files)}
                multiple 
                // @ts-ignore
                webkitdirectory="true" 
            />
            <button onClick={handleUploadClick} title="Upload Folder" className="p-2 rounded-md hover:bg-gray-700">
                <Icon path={ICONS.upload} className="w-5 h-5" />
            </button>
            <button onClick={onLoadTemplate} title="Load Starter Template" className="p-2 rounded-md hover:bg-gray-700">
                <Icon path={ICONS.template} className="w-5 h-5" />
            </button>
            <button onClick={onOpenSettings} title="Settings" className="p-2 rounded-md hover:bg-gray-700">
                <Icon path={ICONS.settings} className="w-5 h-5" />
            </button>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        <div className="p-2 border-b border-gray-700">
          <h2 className="text-sm font-semibold text-gray-400 mb-2 px-2">Project Files</h2>
          {files.length > 0 ? (
            <FileTree files={files} activeFile={activeFile} onFileSelect={onFileSelect} onAddToKnowledgeBase={onAddToKnowledgeBase}/>
          ) : (
            <p className="text-xs text-gray-500 px-2">Upload a folder or load a template.</p>
          )}
        </div>
        
        <div className="p-2 border-b border-gray-700">
            <div className="flex justify-between items-center mb-2 px-2">
                <h2 className="text-sm font-semibold text-gray-400">Knowledge Base</h2>
                {knowledgeBase.length > 0 && <button onClick={onClearKnowledgeBase} title="Clear Knowledge Base" className="p-1 rounded-md hover:bg-gray-700">
                    <Icon path={ICONS.trash} className="w-4 h-4 text-red-400"/>
                </button>}
            </div>
            {knowledgeBase.length > 0 ? (
                <ul className="text-xs text-gray-400 space-y-1 px-2">
                {knowledgeBase.map(doc => (
                    <li key={doc.id} className="truncate" title={doc.name}>- {doc.name}</li>
                ))}
                </ul>
            ) : (
                <p className="text-xs text-gray-500 px-2">Add files to the knowledge base for context.</p>
            )}
        </div>

        <div className="p-4 space-y-4">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md rounded-lg p-3 ${msg.role === 'user' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-200'}`}>
                <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
                <div className="max-w-md rounded-lg p-3 bg-gray-700 text-gray-200">
                   <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
                   </div>
                </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask AI to code..."
            rows={Math.min(5, prompt.split('\n').length)}
            className="w-full bg-gray-700 text-gray-200 rounded-lg p-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-cyan-500 text-white hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <Icon path={ICONS.send} className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
