
/**
 * Triage Service (Logika Murni)
 * Menggunakan algoritma pencocokan kata kunci lokal.
 * Tidak membutuhkan koneksi internet atau API Key.
 */
export async function analyzeReportDescription(description: string) {
  const desc = description.toLowerCase();

  // Daftar kata kunci deteksi otomatis
  const redKeywords = ['sesak', 'darurat', 'kritis', 'pingsan', 'tidak sadar', 'jantung', 'pendarahan', 'stroke', 'kecelakaan parah'];
  const yellowKeywords = ['sakit', 'patah', 'luka', 'hamil', 'melahirkan', 'mendesak', 'demam tinggi', 'kecelakaan', 'infeksi'];

  let urgency: 'Merah (Kritis)' | 'Kuning (Mendesak)' | 'Hijau (Stabil)' = 'Hijau (Stabil)';
  let category = 'Lainnya';

  // Logika Klasifikasi
  if (redKeywords.some(key => desc.includes(key))) {
    urgency = 'Merah (Kritis)';
    category = 'Gawat Darurat';
  } else if (yellowKeywords.some(key => desc.includes(key))) {
    urgency = 'Kuning (Mendesak)';
    if (desc.includes('hamil') || desc.includes('lahir')) {
      category = 'Ibu Hamil/Melahirkan';
    } else if (desc.includes('patah') || desc.includes('kecelakaan')) {
      category = 'Kecelakaan';
    } else {
      category = 'Lansia/Sakit Kronis';
    }
  }

  // Simulasi delay proses komputer (0.5 detik)
  return new Promise<{category: string, urgency: string}>(resolve => {
    setTimeout(() => {
      resolve({ category, urgency });
    }, 500);
  });
}
