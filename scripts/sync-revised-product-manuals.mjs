import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: ".env.local", quiet: true });

const connectionString = process.env.CMS_DATABASE_URL ?? process.env.POSTGRES_PRISMA_URL ?? process.env.POSTGRES_URL;
if (!connectionString) throw new Error("Missing CMS database connection string");

const allowSelfSigned = process.env.CMS_ALLOW_SELF_SIGNED_CERTIFICATE === "true";
const runtimeConnectionString = new URL(connectionString);
if (allowSelfSigned) runtimeConnectionString.searchParams.delete("sslmode");

const pool = new pg.Pool({
  connectionString: runtimeConnectionString.toString(),
  max: 1,
  ssl: allowSelfSigned ? { rejectUnauthorized: false } : undefined,
});

const revisedProducts = {
  "DQ-001": {
    featureLabel: "Portable flagship",
    summaries: {
      en: "25 bar BrewHandy portable espresso machine with capsule and ground-coffee adapters.",
      es: "Cafetera espresso portátil BrewHandy de 25 bar con adaptadores para cápsulas y café molido.",
      pt: "Máquina espresso portátil BrewHandy de 25 bar com adaptadores para cápsulas e café moído.",
      fr: "Machine espresso portable BrewHandy 25 bars avec adaptateurs pour capsules et café moulu.",
      ar: "ماكينة إسبريسو محمولة BrewHandy بضغط 25 بار مع محولين للكبسولات والقهوة المطحونة.",
      zh: "BrewHandy 25 巴便携式意式咖啡机，配有胶囊和咖啡粉适配器。",
      ru: "Портативная эспрессо-машина BrewHandy на 25 бар с адаптерами для капсул и молотого кофе.",
    },
    specs: {
      model: "DQ-001", cup: "300 mL", capacity: "60-80 mL water tank", pressure: "25 bar",
      battery: "9600mAh / 30Wh", material: "ABS + PP + PS", charging: "About 180 minutes, USB Type-C",
      heat: "Cold-water cycle heats to 96°C", size: "77 × 77 × 268 mm",
      adapter: "Capsule adapter + ground-coffee adapter",
    },
  },
  "DQ-005": {
    featureLabel: "Multi-format model",
    summaries: {
      en: "25 bar portable coffee machine for N-series capsules, Dolce Gusto capsules and ground coffee.",
      es: "Cafetera portátil de 25 bar para cápsulas N-series, cápsulas Dolce Gusto y café molido.",
      pt: "Máquina de café portátil de 25 bar para cápsulas N-series, cápsulas Dolce Gusto e café moído.",
      fr: "Machine à café portable 25 bars pour capsules N-series, capsules Dolce Gusto et café moulu.",
      ar: "ماكينة قهوة محمولة بضغط 25 بار لكبسولات N-series وDolce Gusto والقهوة المطحونة.",
      zh: "25 巴便携式咖啡机，支持 N-series 胶囊、Dolce Gusto 胶囊和咖啡粉。",
      ru: "Портативная кофемашина на 25 бар для капсул N-series, Dolce Gusto и молотого кофе.",
    },
    specs: {
      model: "DQ-005", cup: "300 mL", capacity: "50-100 mL water tank", pressure: "25 bar",
      battery: "9600mAh", material: "Food-grade ABS + PP + 304 stainless steel", charging: "About 4 hours, 5V / 3A",
      heat: "Cold-water cycle heats to 96°C", size: "77 × 77 × 268 mm",
      adapter: "N-series + Dolce Gusto + ground coffee",
    },
  },
  "DQ-010": {
    featureLabel: "Higher-capacity format",
    summaries: {
      en: "325 mL Trailblazer portable coffee maker for N-series capsules, Dolce Gusto capsules and ground coffee.",
      es: "Cafetera portátil Trailblazer de 325 mL para cápsulas N-series, Dolce Gusto y café molido.",
      pt: "Cafeteira portátil Trailblazer de 325 mL para cápsulas N-series, Dolce Gusto e café moído.",
      fr: "Cafetière portable Trailblazer de 325 mL pour capsules N-series, Dolce Gusto et café moulu.",
      ar: "ماكينة قهوة محمولة Trailblazer بسعة 325 مل لكبسولات N-series وDolce Gusto والقهوة المطحونة.",
      zh: "325mL Trailblazer 便携式咖啡机，支持 N-series 胶囊、Dolce Gusto 胶囊和咖啡粉。",
      ru: "Портативная кофемашина Trailblazer на 325 мл для капсул N-series, Dolce Gusto и молотого кофе.",
    },
    specs: {
      model: "DQ-010", cup: "325 mL", capacity: "100 mL maximum water tank", pressure: "25 bar",
      battery: "9600mAh", charging: "USB Type-C", heat: "About 3 min 30 sec heating; 46 sec extraction",
      size: "279 × 77 × 77 mm", adapter: "N-series + Dolce Gusto + ground coffee; portable drip cup documented",
    },
  },
};

const client = await pool.connect();
const updated = [];

try {
  await client.query("begin");

  for (const [model, data] of Object.entries(revisedProducts)) {
    const productResult = await client.query("select id from products where model = $1", [model]);
    if (productResult.rowCount !== 1) throw new Error(`Expected one CMS product for ${model}`);
    const productId = productResult.rows[0].id;

    for (const [locale, summary] of Object.entries(data.summaries)) {
      await client.query(
        `update product_translations
         set summary = $1, feature_label = case when locale = 'en' then $2 else feature_label end
         where product_id = $3 and locale = $4`,
        [summary, data.featureLabel, productId, locale],
      );
    }

    await client.query("delete from product_specs where product_id = $1", [productId]);
    let sortOrder = 0;
    for (const [key, value] of Object.entries(data.specs)) {
      sortOrder += 1;
      await client.query(
        "insert into product_specs (id, product_id, key, value, sort_order) values (gen_random_uuid(), $1, $2, $3, $4)",
        [productId, key, value, sortOrder],
      );
    }

    if (model === "DQ-005") {
      await client.query(
        `update product_features set content = 'Three coffee formats documented in the revised manual'
         where product_id = $1 and content = 'Fast charging supports short lead times'`,
        [productId],
      );
    }

    updated.push({ model, specs: Object.keys(data.specs).length, locales: Object.keys(data.summaries).length });
  }

  await client.query("commit");
  console.log(JSON.stringify({ updated }, null, 2));
} catch (error) {
  await client.query("rollback");
  throw error;
} finally {
  client.release();
  await pool.end();
}
