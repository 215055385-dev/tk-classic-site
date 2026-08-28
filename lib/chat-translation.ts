const supported = new Set(["en", "es", "pt", "fr", "ar", "zh", "ru"]);

export function safeChatLang(value: string | null | undefined) {
  const lang = String(value || "en").toLowerCase().split("-")[0];
  return supported.has(lang) ? lang : "en";
}

export function translationConfigured() {
  return Boolean(process.env.DEEPL_API_KEY || process.env.GOOGLE_TRANSLATE_API_KEY);
}

export async function translateChatText(text: string, targetInput: string, sourceInput?: string) {
  const target = safeChatLang(targetInput);
  const source = sourceInput ? safeChatLang(sourceInput) : undefined;
  if (source && source === target) return text;
  if (process.env.DEEPL_API_KEY) return translateWithDeepL(text, target, source);
  if (process.env.GOOGLE_TRANSLATE_API_KEY) return translateWithGoogle(text, target, source);
  throw new Error("TRANSLATION_NOT_CONFIGURED");
}

async function translateWithDeepL(text: string, target: string, source?: string) {
  const key = process.env.DEEPL_API_KEY!;
  const endpoint = process.env.DEEPL_API_URL || (key.endsWith(":fx") ? "https://api-free.deepl.com/v2/translate" : "https://api.deepl.com/v2/translate");
  const body = new URLSearchParams({ text, target_lang: deepLLang(target) });
  if (source) body.set("source_lang", deepLLang(source));
  const response = await fetch(endpoint, { method: "POST", headers: { Authorization: `DeepL-Auth-Key ${key}`, "Content-Type": "application/x-www-form-urlencoded" }, body, signal: AbortSignal.timeout(12_000) });
  if (!response.ok) throw new Error("TRANSLATION_FAILED");
  const data = await response.json() as { translations?: Array<{ text?: string }> };
  const result = data.translations?.[0]?.text?.trim(); if (!result) throw new Error("TRANSLATION_FAILED"); return result;
}

async function translateWithGoogle(text: string, target: string, source?: string) {
  const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(process.env.GOOGLE_TRANSLATE_API_KEY!)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ q: text, target, ...(source ? { source } : {}), format: "text" }), signal: AbortSignal.timeout(12_000) });
  if (!response.ok) throw new Error("TRANSLATION_FAILED");
  const data = await response.json() as { data?: { translations?: Array<{ translatedText?: string }> } };
  const result = data.data?.translations?.[0]?.translatedText?.trim(); if (!result) throw new Error("TRANSLATION_FAILED"); return decodeEntities(result);
}

function deepLLang(lang: string) { return ({ en: "EN", es: "ES", pt: "PT-PT", fr: "FR", ar: "AR", zh: "ZH", ru: "RU" } as Record<string,string>)[lang] || "EN"; }
function decodeEntities(value: string) { return value.replaceAll("&quot;", '"').replaceAll("&#39;", "'").replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">"); }
