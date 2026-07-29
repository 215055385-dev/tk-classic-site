"use client";

import { Send } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { copy, products, type Lang } from "@/lib/site-data";
import { uiCopy } from "@/lib/localized-ui";

type InquiryFormProps = {
  lang: Lang;
  selectedProduct?: string;
  selectedAccessories?: string;
};

const emailWarning: Record<Lang, string> = {
  en: "Your inquiry was saved. The email notification is delayed, and our team will follow up from the saved record.",
  es: "Tu consulta se guardó. El aviso por email está retrasado y nuestro equipo hará seguimiento desde el registro guardado.",
  pt: "A sua consulta foi guardada. A notificação por email está atrasada e a nossa equipa fará o acompanhamento pelo registo salvo.",
  fr: "Votre demande a été enregistrée. La notification par email est retardée et notre équipe assurera le suivi depuis le dossier enregistré.",
  ar: "تم حفظ استفسارك. تأخر إشعار البريد الإلكتروني، وسيتابع فريقنا الطلب من السجل المحفوظ.",
  zh: "询盘已保存。邮件通知暂时延迟，销售团队会根据已保存的记录继续跟进。",
  ru: "Ваш запрос сохранён. Уведомление по email задерживается, и наша команда продолжит работу по сохранённой записи.",
};

export function InquiryForm({ lang, selectedProduct = "DQ-001", selectedAccessories = "" }: InquiryFormProps) {
  const t = copy[lang];
  const ui = uiCopy[lang];
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
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setFeedback("");
    let emailSent = true;

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company: buyerCompany,
          phone,
          country,
          product,
          accessories: accessorySelection,
          quantity,
          branding,
          message,
          lang,
          source: typeof window === "undefined" ? "website" : window.location.href,
          website: new FormData(event.currentTarget).get("website"),
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        setStatus("error");
        setFeedback(result?.message ?? ui.form.error);
        return;
      }
      emailSent = result.emailSent !== false;
    } catch {
      setStatus("error");
      setFeedback(ui.form.error);
      return;
    }

    setStatus("success");
    setFeedback(emailSent ? ui.form.success : emailWarning[lang]);
    setName("");
    setEmail("");
    setBuyerCompany("");
    setPhone("");
    setCountry("");
    setQuantity("");
    setAccessorySelection("");
    setBranding("");
    setMessage("");
  }

  return (
    <form className="inquiry-form" onSubmit={handleSubmit} aria-label={ui.form.ariaLabel}>
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
          placeholder="+33 / +49 / +44 ..."
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
