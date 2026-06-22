// ─────────────────────────────────────────────────────────────────
//  AMSA Shed Directory — Configuration
//  Fill in your Supabase project details below, then save this file.
//  Both values come from: Supabase Dashboard → Project → Settings → API
// ─────────────────────────────────────────────────────────────────

const CONFIG = {

  // Your Supabase project URL  (looks like https://xxxxxxxxxxxx.supabase.co)
  SUPABASE_URL: 'https://ijgmpgyiqfteqwudpcqf.supabase.co',

  // Your Supabase anon/public key  (long string starting with "eyJ…")
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqZ21wZ3lpcWZ0ZXF3dWRwY3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2MjkzMzcsImV4cCI6MjA5NDIwNTMzN30.BfSBSHIdj1dxS2oHjJv9zYUehNBMeCqFoClgPn4zRJc',

  // Master admin password — grants access to edit ANY shed, plus the Admin Panel
  // (add new sheds, see/manage all passwords). Change this to something strong.
  ADMIN_PASSWORD: 'MKEAdmin2024',

  // Developer password — grants the same access as Admin, plus future
  // developer-only tools as the app grows. Keep this private; only you should have it.
  DEVELOPER_PASSWORD: 'MKEDev2024',

};

export default CONFIG;
