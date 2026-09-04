import "server-only";
import { shopifyAdminFetch, isAdminApiConfigured } from "@/lib/shopify/admin-client";

export type ProductSummary = {
  id: string;
  title: string;
  status: string;
  totalInventory: number;
  price: string;
  currencyCode: string;
  imageUrl: string | null;
};

export type OrderSummary = {
  id: string;
  name: string;
  createdAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: string;
  currencyCode: string;
  lineItemsSummary: string;
};

export type SalesOverview = {
  products: ProductSummary[];
  orders: OrderSummary[];
  stats: {
    totalOrders: number;
    totalRevenue: number;
    currencyCode: string;
    averageOrderValue: number;
    fulfilledCount: number;
    unfulfilledCount: number;
  };
};

const PRODUCTS_QUERY = `
  query DashboardProducts($first: Int!) {
    products(first: $first, sortKey: TITLE) {
      edges {
        node {
          id
          title
          status
          totalInventory
          featuredMedia {
            preview {
              image {
                url
              }
            }
          }
          priceRangeV2 {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

const ORDERS_QUERY = `
  query DashboardOrders($first: Int!) {
    orders(first: $first, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          name
          createdAt
          displayFinancialStatus
          displayFulfillmentStatus
          currentTotalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          lineItems(first: 5) {
            edges {
              node {
                title
                quantity
              }
            }
          }
        }
      }
    }
  }
`;

type ProductsQueryResponse = {
  products: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        status: string;
        totalInventory: number;
        featuredMedia: { preview: { image: { url: string } | null } | null } | null;
        priceRangeV2: { minVariantPrice: { amount: string; currencyCode: string } };
      };
    }>;
  };
};

type OrdersQueryResponse = {
  orders: {
    edges: Array<{
      node: {
        id: string;
        name: string;
        createdAt: string;
        displayFinancialStatus: string;
        displayFulfillmentStatus: string;
        currentTotalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
        lineItems: { edges: Array<{ node: { title: string; quantity: number } }> };
      };
    }>;
  };
};

export async function getSalesOverview(): Promise<SalesOverview | null> {
  if (!isAdminApiConfigured()) {
    return null;
  }

  const [productsData, ordersData] = await Promise.all([
    shopifyAdminFetch<ProductsQueryResponse>(PRODUCTS_QUERY, { first: 50 }),
    shopifyAdminFetch<OrdersQueryResponse>(ORDERS_QUERY, { first: 50 }),
  ]);

  const products: ProductSummary[] = productsData.products.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    status: node.status,
    totalInventory: node.totalInventory,
    price: node.priceRangeV2.minVariantPrice.amount,
    currencyCode: node.priceRangeV2.minVariantPrice.currencyCode,
    imageUrl: node.featuredMedia?.preview?.image?.url ?? null,
  }));

  const orders: OrderSummary[] = ordersData.orders.edges.map(({ node }) => ({
    id: node.id,
    name: node.name,
    createdAt: node.createdAt,
    financialStatus: node.displayFinancialStatus,
    fulfillmentStatus: node.displayFulfillmentStatus,
    totalPrice: node.currentTotalPriceSet.shopMoney.amount,
    currencyCode: node.currentTotalPriceSet.shopMoney.currencyCode,
    lineItemsSummary: node.lineItems.edges
      .map(({ node: item }) => `${item.quantity}x ${item.title}`)
      .join(", "),
  }));

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);
  const fulfilledCount = orders.filter((o) => o.fulfillmentStatus === "FULFILLED").length;
  const unfulfilledCount = orders.filter((o) => o.fulfillmentStatus !== "FULFILLED").length;

  return {
    products,
    orders,
    stats: {
      totalOrders: orders.length,
      totalRevenue,
      currencyCode: orders[0]?.currencyCode || "USD",
      averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
      fulfilledCount,
      unfulfilledCount,
    },
  };
}
