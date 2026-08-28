import type { GalleryImage } from "@/lib/gallery-data";
import type { Lang } from "@/lib/site-data";

type GalleryText = {
  factory: { eyebrow: string; title: string; subtitle: string; imageTitle: string; imageDescription: string; category: string; cta: string };
  exhibition: { eyebrow: string; title: string; subtitle: string; imageTitle: string; imageDescription: string; category: string; cta: string; truthEyebrow: string; truthTitle: string; truthBody: string };
  controls: { hint: string; region: string; carousel: string; open: string; bring: string; viewer: string; close: string; previous: string; next: string };
};

export const galleryText: Record<Lang, GalleryText> = {
  en: {
    factory: { eyebrow: "Real production photographs", title: "Inside Our Factory", subtitle: "Drag to explore the people, processes and facilities behind our products.", imageTitle: "Factory record", imageDescription: "A real photograph from our factory, showing the production, assembly or working environment.", category: "Factory", cta: "View Our Factory" },
    exhibition: { eyebrow: "Real exhibition photography", title: "Exhibition Highlights", subtitle: "Drag to explore moments from our exhibitions and product presentations.", imageTitle: "Exhibition record", imageDescription: "A real exhibition photograph showing products, presentation areas or on-site discussions.", category: "Exhibition", cta: "Explore Exhibitions", truthEyebrow: "Photo record", truthTitle: "Products, people and presentations—shown as photographed.", truthBody: "Event names, locations and dates are not assigned where the source photographs do not provide enough verified information." },
    controls: { hint: "Drag or swipe", region: "Drag horizontally to rotate", carousel: "3D image carousel", open: "Open", bring: "Bring to the front", viewer: "image viewer", close: "Close image viewer", previous: "Previous image", next: "Next image" },
  },
  es: {
    factory: { eyebrow: "Fotografías reales de producción", title: "Dentro de nuestra fábrica", subtitle: "Arrastra para explorar las personas, los procesos y las instalaciones detrás de nuestros productos.", imageTitle: "Registro de fábrica", imageDescription: "Fotografía real de nuestra fábrica que muestra el entorno de producción, montaje o trabajo.", category: "Fábrica", cta: "Ver nuestra fábrica" },
    exhibition: { eyebrow: "Fotografías reales de ferias", title: "Momentos destacados en ferias", subtitle: "Arrastra para ver momentos reales de nuestras ferias y presentaciones de producto.", imageTitle: "Registro de feria", imageDescription: "Fotografía real de una feria que muestra productos, zonas de presentación o conversaciones en el stand.", category: "Feria", cta: "Explorar ferias", truthEyebrow: "Registro fotográfico", truthTitle: "Productos, personas y presentaciones, tal como fueron fotografiados.", truthBody: "No indicamos nombres, lugares ni fechas cuando las fotografías originales no aportan información verificable suficiente." },
    controls: { hint: "Arrastra o desliza", region: "Arrastra horizontalmente para girar", carousel: "Carrusel de imágenes 3D", open: "Abrir", bring: "Llevar al frente", viewer: "visor de imágenes", close: "Cerrar visor", previous: "Imagen anterior", next: "Imagen siguiente" },
  },
  pt: {
    factory: { eyebrow: "Fotografias reais da produção", title: "Dentro da nossa fábrica", subtitle: "Arraste para explorar as pessoas, os processos e as instalações por trás dos nossos produtos.", imageTitle: "Registro da fábrica", imageDescription: "Fotografia real da nossa fábrica mostrando o ambiente de produção, montagem ou trabalho.", category: "Fábrica", cta: "Ver nossa fábrica" },
    exhibition: { eyebrow: "Fotografias reais de feiras", title: "Destaques de feiras", subtitle: "Arraste para explorar momentos reais das nossas feiras e apresentações de produtos.", imageTitle: "Registro de feira", imageDescription: "Fotografia real de uma feira mostrando produtos, áreas de apresentação ou conversas no estande.", category: "Feira", cta: "Explorar feiras", truthEyebrow: "Registro fotográfico", truthTitle: "Produtos, pessoas e apresentações, exatamente como foram fotografados.", truthBody: "Não atribuímos nomes, locais ou datas quando as fotografias originais não fornecem informações verificáveis suficientes." },
    controls: { hint: "Arraste ou deslize", region: "Arraste horizontalmente para girar", carousel: "Carrossel de imagens 3D", open: "Abrir", bring: "Trazer para a frente", viewer: "visualizador de imagens", close: "Fechar visualizador", previous: "Imagem anterior", next: "Próxima imagem" },
  },
  fr: {
    factory: { eyebrow: "Photographies réelles de production", title: "Au cœur de notre usine", subtitle: "Faites glisser pour découvrir les personnes, les processus et les installations derrière nos produits.", imageTitle: "Vue de l’usine", imageDescription: "Photographie réelle de notre usine montrant l’environnement de production, d’assemblage ou de travail.", category: "Usine", cta: "Voir notre usine" },
    exhibition: { eyebrow: "Photographies réelles de salons", title: "Temps forts des salons", subtitle: "Faites glisser pour découvrir des moments réels de nos salons et présentations produits.", imageTitle: "Vue du salon", imageDescription: "Photographie réelle d’un salon montrant les produits, les espaces de présentation ou les échanges sur le stand.", category: "Salon", cta: "Découvrir les salons", truthEyebrow: "Archives photographiques", truthTitle: "Produits, personnes et présentations, tels qu’ils ont été photographiés.", truthBody: "Nous n’attribuons ni nom, ni lieu, ni date lorsque les photographies sources ne fournissent pas suffisamment d’informations vérifiables." },
    controls: { hint: "Glisser ou balayer", region: "Faites glisser horizontalement pour faire pivoter", carousel: "Carrousel d’images 3D", open: "Ouvrir", bring: "Placer au premier plan", viewer: "visionneuse d’images", close: "Fermer la visionneuse", previous: "Image précédente", next: "Image suivante" },
  },
  ar: {
    factory: { eyebrow: "صور حقيقية من الإنتاج", title: "داخل مصنعنا", subtitle: "اسحب لاستكشاف فريق العمل والعمليات والمرافق التي تقف خلف منتجاتنا.", imageTitle: "سجل المصنع", imageDescription: "صورة حقيقية من مصنعنا تُظهر بيئة الإنتاج أو التجميع أو العمل.", category: "المصنع", cta: "استكشف مصنعنا" },
    exhibition: { eyebrow: "صور حقيقية من المعارض", title: "أبرز لحظات المعارض", subtitle: "اسحب لاستكشاف لحظات حقيقية من معارضنا وعروض المنتجات.", imageTitle: "سجل المعرض", imageDescription: "صورة حقيقية من معرض تُظهر المنتجات أو مناطق العرض أو النقاشات في الجناح.", category: "المعرض", cta: "استكشف المعارض", truthEyebrow: "سجل مصور", truthTitle: "المنتجات والأشخاص والعروض كما ظهرت في الصور.", truthBody: "لا نضيف أسماء الفعاليات أو المواقع أو التواريخ عندما لا توفر الصور الأصلية معلومات موثوقة كافية." },
    controls: { hint: "اسحب أو مرر", region: "اسحب أفقياً للتدوير", carousel: "عارض صور ثلاثي الأبعاد", open: "فتح", bring: "إحضار إلى المقدمة", viewer: "عارض الصور", close: "إغلاق عارض الصور", previous: "الصورة السابقة", next: "الصورة التالية" },
  },
  zh: {
    factory: { eyebrow: "真实生产照片", title: "走进我们的工厂", subtitle: "左右拖动，查看产品背后的人员、流程和生产环境。", imageTitle: "工厂实景", imageDescription: "来自工厂的真实照片，展示生产、装配或实际工作环境。", category: "工厂", cta: "查看工厂" },
    exhibition: { eyebrow: "真实展会照片", title: "展会现场", subtitle: "左右拖动，查看我们的真实展会与产品展示现场。", imageTitle: "展会实景", imageDescription: "来自展会现场的真实照片，展示产品、展位或现场交流。", category: "展会", cta: "查看展会" , truthEyebrow: "真实影像记录", truthTitle: "产品、人员和展示现场均按真实照片呈现。", truthBody: "当原始照片无法提供足够的可核验信息时，我们不会自行添加展会名称、地点或日期。" },
    controls: { hint: "拖动或滑动", region: "左右拖动以旋转画廊", carousel: "3D 图片画廊", open: "打开", bring: "移到正中", viewer: "图片查看器", close: "关闭图片查看器", previous: "上一张", next: "下一张" },
  },
  ru: {
    factory: { eyebrow: "Реальные фотографии производства", title: "Внутри нашего производства", subtitle: "Перетаскивайте изображения, чтобы увидеть людей, процессы и помещения, связанные с нашей продукцией.", imageTitle: "Производственный кадр", imageDescription: "Реальная фотография производства, сборки или рабочей среды нашей компании.", category: "Производство", cta: "Посмотреть производство" },
    exhibition: { eyebrow: "Реальные фотографии выставок", title: "Участие в выставках", subtitle: "Перетаскивайте изображения, чтобы увидеть реальные моменты с выставок и презентаций продукции.", imageTitle: "Выставочный кадр", imageDescription: "Реальная фотография с выставки: продукция, зона презентации или общение на стенде.", category: "Выставка", cta: "Посмотреть выставки", truthEyebrow: "Фотохроника", truthTitle: "Продукция, люди и презентации показаны без постановочных дополнений.", truthBody: "Мы не указываем название, место или дату мероприятия, если исходные фотографии не содержат достаточно проверяемой информации." },
    controls: { hint: "Перетащите или проведите", region: "Перетащите по горизонтали для вращения", carousel: "Трёхмерная галерея изображений", open: "Открыть", bring: "Переместить в центр", viewer: "просмотр изображений", close: "Закрыть просмотр", previous: "Предыдущее изображение", next: "Следующее изображение" },
  },
};

export function localizeGalleryImages(images: GalleryImage[], lang: Lang, kind: "factory" | "exhibition"): GalleryImage[] {
  if (lang === "en") return images;
  const text = galleryText[lang][kind];
  return images.map((image, index) => ({ ...image, title: `${text.imageTitle} ${String(index + 1).padStart(2, "0")}`, description: text.imageDescription, category: text.category, alt: `${text.imageTitle} ${index + 1}` }));
}
