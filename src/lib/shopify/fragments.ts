export const MONEY_FRAGMENT = /* GraphQL */ `
  fragment MoneyFragment on MoneyV2 {
    amount
    currencyCode
  }
`;

export const IMAGE_FRAGMENT = /* GraphQL */ `
  fragment ImageFragment on Image {
    url
    altText
    width
    height
  }
`;

export const PRODUCT_VARIANT_FRAGMENT = /* GraphQL */ `
  fragment ProductVariantFragment on ProductVariant {
    id
    title
    availableForSale
    price {
      ...MoneyFragment
    }
    compareAtPrice {
      ...MoneyFragment
    }
    selectedOptions {
      name
      value
    }
    image {
      ...ImageFragment
    }
  }
`;

export const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    descriptionHtml
    seo {
      title
      description
    }
    featuredImage {
      ...ImageFragment
    }
    images(first: 20) {
      nodes {
        ...ImageFragment
      }
    }
    options {
      name
      values
    }
    variants(first: 100) {
      nodes {
        ...ProductVariantFragment
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyFragment
      }
      maxVariantPrice {
        ...MoneyFragment
      }
    }
  }
`;

export const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        ...MoneyFragment
      }
      totalAmount {
        ...MoneyFragment
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost {
          totalAmount {
            ...MoneyFragment
          }
        }
        discountAllocations {
          discountedAmount {
            ...MoneyFragment
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            availableForSale
            product {
              handle
              title
            }
            image {
              ...ImageFragment
            }
            price {
              ...MoneyFragment
            }
          }
        }
      }
    }
  }
`;
