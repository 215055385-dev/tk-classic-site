import { company } from "@/lib/site-data";
import { getCmsProducts } from "@/lib/cms-products";
import { getProductSpecEntries } from "@/lib/product-presentation";
import { localizeSpecValue } from "@/lib/localized-ui";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  const products = await getCmsProducts();
  const productLines = products.map((product) => {
    const facts = getProductSpecEntries(product)
      .map(([key, value]) => `${key}: ${localizeSpecValue(value, "zh")}`)
      .join("；");
    return `- ${product.model}：${product.summary.zh} 已公开规格：${facts}。中文产品页：${company.siteUrl}/zh/products/${product.slug}`;
  }).join("\n");

  const body = `# TK Classic 中文事实索引

> TK Classic 是 ${company.legalName} 面向海外采购业务使用的品牌，网站提供便携式咖啡设备、配件及 OEM/ODM 私牌项目资料。

## 企业与服务对象
- 企业：${company.legalName}
- 品牌：${company.brand}
- 所在地：中国深圳
- 服务对象：跨境品牌、进口商、批发商、户外用品渠道、礼品采购与私牌项目客户
- 服务范围：便携式咖啡机、咖啡配件、Logo 与包装定制、OEM/ODM 项目沟通

## 产品型号与已公开事实
${productLines}

## 事实边界
- 产品页面是型号、图片和参数对应关系的主要公开来源。
- 不将一个型号的参数、配件或说明套用到其他型号。
- 网站不公开统一价格、MOQ、交期或质保承诺；具体条款以正式询盘和报价确认为准。
- 认证与检测资料按具体型号和目标市场在询盘后核对，不根据证书缩略图推断全部适用范围。
- 数字配色和 Logo 预览仅用于表达定制需求，不等同于量产样品确认。

## 主要中文页面
- 首页：${company.siteUrl}/zh
- 产品：${company.siteUrl}/zh/products
- OEM/ODM：${company.siteUrl}/zh/oem-odm
- 工厂与展会：${company.siteUrl}/zh/factory
- 认证资料：${company.siteUrl}/zh/certifications
- 采购资源与 FAQ：${company.siteUrl}/zh/resources
- 中文 OEM/ODM 采购指南：${company.siteUrl}/zh/china-oem-guide
- 联系与询盘：${company.siteUrl}/zh/contact

## 联系方式
- 邮箱：${company.emailBowie}
- 邮箱：${company.emailLeo}
- WhatsApp：${company.whatsappBowie}
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
