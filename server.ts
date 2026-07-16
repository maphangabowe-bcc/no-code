import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Gemini client server-side only
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Endpoint: Generate mobile-optimized web application code
  app.post("/api/generate-html", async (req, res) => {
    try {
      const { prompt, templateType } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      if (!ai) {
        return res.status(503).json({ 
          error: "Gemini API key is not configured. Please set your GEMINI_API_KEY in the Secrets panel." 
        });
      }

      const systemInstruction = `You are an expert mobile frontend developer and UI/UX designer. 
Your task is to write a single-file, self-contained, fully interactive mobile web application using HTML, modern CSS, and vanilla JavaScript.

Design Principles:
1. Native Feel: Make the app feel like a native iOS/Android app. Use mobile layouts, proper padding, modern typography (sans-serif), high-contrast rounded buttons, swipeable lists or tabs if appropriate, and beautiful status/nav bars.
2. Responsiveness: The app should render flawlessly in any standard mobile viewport. Keep all key components compact, thumb-friendly (min 44px touch targets), and with smooth scrolling.
3. High Fidelity Interaction: Include realistic mock state management. For example, if it's a shop, let users add items to a cart, see the total update, and click 'Checkout' to show a beautiful receipt dialog. If it's a fitness log, let them log runs, show animated list additions, and update mock totals.
4. Tailwind CSS: Use Tailwind CSS via CDN (<script src="https://cdn.tailwindcss.com"></script>) for rich, modern styles. Include nice animations (e.g. Tailwind transitions, pulses, or fade-ins).
5. Icons: Use Lucide Icons CDN (<script src="https://unpkg.com/lucide@latest"></script>) or FontAwesome for elegant graphic indicators.
6. Do NOT wrap your output in markdown code blocks like \`\`\`html. Output the raw, executable HTML string ONLY, starting with <!DOCTYPE html>.`;

      const userPrompt = `Create a mobile web application for this concept: "${prompt}". 
${templateType ? `Category: "${templateType}"` : ""}
Ensure it has a high level of interactive fidelity (e.g., clickable tabs, functional interactive state, search/filter inputs, dynamic modal popups, and nice animations). Make it fully complete and polished, with no placeholders or truncated code.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      let htmlCode = response.text || "";
      
      // Clean up potential markdown code block artifacts
      htmlCode = htmlCode.trim();
      if (htmlCode.startsWith("```html")) {
        htmlCode = htmlCode.substring(7);
      } else if (htmlCode.startsWith("```")) {
        htmlCode = htmlCode.substring(3);
      }
      if (htmlCode.endsWith("```")) {
        htmlCode = htmlCode.substring(0, htmlCode.length - 3);
      }
      htmlCode = htmlCode.trim();

      res.json({ html: htmlCode });
    } catch (error: any) {
      console.error("Error generating HTML app:", error);
      res.status(500).json({ error: error?.message || "Failed to compile AI-generated application." });
    }
  });

  // Vite middleware setup for development, or static serving in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Server startup crash:", err);
});
