import Link from "next/link";
import { Check } from "lucide-react";
import { accessories } from "@/lib/accessory-data";
import { products, type Lang } from "@/lib/site-data";
import { accessoryPageCopy, getAccessoryDisplay } from "@/lib/translation-copy";

type AccessoryCompatibilityMatrixProps = { lang: Lang };

export function AccessoryCompatibilityMatrix({ lang }: AccessoryCompatibilityMatrixProps) {
  const pageCopy = accessoryPageCopy[lang];
  return (
    <section className="section accessory-matrix-section" aria-labelledby="accessory-matrix-title">
      <div className="section-heading align-left">
        <span>{pageCopy.matrixEyebrow}</span>
        <h2 id="accessory-matrix-title">{pageCopy.matrixTitle}</h2>
        <p>{pageCopy.matrixLead}</p>
      </div>
      <div className="accessory-matrix-scroll">
        <table className="accessory-matrix">
          <thead>
            <tr>
              <th scope="col">{pageCopy.modelLabel}</th>
              {accessories.map((accessory) => <th scope="col" key={accessory.slug}>{getAccessoryDisplay(accessory.slug, lang, accessory).title}</th>)}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.model}>
                <th scope="row"><Link href={`/products/${product.slug}#accessory-selector`}>{product.model}</Link></th>
                {accessories.map((accessory) => <td key={accessory.slug} aria-label={`${product.model}: ${pageCopy.optionalLabel} ${getAccessoryDisplay(accessory.slug, lang, accessory).title}`}><Check size={16} aria-hidden="true" /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
