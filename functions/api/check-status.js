export async function onRequest(context) {
  const { env } = context;
  const db = env.BAROKAH_DB;

  try {
    // Mencoba mengambil data dari database D1
    const { results } = await db.prepare("SELECT * FROM pendaftaran ORDER BY created_at DESC LIMIT 5").all();

    const data = {
      status: "success",
      message: "API Barokah Abadi + Database D1 Connected",
      timestamp: new Date().toISOString(),
      database_check: results.length > 0 ? "Data found" : "Database connected, but no results",
      recent_registrations: results
    };

    return new Response(JSON.stringify(data, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      status: "error",
      message: "Database connection failed",
      error: err.message
    }, null, 2), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
