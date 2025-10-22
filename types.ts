// Represents a single file or folder in the project structure
export interface FileNode {
  name: string;
  path: string;
  content?: string; // Content for files
  children?: FileNode[]; // Sub-nodes for directories
  type: 'file' | 'directory';
}

// Represents a single message in the chat history
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

// Represents different LLM providers
export enum LLMProvider {
  Gemini = 'Gemini',
  // Future-proofing for other providers
  // OpenAI = 'OpenAI',
  // Anthropic = 'Anthropic',
}

// Represents available Gemini models
export enum GeminiModel {
  Flash = 'gemini-2.5-flash',
  Pro = 'gemini-2.5-pro',
}

// Represents all application settings
export interface AppSettings {
  provider: LLMProvider;
  model: GeminiModel;
  systemPrompt: string;
}

// For knowledge base documents
export interface KnowledgeDocument {
  id: string;
  name: string;
  content: string;
  createdAt: number;
}

// Represents the parsed commands from the AI's response
export type AICommand = FileCommand | ChatCommand;

export interface FileCommand {
    type: 'file';
    path: string;
    content: string;
}

export interface ChatCommand {
    type: 'chat';
    content: string;
}
