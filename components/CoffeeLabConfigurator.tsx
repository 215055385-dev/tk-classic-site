"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Check, Clipboard, Download, ImagePlus, Plus, Save, Send, Trash2 } from "lucide-react";
import {
  coffeeLabColors,
  coffeeLabFinishes,
  type CoffeeLabCatalog,
  type coffeeLabCopy,
} from "@/lib/coffee-lab-data";
import { getClientAttribution, trackConversionEvent } from "@/lib/client-analytics";
import type { Lang } from "@/lib/site-data";

type Copy = (typeof coffeeLabCopy)[Lang];
type LayerName = "body" | "lid" | "cup";
type SavedDesign = {
  id: string;
  model: string;
  colors: Record<LayerName, string>;
  customColors?: Record<LayerName, string>;
  finishes: Record<LayerName, string>;
  accessories: string[];
  projectType: string;
  structural: string;
  logoName: string;
};

const storageKey = "tk-coffee-lab-design-v1";

function makeId() {
  return `LAB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

const conceptBoardCopy: Record<Lang, { generate: string; download: string; ready: string; photo: string; specification: string; previous: string; next: string; review: string }> = {
  en: { generate: "Generate concept board", download: "Download PNG", ready: "Concept board ready", photo: "REAL PRODUCT REFERENCES", specification: "CMF DIRECTION", previous: "Previous", next: "Next", review: "Review configuration" },
  es: { generate: "Generar tablero conceptual", download: "Descargar PNG", ready: "Tablero listo", photo: "REFERENCIAS REALES", specification: "DIRECCIÓN CMF", previous: "Anterior", next: "Siguiente", review: "Revisar configuración" },
  pt: { generate: "Gerar painel conceitual", download: "Baixar PNG", ready: "Painel pronto", photo: "REFERÊNCIAS REAIS", specification: "DIREÇÃO CMF", previous: "Anterior", next: "Próximo", review: "Revisar configuração" },
  fr: { generate: "Générer la planche concept", download: "Télécharger PNG", ready: "Planche prête", photo: "RÉFÉRENCES RÉELLES", specification: "DIRECTION CMF", previous: "Précédent", next: "Suivant", review: "Vérifier la configuration" },
  ar: { generate: "إنشاء لوحة المفهوم", download: "تنزيل PNG", ready: "لوحة المفهوم جاهزة", photo: "مراجع المنتج الحقيقية", specification: "اتجاه اللون والخامة", previous: "السابق", next: "التالي", review: "مراجعة الإعداد" },
  zh: { generate: "生成定制效果图", download: "下载 PNG", ready: "定制效果图已生成", photo: "真实产品参考", specification: "CMF 定制方向", previous: "上一步", next: "下一步", review: "确认配置" },
  ru: { generate: "Создать концепт-лист", download: "Скачать PNG", ready: "Концепт-лист готов", photo: "РЕАЛЬНЫЕ ФОТО", specification: "НАПРАВЛЕНИЕ CMF", previous: "Назад", next: "Далее", review: "Проверить конфигурацию" },
};

export function CoffeeLabConfigurator({ lang, catalog, copy, formSeed }: { lang: Lang; catalog: CoffeeLabCatalog; copy: Copy; formSeed: { startedAt: number; a: number; b: number } }) {
  const defaultModel = catalog.models.find((model) => model.model === "DQ-010") ?? catalog.models[0];
  const [model, setModel] = useState(defaultModel.model);
  const [colors, setColors] = useState<Record<LayerName, string>>({ body: "graphite", lid: "graphite", cup: "oat" });
  const [customColors, setCustomColors] = useState<Record<LayerName, string>>({ body: "#cf5f32", lid: "#cf5f32", cup: "#cf5f32" });
  const [finishes, setFinishes] = useState<Record<LayerName, string>>({ body: "Matte", lid: "Satin", cup: "Gloss" });
  const [activeLayer, setActiveLayer] = useState<LayerName>("body");
  const [activeStep, setActiveStep] = useState(1);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [projectType, setProjectType] = useState("Private label");
  const [structural, setStructural] = useState("");
  const [designId, setDesignId] = useState("");
  const [notice, setNotice] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [logoScale, setLogoScale] = useState(70);
  const [logoX, setLogoX] = useState(50);
  const [logoY, setLogoY] = useState(48);
  const [conceptBoard, setConceptBoard] = useState("");
  const startedAt = formSeed.startedAt;
  const challenge = { a: formSeed.a, b: formSeed.b };
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [responseMessage, setResponseMessage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const selectedModel = catalog.models.find((item) => item.model === model) ?? defaultModel;
  const selectedItems = catalog.accessories.filter((item) => selectedAccessories.includes(item.slug));
  const layerColor = (layer: LayerName) => {
    const selected = coffeeLabColors.find((item) => item.id === colors[layer]) ?? coffeeLabColors[0];
    return selected.id === "custom" ? { ...selected, name: `Custom ${customColors[layer]}`, value: customColors[layer] } : selected;
  };
  const activeColor = layerColor(activeLayer);
  const boardCopy = conceptBoardCopy[lang];

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      const saved = JSON.parse(raw) as SavedDesign;
      queueMicrotask(() => {
        if (catalog.models.some((item) => item.model === saved.model)) setModel(saved.model);
        if (saved.colors) setColors(saved.colors);
        if (saved.customColors) setCustomColors(saved.customColors);
        if (saved.finishes) setFinishes(saved.finishes);
        if (Array.isArray(saved.accessories)) setSelectedAccessories(saved.accessories.filter((slug) => catalog.accessories.some((item) => item.slug === slug)));
        if (saved.projectType) setProjectType(saved.projectType);
        if (saved.structural) setStructural(saved.structural);
        if (saved.id) setDesignId(saved.id);
      });
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [catalog.accessories, catalog.models]);

  useEffect(() => () => {
    if (logoUrl) URL.revokeObjectURL(logoUrl);
  }, [logoUrl]);

  const englishSummary = (() => {
    const names = selectedItems.map((item) => item.title).join(", ") || "None selected";
    return [
      `Coffee Lab configuration${designId ? ` ${designId}` : ""}`,
      `Machine: ${selectedModel.model}`,
      `Body: ${layerColor("body").name} / ${finishes.body}`,
      `Lid: ${layerColor("lid").name} / ${finishes.lid}`,
      `Cup: ${layerColor("cup").name} / ${finishes.cup}`,
      `Accessories: ${names}`,
      `Project type: ${projectType}`,
      `Customer logo: ${logoFile?.name || "Not uploaded"}`,
      `Structural concept: ${structural.trim() || "Not specified"}`,
      "Note: Concept preview only. Final color, finish, structure and compatibility are subject to sampling and project review.",
    ].join("\n");
  })();

  function updateLayerColor(id: string) {
    setColors((current) => ({ ...current, [activeLayer]: id }));
  }

  function toggleAccessory(slug: string) {
    setSelectedAccessories((current) => current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]);
  }

  function handleLogo(file?: File) {
    if (!file || file.size > 5 * 1024 * 1024 || !["image/png", "image/jpeg", "image/svg+xml"].includes(file.type)) {
      setNotice(copy.logoHelp);
      return;
    }
    if (logoUrl) URL.revokeObjectURL(logoUrl);
    setLogoFile(file);
    setLogoUrl(URL.createObjectURL(file));
    setNotice("");
  }

  function removeLogo() {
    if (logoUrl) URL.revokeObjectURL(logoUrl);
    setLogoFile(null);
    setLogoUrl("");
    if (fileInput.current) fileInput.current.value = "";
  }

  function saveDesign() {
    const id = designId || makeId();
    setDesignId(id);
    const payload: SavedDesign = { id, model, colors, customColors, finishes, accessories: selectedAccessories, projectType, structural, logoName: logoFile?.name ?? "" };
    window.localStorage.setItem(storageKey, JSON.stringify(payload));
    setNotice(`${copy.saved} · ${id}${logoFile ? " · Logo file must be reselected after reopening." : ""}`);
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(englishSummary);
      setNotice(copy.copied);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = englishSummary;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      setNotice(copy.copied);
    }
  }

  async function loadConceptImage(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new window.Image();
      image.decoding = "async";
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }

  async function generateConceptBoard() {
    const id = designId || makeId();
    setDesignId(id);
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 1120;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = "#f4e8d6";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#241a16";
    context.fillRect(0, 0, canvas.width, 150);
    context.fillStyle = "#fff8ee";
    context.font = "700 48px Arial, sans-serif";
    context.fillText("COFFEE LAB STUDIO", 68, 70);
    context.font = "600 24px Arial, sans-serif";
    context.fillStyle = "#d8b894";
    context.fillText(`${selectedModel.model} · ${id}`, 70, 112);

    const productPhoto = await loadConceptImage(selectedModel.variantBoard);
    const photoX = 58;
    const photoY = 194;
    const photoWidth = 930;
    const photoHeight = 730;
    context.fillStyle = "#211712";
    context.fillRect(photoX, photoY, photoWidth, photoHeight);
    const photoScale = Math.min(photoWidth / productPhoto.naturalWidth, photoHeight / productPhoto.naturalHeight);
    const renderedWidth = productPhoto.naturalWidth * photoScale;
    const renderedHeight = productPhoto.naturalHeight * photoScale;
    context.drawImage(productPhoto, photoX + (photoWidth - renderedWidth) / 2, photoY + (photoHeight - renderedHeight) / 2, renderedWidth, renderedHeight);
    context.fillStyle = "rgba(36,26,22,.9)";
    context.fillRect(photoX, photoY + photoHeight - 62, photoWidth, 62);
    context.fillStyle = "#fff8ee";
    context.font = "700 20px Arial, sans-serif";
    context.fillText(boardCopy.photo, photoX + 24, photoY + photoHeight - 24);

    const panelX = 1040;
    context.fillStyle = "#321b12";
    context.font = "700 24px Arial, sans-serif";
    context.fillText(boardCopy.specification, panelX, 224);
    context.font = "700 42px Arial, sans-serif";
    context.fillText(selectedModel.model, panelX, 278);
    (["body", "lid", "cup"] as LayerName[]).forEach((layer, index) => {
      const y = 340 + index * 146;
      const selection = layerColor(layer);
      context.fillStyle = selection.value;
      context.beginPath();
      context.arc(panelX + 38, y + 34, 34, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "rgba(36,26,22,.25)";
      context.lineWidth = 2;
      context.stroke();
      context.fillStyle = "#6b5649";
      context.font = "700 17px Arial, sans-serif";
      context.fillText(layer.toUpperCase(), panelX + 92, y + 18);
      context.fillStyle = "#241a16";
      context.font = "700 25px Arial, sans-serif";
      context.fillText(selection.name, panelX + 92, y + 51);
      context.fillStyle = "#7a6557";
      context.font = "500 18px Arial, sans-serif";
      context.fillText(finishes[layer], panelX + 92, y + 80);
    });

    context.fillStyle = "#ead8bc";
    context.fillRect(panelX, 788, 490, 136);
    context.fillStyle = "#6b5649";
    context.font = "700 16px Arial, sans-serif";
    context.fillText("PROJECT", panelX + 24, 824);
    context.fillStyle = "#241a16";
    context.font = "700 26px Arial, sans-serif";
    context.fillText(projectType, panelX + 24, 864);
    context.font = "500 17px Arial, sans-serif";
    context.fillText(`${selectedItems.length} accessory option${selectedItems.length === 1 ? "" : "s"} selected`, panelX + 24, 898);

    if (logoUrl) {
      const customerLogo = await loadConceptImage(logoUrl);
      const maxLogoWidth = 170 * (logoScale / 70);
      const maxLogoHeight = 70;
      const logoScaleFactor = Math.min(maxLogoWidth / customerLogo.naturalWidth, maxLogoHeight / customerLogo.naturalHeight);
      const logoWidth = customerLogo.naturalWidth * logoScaleFactor;
      const logoHeight = customerLogo.naturalHeight * logoScaleFactor;
      const logoAreaX = panelX + 270 + (logoX - 50) * 2.2;
      const logoAreaY = 822 + (logoY - 48) * 1.2;
      context.drawImage(customerLogo, logoAreaX, logoAreaY, logoWidth, logoHeight);
    }

    context.fillStyle = "#241a16";
    context.fillRect(0, 986, 1600, 134);
    context.fillStyle = "#d8b894";
    context.font = "600 18px Arial, sans-serif";
    context.fillText("CONCEPT DIRECTION ONLY", 68, 1032);
    context.fillStyle = "#fff8ee";
    context.font = "500 20px Arial, sans-serif";
    context.fillText("Final color, finish, structure and compatibility are subject to sampling and project review.", 68, 1075);
    const dataUrl = canvas.toDataURL("image/png", 0.94);
    setConceptBoard(dataUrl);
    setNotice(`${boardCopy.ready} · ${id}`);
    trackConversionEvent("coffee_lab_concept", {
      product: selectedModel.model,
      metadata: { designId: id, projectType, accessoryCount: selectedItems.length },
    });
  }

  function downloadConceptBoard() {
    if (!conceptBoard) return;
    const link = document.createElement("a");
    link.href = conceptBoard;
    link.download = `${selectedModel.model.toLowerCase()}-coffee-lab-concept.png`;
    link.click();
    trackConversionEvent("coffee_lab_download", {
      product: selectedModel.model,
      metadata: { designId, projectType },
    });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setResponseMessage("");
    const formData = new FormData(event.currentTarget);
    const id = designId || makeId();
    setDesignId(id);
    formData.set("formType", "full");
    formData.set("product", selectedModel.model);
    formData.set("accessories", selectedItems.map((item) => item.title).join(", ") || "None selected");
    formData.set("branding", `Coffee Lab ${id}; ${projectType}; Body ${layerColor("body").name}/${finishes.body}; Lid ${layerColor("lid").name}/${finishes.lid}; Cup ${layerColor("cup").name}/${finishes.cup}; Logo ${logoFile?.name || "none"}`);
    formData.set("message", englishSummary.replace("Coffee Lab configuration", `Coffee Lab configuration ${id}`));
    formData.set("lang", lang);
    const attribution = getClientAttribution();
    formData.set("source", attribution.utm_source ?? attribution.referrerHost ?? "coffee-lab-studio");
    formData.set("sourcePage", `${window.location.pathname}${window.location.search}`);
    formData.set("referrer", document.referrer);
    formData.set("startedAt", String(startedAt));
    formData.set("challengeA", String(challenge.a));
    formData.set("challengeB", String(challenge.b));
    if (logoFile) formData.append("attachments", logoFile);
    try {
      const response = await fetch("/api/inquiries", { method: "POST", body: formData });
      const result = await response.json() as { ok?: boolean; message?: string; id?: string };
      if (!response.ok || !result.ok) throw new Error(result.message || copy.error);
      setStatus("success");
      setResponseMessage(`${copy.success}${result.id ? ` · ${result.id}` : ""}`);
      trackConversionEvent("generate_lead", {
        product: selectedModel.model,
        metadata: { inquiryId: String(result.id ?? ""), source: "coffee-lab-studio", designId: id },
      });
      window.localStorage.setItem(storageKey, JSON.stringify({ id, model, colors, customColors, finishes, accessories: selectedAccessories, projectType, structural, logoName: logoFile?.name ?? "" } satisfies SavedDesign));
    } catch (error) {
      setStatus("error");
      setResponseMessage(error instanceof Error ? error.message : copy.error);
    }
  }

  return (
    <section className="coffee-lab-configurator" id="configurator" aria-labelledby="coffee-lab-configurator-title">
      <div className="coffee-lab-section-heading">
        <p className="eyebrow">02 / CONFIGURE</p>
        <h2 id="coffee-lab-configurator-title">{copy.configure}</h2>
        <p>{copy.configureLead}</p>
      </div>

      <div className="coffee-lab-workbench">
        <div className="coffee-lab-preview-panel">
          <div className="coffee-lab-preview-head">
            <div><span>{copy.preview}</span><strong>{selectedModel.model}</strong></div>
            <small>{copy.concept}</small>
          </div>
          <div className={`coffee-lab-machine-stage finish-${finishes.body.toLowerCase()}`}>
            <div className="coffee-lab-orbit orbit-one" aria-hidden="true" />
            <div className="coffee-lab-orbit orbit-two" aria-hidden="true" />
            <div className="coffee-lab-real-variant-board is-cmf-reference" style={{ position: "absolute" }}>
              <Image src={selectedModel.variantBoard} alt={`${selectedModel.model} real product color references`} fill loading="eager" fetchPriority="high" sizes="(max-width: 900px) 92vw, 620px" />
              <span className="coffee-lab-photo-badge">{boardCopy.photo}</span>
              {logoUrl ? <div className="coffee-lab-board-logo" aria-label="Customer logo concept reference" style={{ backgroundImage: `url(${logoUrl})` }} /> : null}
            </div>
          </div>
          <div className="coffee-lab-live-color-readout" aria-label={`${copy.color} preview controls`}>
            {(["body", "lid", "cup"] as LayerName[]).map((layer) => (
              <button type="button" key={layer} className={activeLayer === layer ? "is-active" : ""} aria-pressed={activeLayer === layer} onClick={() => { setActiveLayer(layer); setActiveStep(2); }}>
                <span style={{ background: layerColor(layer).value }} aria-hidden="true" />
                <small>{copy[layer]}</small>
                <strong>{layerColor(layer).name}</strong>
              </button>
            ))}
          </div>
          <div className="coffee-lab-summary-strip">
            <div><span>{copy.machine}</span><strong>{selectedModel.model}</strong></div>
            <div><span>{copy.accessories}</span><strong>{selectedItems.length}</strong></div>
            <div><span>{copy.project}</span><strong>{projectType}</strong></div>
          </div>
        </div>

        <div className="coffee-lab-controls">
          <div className="coffee-lab-step-tabs" role="tablist" aria-label="Coffee Lab configuration steps">
            {[copy.machine, copy.color, copy.logo, copy.accessories, copy.configuration].map((label, index) => {
              const complete = index < 2 || (index === 2 && Boolean(logoFile)) || (index === 3 && selectedItems.length > 0) || (index === 4 && Boolean(conceptBoard));
              const isActive = activeStep === index + 1;
              return <button type="button" role="tab" aria-label={`${String(index + 1).padStart(2, "0")} ${label}`} aria-selected={isActive} aria-current={isActive ? "step" : undefined} data-state={isActive ? "active" : complete ? "complete" : "pending"} className={`${isActive ? "is-active" : ""} ${complete ? "is-complete" : ""}`} key={label} onClick={() => setActiveStep(index + 1)}><span>{complete ? <Check size={12} aria-hidden="true" /> : String(index + 1).padStart(2, "0")}</span><strong>{label}</strong></button>;
            })}
          </div>
          <fieldset id="lab-machine" className="coffee-lab-control-step" hidden={activeStep !== 1}>
            <legend><span>01</span>{copy.machine}</legend>
            <div className="coffee-lab-current-choice"><Check size={16} /><span>{copy.preview}</span><strong>{selectedModel.model}</strong></div>
            <div className="coffee-lab-model-grid">
              {catalog.models.map((item) => <button type="button" key={item.model} className={model === item.model ? "is-active" : ""} onClick={() => setModel(item.model)} aria-pressed={model === item.model}><span className="coffee-lab-model-thumb"><Image src={item.image} alt="" fill sizes="110px" loading="eager" /></span><span className="coffee-lab-model-meta"><strong>{item.model}</strong><small>{item.role === "value" ? copy.value : item.role === "premium" ? copy.premium : copy.standard}</small></span>{model === item.model ? <Check className="coffee-lab-model-check" size={15} /> : null}</button>)}
            </div>
          </fieldset>

          <fieldset id="lab-style" className="coffee-lab-control-step" hidden={activeStep !== 2}>
            <legend><span>02</span>{copy.color} &amp; {copy.finish}</legend>
            <p className="coffee-lab-field-help">{copy.concept}</p>
            <div className="coffee-lab-mobile-live-preview">
              <div className="coffee-lab-mobile-live-canvas">
                <Image src={selectedModel.variantBoard} alt={`${selectedModel.model} real product color references`} fill sizes="170px" />
              </div>
              <div><span>{copy.preview}</span><strong>{selectedModel.model} · {copy[activeLayer]} · {activeColor.name}</strong><small>{copy.concept}</small></div>
            </div>
            <div className="coffee-lab-layer-tabs" role="tablist" aria-label="Customizable layers">
              {(["body", "lid", "cup"] as LayerName[]).map((layer) => <button type="button" role="tab" aria-selected={activeLayer === layer} className={activeLayer === layer ? "is-active" : ""} key={layer} onClick={() => setActiveLayer(layer)}>{copy[layer]}</button>)}
            </div>
            <div className="coffee-lab-swatches">
              {coffeeLabColors.map((item) => <button type="button" key={item.id} className={colors[activeLayer] === item.id ? "is-active" : ""} onClick={() => updateLayerColor(item.id)} aria-label={`${copy.color}: ${item.name}`} aria-pressed={colors[activeLayer] === item.id}><span style={{ background: item.value }} /><small>{item.name}</small></button>)}
            </div>
            {colors[activeLayer] === "custom" ? <label className="coffee-lab-custom-color"><span>{copy.color}</span><input type="color" value={customColors[activeLayer]} onChange={(event) => setCustomColors((current) => ({ ...current, [activeLayer]: event.target.value }))} /><strong>{customColors[activeLayer].toUpperCase()}</strong></label> : null}
            <div className="coffee-lab-finish-row">
              {coffeeLabFinishes.map((finish) => <button type="button" key={finish} className={finishes[activeLayer] === finish ? "is-active" : ""} onClick={() => setFinishes((current) => ({ ...current, [activeLayer]: finish }))}>{finish}</button>)}
            </div>
          </fieldset>

          <fieldset id="lab-logo" className="coffee-lab-control-step" hidden={activeStep !== 3}>
            <legend><span>03</span>{copy.logo}</legend>
            <p className="coffee-lab-field-help">{copy.logoHelp}</p>
            <div className="coffee-lab-upload-row">
              <input ref={fileInput} id="coffee-lab-logo" type="file" accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml" onChange={(event) => handleLogo(event.target.files?.[0])} />
              <label htmlFor="coffee-lab-logo"><ImagePlus size={17} aria-hidden="true" />{copy.upload}</label>
              {logoFile ? <button type="button" onClick={removeLogo}><Trash2 size={16} aria-hidden="true" />{copy.remove}</button> : null}
            </div>
            {logoFile ? <div className="coffee-lab-logo-controls"><label>{copy.logoScale}<input type="range" min="36" max="130" value={logoScale} onChange={(event) => setLogoScale(Number(event.target.value))} /></label><label>X<input type="range" min="28" max="72" value={logoX} onChange={(event) => setLogoX(Number(event.target.value))} /></label><label>Y<input type="range" min="35" max="68" value={logoY} onChange={(event) => setLogoY(Number(event.target.value))} /></label></div> : null}
          </fieldset>
          <fieldset id="lab-accessories" className="coffee-lab-control-step" hidden={activeStep !== 4}>
            <legend><span>04</span>{copy.accessories}</legend>
            <p className="coffee-lab-field-help">{copy.compatible}</p>
            <div className="coffee-lab-compact-accessories">
              {catalog.accessories.map((item) => {
                const active = selectedAccessories.includes(item.slug);
                return <button type="button" key={item.slug} className={active ? "is-active" : ""} onClick={() => toggleAccessory(item.slug)} aria-pressed={active}><span><Image src={item.image} alt={item.alt} fill sizes="84px" /></span><div><small>{item.category}</small><strong>{item.title}</strong></div>{active ? <Check size={17} /> : <Plus size={17} />}</button>;
              })}
            </div>
          </fieldset>
          <fieldset id="lab-review" className="coffee-lab-control-step" hidden={activeStep !== 5}>
            <legend><span>05</span>{boardCopy.review}</legend>
            <div className="coffee-lab-inline-review">
              {(["body", "lid", "cup"] as LayerName[]).map((layer) => <div key={layer}><i style={{ background: layerColor(layer).value }} /><span>{copy[layer]}</span><strong>{layerColor(layer).name} · {finishes[layer]}</strong></div>)}
              <div><span>{copy.machine}</span><strong>{selectedModel.model}</strong></div>
              <div><span>{copy.accessories}</span><strong>{selectedItems.length}</strong></div>
              <div><span>{copy.project}</span><strong>{projectType}</strong></div>
            </div>
            <div className="coffee-lab-review-actions"><button type="button" onClick={generateConceptBoard}><ImagePlus size={17} />{boardCopy.generate}</button>{conceptBoard ? <button type="button" onClick={downloadConceptBoard}><Download size={17} />{boardCopy.download}</button> : null}</div>
            {conceptBoard ? <div className="coffee-lab-concept-board"><Image src={conceptBoard} alt={`${selectedModel.model} Coffee Lab CMF concept board`} width={800} height={560} unoptimized /></div> : null}
            <a className="coffee-lab-review-submit" href="#coffee-lab-inquiry"><Send size={17} />{copy.submit}</a>
          </fieldset>
          <div className="coffee-lab-step-actions"><button type="button" onClick={() => setActiveStep((step) => Math.max(1, step - 1))} disabled={activeStep === 1}>{boardCopy.previous}</button><span>{activeStep} / 5</span><button type="button" onClick={() => setActiveStep((step) => Math.min(5, step + 1))} disabled={activeStep === 5}>{boardCopy.next}</button></div>
        </div>
      </div>

      <div className="coffee-lab-submit-grid" id="coffee-lab-inquiry">
        <div className="coffee-lab-configuration-card">
          <p className="eyebrow">04 / REVIEW</p><h3>{copy.configuration}</h3>
          {designId ? <p><strong>{copy.configId}:</strong> {designId}</p> : null}
          <pre>{englishSummary}</pre>
          <div className="coffee-lab-save-actions"><button type="button" onClick={saveDesign}><Save size={17} />{copy.save}</button><button type="button" onClick={copySummary}><Clipboard size={17} />{copy.copy}</button></div>
          {notice ? <p className="coffee-lab-notice" role="status"><Check size={16} />{notice}</p> : null}
        </div>
        <form className="coffee-lab-inquiry-form" data-track-form onSubmit={submit}>
          <div><p className="eyebrow">05 / SEND</p><h3>{copy.finalTitle}</h3><p>{copy.finalLead}</p></div>
          <div className="coffee-lab-form-grid">
            <label>{copy.name}<input name="name" required maxLength={120} /></label>
            <label>{copy.company}<input name="company" maxLength={160} /></label>
            <label>{copy.email}<input name="email" required type="email" maxLength={254} /></label>
            <label>{copy.country}<input name="country" maxLength={120} /></label>
            <label>{copy.phone}<input name="phone" maxLength={80} /></label>
            <label>{copy.quantity}<input name="quantity" required maxLength={80} /></label>
            <label>{copy.project}<select value={projectType} onChange={(event) => setProjectType(event.target.value)}><option value="Wholesale bundle">{copy.wholesale}</option><option value="Private label">{copy.privateLabel}</option><option value="OEM">{copy.oem}</option><option value="ODM">{copy.odm}</option></select></label>
            <label>{copy.verification}: {challenge.a} + {challenge.b}<input name="verificationAnswer" required inputMode="numeric" pattern="[0-9]*" /></label>
          </div>
          <label>{copy.structural}<textarea value={structural} onChange={(event) => setStructural(event.target.value)} rows={4} maxLength={1200} placeholder={copy.structuralHelp} /></label>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="coffee-lab-honeypot" aria-hidden="true" />
          <button className="coffee-lab-submit" type="submit" disabled={status === "submitting"}><Send size={18} />{status === "submitting" ? copy.submitting : copy.submit}</button>
          {responseMessage ? <p className={`coffee-lab-response is-${status}`} role="status">{responseMessage}</p> : null}
        </form>
      </div>
    </section>
  );
}
