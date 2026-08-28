import { permanentRedirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function BlogArticleRedirectPage({ params }: Props) {
  const { slug } = await params;
  permanentRedirect(`/resources/${slug}`);
}
