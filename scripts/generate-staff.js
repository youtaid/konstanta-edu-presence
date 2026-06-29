const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

// Helper to priority rank roles for profiles.role
const rolePriority = ["admin", "akademik", "ketetap", "kangguru", "karyawan"];

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

// Set of all unique people mapped by name
const people = new Map();

function addPerson(name, role) {
  if (!people.has(name)) {
    const email = cleanNameForEmail(name);
    // Generate deterministic UUID based on name for idempotency
    const hash = crypto.createHash('md5').update(name).digest("hex");
    const uuid = `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
    people.set(name, {
      uuid,
      name,
      email,
      password: generatePassword(),
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

// Create demo accounts
const demoAccounts = [
  { uuid: 'd0000000-0000-0000-0000-000000000001', name: "Demo Admin", email: "demo.admin@konstanta.my.id", password: "AdminDemo123!", roles: ["admin"] },
  { uuid: 'd0000000-0000-0000-0000-000000000002', name: "Demo Akademik", email: "demo.akademik@konstanta.my.id", password: "AkademikDemo123!", roles: ["akademik"] },
  { uuid: 'd0000000-0000-0000-0000-000000000003', name: "Demo KETetap", email: "demo.ketetap@konstanta.my.id", password: "KetetapDemo123!", roles: ["ketetap"] },
  { uuid: 'd0000000-0000-0000-0000-000000000004', name: "Demo KangGuru", email: "demo.kangguru@konstanta.my.id", password: "KangguruDemo123!", roles: ["kangguru"] },
  { uuid: 'd0000000-0000-0000-0000-000000000005', name: "Demo Karyawan", email: "demo.karyawan@konstanta.my.id", password: "KaryawanDemo123!", roles: ["karyawan"] }
];

// Generate SQL output
let sql = `-- ============================================================
-- Konstanta Education Web — Auto-Generated Staff Seeds (konstanta.my.id)
-- Paste ke Supabase SQL Editor dan jalankan.
-- Aman dijalankan berkali-kali.
-- ============================================================

DO $$
BEGIN
`;

// Helper to build SQL inserts
function buildUserSql(user, mustChangePassword = true) {
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
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '${user.uuid}') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role,
      email, encrypted_password,
      email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data,
      is_super_admin, is_sso_user,
      created_at, updated_at,
      confirmation_token, recovery_token,
      email_change_token_new, email_change
    ) values
    (
      '${user.uuid}', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      '${user.email}',
      crypt('${user.password}', gen_salt('bf')),
      now(),
      '${appMetadata}'::jsonb,
      '${userMetadata}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '${user.uuid}', '${user.uuid}',
      '${user.email}', 'email',
      json_build_object('sub', '${user.uuid}'::text, 'email', '${user.email}', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '${user.uuid}', '${primaryRole}', '${user.name}', ${mustChangePassword}, now(), now()
    );
  END IF;
`;
}

// Append Demo users
sql += `  -- --------------------------------------------------------\n  -- DEMO ACCOUNTS\n  -- --------------------------------------------------------\n`;
demoAccounts.forEach(demo => {
  sql += buildUserSql(demo, false); // Demo doesn't need first login reset
});

// Append Staff users
sql += `\n  -- --------------------------------------------------------\n  -- STAFF ACCOUNTS\n  -- --------------------------------------------------------\n`;
people.forEach(person => {
  sql += buildUserSql(person, true); // Real staff needs first login reset
});

sql += `
END $$;
`;

// Write seed SQL file
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
| Karyawan | Demo Karyawan | \`demo.karyawan@konstanta.my.id\` | \`KaryawanDemo123!\` |

## Akun Staff Otomatis (Wajib Reset Password pada Login Pertama)

| Nama Staf | Email Login | Peran (Roles) | Password Awal |
|---|---|---|---|
`;

people.forEach(person => {
  const rolesLabel = person.roles.map(r => r === 'ketetap' ? 'KETetap' : r === 'kangguru' ? 'KangGuru' : r.charAt(0).toUpperCase() + r.slice(1)).join(', ');
  md += `| ${person.name} | \`${person.email}\` | ${rolesLabel} | \`${person.password}\` |\n`;
});

// Write Markdown file
fs.writeFileSync(path.join(__dirname, '../generated_credentials.md'), md);
console.log('Successfully generated generated_credentials.md');
