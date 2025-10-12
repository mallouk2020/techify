import { notFound } from "next/navigation";
import ProductContent from "./ProductContent";

interface ImageItem {
  imageID: string;
  productID: string;
  image: string;
}

interface SingleProductPageProps {
  params: Promise<{ productSlug: string; id: string }>;
}

// دالة مساعدة لجلب البيانات من API
async function fetchProductData(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    
    // جلب بيانات المنتج
    const productRes = await fetch(`${baseUrl}/api/slugs/${slug}`, {
      cache: 'no-store',
    });
    
    if (!productRes.ok) {
      return null;
    }
    
    const product = await productRes.json();
    
    if (!product || product.error) {
      return null;
    }

    // جلب الصور الإضافية
    const imagesRes = await fetch(`${baseUrl}/api/images/${product.id}`, {
      cache: 'no-store',
    });
    
    const images = imagesRes.ok ? await imagesRes.json() : [];

    return { product, images };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// المكون الرئيسي (Server Component)
export default async function SingleProductPage({ params }: SingleProductPageProps) {
  const paramsAwaited = await params;
  const data = await fetchProductData(paramsAwaited.productSlug);

  if (!data) {
    notFound();
  }

  const { product, images } = data;

  // تمرير البيانات إلى مكون يدعم التفاعل (Client Component)
  return <ProductContent product={product} images={images} slug={paramsAwaited.productSlug} />;
}