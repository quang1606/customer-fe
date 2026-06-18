export async function identityFetch(path: string, options: RequestInit = {}) {
  const identityUrl = process.env.IDENTITY_SERVICE_URL || "http://localhost:8000/api/identity";
  const url = `${identityUrl}${path}`;
  console.log("[identityFetch] URL:", url);
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
