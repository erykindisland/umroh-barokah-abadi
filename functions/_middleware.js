export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const canonicalHostname = "umroh.barokahabadi.web.id";

  // 1. Enforce Canonical Domain (Redirect non-canonical hostnames / pages.dev)
  // This helps Google consolidate indexing to the main domain
  if (url.hostname !== canonicalHostname && !url.hostname.includes('localhost') && !url.hostname.includes('127.0.0.1')) {
    const canonicalUrl = new URL(request.url);
    canonicalUrl.hostname = canonicalHostname;
    canonicalUrl.protocol = "https:"; // Force HTTPS
    return Response.redirect(canonicalUrl.toString(), 301);
  }

  try {
    // 2. Perform existing authentication checks for /api
    if (url.pathname.startsWith('/api')) {
      // SIMULASI LOGIN LOKAL (Hanya untuk testing)
      const mockLogin = url.searchParams.get('mock_login');
      if (mockLogin === 'true') return await next();

      const accessJwt = request.headers.get('CF-Access-Jwt-Assertion');
      const authHeader = request.headers.get('Authorization');
      const secretKey = env.API_SECRET_KEY || "barokah-secret-123";

      if (!accessJwt && authHeader !== `Bearer ${secretKey}`) {
        return new Response(JSON.stringify({
          error: "Unauthorized",
          message: "Akses ditolak. Silakan login melalui Cloudflare Authorize."
        }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // 3. Add Canonical Header to all HTML responses
    const response = await next();
    
    // Only modify responses that are successful and likely HTML
    const contentType = response.headers.get("content-type") || "";
    if (response.status === 200 && contentType.includes("text/html")) {
      const newResponse = new Response(response.body, response);
      // Absolute canonical link header
      const canonicalLink = `<https://${canonicalHostname}${url.pathname}>; rel="canonical"`;
      newResponse.headers.set("Link", canonicalLink);
      return newResponse;
    }

    return response;
  } catch (err) {
    return new Response("Internal Server Error: " + err.message, { status: 500 });
  }
}
