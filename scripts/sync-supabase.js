const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Load env vars
function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  const envFallbackPath = path.join(__dirname, '../.env');
  const envFile = fs.existsSync(envPath) ? envPath : envFallbackPath;
  if (!fs.existsSync(envFile)) {
    console.error('No .env or .env.local file found!');
    process.exit(1);
  }
  const content = fs.readFileSync(envFile, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let val = match[2] || '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }
      env[match[1]] = val.trim();
    }
  });
  return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
const supabaseSecretKey = env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  console.error('Missing Supabase URL or Secret Key in env!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// 2. Load names and definitions from generate-staff logic
const adminNames = ["Anisa Zunayah", "Farid Fachrudin", "Farhanul Karim"];
const akademikNames = ["Budi Rahman", "Farid Fachrudin", "Tisya Aulika Nuri", "M. Rasya Azmi"];
const ketetapNames = [
  "Mukti Karya Utama", "M. Arief Ridwan", "Anisa Zunayah", "Farid Fachrudin", 
  "Farhanul Karim", "Budi Rahman", "Retno Yusniawati", "Ibnu Sina", 
  "Inggrit Maylinda", "Ponco Arief Triyasto", "M. Rafly Novanto", "Akbar Ramadhian", "Fairuz Salsabilla"
];
const kangguruNames = [
  "Achmad Rivai", "Ade K Irawan", "Aditya Perbawa", "Ahmad Faris", "Al Akrom", 
  "Akhit Anis", "Andromeda", "Annahel Aliesta", "Annisa Michellia", "Arif Sapta Diputra", 
  "Aulia Dini", "Cahya Sasmita", "Candra Riyadi", "Cecep Saepudin Ahmad", "Daulat Harahap", 
  "Dede Abdul Hakim", "Dewi Siska", "Dika Amalia Lutfiana", "Dolly Fernando", "Eko Priono", 
  "Eko Wandoyo", "Fachrizal Nurrachman", "Fadhilah Rahmani", "Fahmi Firmansyah", "Fawaidul Khoir", 
  "Fasniyanto", "Fathan Mubinan", "Frimadani", "Gentur Meshubudi", "Gianni Benhardi", 
  "Gilang Ainan", "Hanunah Sofa", "Hasbiyallah", "Jurio Susilo", "Kartim", "Kelik Adi Trinugroho", 
  "Lidia Rentina Pardede", "Lisa Rosaline", "Muarif Ambari", "M. Tulodo A", "Muhammad Arief", 
  "Mujahidin Faruqul Adzim", "Muhammad Faisal Aulia", "Muhamad Ridho", "Natasya Adysaphira", 
  "Nyimas Komariah S", "Pambudi Rahardjo", "Purnomo", "Putri Khumaeroh", "Raihana Zahra", 
  "Rama Akbar Saputra", "Ramadhan Sagala", "Ratih Novia Pratiwi", "Restu Asegaf", 
  "Rian Pratama", "Roy Hadiyanto", "Sigit Ramires", "Susilawati", "Taufik Hidayat", 
  "Tranggono Setya R (Tio)", "Wahyu", "Yana", "Yasmine"
];
const karyawanNames = ["Sumardi", "Imanoeddin", "Tisya Aulika Nuri", "M. Rasya Azmi", "Ahmad Fatihul Ihsan"];
const evalNames = ["Farid Fachrudin", "M. Arief Ridwan"];

const rolePriority = ["admin", "akademik", "eval", "ketetap", "kangguru", "karyawan"];

function getPrimaryRole(roles) {
  for (const role of rolePriority) {
    if (roles.includes(role)) return role;
  }
  return roles[0] || "karyawan";
}

function cleanNameForEmail(name) {
  let clean = name.replace(/\s*\([^)]*\)\s*/g, "").trim();
  clean = clean.replace(/\s+/g, " ");
  clean = clean.replace(/[^a-zA-Z0-9\s.]/g, "");
  const parts = clean.toLowerCase().split(" ").filter(Boolean);
  return parts.join(".") + "@konstanta.my.id";
}

// Read existing passwords from generated_credentials.md if it exists
function loadExistingPasswords() {
  const mdPath = path.join(__dirname, '../generated_credentials.md');
  const byEmail = new Map();
  if (!fs.existsSync(mdPath)) return byEmail;

  const lines = fs.readFileSync(mdPath, 'utf8').split('\n');
  for (const line of lines) {
    if (!line.startsWith('|')) continue;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length !== 4) continue;
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
const people = new Map();

function addPerson(name, role) {
  if (!people.has(name)) {
    const email = cleanNameForEmail(name);
    people.set(name, {
      name,
      email,
      password: existingPasswords.get(email),
      roles: []
    });
  }
  people.get(name).roles.push(role);
}

adminNames.forEach(n => addPerson(n, "admin"));
akademikNames.forEach(n => addPerson(n, "akademik"));
ketetapNames.forEach(n => addPerson(n, "ketetap"));
kangguruNames.forEach(n => addPerson(n, "kangguru"));
karyawanNames.forEach(n => addPerson(n, "karyawan"));
evalNames.forEach(n => addPerson(n, "eval"));

const demoAccounts = [
  { name: "Demo Admin", email: "demo.admin@konstanta.my.id", password: "AdminDemo123!", roles: ["admin"] },
  { name: "Demo Akademik", email: "demo.akademik@konstanta.my.id", password: "AkademikDemo123!", roles: ["akademik"] },
  { name: "Demo KETetap", email: "demo.ketetap@konstanta.my.id", password: "KetetapDemo123!", roles: ["ketetap"] },
  { name: "Demo KangGuru", email: "demo.kangguru@konstanta.my.id", password: "KangguruDemo123!", roles: ["kangguru"] },
  { name: "Demo Eval", email: "demo.eval@konstanta.my.id", password: "EvalDemo123!", roles: ["eval"] },
  { name: "Demo Karyawan", email: "demo.karyawan@konstanta.my.id", password: "KaryawanDemo123!", roles: ["karyawan"] },
  { name: "Demo Orang Tua", email: "demo.otk@konstanta.my.id", password: "OtkDemo123!", roles: ["otk"] },
  { name: "Demo Siswa", email: "demo.kenz@konstanta.my.id", password: "KenzDemo123!", roles: ["kenz"] }
];

async function syncUser(user, mustChangePassword) {
  const primaryRole = getPrimaryRole(user.roles);
  
  console.log(`Syncing user: ${user.email} (${user.name})...`);
  
  let authUser = null;
  try {
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password || 'Konstanta123!',
      email_confirm: true,
      app_metadata: {
        provider: 'email',
        providers: ['email'],
        role: primaryRole,
        roles: user.roles
      },
      user_metadata: {
        full_name: user.name
      }
    });

    if (createError) {
      if (createError.message.includes('already exists') || createError.status === 422 || (createError.message && createError.message.toLowerCase().includes('duplicate'))) {
        // User already exists, fetch list to find user
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({
          perPage: 1000
        });
        if (listError) throw listError;
        authUser = users.find(u => u.email === user.email);
        if (!authUser) {
          throw new Error(`User with email ${user.email} already exists but could not be found in list.`);
        }
        
        console.log(`User ${user.email} already exists. Updating metadata...`);
        const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
          authUser.id,
          {
            email: user.email,
            // If they are a demo user, we also reset/enforce the password to match generated_credentials.md
            password: !mustChangePassword ? user.password : undefined,
            app_metadata: {
              role: primaryRole,
              roles: user.roles
            },
            user_metadata: {
              full_name: user.name
            }
          }
        );
        if (updateError) throw updateError;
        authUser = updateData.user;
      } else {
        throw createError;
      }
    } else {
      console.log(`Successfully created auth user: ${user.email}`);
      authUser = createData.user;
    }
  } catch (err) {
    console.error(`Failed to create/update auth user for ${user.email}:`, err.message);
    return;
  }

  // Now, upsert into profiles table
  try {
    const { data: existingProfile, error: profileFetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', authUser.id)
      .single();

    if (profileFetchError && profileFetchError.code !== 'PGRST116') {
      throw profileFetchError;
    }

    if (existingProfile) {
      console.log(`Updating profile for ${user.name}...`);
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          role: primaryRole,
          full_name: user.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', authUser.id);
      if (updateError) throw updateError;
    } else {
      console.log(`Inserting profile for ${user.name}...`);
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: authUser.id,
          role: primaryRole,
          full_name: user.name,
          must_change_password: mustChangePassword,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      if (insertError) throw insertError;
    }
    console.log(`Profile synced for ${user.name}.`);
  } catch (err) {
    console.error(`Failed to upsert profile for ${user.name}:`, err.message);
  }
}

async function main() {
  console.log('Starting sync to Supabase cloud...');
  
  console.log('\n--- Syncing Demo Accounts ---');
  for (const demo of demoAccounts) {
    await syncUser(demo, false);
  }

  console.log('\n--- Syncing Staff Accounts ---');
  for (const person of people.values()) {
    await syncUser(person, true);
  }

  console.log('\nSync completed successfully!');
}

main().catch(err => {
  console.error('Unhandled error in main sync:', err);
});
