const API = process.env.API_URL;

export async function GET() {
  const response = await fetch(`${API}/cards`);

  // Forward the backend response directly
  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}

export async function POST(request: Request) {
  const body = await request.text(); // Forward the raw request body
  const response = await fetch(`${API}/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  // Forward the backend response directly
  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}
