export type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type ShopifySelectedOption = {
  name: string;
  value: string;
};

export type ShopifyProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  selectedOptions: ShopifySelectedOption[];
  image: ShopifyImage | null;
};

export type ShopifyProductOption = {
  name: string;
  values: string[];
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  seo: {
    title: string | null;
    description: string | null;
  };
  featuredImage: ShopifyImage | null;
  images: { nodes: ShopifyImage[] };
  options: ShopifyProductOption[];
  variants: { nodes: ShopifyProductVariant[] };
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
};

export type ShopifyProductByHandleResponse = {
  product: ShopifyProduct | null;
};

export type ShopifyCartLine = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: ShopifyMoney;
  };
  discountAllocations: {
    discountedAmount: ShopifyMoney;
  }[];
  merchandise: {
    id: string;
    title: string;
    availableForSale: boolean;
    product: {
      handle: string;
      title: string;
    };
    image: ShopifyImage | null;
    price: ShopifyMoney;
  };
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
  };
  lines: { nodes: ShopifyCartLine[] };
};

export type ShopifyCartResponse = {
  cart: ShopifyCart | null;
};

export type ShopifyUserError = {
  field: string[] | null;
  message: string;
};
