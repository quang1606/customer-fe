const CUSTOMER_URL = process.env.CUSTOMER_SERVICE_URL || "http://localhost:8084";

export async function customerFetch(path: string, options: RequestInit = {}) {
  const url = `${CUSTOMER_URL}${path}`;
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
