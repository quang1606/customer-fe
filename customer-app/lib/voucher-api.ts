const VOUCHER_URL = process.env.VOUCHER_SERVICE_URL || "http://localhost:8000/api/vouchers";

export async function voucherFetch(path: string, options: RequestInit = {}) {
  const url = `${VOUCHER_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  let data;
  try {
    data = await res.json();
  } catch {
    data = { message: `Upstream returned ${res.status}` };
  }
  return { data, status: res.status, ok: res.ok };
}
