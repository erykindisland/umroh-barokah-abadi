export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.BAROKAH_DB;

  try {
    const input = await request.json();
    const { nama, whatsapp, paket, rencana } = input;

    // Validasi sederhana
    if (!nama || !whatsapp) {
      return new Response(JSON.stringify({ error: "Nama dan WhatsApp wajib diisi" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Simpan ke Database D1
    await db.prepare(
      "INSERT INTO pendaftaran (nama, whatsapp, paket, rencana_keberangkatan) VALUES (?, ?, ?, ?)"
    )
    .bind(nama, whatsapp, paket || "Belum Memilih", rencana || "Segera")
    .run();

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Alhamdulillah, data pendaftaran Anda telah kami terima. Tim kami akan segera menghubungi Anda." 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ 
      error: "Gagal menyimpan data", 
      details: err.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
