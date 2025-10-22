import { GoogleGenAI } from "@google/genai";
import { AppSettings, ChatMessage, FileNode, KnowledgeDocument } from '../types';

// This function constructs a single, comprehensive prompt for the AI
function buildPrompt(
    userPrompt: string,
    chatHistory: ChatMessage[],
    projectFiles: FileNode[],
    knowledgeBase: KnowledgeDocument[]
): string {
    let fullPrompt = `Here is the user's request:\n<user_request>\n${userPrompt}\n</user_request>\n\n`;

    if (chatHistory.length > 1) { // ignore initial user prompt
        fullPrompt += "Here is the recent chat history:\n<chat_history>\n";
        chatHistory.slice(0, -1).forEach(msg => {
            fullPrompt += `${msg.role}: ${msg.content}\n`;
        });
        fullPrompt += "</chat_history>\n\n";
    }

    if (projectFiles.length > 0) {
        fullPrompt += "Here are the current project files:\n<project_files>\n";
        const stringifyFiles = (nodes: FileNode[], indent = '') => {
            nodes.forEach(node => {
                if (node.type === 'file') {
                    fullPrompt += `${indent}--- File: ${node.path} ---\n${node.content}\n\n`;
                } else {
                    fullPrompt += `${indent}--- Directory: ${node.path} ---\n`;
                    if (node.children) {
                        stringifyFiles(node.children, indent + '  ');
                    }
                }
            });
        };
        stringifyFiles(projectFiles);
        fullPrompt += "</project_files>\n\n";
    }

    if (knowledgeBase.length > 0) {
        fullPrompt += "Here is the content from the knowledge base for context:\n<knowledge_base>\n";
        knowledgeBase.forEach(doc => {
            fullPrompt += `--- Document: ${doc.name} ---\n${doc.content}\n\n`;
        });
        fullPrompt += "</knowledge_base>\n\n";
    }

    fullPrompt += "Please provide your response based on the user's request and the provided context.";
    return fullPrompt;
}

export const generateResponse = async (
    userPrompt: string,
    chatHistory: ChatMessage[],
    projectFiles: FileNode[],
    knowledgeBase: KnowledgeDocument[],
    settings: AppSettings
): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const model = settings.model;

        const fullPrompt = buildPrompt(userPrompt, chatHistory, projectFiles, knowledgeBase);

        // FIX: The `contents` for a single-turn text prompt should be a string. The previous structure was for multi-turn chat.
        const response = await ai.models.generateContent({
            model: model,
            contents: fullPrompt,
            config: {
                systemInstruction: settings.systemPrompt,
            },
        });

        return response.text;
    } catch (error) {
        console.error("Error generating response from Gemini:", error);
        if (error instanceof Error) {
            return `Error: ${error.message}`;
        }
        return "An unknown error occurred while contacting the AI.";
    }
};