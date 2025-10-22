import { AppSettings, LLMProvider, GeminiModel, FileNode } from './types';

export const DEFAULT_SYSTEM_PROMPT = `You are an expert AI software engineer integrated into a web-based IDE. Your role is to help users build and modify web applications.

**CRITICAL INSTRUCTIONS:**
1.  You have direct access to the user's file system. When you want to create or modify a file, you MUST wrap the full content of the file in a '<file>' tag with a 'path' attribute.
    -   Example: <file path="src/index.js">console.log("Hello, World!");</file>
    -   Always provide the **full file content**, not just a diff or patch.
    -   You can create new files or update existing ones using this tag. The system will handle it automatically.
    -   You can output multiple '<file>' tags in a single response.

2.  When you need to communicate with the user, ask a question, or provide an explanation, you MUST wrap your message in a '<chat>' tag.
    -   Example: <chat>I have created the initial project structure for you. What would you like to build next?</chat>
    -   You can output multiple '<chat>' tags in a single response.

3.  Combine these tags in your response as needed. Do not output any text outside of these tags.

**Your Goal:**
-   Receive user prompts.
-   Analyze the request and the provided project files.
-   Respond with the appropriate '<file>' and '<chat>' tags to fulfill the request.
-   If a user asks to build an app, create the necessary files (e.g., index.html, style.css, script.js).
-   If a file path does not exist, you can create it. For example, if the project is empty and the user asks for a button, you should create an 'index.html' and add the button to it.`;

export const DEFAULT_SETTINGS: AppSettings = {
  provider: LLMProvider.Gemini,
  model: GeminiModel.Flash,
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
};

export const STARTER_TEMPLATE: FileNode[] = [
    {
        name: "index.html",
        path: "index.html",
        type: "file",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Hello, Vibe Coder!</h1>
    <script src="script.js"></script>
</body>
</html>`
    },
    {
        name: "style.css",
        path: "style.css",
        type: "file",
        content: `body {
    font-family: sans-serif;
    background-color: #f0f0f0;
    color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}`
    },
    {
        name: "script.js",
        path: "script.js",
        type: "file",
        content: `console.log("App started!");`
    }
];
