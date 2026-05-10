const IDENTITY_URL = process.env.IDENTITY_SERVICE_URL || "http://localhost:8081";

export async function identityFetch(path: string, options: RequestInit = {}) {
  const url = `${IDENTITY_URL}${path}`;
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
