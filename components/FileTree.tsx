
import React from 'react';
import { FileNode } from '../types';
import Icon from './Icon';

interface FileTreeProps {
  files: FileNode[];
  activeFile: string | null;
  onFileSelect: (path: string) => void;
  onAddToKnowledgeBase: (file: FileNode) => void;
}

const ICONS = {
  folder: "M13 4H7a2 2 0 00-2 2v10h12V8a2 2 0 00-2-2h-2.586l-2-2z",
  file: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  knowledge: "M12 6.25278C12 6.25278 10.8239 4 8.5 4C5.67614 4 4 6.67614 4 8.5C4 12.25 8.5 16 8.5 16C8.5 16 13 12.25 13 8.5C13 6.67614 11.3239 4 9.5 4C8.17614 4 7 5.17614 7 6.25278"
};

const FileNodeItem: React.FC<{ 
  node: FileNode; 
  level: number;
  activeFile: string | null;
  onFileSelect: (path: string) => void;
  onAddToKnowledgeBase: (file: FileNode) => void;
}> = ({ node, level, activeFile, onFileSelect, onAddToKnowledgeBase }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const isSelected = node.path === activeFile;

  const handleSelect = () => {
    if (node.type === 'file') {
      onFileSelect(node.path);
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div>
      <div 
        className={`flex items-center p-1 rounded-md cursor-pointer group ${isSelected ? 'bg-cyan-500/20' : 'hover:bg-gray-700'}`}
        style={{ paddingLeft: `${level * 1.5}rem` }}
        onClick={handleSelect}
      >
        <Icon path={node.type === 'directory' ? ICONS.folder : ICONS.file} className="w-5 h-5 mr-2 flex-shrink-0" />
        <span className="truncate flex-grow">{node.name}</span>
        {node.type === 'file' && (
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToKnowledgeBase(node); }} 
            className="ml-auto p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-600 transition-opacity"
            title="Add to Knowledge Base"
          >
            <Icon path={ICONS.knowledge} className="w-4 h-4 text-cyan-400" />
          </button>
        )}
      </div>
      {node.type === 'directory' && isOpen && node.children && (
        <div>
          {node.children.map(child => (
            <FileNodeItem 
              key={child.path} 
              node={child} 
              level={level + 1}
              activeFile={activeFile}
              onFileSelect={onFileSelect}
              onAddToKnowledgeBase={onAddToKnowledgeBase}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileTree: React.FC<FileTreeProps> = ({ files, activeFile, onFileSelect, onAddToKnowledgeBase }) => {
  return (
    <div className="p-2 space-y-1">
      {files.map(node => (
        <FileNodeItem 
          key={node.path} 
          node={node} 
          level={0}
          activeFile={activeFile}
          onFileSelect={onFileSelect}
          onAddToKnowledgeBase={onAddToKnowledgeBase}
        />
      ))}
    </div>
  );
};

export default FileTree;
