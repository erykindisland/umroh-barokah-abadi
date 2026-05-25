-- Pembuatan tabel pendaftaran jemaah
CREATE TABLE IF NOT EXISTS pendaftaran (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    email TEXT,
    whatsapp TEXT NOT NULL,
    paket TEXT,
    rencana_keberangkatan TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert data contoh
INSERT INTO pendaftaran (nama, whatsapp, paket, rencana_keberangkatan) 
VALUES ('Jemaah Contoh', '08123456789', 'Ramadhan Bintang 5', '2026-03-25');
