"use client";

import { Send } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { copy, products, type Lang } from "@/lib/site-data";
import { uiCopy } from "@/lib/localized-ui";
import { inquiryCopy } from "@/lib/inquiry-copy";

type InquiryFormProps = {
  lang: Lang;
  selectedProduct?: string;
  selectedAccessories?: string;
};

export function InquiryForm({ lang, selectedProduct = "DQ-001", selectedAccessories = "" }: InquiryFormProps) {
  const t = copy[lang];
  const ui = uiCopy[lang];
  const formCopy = inquiryCopy[lang];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [buyerCompany, setBuyerCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [product, setProduct] = useState(selectedProduct);
  const [accessorySelection, setAccessorySelection] = useState(selectedAccessories);
  const [quantity, setQuantity] = useState("");
  const [branding, setBranding] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [verificationAnswer, setVerificationAnswer] = useState("");
  const [challenge] = useState(() => ({
    a: Math.floor(Math.random() * 4) + 2,
    b: Math.floor(Math.random() * 5) + 1,
  }));
  const [startedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  function handleFilesChange(nextFiles: FileList | null) {
    const selected = Array.from(nextFiles ?? []);
    if (selected.length > 3 || selected.some((file) => file.size > 5 * 1024 * 1024)) {
      setStatus("error");
      setFeedback(formCopy.attachmentHint);
      setFiles([]);
      return;
    }
    setStatus("idle");
    setFeedback("");
    setFiles(selected);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setFeedback("");

    try {
      const formData = new FormData(event.currentTarget);
      formData.set("sourcePage", `${window.location.pathname}${window.location.search}`);
      formData.set("referrer", document.referrer);
      formData.set("startedAt", String(startedAt));
      formData.set("challengeA", String(challenge.a));
      formData.set("challengeB", String(challenge.b));
      const response = await fetch("/api/inquiries", {
        method: "POST",
        body: formData,
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        setStatus("error");
        setFeedback(result?.message ?? ui.form.error);
        return;
      }
      const successPath = lang === "en" ? "/contact/success" : `/${lang}/contact/success`;
      window.location.assign(`${successPath}?product=${encodeURIComponent(product)}`);
      return;
    } catch {
      setStatus("error");
      setFeedback(ui.form.error);
      return;
    }

  }

  return (
    <form id="inquiry-form" className="inquiry-form" onSubmit={handleSubmit} aria-label={ui.form.ariaLabel}>
      <p className="form-helper span-2">
        {ui.form.helper}
      </p>
      <input
        className="honeypot-field"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <input name="lang" type="hidden" value={lang} />
      <label>
        <span>{t.form.name}</span>
        <input
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Leo Buyer"
          autoComplete="name"
          required
        />
      </label>
      <label>
        <span>{t.form.email}</span>
        <input
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="buyer@example.com"
          autoComplete="email"
          required
        />
      </label>
      <label>
        <span>{t.form.company}</span>
        <input
          name="company"
          value={buyerCompany}
          onChange={(event) => setBuyerCompany(event.target.value)}
          placeholder={ui.form.companyPlaceholder}
          autoComplete="organization"
        />
      </label>
      <label>
        <span>{ui.form.phone}</span>
        <input
          name="phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+86 159 1400 4936"
          autoComplete="tel"
        />
      </label>
      <label>
        <span>{ui.form.country}</span>
        <input
          name="country"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          placeholder={ui.form.countryPlaceholder}
          autoComplete="country-name"
        />
      </label>
      <label>
        <span>{t.form.product}</span>
        <select
          name="product"
          value={product}
          onChange={(event) => setProduct(event.target.value)}
        >
          {products.map((item) => (
            <option key={item.model} value={item.model}>
              {item.model}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>{ui.form.quantity}</span>
        <input
          name="quantity"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          placeholder={ui.form.quantityPlaceholder}
          required
        />
      </label>
      <label className="span-2">
        <span>{t.sectionTitles.accessories}</span>
        <input
          name="accessories"
          value={accessorySelection}
          onChange={(event) => setAccessorySelection(event.target.value)}
          placeholder={lang === "zh" ? "可选：例如 DG 胶囊底座、亚克力支架" : "Optional: e.g. DG capsule base, acrylic machine stand"}
        />
      </label>
      <label className="span-2">
        <span>{ui.form.branding}</span>
        <input
          name="branding"
          value={branding}
          onChange={(event) => setBranding(event.target.value)}
          placeholder={ui.form.brandingPlaceholder}
        />
      </label>
      <label className="span-2 inquiry-file-field">
        <span>{formCopy.attachments}</span>
        <input
          className="inquiry-file-input"
          name="attachments"
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.zip"
          onChange={(event) => handleFilesChange(event.target.files)}
        />
        <small>{formCopy.attachmentHint}</small>
        {files.length > 0 ? <small className="inquiry-file-list">{files.map((file) => file.name).join(" · ")}</small> : null}
      </label>
      <label className="span-2">
        <span>{t.form.message}</span>
        <textarea
          name="message"
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={ui.form.messagePlaceholder}
          required
        />
      </label>
      <label className="span-2 inquiry-verification-field">
        <span>{formCopy.verification}</span>
        <input
          name="verificationAnswer"
          inputMode="numeric"
          value={verificationAnswer}
          onChange={(event) => setVerificationAnswer(event.target.value)}
          placeholder={`${challenge.a} + ${challenge.b} = ?`}
          required
          aria-describedby="inquiry-verification-hint"
        />
        <small id="inquiry-verification-hint">{formCopy.verificationHint}</small>
      </label>
      <button className="primary-action span-2" type="submit" disabled={status === "submitting"}>
        <Send size={18} aria-hidden="true" />
        {status === "submitting" ? ui.form.submitting : ui.form.submit}
      </button>
      {feedback ? (
        <p
          className={`form-feedback span-2 ${status === "success" ? "is-success" : "is-error"}`}
          role="status"
          aria-live="polite"
        >
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
