import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON with generous limit for base64 image data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Fallback intelligent metadata generator if API key is not yet set
function generateFallbackMetadata(options: {
  filename: string;
  platform: string;
  minTitleWords: number;
  maxTitleWords: number;
  minKeywords: number;
  maxKeywords: number;
  minDescWords: number;
  maxDescWords: number;
  singleWordKeywords: boolean;
  whiteBackground: boolean;
  transparentBackground: boolean;
  silhouette: boolean;
  customPrompt?: string;
  prohibitedWords?: string[];
}) {
  const cleanName = options.filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim() || "Stock creative asset";

  const capitalizedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

  // Generate title targeting desired word count
  const titleWordsPool = [
    capitalizedName,
    "concept",
    "featuring",
    "modern",
    "design",
    "elements",
    "with",
    "professional",
    "creative",
    "composition",
    "and",
    "copy",
    "space",
    "for",
    "commercial",
    "editorial",
    "advertising",
    "project",
    "background"
  ];
  
  const targetTitleLength = Math.max(options.minTitleWords, Math.min(options.maxTitleWords, 10));
  const title = titleWordsPool.slice(0, targetTitleLength).join(" ");

  // Generate description targeting desired word count
  const descWordsPool = [
    "High", "quality", "commercial", "asset", "of", cleanName.toLowerCase(),
    "suitable", "for", "marketing", "banners", "print", "and", "digital",
    "creative", "campaigns", "with", "detailed", "textures", "lighting", "and",
    "clean", "aesthetic", "appeal"
  ];
  const targetDescLength = Math.max(options.minDescWords, Math.min(options.maxDescWords, 15));
  const description = descWordsPool.slice(0, targetDescLength).join(" ") + ".";

  // Base stock keyword taxonomy
  const basePool = [
    "background", "design", "concept", "isolated", "graphic", "illustration",
    "modern", "creative", "commercial", "stock", "element", "art", "clean",
    "digital", "symbol", "vector", "abstract", "icon", "sign", "template",
    "business", "technology", "pattern", "decorative", "visual", "minimal",
    "professional", "style", "presentation", "banner", "web", "layout",
    "nature", "color", "texture", "fresh", "space", "render", "3d", "light",
    "bright", "object", "detail", "collection", "set", "media", "craft", "unique"
  ];

  if (options.whiteBackground) {
    basePool.unshift("isolated", "white", "cutout", "copyspace", "blank");
  }
  if (options.transparentBackground) {
    basePool.unshift("transparent", "isolated", "png", "alpha", "cutout");
  }
  if (options.silhouette) {
    basePool.unshift("silhouette", "shadow", "outline", "shape", "dark");
  }

  // Name specific keywords
  const nameTokens = cleanName.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const combined = Array.from(new Set([...nameTokens, ...basePool]));

  // Filter prohibited words
  const prohibitedSet = new Set((options.prohibitedWords || []).map(w => w.toLowerCase().trim()));
  let filtered = combined.filter(kw => !prohibitedSet.has(kw.toLowerCase()));

  if (options.singleWordKeywords) {
    filtered = filtered.map(kw => kw.split(/\s+/)[0]).filter(Boolean);
  }

  const targetCount = Math.max(options.minKeywords, Math.min(options.maxKeywords, 30));
  const selectedKeywords = Array.from(new Set(filtered)).slice(0, targetCount);

  // PNG Platform specific segmentation
  const mainKeywords = selectedKeywords.slice(0, 3);
  const secondaryKeywords = selectedKeywords.slice(3, 23);
  const promptKeywords = description; // Short min description for image creation

  const categoryMap: { [key: string]: { c1: string; c2: string } } = {
    background: { c1: "BACKGROUND", c2: "Texture" },
    technology: { c1: "ELEMENTS", c2: "Technology" },
    coffee: { c1: "ELEMENTS", c2: "Food & Drink" },
    workspace: { c1: "BACKGROUND", c2: "Business" },
  };

  const matchedCat = Object.keys(categoryMap).find(k => cleanName.toLowerCase().includes(k));
  const category1 = matchedCat ? categoryMap[matchedCat].c1 : "BACKGROUND";
  const category2 = matchedCat ? categoryMap[matchedCat].c2 : "Abstract";

  const uploadId = Math.floor(10000000 + Math.random() * 90000000).toString();

  return {
    title,
    description,
    keywords: selectedKeywords,
    category: `${category1} - ${category2}`,
    source: "fallback",
    pngData: {
      category1,
      category2,
      mainKeywords,
      secondaryKeywords,
      promptKeywords,
      aiPlatformName: "Midjourney",
      aiPlatformUrl: "https://www.midjourney.com",
      uploadId,
    },
  };
}

// API endpoint to generate metadata
app.post("/api/generate-metadata", async (req, res) => {
  try {
    const {
      imageData, // base64 string or null
      mimeType = "image/jpeg",
      filename = "asset.jpg",
      platform = "Adobe Stock",
      minTitleWords = 7,
      maxTitleWords = 15,
      minKeywords = 25,
      maxKeywords = 35,
      minDescWords = 10,
      maxDescWords = 20,
      singleWordKeywords = false,
      whiteBackground = false,
      transparentBackground = false,
      silhouette = false,
      customPrompt = "",
      prohibitedWords = [],
      customApiKey = "",
      customModel = "gemini-3.8-flash"
    } = req.body;

    const authHeader = req.headers.authorization;
    const bearerKey = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const effectiveApiKey = (customApiKey || bearerKey || "").trim();

    let ai = null;
    if (effectiveApiKey && effectiveApiKey.length > 5) {
      ai = new GoogleGenAI({ apiKey: effectiveApiKey });
    } else {
      ai = getGeminiClient();
    }

    if (!ai) {
      // Return smart fallback metadata with helpful notification
      const fallback = generateFallbackMetadata({
        filename,
        platform,
        minTitleWords,
        maxTitleWords,
        minKeywords,
        maxKeywords,
        minDescWords,
        maxDescWords,
        singleWordKeywords,
        whiteBackground,
        transparentBackground,
        silhouette,
        customPrompt,
        prohibitedWords
      });
      return res.json({ success: true, metadata: fallback, isFallback: true });
    }

    // Build the system instructions & prompt for Gemini with Microstock SEO Ranking Algorithms
    const systemPrompt = `You are a world-class Microstock SEO Metadata Specialist and Keyword Strategist for top stock agencies (Adobe Stock, Shutterstock, Freepik, Getty/iStock, and PNG marketplaces).

YOUR GOAL: Generate high-ranking, commercially competitive, and search-optimized metadata based directly on the provided visual image content.

CORE SEO RANKING RULES FOR MICROSTOCK MARKETPLACES:
1. STRICT VISUAL ACCURACY (NO HALLUCINATIONS):
   - Visually analyze the uploaded image with extreme precision: identify the exact subject matter, art style/medium (e.g. vector illustration, 3D render, flat design, icon, photograph, watercolor, minimalist badge), objects, color scheme, composition, and isolation.
   - Ground all titles, keywords, and descriptions strictly in what is visible or logically represented. Never include irrelevant spam tags that stock review algorithms penalize or reject.

2. SEO TITLE RANKING ALGORITHM:
   - Must contain BETWEEN ${minTitleWords} and ${maxTitleWords} WORDS.
   - Lead immediately with the most searched commercial terms (Primary Subject + Main Action/State + Style/Context + Key Features).
   - Format like a natural, compelling English sentence or descriptive phrase (e.g. "Green leaves growing from orange capsule pill wellness logo design vector illustration").
   - Maximize search click-through rate (CTR) for commercial buyers.

3. HIERARCHICAL SEO KEYWORD ORDER (CRITICAL FOR SEARCH RANKINGS):
   - Microstock search algorithms give maximum weight to the FIRST 10 keywords. Sort your keywords strictly in descending order of search relevance and buyer search volume:
     * Rank 1-5 (Primary Focal Subject): The exact main objects, characters, or core theme seen in the image.
     * Rank 6-12 (Artistic Style & Technique): Exact medium, design style, rendering type (e.g., vector, illustration, flat, 3d, icon, logo, badge, emblem).
     * Rank 13-22 (Industry & Commercial Themes): Concepts, business verticals, intended use (e.g., wellness, medical, healthcare, organic, branding, corporate, eco).
     * Rank 23+ (Attributes, Colors & Composition): Dominant colors, composition, background tags (e.g., isolated, white background, green, orange, modern, clean, copyspace).
   - Total Keywords: Provide BETWEEN ${minKeywords} and ${maxKeywords} keywords.
   ${singleWordKeywords ? "- CRITICAL: Every keyword MUST be a SINGLE word only (no spaces, no multi-word phrases)." : "- Include a balanced mix of high-traffic single words and high-intent 2-word commercial buyer search queries."}
   ${whiteBackground ? "- Must include isolation tags: 'isolated', 'white background', 'cutout', 'copyspace'." : ""}
   ${transparentBackground ? "- Must include transparency tags: 'isolated', 'transparent background', 'png', 'alpha channel'." : ""}
   ${silhouette ? "- Must include silhouette tags: 'silhouette', 'outline', 'shadow', 'black shape'." : ""}
   ${prohibitedWords && prohibitedWords.length > 0 ? `- STRICTLY PROHIBIT the following words anywhere in title, description, or keywords: ${prohibitedWords.join(", ")}.` : ""}
   ${customPrompt ? `- Additional user creative direction: "${customPrompt}".` : ""}

4. PNG PLATFORM SEGMENTATION:
   - mainKeywords: Exactly 2 to 3 highest-ranking core keywords that a buyer would type to find this image directly (e.g. ["wellness logo", "green leaves", "capsule logo"]).
   - secondaryKeywords: 10 to 20 relevant high-traffic secondary tags and synonyms.
   - promptKeywords: A concise, rich text-to-image prompt (around ${minDescWords} to ${maxDescWords} words) describing the subject, art style, and palette to recreate the visual image.

5. Return ONLY structured JSON strictly adhering to the schema.`;

    const userPrompt = `Analyze the visual content of this stock image (Filename: "${filename}", Platform: "${platform}"). Generate top-ranking SEO commercial metadata strictly matching what is seen in the image.`;

    let parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

    if (imageData && typeof imageData === "string" && imageData.length > 100) {
      let cleanMime = mimeType || "image/jpeg";
      const mimeMatch = imageData.match(/^data:([^;]+);base64,/);
      if (mimeMatch && mimeMatch[1]) {
        cleanMime = mimeMatch[1];
      }
      const base64Clean = imageData.replace(/^data:[^;]+;base64,/, "").trim();
      if (base64Clean.length > 50) {
        parts.push({
          inlineData: {
            mimeType: cleanMime,
            data: base64Clean,
          },
        });
      }
    }

    parts.push({ text: `${systemPrompt}\n\n${userPrompt}` });

    const response = await ai.models.generateContent({
      model: customModel || "gemini-3.8-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: `Title with ${minTitleWords} to ${maxTitleWords} words`,
            },
            description: {
              type: Type.STRING,
              description: `Description with ${minDescWords} to ${maxDescWords} words`,
            },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: `List of ${minKeywords} to ${maxKeywords} keywords`,
            },
            category: {
              type: Type.STRING,
              description: "Relevant stock category e.g. Business, Nature, Technology, Lifestyle",
            },
            category1: {
              type: Type.STRING,
              description: "PNG platform primary category e.g. BACKGROUND, GRAPHIC DESIGN, ILLUSTRATION, FESTIVALS, ELEMENTS, ICONS, TEMPLATE",
            },
            category2: {
              type: Type.STRING,
              description: "PNG platform secondary sub-category e.g. Texture, Abstract, Nature, Business, Technology, 3D, Minimalist",
            },
            mainKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 2 to 3 primary core keywords describing the main subject directly",
            },
            secondaryKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Between 10 and 20 secondary keywords/tags",
            },
            promptKeywords: {
              type: Type.STRING,
              description: `Keywords used to create image: generate a short, concise description (around ${minDescWords} to ${maxDescWords} words) describing the image content clearly`,
            },
            aiPlatformName: {
              type: Type.STRING,
              description: "Name of the AI platform, choose one appropriate like Midjourney, Ideogram, Leonardo AI, or Adobe Firefly",
            },
            aiPlatformUrl: {
              type: Type.STRING,
              description: "URL of AI platform used e.g. https://www.midjourney.com or https://ideogram.ai",
            },
          },
          required: ["title", "description", "keywords"],
        },
      },
    });

    const text = response.text?.trim() || "{}";
    const parsed = JSON.parse(text);

    // Ensure keywords meet length criteria and filters
    let keywords: string[] = Array.isArray(parsed.keywords) ? parsed.keywords : [];
    if (singleWordKeywords) {
      keywords = keywords.map((k) => k.split(/\s+/)[0]).filter(Boolean);
    }
    if (prohibitedWords && prohibitedWords.length > 0) {
      const banned = new Set(prohibitedWords.map((w: string) => w.toLowerCase().trim()));
      keywords = keywords.filter((k) => !banned.has(k.toLowerCase()));
    }

    const mainKws = Array.isArray(parsed.mainKeywords) && parsed.mainKeywords.length >= 2
      ? parsed.mainKeywords.slice(0, 3)
      : keywords.slice(0, 3);
    const secondaryKws = Array.isArray(parsed.secondaryKeywords) && parsed.secondaryKeywords.length >= 5
      ? parsed.secondaryKeywords.slice(0, 20)
      : keywords.slice(3, 23);

    const pngData = {
      category1: parsed.category1 || "BACKGROUND",
      category2: parsed.category2 || "Texture",
      mainKeywords: mainKws,
      secondaryKeywords: secondaryKws,
      promptKeywords: parsed.promptKeywords || parsed.description || parsed.title || filename,
      aiPlatformName: parsed.aiPlatformName || "Midjourney",
      aiPlatformUrl: parsed.aiPlatformUrl || "https://www.midjourney.com",
      uploadId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    };

    return res.json({
      success: true,
      metadata: {
        title: parsed.title || `${filename} Stock Asset`,
        description: parsed.description || parsed.title || "",
        keywords,
        category: parsed.category || `${pngData.category1} - ${pngData.category2}`,
        source: "gemini",
        pngData,
      },
      isFallback: false,
    });
  } catch (error: any) {
    console.error("Gemini metadata generation failed, using fallback:", error?.message || error);
    const fallback = generateFallbackMetadata({
      filename: req.body.filename || "asset.jpg",
      platform: req.body.platform || "Adobe Stock",
      minTitleWords: req.body.minTitleWords || 7,
      maxTitleWords: req.body.maxTitleWords || 15,
      minKeywords: req.body.minKeywords || 25,
      maxKeywords: req.body.maxKeywords || 35,
      minDescWords: req.body.minDescWords || 10,
      maxDescWords: req.body.maxDescWords || 20,
      singleWordKeywords: Boolean(req.body.singleWordKeywords),
      whiteBackground: Boolean(req.body.whiteBackground),
      transparentBackground: Boolean(req.body.transparentBackground),
      silhouette: Boolean(req.body.silhouette),
      customPrompt: req.body.customPrompt || "",
      prohibitedWords: req.body.prohibitedWords || [],
    });

    return res.json({
      success: true,
      metadata: fallback,
      isFallback: true,
      note: error?.message,
    });
  }
});

// Health check route
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Mount Vite middleware in dev, static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Microstock Metadata Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
