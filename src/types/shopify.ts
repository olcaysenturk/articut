export type Money = {
  amount: number;
  currencyCode: string;
};

export type ProductImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

export type ProductVariant = {
  id: string;
  title: string;
  available: boolean;
  price: Money;
  compareAtPrice: Money | null;
  selectedOptions: { name: string; value: string }[];
  image: ProductImage | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  images: ProductImage[];
  options: { name: string; values: string[] }[];
  variants: ProductVariant[];
  price: Money;
  compareAtPrice: Money | null;
  available: boolean;
};

export type CartLine = {
  id: string;
  quantity: number;
  variantId: string;
  variantTitle: string;
  productTitle: string;
  productHandle: string;
  available: boolean;
  image: ProductImage | null;
  linePrice: Money;
  unitPrice: Money;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: Money;
  discountTotal: Money;
  total: Money;
  lines: CartLine[];
};
