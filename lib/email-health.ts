import { Resend } from "resend";
import { company } from "@/lib/site-data";

export type EmailHealth = {
  ready: boolean;
  apiKeyConfigured: boolean;
  senderConfigured: boolean;
  senderAddress: string;
  senderDomain: string;
  siteDomain: string;
  domainStatus: string;
  recipientCount: number;
  checkedAt: string;
  error: string;
};

function extractAddress(value: string) {
  const bracketed = value.match(/<([^<>]+)>/);
  return (bracketed?.[1] ?? value).trim().toLowerCase();
}

function configuredRecipients() {
  const value = process.env.INQUIRY_TO_EMAILS?.trim() || `${company.emailBowie},${company.emailLeo}`;
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export async function getEmailHealth(): Promise<EmailHealth> {
  const apiKey = process.env.RESEND_API_KEY?.trim() ?? "";
  const sender = process.env.INQUIRY_FROM_EMAIL?.trim() ?? "";
  const senderAddress = extractAddress(sender);
  const senderDomain = senderAddress.includes("@") ? senderAddress.split("@").pop() ?? "" : "";
  const siteDomain = new URL(company.siteUrl).hostname.replace(/^www\./, "").toLowerCase();
  const senderConfigured = Boolean(senderAddress) && senderDomain === siteDomain;
  const recipientCount = configuredRecipients().length;
  const base = {
    apiKeyConfigured: Boolean(apiKey),
    senderConfigured,
    senderAddress,
    senderDomain,
    siteDomain,
    recipientCount,
    checkedAt: new Date().toISOString(),
  };

  if (!apiKey) {
    return { ...base, ready: false, domainStatus: "unknown", error: "缺少 RESEND_API_KEY。" };
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.domains.list();
    if (error) throw new Error(error.message);
    const domain = data?.data.find((item) => item.name.toLowerCase() === siteDomain);
    const domainStatus = domain?.status ?? "not_found";
    return {
      ...base,
      ready: senderConfigured && recipientCount > 0 && domainStatus === "verified",
      domainStatus,
      error: "",
    };
  } catch (error) {
    return {
      ...base,
      ready: false,
      domainStatus: "check_failed",
      error: error instanceof Error ? error.message.slice(0, 300) : "无法检查 Resend 域名状态。",
    };
  }
}
