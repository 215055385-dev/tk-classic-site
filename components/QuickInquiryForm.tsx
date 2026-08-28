"use client";

import type { FormEvent } from "react";
import { useId, useState } from "react";
import { getClientAttribution, trackConversionEvent } from "@/lib/client-analytics";
import styles from "./QuickInquiryForm.module.css";

const buyerTypes = [
  "Importer / wholesaler",
  "Outdoor retailer",
  "Coffee brand / private label",
  "Amazon or marketplace seller",
  "Other business buyer",
] as const;

function challengeFromId(id: string) {
  const seed = Array.from(id).reduce((total, character) => total + character.charCodeAt(0), 0);
  return { a: (seed % 4) + 2, b: (Math.floor(seed / 4) % 5) + 1 };
}

export function QuickInquiryForm() {
  const challenge = challengeFromId(useId());
  const [startedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setFeedback("");
    try {
      const formData = new FormData(event.currentTarget);
      const attribution = getClientAttribution();
      formData.set("sourcePage", `${window.location.pathname}${window.location.search}`);
      formData.set("source", attribution.utm_source ?? attribution.referrerHost ?? "direct");
      formData.set("referrer", document.referrer);
      formData.set("startedAt", String(startedAt));
      formData.set("challengeA", String(challenge.a));
      formData.set("challengeB", String(challenge.b));
      const response = await fetch("/api/inquiries", { method: "POST", body: formData });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) throw new Error(result?.message ?? "We could not submit your request.");
      trackConversionEvent("generate_lead", {
        product: "DQ-001 / DQ-010",
        metadata: { inquiryId: String(result.id ?? ""), formType: "quick" },
      });
      const params = new URLSearchParams({
        product: "DQ-001 / DQ-010",
        id: String(result.id ?? ""),
        ...(result.deliveryPending ? { delivery: "pending" } : {}),
      });
      window.location.assign(`/contact/success?${params.toString()}`);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "We could not submit your request.");
    }
  }

  return (
    <form className={styles.form} data-track-form onSubmit={submit} aria-label="Quick wholesale contact form">
      <input className={styles.hidden} name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <input name="formType" type="hidden" value="quick" />
      <input name="lang" type="hidden" value="en" />
      <input name="product" type="hidden" value="DQ-001 / DQ-010" />
      <label>Name<input name="name" autoComplete="name" maxLength={120} required /></label>
      <label>Business email<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
      <label className={styles.span}>I am sourcing as
        <select name="buyerType" required defaultValue="">
          <option value="" disabled>Select your buyer type</option>
          {buyerTypes.map((item) => <option value={item} key={item}>{item}</option>)}
        </select>
      </label>
      <label className={styles.span}>Verification: {challenge.a} + {challenge.b}
        <input name="verificationAnswer" inputMode="numeric" required aria-label="Verification answer" />
      </label>
      <button className={styles.button} type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Start a wholesale conversation"}
      </button>
      <p className={styles.note}>No public price or fixed MOQ is shown. Configuration and commercial terms are confirmed for the selected market and project.</p>
      {feedback ? <p className={styles.feedback} role="alert">{feedback}</p> : null}
    </form>
  );
}
