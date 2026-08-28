import type { Lang } from "@/lib/site-data";

export type ManualStep = {
  title: string;
  description: string;
};

export type ManualTroubleshootingItem = {
  issue: string;
  action: string;
};

export type ProductManualKnowledge = {
  model: string;
  sourceLabel: string;
  reviewedOn: string;
  supportedInputs: string[];
  packageContents: string;
  operationSteps: ManualStep[];
  cleaning: string[];
  troubleshooting: ManualTroubleshootingItem[];
  safety: string;
  faqs: Array<{ question: string; answer: string }>;
};

const englishManuals: Record<string, ProductManualKnowledge> = {
  "DQ-001": {
    model: "DQ-001",
    sourceLabel: "DQ-001 revised product manual",
    reviewedOn: "2026-08-10",
    supportedInputs: ["Capsules with the supplied capsule adapter", "Ground coffee with the supplied ground-coffee adapter"],
    packageContents: "Main unit, ground-coffee adapter, capsule adapter, D-type accessory adapter, accessories, USB Type-C charging cable, user manual and filter.",
    operationSteps: [
      { title: "Load the coffee", description: "Place a capsule in the capsule adapter, or add ground coffee to the ground-coffee adapter, then secure the adapter to the machine." },
      { title: "Add drinking water", description: "Remove the top cover, add about 60 ml of water and fasten the cover completely." },
      { title: "Choose the brew mode", description: "Hold the power button for 3 seconds. Press once for the cold-water heating cycle, or press twice when using preheated water." },
      { title: "Finish and power down", description: "The machine stops automatically after brewing. It also powers off after 3 minutes without operation in standby." },
    ],
    cleaning: [
      "Remove the adapter and discard the used coffee after the machine has stopped.",
      "Rinse the removable adapter and capsule holder with clean water, then dry them.",
      "Wipe the main unit with a wrung-out damp cloth. Do not rinse or immerse the main unit.",
    ],
    troubleshooting: [
      { issue: "Low-battery warning", action: "Recharge the machine before attempting another brew." },
      { issue: "Long-term storage", action: "Clean and dry the parts, keep the unit in a cool dry place and recharge it every 3 months." },
    ],
    safety: "The built-in battery is not replaceable. Do not disassemble, immerse, place in fire or expose the unit to temperatures above 60°C.",
    faqs: [
      { question: "Which coffee formats does DQ-001 support?", answer: "The revised DQ-001 manual lists a capsule adapter and a ground-coffee adapter. The required adapter and package contents should still be confirmed in the quotation." },
      { question: "How is DQ-001 operated with cold or preheated water?", answer: "Hold the power button for 3 seconds to enter standby. Press once for the cold-water heating and extraction cycle, or press twice for direct extraction with preheated water." },
      { question: "How should DQ-001 be cleaned?", answer: "Rinse and dry only the removable adapter and capsule holder. Wipe the main unit with a damp cloth and never rinse or immerse it." },
    ],
  },
  "DQ-005": {
    model: "DQ-005",
    sourceLabel: "DQ-005 revised product manual",
    reviewedOn: "2026-08-10",
    supportedInputs: ["N-series capsules", "Dolce Gusto capsules", "6–8 g of medium-fine ground coffee"],
    packageContents: "Main unit; B, N, D and P compartments/adapters; powder lid; coffee cup; charging cable and user manual.",
    operationSteps: [
      { title: "Choose the coffee format", description: "Use compartment N for an N-series capsule, D for a Dolce Gusto capsule, or P for 6–8 g of medium-fine ground coffee." },
      { title: "Add drinking water", description: "Add 50–100 ml of water. The manual recommends 50–60 ml for capsule brewing, then fasten the cover." },
      { title: "Start the cycle", description: "Hold the power button for 3 seconds. Press once when starting with cold water, or press twice when using preheated water." },
      { title: "Wait for completion", description: "Two beeps and a steady green indicator signal that the brewing sequence has finished." },
    ],
    cleaning: [
      "Rinse the capsule or powder compartments after each brew.",
      "Clean adapter P thoroughly every 1–2 uses.",
      "Only the capsule compartment and cup may be washed. Wipe the main unit; do not rinse or immerse it.",
    ],
    troubleshooting: [
      { issue: "Slow flow", action: "Use a coarser grind and avoid packing the ground coffee too tightly." },
      { issue: "No pump after heating", action: "Refit the water tank and sealing ring." },
      { issue: "Three-beep alert", action: "Stop the machine, clean it and inspect the pump path for blockage." },
    ],
    safety: "Use a compliant 5 V / 3 A charger and do not operate the machine while it is charging. Stop and inspect the unit if a fault alert sounds.",
    faqs: [
      { question: "Which coffee formats does DQ-005 support?", answer: "The revised DQ-005 manual lists N-series capsules, Dolce Gusto capsules and medium-fine ground coffee with the corresponding supplied compartments or adapters." },
      { question: "How much water does DQ-005 use?", answer: "The manual lists a 50–100 ml water-tank range and recommends 50–60 ml for capsule brewing." },
      { question: "How should DQ-005 be cleaned?", answer: "Rinse the removable coffee compartments after use and clean adapter P every 1–2 uses. Wipe the main unit with a damp towel; do not rinse or immerse it." },
    ],
  },
  "DQ-010": {
    model: "DQ-010",
    sourceLabel: "DQ-010 revised product manual",
    reviewedOn: "2026-08-10",
    supportedInputs: ["N-series capsules", "Dolce Gusto capsules", "6–8 g of medium-fine ground coffee", "Portable drip cup with 15–20 g of ground coffee"],
    packageContents: "Main body; B and D compartments; N-series capsule compartment; powder compartment; coffee filter; USB-C to USB-C cable and user manual.",
    operationSteps: [
      { title: "Select the coffee format", description: "Use the matching N, D or P compartment for an N-series capsule, Dolce Gusto capsule or 6–8 g of medium-fine ground coffee." },
      { title: "Add drinking water", description: "Add 50–100 ml of water. The manual recommends 50–60 ml for capsule brewing, then close the cover completely." },
      { title: "Start brewing", description: "Hold the power button for 3 seconds. Press once for the cold-water cycle or press twice when using preheated water." },
      { title: "Follow the display", description: "The LCD shows temperature, battery level and extraction mode. Two beeps indicate completion." },
    ],
    cleaning: [
      "Remove the capsule or powder compartment and rinse away coffee residue.",
      "Wipe the main unit with a wrung-out damp cloth. Do not rinse or immerse it.",
      "Empty and dry the water tank and remove all adapters before long-term storage.",
    ],
    troubleshooting: [
      { issue: "No water after heating", action: "Refit the tank lid and sealing ring; replace a damaged sealing ring." },
      { issue: "Adapter does not fit", action: "Align the card slot and use the correct capsule size or adapter." },
      { issue: "Charging is slow or the light is off", action: "Use a compatible cable and charger and keep the charging port clean." },
    ],
    safety: "Keep the main unit and charging port dry, do not brew while charging and do not disassemble the non-replaceable built-in battery.",
    faqs: [
      { question: "Which coffee formats does DQ-010 support?", answer: "The revised DQ-010 manual lists N-series capsules, Dolce Gusto capsules and ground coffee. It also documents a separate portable drip-cup method." },
      { question: "What does the DQ-010 display show?", answer: "The LCD shows temperature, battery level and extraction mode according to the revised product manual." },
      { question: "How long is the DQ-010 cold-water cycle?", answer: "The revised manual lists about 3 minutes 30 seconds for cold-water heating and 46 seconds for extraction." },
    ],
  },
};

const chineseDq001: ProductManualKnowledge = {
  ...englishManuals["DQ-001"],
  sourceLabel: "DQ-001 修订版产品说明书",
  supportedInputs: ["使用随附胶囊适配器的咖啡胶囊", "使用随附咖啡粉适配器的咖啡粉"],
  packageContents: "主机、咖啡粉适配器、咖啡胶囊适配器、D 型配件适配器、附件、USB Type-C 充电线、用户手册和过滤器。",
  operationSteps: [
    { title: "装入咖啡", description: "将胶囊放入胶囊适配器，或把咖啡粉加入咖啡粉适配器，再将适配器旋紧到机器上。" },
    { title: "加入饮用水", description: "取下上盖，加入约 60 ml 饮用水并将上盖完全盖紧。" },
    { title: "选择萃取模式", description: "长按电源键 3 秒进入待机；冷水按一次，使用预热水时连续按两次。" },
    { title: "完成并关机", description: "萃取完成后机器自动停止；待机 3 分钟无操作会自动关机。" },
  ],
  cleaning: ["机器停止后取出适配器并倒掉咖啡渣。", "用清水冲洗可拆卸适配器和胶囊架并擦干。", "主机只能用拧干的湿毛巾擦拭，不可冲洗或浸泡。"],
  troubleshooting: [
    { issue: "低电量提示", action: "再次萃取前先给机器充电。" },
    { issue: "长期存放", action: "清洁并干燥部件，存放在阴凉干燥处，每 3 个月充电一次。" },
  ],
  safety: "内置电池不可更换。请勿拆卸、浸泡、投入火中，或将机器置于高于 60°C 的环境。",
  faqs: [
    { question: "DQ-001 支持哪些咖啡规格？", answer: "DQ-001 修订版说明书列有胶囊适配器和咖啡粉适配器；具体随单配置仍应以正式报价确认为准。" },
    { question: "DQ-001 如何使用冷水或预热水萃取？", answer: "长按电源键 3 秒进入待机。冷水萃取按一次；使用预热水直接萃取时连续按两次。" },
    { question: "DQ-001 应如何清洁？", answer: "仅清洗并擦干可拆卸适配器和胶囊架。主机使用湿布擦拭，不可冲洗或浸泡。" },
  ],
};

export function getProductManualKnowledge(model: string, lang: Lang) {
  if (lang === "zh" && model === "DQ-001") return chineseDq001;
  if (lang !== "en") return null;
  return englishManuals[model] ?? null;
}

export function getEnglishProductManualKnowledge(model: string) {
  return englishManuals[model] ?? null;
}
