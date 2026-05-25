export async function onRequest(context) {
  // Ini adalah Middleware Otentikasi (Authorize Cloudflare)
  // Middleware ini akan berjalan di SETIAP request ke folder /api atau subfolder lainnya.
  
  try {
    const { request, next, env } = context;
    const url = new URL(request.url);

    // Contoh: Hanya lindungi rute /api
    if (url.pathname.startsWith('/api')) {
      
      // SIMULASI LOGIN LOKAL (Hanya untuk testing)
      const mockLogin = url.searchParams.get('mock_login');
      if (mockLogin === 'true') return await next();

      // Jika Anda menggunakan Cloudflare Access (Zero Trust), 
      // Cloudflare akan menyisipkan header 'CF-Access-Jwt-Assertion'.
      const accessJwt = request.headers.get('CF-Access-Jwt-Assertion');

      // Placeholder: Jika ingin mencoba otentikasi manual sederhana via Header
      const authHeader = request.headers.get('Authorization');
      const secretKey = env.API_SECRET_KEY || "barokah-secret-123";

      if (!accessJwt && authHeader !== `Bearer ${secretKey}`) {
        // Jika tidak ada otentikasi dari Cloudflare Access DAN tidak ada Bearer Token manual
        return new Response(JSON.stringify({
          error: "Unauthorized",
          message: "Akses ditolak. Silakan login melalui Cloudflare Authorize."
        }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // Jika lolos pengecekan, lanjutkan ke request berikutnya
    return await next();
  } catch (err) {
    return new Response("Internal Server Error: " + err.message, { status: 500 });
  }
}
