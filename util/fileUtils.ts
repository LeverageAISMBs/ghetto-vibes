import { FileNode } from '../types';

const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const processUploadedFiles = async (files: FileList): Promise<FileNode[]> => {
  const fileNodes: FileNode[] = [];
  const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20MB
  let currentSize = 0;

  for (const file of Array.from(files)) {
    currentSize += file.size;
    if (currentSize > MAX_TOTAL_SIZE) {
        alert("Total file size exceeds 20MB. Some files were not uploaded.");
        break;
    }
    
    // webkitRelativePath is available for folder uploads
    const path = (file as any).webkitRelativePath || file.name;
    const pathParts = path.split('/').filter(p => p);
    
    let currentNode: { children?: FileNode[] } = { children: fileNodes };
    
    for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        const isLastPart = i === pathParts.length - 1;

        let childNode = currentNode.children?.find(node => node.name === part);

        if (!childNode) {
            if (isLastPart) {
                 const content = await readFileContent(file);
                 childNode = {
                    name: part,
                    path: path,
                    content: content,
                    type: 'file',
                };
            } else {
                 childNode = {
                    name: part,
                    path: pathParts.slice(0, i + 1).join('/'),
                    type: 'directory',
                    children: [],
                };
            }
            if (!currentNode.children) currentNode.children = [];
            currentNode.children.push(childNode);
            currentNode.children.sort((a, b) => {
              if (a.type === b.type) return a.name.localeCompare(b.name);
              return a.type === 'directory' ? -1 : 1;
            });

        }
        currentNode = childNode;
    }
  }

  return fileNodes;
};

export const updateOrCreateFile = (nodes: FileNode[], path: string, content: string): FileNode[] => {
    const pathParts = path.split('/');
    const fileName = pathParts.pop();

    if (!fileName) return nodes;

    let currentLevel = [...nodes];
    let parent: { children: FileNode[] } = { children: currentLevel };
    let currentPath = '';

    for (const part of pathParts) {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        let dirNode = parent.children.find(node => node.name === part && node.type === 'directory');
        if (!dirNode) {
            dirNode = {
                name: part,
                path: currentPath,
                type: 'directory',
                children: [],
            };
            parent.children.push(dirNode);
            // Sort to keep directories first
            parent.children.sort((a, b) => {
                if (a.type === 'directory' && b.type === 'file') return -1;
                if (a.type === 'file' && b.type === 'directory') return 1;
                return a.name.localeCompare(b.name);
            });
        }
        parent = dirNode as { children: FileNode[] }; // We know it's a directory
    }
    
    const existingFile = parent.children.find(node => node.name === fileName && node.type === 'file');
    if (existingFile) {
        existingFile.content = content;
    } else {
        parent.children.push({
            name: fileName,
            path: path,
            type: 'file',
            content: content,
        });
        parent.children.sort((a, b) => a.name.localeCompare(b.name));
    }

    return currentLevel;
};
