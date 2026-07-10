const fs = require('fs');
const path = require('path');

// 1. Raw lists of names under each role from the spreadsheet
const adminNames = [
  "Anisa Zunayah",
  "Farid Fachrudin",
  "Farhanul Karim"
];

const akademikNames = [
  "Budi Rahman",
  "Farid Fachrudin",
  "Tisya Aulika Nuri",
  "M. Rasya Azmi"
];

const ketetapNames = [
  "Mukti Karya Utama",
  "M. Arief Ridwan",
  "Anisa Zunayah",
  "Farid Fachrudin",
  "Farhanul Karim",
  "Budi Rahman",
  "Retno Yusniawati",
  "Ibnu Sina",
  "Inggrit Maylinda",
  "Ponco Arief Triyasto",
  "M. Rafly Novanto",
  "Akbar Ramadhian",
  "Fairuz Salsabilla"
];

const kangguruNames = [
  "Achmad Rivai",
  "Ade K Irawan",
  "Aditya Perbawa",
  "Ahmad Faris",
  "Al Akrom",
  "Akhit Anis",
  "Andromeda",
  "Annahel Aliesta",
  "Annisa Michellia",
  "Arif Sapta Diputra",
  "Aulia Dini",
  "Cahya Sasmita",
  "Candra Riyadi",
  "Cecep Saepudin Ahmad",
  "Daulat Harahap",
  "Dede Abdul Hakim",
  "Dewi Siska",
  "Dika Amalia Lutfiana",
  "Dolly Fernando",
  "Eko Priono",
  "Eko Wandoyo",
  "Fachrizal Nurrachman",
  "Fadhilah Rahmani",
  "Fahmi Firmansyah",
  "Fawaidul Khoir",
  "Fasniyanto",
  "Fathan Mubinan",
  "Frimadani",
  "Gentur Meshubudi",
  "Gianni Benhardi",
  "Gilang Ainan",
  "Hanunah Sofa",
  "Hasbiyallah",
  "Jurio Susilo",
  "Kartim",
  "Kelik Adi Trinugroho",
  "Lidia Rentina Pardede",
  "Lisa Rosaline",
  "Muarif Ambari",
  "M. Tulodo A",
  "Muhammad Arief",
  "Mujahidin Faruqul Adzim",
  "Muhammad Faisal Aulia",
  "Muhamad Ridho",
  "Natasya Adysaphira",
  "Nyimas Komariah S",
  "Pambudi Rahardjo",
  "Purnomo",
  "Putri Khumaeroh",
  "Raihana Zahra",
  "Rama Akbar Saputra",
  "Ramadhan Sagala",
  "Ratih Novia Pratiwi",
  "Restu Asegaf",
  "Rian Pratama",
  "Roy Hadiyanto",
  "Sigit Ramires",
  "Susilawati",
  "Taufik Hidayat",
  "Tranggono Setya R (Tio)",
  "Wahyu",
  "Yana",
  "Yasmine"
];

const karyawanNames = [
  "Sumardi",
  "Imanoeddin",
  "Tisya Aulika Nuri",
  "M. Rasya Azmi",
  "Ahmad Fatihul Ihsan"
];

const evalNames = [
  "Farid Fachrudin",
  "M. Arief Ridwan"
];

// Helper to priority rank roles for profiles.role
const rolePriority = ["admin", "akademik", "eval", "ketetap", "kangguru", "karyawan"];

function getPrimaryRole(roles) {
  for (const role of rolePriority) {
    if (roles.includes(role)) {
      return role;
    }
  }
  return roles[0] || "karyawan";
}

// Clean name for email generation (domain: @konstanta.my.id)
function cleanNameForEmail(name) {
  let clean = name.replace(/\s*\([^)]*\)\s*/g, "").trim();
  clean = clean.replace(/\s+/g, " ");
  // Remove special characters except spaces
  clean = clean.replace(/[^a-zA-Z0-9\s.]/g, "");
  const parts = clean.toLowerCase().split(" ").filter(Boolean);
  return parts.join(".") + "@konstanta.my.id";
}

// Generate simple human-readable password
function generatePassword() {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `Konstanta${digits}`;
}

// Re-use whatever password is already documented for an email so that
// re-running this generator never invalidates credentials that were already
// handed out / already seeded into Supabase. Only brand-new accounts (not
// present in the existing doc) get a freshly generated password.
function loadExistingPasswords() {
  const mdPath = path.join(__dirname, '../generated_credentials.md');
  const byEmail = new Map();
  if (!fs.existsSync(mdPath)) return byEmail;

  const lines = fs.readFileSync(mdPath, 'utf8').split('\n');
  for (const line of lines) {
    if (!line.startsWith('|')) continue;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length !== 4) continue;
    // Staff rows look like: | Name | `email` | Roles | `password` |
    // Demo rows look like:  | Role | Name | `email` | `password` |
    const emailCell = cells.find((c) => /^`.+@.+`$/.test(c));
    const passwordCell = [...cells].reverse().find((c) => /^`.+`$/.test(c) && c !== emailCell);
    if (!emailCell || !passwordCell) continue;
    const email = emailCell.replace(/`/g, '');
    const password = passwordCell.replace(/`/g, '');
    if (email.includes('@')) byEmail.set(email, password);
  }
  return byEmail;
}

const existingPasswords = loadExistingPasswords();

// Set of all unique people mapped by name
const people = new Map();

function addPerson(name, role) {
  if (!people.has(name)) {
    const email = cleanNameForEmail(name);
    people.set(name, {
      name,
      email,
      password: existingPasswords.get(email) || generatePassword(),
      roles: []
    });
  }
  people.get(name).roles.push(role);
}

// Populate people
adminNames.forEach(n => addPerson(n, "admin"));
akademikNames.forEach(n => addPerson(n, "akademik"));
ketetapNames.forEach(n => addPerson(n, "ketetap"));
kangguruNames.forEach(n => addPerson(n, "kangguru"));
karyawanNames.forEach(n => addPerson(n, "karyawan"));
evalNames.forEach(n => addPerson(n, "eval"));

// Demo accounts (bypass first-login password reset)
const demoAccounts = [
  { name: "Demo Admin", email: "demo.admin@konstanta.my.id", password: "AdminDemo123!", roles: ["admin"] },
  { name: "Demo Akademik", email: "demo.akademik@konstanta.my.id", password: "AkademikDemo123!", roles: ["akademik"] },
  { name: "Demo KETetap", email: "demo.ketetap@konstanta.my.id", password: "KetetapDemo123!", roles: ["ketetap"] },
  { name: "Demo KangGuru", email: "demo.kangguru@konstanta.my.id", password: "KangguruDemo123!", roles: ["kangguru"] },
  { name: "Demo Eval", email: "demo.eval@konstanta.my.id", password: "EvalDemo123!", roles: ["eval"] },
  { name: "Demo Karyawan", email: "demo.karyawan@konstanta.my.id", password: "KaryawanDemo123!", roles: ["karyawan"] },
  // Linked to demo students (ST1/ST2) by supabase/seed_lms.sql after this
  // seed runs — see that file for the parent_student_links / auth_user_id
  // wiring, since this script only knows about staff, not students.
  { name: "Demo Orang Tua", email: "demo.otk@konstanta.my.id", password: "OtkDemo123!", roles: ["otk"] },
  { name: "Demo Siswa", email: "demo.kenz@konstanta.my.id", password: "KenzDemo123!", roles: ["kenz"] }
];

// ============================================================
// SQL generation
//
// Every statement is keyed off `email` (never off a UUID we guessed
// client-side), and is safe to run on a fresh project AND on a project
// that already has some/all of these accounts:
//   - auth.users: inserted only if the email doesn't exist yet; if it
//     already exists, only app_metadata/user_metadata are refreshed —
//     the password is left untouched so nobody who already changed
//     their password gets locked out.
//   - auth.identities: inserted only if missing.
//   - public.profiles: id is looked up from auth.users by email, so it
//     works whether the row was just created above or already existed
//     with some other id. must_change_password is only set when the
//     profiles row doesn't exist yet (never reset on an existing row).
// ============================================================

function buildUserSql(user, mustChangePasswordForNewProfile) {
  const primaryRole = getPrimaryRole(user.roles);
  const appMetadata = JSON.stringify({
    provider: "email",
    providers: ["email"],
    role: primaryRole,
    roles: user.roles
  });
  const userMetadata = JSON.stringify({
    full_name: user.name
  });

  return `
  -- ${user.name} (${user.roles.join(', ')})
  INSERT INTO auth.users (
    id, instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    '${user.email}',
    crypt('${user.password}', gen_salt('bf')),
    now(),
    '${appMetadata}'::jsonb,
    '${userMetadata}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = '${user.email}');

  UPDATE auth.users SET
    raw_app_meta_data = '${appMetadata}'::jsonb,
    raw_user_meta_data = '${userMetadata}'::jsonb,
    updated_at = now()
  WHERE email = '${user.email}';

  INSERT INTO auth.identities (
    id, user_id, provider_id, provider,
    identity_data, last_sign_in_at,
    created_at, updated_at
  )
  SELECT
    u.id, u.id, u.email, 'email',
    json_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true, 'provider', 'email')::jsonb,
    now(), now(), now()
  FROM auth.users u
  WHERE u.email = '${user.email}'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, '${primaryRole}', '${user.name}', ${mustChangePasswordForNewProfile}, now(), now()
  FROM auth.users u
  WHERE u.email = '${user.email}'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();
`;
}

let sql = `-- ============================================================
-- Konstanta Education Web — Auto-Generated Staff Seeds (konstanta.my.id)
-- Paste ke Supabase SQL Editor dan jalankan.
-- Aman dijalankan berkali-kali: akun yang sudah ada hanya disinkronkan
-- (role/nama/profil), passwordnya TIDAK akan ditimpa.
-- ============================================================

DO $$
BEGIN
  -- --------------------------------------------------------
  -- DEMO ACCOUNTS
  -- --------------------------------------------------------
`;
demoAccounts.forEach(demo => {
  sql += buildUserSql(demo, false);
});

sql += `\n  -- --------------------------------------------------------\n  -- STAFF ACCOUNTS\n  -- --------------------------------------------------------\n`;
people.forEach(person => {
  sql += buildUserSql(person, true);
});

sql += `
END $$;
`;

fs.writeFileSync(path.join(__dirname, '../supabase/seed_staff.sql'), sql);
console.log('Successfully generated supabase/seed_staff.sql');

// Generate Markdown documentation for credentials
let md = `# Staff Credentials (Kredensial Login Staff - konstanta.my.id)

> [!WARNING]
> **Kerahasiaan Kredensial**
> Dokumen ini berisi password awal yang dibuat secara otomatis oleh sistem. Harap simpan dokumen ini secara aman dan segera hapus jika sudah diimpor ke server produksi. Semua staf (kecuali akun demo) **wajib** mengubah password mereka pada saat pertama kali login.

## Akun Demo (Bypass Password Reset)

| Peran (Role) | Nama Akun | Email Login | Password Awal |
|---|---|---|---|
| Admin | Demo Admin | \`demo.admin@konstanta.my.id\` | \`AdminDemo123!\` |
| Akademik | Demo Akademik | \`demo.akademik@konstanta.my.id\` | \`AkademikDemo123!\` |
| KETetap | Demo KETetap | \`demo.ketetap@konstanta.my.id\` | \`KetetapDemo123!\` |
| KangGuru | Demo KangGuru | \`demo.kangguru@konstanta.my.id\` | \`KangguruDemo123!\` |
| Eval | Demo Eval | \`demo.eval@konstanta.my.id\` | \`EvalDemo123!\` |
| Karyawan | Demo Karyawan | \`demo.karyawan@konstanta.my.id\` | \`KaryawanDemo123!\` |
| OTK (Orang Tua) | Demo Orang Tua | \`demo.otk@konstanta.my.id\` | \`OtkDemo123!\` |
| KEnz (Siswa) | Demo Siswa | \`demo.kenz@konstanta.my.id\` | \`KenzDemo123!\` |

> **Catatan OTK/KEnz**: \`Demo Orang Tua\` terhubung ke 2 anak demo (Ahmad — ST1, Siti — ST2) untuk menguji selector multi-anak; \`Demo Siswa\` adalah akun Ahmad (ST1) sendiri. Riwayat kehadiran/nilai untuk kedua akun ini dibuat oleh \`supabase/seed_lms.sql\` — jalankan file itu setelah \`seed_staff.sql\` agar datanya muncul.

## Akun Staff Otomatis (Wajib Reset Password pada Login Pertama)

| Nama Staf | Email Login | Peran (Roles) | Password Awal |
|---|---|---|---|
`;

people.forEach(person => {
  const rolesLabel = person.roles.map(r => r === 'ketetap' ? 'KETetap' : r === 'kangguru' ? 'KangGuru' : r.charAt(0).toUpperCase() + r.slice(1)).join(', ');
  md += `| ${person.name} | \`${person.email}\` | ${rolesLabel} | \`${person.password}\` |\n`;
});

fs.writeFileSync(path.join(__dirname, '../generated_credentials.md'), md);
console.log('Successfully generated generated_credentials.md');
