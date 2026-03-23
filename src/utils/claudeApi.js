import Anthropic from "@anthropic-ai/sdk";

const ANTHROPIC_API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.warn("⚠️ REACT_APP_ANTHROPIC_API_KEY is not set in environment variables");
}

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage
});

/**
 * Convert file to base64
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Extract invoice data from PDF or image using Claude Vision/Document API
 * @param {File} file - The invoice file (PDF or image)
 * @returns {Promise<Object>} - Extracted invoice data
 */
export const extractInvoiceData = async (file) => {
  try {
    const base64Data = await fileToBase64(file);
    const fileType = file.type;

    let sourceType, mediaType;
    if (fileType === "application/pdf") {
      sourceType = "document";
      mediaType = "application/pdf";
    } else if (fileType.startsWith("image/")) {
      sourceType = "image";
      mediaType = fileType;
    } else {
      throw new Error("Unsupported file type. Please upload PDF or image.");
    }

    const prompt = `Extract the following fields from this invoice and return ONLY valid JSON with no additional text:
{
  "date": "",
  "order_no": "",
  "po_no": "",
  "item": "",
  "vendor": "",
  "subtotal": 0.00,
  "tax": 0.00,
  "total": 0.00,
  "payment_method": "",
  "paid_by": ""
}

Rules:
- Return ONLY the JSON object, no markdown, no explanations
- If a field is not found, use empty string "" for text fields and 0.00 for numeric fields
- Ensure numeric values are numbers, not strings
- Parse dates in YYYY-MM-DD format if possible`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: sourceType,
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Data,
              },
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    });

    const responseText = message.content[0].text;
    console.log("[Claude Response]", responseText);

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from Claude response");
    }

    const extractedData = JSON.parse(jsonMatch[0]);
    return extractedData;
  } catch (error) {
    console.error("[Extract Invoice Error]", error);
    throw error;
  }
};

/**
 * Categorize an item using Claude AI
 * @param {string} item - The item description
 * @param {string} vendor - The vendor name
 * @param {Array<Object>} categories - List of available categories
 * @returns {Promise<Object>} - { category: string, reason: string }
 */
export const categorizeItem = async (item, vendor, categories) => {
  try {
    const categoryNames = categories.map((c) => c.name).join(", ");

    const prompt = `Given this item: "${item}" from vendor "${vendor}",
assign it to the CLOSEST category from this list: ${categoryNames}.

Return ONLY valid JSON with no additional text:
{
  "category": "",
  "reason": ""
}

Rules:
- category must be EXACTLY one of the categories from the list
- reason should be a brief explanation (1 sentence)
- Return ONLY the JSON object, no markdown, no explanations`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].text;
    console.log("[Claude Categorization Response]", responseText);

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from Claude response");
    }

    const result = JSON.parse(jsonMatch[0]);
    return result;
  } catch (error) {
    console.error("[Categorize Item Error]", error);
    throw error;
  }
};
