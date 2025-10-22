import React, { useState, useCallback, useEffect } from 'react';
import ChatPanel from './components/ChatPanel';
import CodePanel from './components/CodePanel';
import SettingsModal from './components/SettingsModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateResponse } from './services/geminiService';
import { processUploadedFiles, updateOrCreateFile } from './util/fileUtils';
import { parseAIResponse } from './util/responseParser';
import { AppSettings, ChatMessage, FileNode, KnowledgeDocument } from './types';
import { DEFAULT_SETTINGS, STARTER_TEMPLATE } from './constants';

const App: React.FC = () => {
  const [settings, setSettings] = useLocalStorage<AppSettings>('vibe-coder-settings', DEFAULT_SETTINGS);
  const [files, setFiles] = useLocalStorage<FileNode[]>('vibe-coder-files', []);
  const [activeFile, setActiveFile] = useLocalStorage<string | null>('vibe-coder-active-file', null);
  const [chatHistory, setChatHistory] = useLocalStorage<ChatMessage[]>('vibe-coder-chat-history', []);
  const [knowledgeBase, setKnowledgeBase] = useLocalStorage<KnowledgeDocument[]>('vibe-coder-knowledge-base', []);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');

  const findFileNode = (nodes: FileNode[], path: string): FileNode | null => {
    for (const node of nodes) {
      if (node.path === path) return node;
      if (node.children) {
        const found = findFileNode(node.children, path);
        if (found) return found;
      }
    }
    return null;
  };
  
  const generatePreview = useCallback(() => {
    const htmlFile = findFileNode(files, 'index.html');
    if (!htmlFile || typeof htmlFile.content !== 'string') {
        setPreviewHtml('<div style="color: grey; font-family: sans-serif; text-align: center; padding-top: 2rem;">No index.html file found in the project.</div>');
        return;
    }

    let processedHtml = htmlFile.content;
    
    // Basic injection for css and js - limitation: only handles simple cases.
    const cssRegex = /<link\s+.*?href=["'](.*?\.css)["'].*?>/g;
    processedHtml = processedHtml.replace(cssRegex, (match, href) => {
        const cssFile = findFileNode(files, href);
        if (cssFile && cssFile.content) {
            return `<style>${cssFile.content}</style>`;
        }
        return match; // Keep original if not found
    });

    const jsRegex = /<script\s+.*?src=["'](.*?\.js)["'].*?>\s*<\/script>/g;
    processedHtml = processedHtml.replace(jsRegex, (match, src) => {
        const jsFile = findFileNode(files, src);
        if (jsFile && jsFile.content) {
            return `<script>${jsFile.content}<\/script>`;
        }
        return match; // Keep original if not found
    });
    
    setPreviewHtml(processedHtml);

  }, [files]);
  
  useEffect(() => {
    generatePreview();
  }, [files, generatePreview]);

  const handleSendMessage = useCallback(async (message: string) => {
    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: message }];
    setChatHistory(newHistory);
    setIsLoading(true);

    try {
      const rawResponse = await generateResponse(message, newHistory, files, knowledgeBase, settings);
      const commands = parseAIResponse(rawResponse);
      
      let newFiles = files;
      let newChatMessages: ChatMessage[] = [];

      for (const command of commands) {
        if (command.type === 'file') {
          newFiles = updateOrCreateFile(newFiles, command.path, command.content);
        } else if (command.type === 'chat') {
          newChatMessages.push({ role: 'model', content: command.content });
        }
      }

      setFiles(newFiles);
      if(newChatMessages.length > 0) {
        setChatHistory(prev => [...prev, ...newChatMessages]);
      }
      
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setChatHistory(prev => [...prev, { role: 'model', content: `Error: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  }, [chatHistory, files, knowledgeBase, settings, setChatHistory, setFiles]);

  const handleFilesUpload = async (fileList: FileList) => {
    const newFileNodes = await processUploadedFiles(fileList);
    setFiles(newFileNodes);
    setChatHistory([]);
    setActiveFile(null);
  };
  
  const handleLoadTemplate = () => {
    setFiles(STARTER_TEMPLATE);
    setChatHistory([]);
    setActiveFile('index.html');
  }

  const handleFileContentChange = (newContent: string) => {
    if (activeFile) {
        setFiles(prevFiles => {
            const updateNodes = (nodes: FileNode[]): FileNode[] => {
                return nodes.map(node => {
                    if (node.path === activeFile) {
                        return { ...node, content: newContent };
                    }
                    if (node.children) {
                        return { ...node, children: updateNodes(node.children) };
                    }
                    return node;
                });
            };
            return updateNodes(prevFiles);
        });
    }
  };
  
  const handleAddToKnowledgeBase = (file: FileNode) => {
    if (!knowledgeBase.some(doc => doc.id === file.path)) {
      setKnowledgeBase(prev => [...prev, {
        id: file.path,
        name: file.name,
        content: file.content || '',
        createdAt: Date.now()
      }]);
    }
  };

  const activeFileNode = activeFile ? findFileNode(files, activeFile) : null;
  const activeFileContent = activeFileNode?.content ?? null;

  return (
    <div className="h-screen w-screen flex font-sans">
      <div className="w-1/3 max-w-md h-full">
        <ChatPanel
          chatHistory={chatHistory}
          files={files}
          knowledgeBase={knowledgeBase}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onFilesUpload={handleFilesUpload}
          onLoadTemplate={handleLoadTemplate}
          onFileSelect={setActiveFile}
          activeFile={activeFile}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onAddToKnowledgeBase={handleAddToKnowledgeBase}
          onClearKnowledgeBase={() => setKnowledgeBase([])}
        />
      </div>
      <div className="flex-1 h-full">
        <CodePanel
          activeFileContent={activeFileContent}
          onContentChange={handleFileContentChange}
          previewHtml={previewHtml}
        />
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={setSettings}
      />
    </div>
  );
};

export default App;
