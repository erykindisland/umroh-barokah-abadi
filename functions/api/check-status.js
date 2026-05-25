export async function onRequest(context) {
  // Ini adalah contoh logic Cloudflare Worker (Functions)
  // Anda bisa memanggil database, integrasi API WhatsApp, dll di sini.
  
  const data = {
    status: "success",
    message: "Haji & Umroh Barokah Abadi API is Online",
    timestamp: new Date().toISOString(),
    env: context.env.ENVIRONMENT || "production"
  };

  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
