import { AICommand } from '../types';

export const parseAIResponse = (response: string): AICommand[] => {
    const commands: AICommand[] = [];
    
    // Regex to find <file path="...">...</file> tags
    const fileRegex = /<file\s+path="([^"]+)">([\s\S]*?)<\/file>/g;
    
    // Regex to find <chat>...</chat> tags
    const chatRegex = /<chat>([\s\S]*?)<\/chat>/g;

    let match;

    while ((match = fileRegex.exec(response)) !== null) {
        commands.push({
            type: 'file',
            path: match[1],
            content: match[2],
        });
    }

    while ((match = chatRegex.exec(response)) !== null) {
        commands.push({
            type: 'chat',
            content: match[1],
        });
    }

    // If no tags are found, assume the whole response is a chat message for backward compatibility.
    if (commands.length === 0 && response.trim().length > 0) {
        commands.push({
            type: 'chat',
            content: response,
        });
    }

    return commands;
};
