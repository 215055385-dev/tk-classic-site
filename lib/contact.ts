import { company } from "@/lib/site-data";

export function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function whatsappHref(product?: string) {
  const number = company.whatsappBowie.replace(/\D/g, "");
  const message = product
    ? `Hello TK Classic, I would like details and a quotation for ${product}.`
    : "Hello TK Classic, I would like to discuss your portable coffee machines.";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
