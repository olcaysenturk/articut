import type { SalesOverview } from "@/lib/shopify/sales-data";

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg border p-5 ${accent ? "border-[#e04d26]/30 bg-[#fff7e4]" : "border-[#d0d0d0] bg-white"}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6f6f6f]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#1f1f1f]">{value}</p>
    </div>
  );
}

function statusBadgeClass(status: string) {
  const normalized = status.toUpperCase();
  if (normalized === "FULFILLED" || normalized === "PAID") {
    return "bg-green-50 text-green-700 border-green-200";
  }
  if (normalized === "PARTIALLY_FULFILLED" || normalized === "PARTIALLY_PAID" || normalized === "PENDING") {
    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  }
  if (normalized === "UNFULFILLED" || normalized === "REFUNDED" || normalized === "VOIDED") {
    return "bg-red-50 text-red-700 border-red-200";
  }
  return "bg-gray-50 text-gray-700 border-gray-200";
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClass(status)}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

export function SalesPanel({ overview }: { overview: SalesOverview | null }) {
  if (!overview) {
    return (
      <div className="rounded-lg border border-[#e04d26]/30 bg-[#fff7e4] p-6">
        <div className="text-base font-semibold text-[#1f1f1f]">Shopify Admin API not configured</div>
        <p className="mt-2 text-sm text-[#6f6f6f]">
          Add <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-xs">SHOPIFY_ADMIN_API_ACCESS_TOKEN</code> to
          your <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-xs">.env.local</code> file to see sales
          data here. Create an Admin API token from your Shopify admin under{" "}
          <span className="font-medium">Settings → Apps and sales channels → Develop apps</span>, with the{" "}
          <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-xs">read_orders</code>,{" "}
          <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-xs">read_products</code>, and{" "}
          <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-xs">read_fulfillments</code> scopes.
        </p>
      </div>
    );
  }

  const { products, orders, stats } = overview;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard label="Total orders" value={String(stats.totalOrders)} />
        <StatCard
          label="Total revenue"
          value={formatMoney(stats.totalRevenue, stats.currencyCode)}
          accent
        />
        <StatCard
          label="Avg. order value"
          value={formatMoney(stats.averageOrderValue, stats.currencyCode)}
        />
        <StatCard label="Fulfilled" value={String(stats.fulfilledCount)} />
        <StatCard label="Unfulfilled" value={String(stats.unfulfilledCount)} />
      </div>

      <section>
        <div className="mb-4 text-base font-semibold text-[#1f1f1f]">Products</div>
        <div className="overflow-x-auto rounded-lg border border-[#d0d0d0] bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#e0e0e0] text-xs font-semibold uppercase tracking-wide text-[#6f6f6f]">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Inventory</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-[#f0f0f0] last:border-0">
                  <td className="flex items-center gap-3 px-4 py-3">
                    {product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- Shopify Admin API image URL, not a local asset.
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="size-10 shrink-0 rounded-md object-cover"
                      />
                    ) : (
                      <span className="grid size-10 shrink-0 place-items-center rounded-md bg-[#f4f4f4] text-xs text-[#6f6f6f]">
                        —
                      </span>
                    )}
                    <span className="font-medium text-[#1f1f1f]">{product.title}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="px-4 py-3 text-[#1f1f1f]">{formatMoney(Number(product.price), product.currencyCode)}</td>
                  <td className="px-4 py-3 text-[#1f1f1f]">{product.totalInventory}</td>
                </tr>
              ))}
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-[#6f6f6f]">
                    No products found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="mb-4 text-base font-semibold text-[#1f1f1f]">Recent orders</div>
        <div className="overflow-x-auto rounded-lg border border-[#d0d0d0] bg-white">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#e0e0e0] text-xs font-semibold uppercase tracking-wide text-[#6f6f6f]">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Shipping</th>
                <th className="px-4 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-[#f0f0f0] last:border-0">
                  <td className="px-4 py-3 font-medium text-[#1f1f1f]">{order.name}</td>
                  <td className="px-4 py-3 text-[#6f6f6f]">{formatDate(order.createdAt)}</td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-[#6f6f6f]" title={order.lineItemsSummary}>
                    {order.lineItemsSummary || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.financialStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.fulfillmentStatus} />
                  </td>
                  <td className="px-4 py-3 text-[#1f1f1f]">{formatMoney(Number(order.totalPrice), order.currencyCode)}</td>
                </tr>
              ))}
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-[#6f6f6f]">
                    No orders found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
