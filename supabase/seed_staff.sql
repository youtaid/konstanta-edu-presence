-- ============================================================
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

  -- Demo Admin (admin)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo.admin@konstanta.my.id',
    crypt('AdminDemo123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"admin","roles":["admin"]}'::jsonb,
    '{"full_name":"Demo Admin"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'demo.admin@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"admin","roles":["admin"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Demo Admin"}'::jsonb,
    updated_at = now()
  WHERE email = 'demo.admin@konstanta.my.id';

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
  WHERE u.email = 'demo.admin@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'admin', 'Demo Admin', false, now(), now()
  FROM auth.users u
  WHERE u.email = 'demo.admin@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Demo Akademik (akademik)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo.akademik@konstanta.my.id',
    crypt('AkademikDemo123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"akademik","roles":["akademik"]}'::jsonb,
    '{"full_name":"Demo Akademik"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'demo.akademik@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"akademik","roles":["akademik"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Demo Akademik"}'::jsonb,
    updated_at = now()
  WHERE email = 'demo.akademik@konstanta.my.id';

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
  WHERE u.email = 'demo.akademik@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'akademik', 'Demo Akademik', false, now(), now()
  FROM auth.users u
  WHERE u.email = 'demo.akademik@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Demo KETetap (ketetap)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo.ketetap@konstanta.my.id',
    crypt('KetetapDemo123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
    '{"full_name":"Demo KETetap"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'demo.ketetap@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Demo KETetap"}'::jsonb,
    updated_at = now()
  WHERE email = 'demo.ketetap@konstanta.my.id';

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
  WHERE u.email = 'demo.ketetap@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'ketetap', 'Demo KETetap', false, now(), now()
  FROM auth.users u
  WHERE u.email = 'demo.ketetap@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Demo KangGuru (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo.kangguru@konstanta.my.id',
    crypt('KangguruDemo123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Demo KangGuru"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'demo.kangguru@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Demo KangGuru"}'::jsonb,
    updated_at = now()
  WHERE email = 'demo.kangguru@konstanta.my.id';

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
  WHERE u.email = 'demo.kangguru@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Demo KangGuru', false, now(), now()
  FROM auth.users u
  WHERE u.email = 'demo.kangguru@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Demo Karyawan (karyawan)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo.karyawan@konstanta.my.id',
    crypt('KaryawanDemo123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"karyawan","roles":["karyawan"]}'::jsonb,
    '{"full_name":"Demo Karyawan"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'demo.karyawan@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"karyawan","roles":["karyawan"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Demo Karyawan"}'::jsonb,
    updated_at = now()
  WHERE email = 'demo.karyawan@konstanta.my.id';

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
  WHERE u.email = 'demo.karyawan@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'karyawan', 'Demo Karyawan', false, now(), now()
  FROM auth.users u
  WHERE u.email = 'demo.karyawan@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- --------------------------------------------------------
  -- STAFF ACCOUNTS
  -- --------------------------------------------------------

  -- Anisa Zunayah (admin, ketetap)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'anisa.zunayah@konstanta.my.id',
    crypt('Konstanta6716', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"admin","roles":["admin","ketetap"]}'::jsonb,
    '{"full_name":"Anisa Zunayah"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'anisa.zunayah@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"admin","roles":["admin","ketetap"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Anisa Zunayah"}'::jsonb,
    updated_at = now()
  WHERE email = 'anisa.zunayah@konstanta.my.id';

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
  WHERE u.email = 'anisa.zunayah@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'admin', 'Anisa Zunayah', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'anisa.zunayah@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Farid Fachrudin (admin, akademik, ketetap)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'farid.fachrudin@konstanta.my.id',
    crypt('Konstanta1386', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"admin","roles":["admin","akademik","ketetap"]}'::jsonb,
    '{"full_name":"Farid Fachrudin"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'farid.fachrudin@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"admin","roles":["admin","akademik","ketetap"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Farid Fachrudin"}'::jsonb,
    updated_at = now()
  WHERE email = 'farid.fachrudin@konstanta.my.id';

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
  WHERE u.email = 'farid.fachrudin@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'admin', 'Farid Fachrudin', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'farid.fachrudin@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Farhanul Karim (admin, ketetap)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'farhanul.karim@konstanta.my.id',
    crypt('Konstanta9928', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"admin","roles":["admin","ketetap"]}'::jsonb,
    '{"full_name":"Farhanul Karim"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'farhanul.karim@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"admin","roles":["admin","ketetap"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Farhanul Karim"}'::jsonb,
    updated_at = now()
  WHERE email = 'farhanul.karim@konstanta.my.id';

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
  WHERE u.email = 'farhanul.karim@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'admin', 'Farhanul Karim', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'farhanul.karim@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Budi Rahman (akademik, ketetap)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'budi.rahman@konstanta.my.id',
    crypt('Konstanta2332', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"akademik","roles":["akademik","ketetap"]}'::jsonb,
    '{"full_name":"Budi Rahman"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'budi.rahman@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"akademik","roles":["akademik","ketetap"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Budi Rahman"}'::jsonb,
    updated_at = now()
  WHERE email = 'budi.rahman@konstanta.my.id';

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
  WHERE u.email = 'budi.rahman@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'akademik', 'Budi Rahman', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'budi.rahman@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Tisya Aulika Nuri (akademik, karyawan)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'tisya.aulika.nuri@konstanta.my.id',
    crypt('Konstanta2094', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"akademik","roles":["akademik","karyawan"]}'::jsonb,
    '{"full_name":"Tisya Aulika Nuri"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'tisya.aulika.nuri@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"akademik","roles":["akademik","karyawan"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Tisya Aulika Nuri"}'::jsonb,
    updated_at = now()
  WHERE email = 'tisya.aulika.nuri@konstanta.my.id';

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
  WHERE u.email = 'tisya.aulika.nuri@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'akademik', 'Tisya Aulika Nuri', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'tisya.aulika.nuri@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- M. Rasya Azmi (akademik, karyawan)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'm..rasya.azmi@konstanta.my.id',
    crypt('Konstanta1903', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"akademik","roles":["akademik","karyawan"]}'::jsonb,
    '{"full_name":"M. Rasya Azmi"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'm..rasya.azmi@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"akademik","roles":["akademik","karyawan"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"M. Rasya Azmi"}'::jsonb,
    updated_at = now()
  WHERE email = 'm..rasya.azmi@konstanta.my.id';

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
  WHERE u.email = 'm..rasya.azmi@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'akademik', 'M. Rasya Azmi', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'm..rasya.azmi@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Mukti Karya Utama (ketetap)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'mukti.karya.utama@konstanta.my.id',
    crypt('Konstanta2389', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
    '{"full_name":"Mukti Karya Utama"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mukti.karya.utama@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Mukti Karya Utama"}'::jsonb,
    updated_at = now()
  WHERE email = 'mukti.karya.utama@konstanta.my.id';

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
  WHERE u.email = 'mukti.karya.utama@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'ketetap', 'Mukti Karya Utama', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'mukti.karya.utama@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- M. Arief Ridwan (ketetap)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'm..arief.ridwan@konstanta.my.id',
    crypt('Konstanta9771', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
    '{"full_name":"M. Arief Ridwan"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'm..arief.ridwan@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"M. Arief Ridwan"}'::jsonb,
    updated_at = now()
  WHERE email = 'm..arief.ridwan@konstanta.my.id';

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
  WHERE u.email = 'm..arief.ridwan@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'ketetap', 'M. Arief Ridwan', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'm..arief.ridwan@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Retno Yusniawati (ketetap)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'retno.yusniawati@konstanta.my.id',
    crypt('Konstanta6142', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
    '{"full_name":"Retno Yusniawati"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'retno.yusniawati@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Retno Yusniawati"}'::jsonb,
    updated_at = now()
  WHERE email = 'retno.yusniawati@konstanta.my.id';

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
  WHERE u.email = 'retno.yusniawati@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'ketetap', 'Retno Yusniawati', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'retno.yusniawati@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Ibnu Sina (ketetap)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'ibnu.sina@konstanta.my.id',
    crypt('Konstanta5764', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
    '{"full_name":"Ibnu Sina"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ibnu.sina@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Ibnu Sina"}'::jsonb,
    updated_at = now()
  WHERE email = 'ibnu.sina@konstanta.my.id';

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
  WHERE u.email = 'ibnu.sina@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'ketetap', 'Ibnu Sina', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'ibnu.sina@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Inggrit Maylinda (ketetap)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'inggrit.maylinda@konstanta.my.id',
    crypt('Konstanta1903', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
    '{"full_name":"Inggrit Maylinda"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'inggrit.maylinda@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Inggrit Maylinda"}'::jsonb,
    updated_at = now()
  WHERE email = 'inggrit.maylinda@konstanta.my.id';

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
  WHERE u.email = 'inggrit.maylinda@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'ketetap', 'Inggrit Maylinda', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'inggrit.maylinda@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Ponco Arief Triyasto (ketetap)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'ponco.arief.triyasto@konstanta.my.id',
    crypt('Konstanta5647', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
    '{"full_name":"Ponco Arief Triyasto"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ponco.arief.triyasto@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Ponco Arief Triyasto"}'::jsonb,
    updated_at = now()
  WHERE email = 'ponco.arief.triyasto@konstanta.my.id';

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
  WHERE u.email = 'ponco.arief.triyasto@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'ketetap', 'Ponco Arief Triyasto', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'ponco.arief.triyasto@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- M. Rafly Novanto (ketetap)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'm..rafly.novanto@konstanta.my.id',
    crypt('Konstanta7838', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
    '{"full_name":"M. Rafly Novanto"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'm..rafly.novanto@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"M. Rafly Novanto"}'::jsonb,
    updated_at = now()
  WHERE email = 'm..rafly.novanto@konstanta.my.id';

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
  WHERE u.email = 'm..rafly.novanto@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'ketetap', 'M. Rafly Novanto', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'm..rafly.novanto@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Akbar Ramadhian (ketetap)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'akbar.ramadhian@konstanta.my.id',
    crypt('Konstanta3669', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
    '{"full_name":"Akbar Ramadhian"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'akbar.ramadhian@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Akbar Ramadhian"}'::jsonb,
    updated_at = now()
  WHERE email = 'akbar.ramadhian@konstanta.my.id';

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
  WHERE u.email = 'akbar.ramadhian@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'ketetap', 'Akbar Ramadhian', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'akbar.ramadhian@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Fairuz Salsabilla (ketetap)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'fairuz.salsabilla@konstanta.my.id',
    crypt('Konstanta9763', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
    '{"full_name":"Fairuz Salsabilla"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'fairuz.salsabilla@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Fairuz Salsabilla"}'::jsonb,
    updated_at = now()
  WHERE email = 'fairuz.salsabilla@konstanta.my.id';

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
  WHERE u.email = 'fairuz.salsabilla@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'ketetap', 'Fairuz Salsabilla', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'fairuz.salsabilla@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Achmad Rivai (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'achmad.rivai@konstanta.my.id',
    crypt('Konstanta2934', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Achmad Rivai"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'achmad.rivai@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Achmad Rivai"}'::jsonb,
    updated_at = now()
  WHERE email = 'achmad.rivai@konstanta.my.id';

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
  WHERE u.email = 'achmad.rivai@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Achmad Rivai', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'achmad.rivai@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Ade K Irawan (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'ade.k.irawan@konstanta.my.id',
    crypt('Konstanta1179', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Ade K Irawan"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ade.k.irawan@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Ade K Irawan"}'::jsonb,
    updated_at = now()
  WHERE email = 'ade.k.irawan@konstanta.my.id';

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
  WHERE u.email = 'ade.k.irawan@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Ade K Irawan', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'ade.k.irawan@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Aditya Perbawa (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'aditya.perbawa@konstanta.my.id',
    crypt('Konstanta7097', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Aditya Perbawa"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'aditya.perbawa@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Aditya Perbawa"}'::jsonb,
    updated_at = now()
  WHERE email = 'aditya.perbawa@konstanta.my.id';

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
  WHERE u.email = 'aditya.perbawa@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Aditya Perbawa', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'aditya.perbawa@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Ahmad Faris (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'ahmad.faris@konstanta.my.id',
    crypt('Konstanta7210', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Ahmad Faris"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ahmad.faris@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Ahmad Faris"}'::jsonb,
    updated_at = now()
  WHERE email = 'ahmad.faris@konstanta.my.id';

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
  WHERE u.email = 'ahmad.faris@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Ahmad Faris', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'ahmad.faris@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Al Akrom (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'al.akrom@konstanta.my.id',
    crypt('Konstanta3143', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Al Akrom"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'al.akrom@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Al Akrom"}'::jsonb,
    updated_at = now()
  WHERE email = 'al.akrom@konstanta.my.id';

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
  WHERE u.email = 'al.akrom@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Al Akrom', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'al.akrom@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Akhit Anis (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'akhit.anis@konstanta.my.id',
    crypt('Konstanta3107', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Akhit Anis"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'akhit.anis@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Akhit Anis"}'::jsonb,
    updated_at = now()
  WHERE email = 'akhit.anis@konstanta.my.id';

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
  WHERE u.email = 'akhit.anis@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Akhit Anis', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'akhit.anis@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Andromeda (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'andromeda@konstanta.my.id',
    crypt('Konstanta3738', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Andromeda"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'andromeda@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Andromeda"}'::jsonb,
    updated_at = now()
  WHERE email = 'andromeda@konstanta.my.id';

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
  WHERE u.email = 'andromeda@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Andromeda', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'andromeda@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Annahel Aliesta (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'annahel.aliesta@konstanta.my.id',
    crypt('Konstanta2858', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Annahel Aliesta"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'annahel.aliesta@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Annahel Aliesta"}'::jsonb,
    updated_at = now()
  WHERE email = 'annahel.aliesta@konstanta.my.id';

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
  WHERE u.email = 'annahel.aliesta@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Annahel Aliesta', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'annahel.aliesta@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Annisa Michellia (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'annisa.michellia@konstanta.my.id',
    crypt('Konstanta8173', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Annisa Michellia"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'annisa.michellia@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Annisa Michellia"}'::jsonb,
    updated_at = now()
  WHERE email = 'annisa.michellia@konstanta.my.id';

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
  WHERE u.email = 'annisa.michellia@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Annisa Michellia', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'annisa.michellia@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Arif Sapta Diputra (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'arif.sapta.diputra@konstanta.my.id',
    crypt('Konstanta2335', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Arif Sapta Diputra"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'arif.sapta.diputra@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Arif Sapta Diputra"}'::jsonb,
    updated_at = now()
  WHERE email = 'arif.sapta.diputra@konstanta.my.id';

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
  WHERE u.email = 'arif.sapta.diputra@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Arif Sapta Diputra', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'arif.sapta.diputra@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Aulia Dini (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'aulia.dini@konstanta.my.id',
    crypt('Konstanta5513', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Aulia Dini"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'aulia.dini@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Aulia Dini"}'::jsonb,
    updated_at = now()
  WHERE email = 'aulia.dini@konstanta.my.id';

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
  WHERE u.email = 'aulia.dini@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Aulia Dini', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'aulia.dini@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Cahya Sasmita (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'cahya.sasmita@konstanta.my.id',
    crypt('Konstanta8444', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Cahya Sasmita"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'cahya.sasmita@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Cahya Sasmita"}'::jsonb,
    updated_at = now()
  WHERE email = 'cahya.sasmita@konstanta.my.id';

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
  WHERE u.email = 'cahya.sasmita@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Cahya Sasmita', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'cahya.sasmita@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Candra Riyadi (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'candra.riyadi@konstanta.my.id',
    crypt('Konstanta7721', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Candra Riyadi"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'candra.riyadi@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Candra Riyadi"}'::jsonb,
    updated_at = now()
  WHERE email = 'candra.riyadi@konstanta.my.id';

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
  WHERE u.email = 'candra.riyadi@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Candra Riyadi', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'candra.riyadi@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Cecep Saepudin Ahmad (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'cecep.saepudin.ahmad@konstanta.my.id',
    crypt('Konstanta6777', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Cecep Saepudin Ahmad"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'cecep.saepudin.ahmad@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Cecep Saepudin Ahmad"}'::jsonb,
    updated_at = now()
  WHERE email = 'cecep.saepudin.ahmad@konstanta.my.id';

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
  WHERE u.email = 'cecep.saepudin.ahmad@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Cecep Saepudin Ahmad', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'cecep.saepudin.ahmad@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Daulat Harahap (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'daulat.harahap@konstanta.my.id',
    crypt('Konstanta7738', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Daulat Harahap"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'daulat.harahap@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Daulat Harahap"}'::jsonb,
    updated_at = now()
  WHERE email = 'daulat.harahap@konstanta.my.id';

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
  WHERE u.email = 'daulat.harahap@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Daulat Harahap', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'daulat.harahap@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Dede Abdul Hakim (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'dede.abdul.hakim@konstanta.my.id',
    crypt('Konstanta2178', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Dede Abdul Hakim"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dede.abdul.hakim@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Dede Abdul Hakim"}'::jsonb,
    updated_at = now()
  WHERE email = 'dede.abdul.hakim@konstanta.my.id';

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
  WHERE u.email = 'dede.abdul.hakim@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Dede Abdul Hakim', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'dede.abdul.hakim@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Dewi Siska (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'dewi.siska@konstanta.my.id',
    crypt('Konstanta7314', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Dewi Siska"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dewi.siska@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Dewi Siska"}'::jsonb,
    updated_at = now()
  WHERE email = 'dewi.siska@konstanta.my.id';

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
  WHERE u.email = 'dewi.siska@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Dewi Siska', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'dewi.siska@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Dika Amalia Lutfiana (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'dika.amalia.lutfiana@konstanta.my.id',
    crypt('Konstanta7711', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Dika Amalia Lutfiana"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dika.amalia.lutfiana@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Dika Amalia Lutfiana"}'::jsonb,
    updated_at = now()
  WHERE email = 'dika.amalia.lutfiana@konstanta.my.id';

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
  WHERE u.email = 'dika.amalia.lutfiana@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Dika Amalia Lutfiana', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'dika.amalia.lutfiana@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Dolly Fernando (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'dolly.fernando@konstanta.my.id',
    crypt('Konstanta8801', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Dolly Fernando"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dolly.fernando@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Dolly Fernando"}'::jsonb,
    updated_at = now()
  WHERE email = 'dolly.fernando@konstanta.my.id';

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
  WHERE u.email = 'dolly.fernando@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Dolly Fernando', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'dolly.fernando@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Eko Priono (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'eko.priono@konstanta.my.id',
    crypt('Konstanta1757', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Eko Priono"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'eko.priono@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Eko Priono"}'::jsonb,
    updated_at = now()
  WHERE email = 'eko.priono@konstanta.my.id';

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
  WHERE u.email = 'eko.priono@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Eko Priono', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'eko.priono@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Eko Wandoyo (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'eko.wandoyo@konstanta.my.id',
    crypt('Konstanta4726', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Eko Wandoyo"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'eko.wandoyo@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Eko Wandoyo"}'::jsonb,
    updated_at = now()
  WHERE email = 'eko.wandoyo@konstanta.my.id';

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
  WHERE u.email = 'eko.wandoyo@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Eko Wandoyo', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'eko.wandoyo@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Fachrizal Nurrachman (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'fachrizal.nurrachman@konstanta.my.id',
    crypt('Konstanta1591', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Fachrizal Nurrachman"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'fachrizal.nurrachman@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Fachrizal Nurrachman"}'::jsonb,
    updated_at = now()
  WHERE email = 'fachrizal.nurrachman@konstanta.my.id';

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
  WHERE u.email = 'fachrizal.nurrachman@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Fachrizal Nurrachman', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'fachrizal.nurrachman@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Fadhilah Rahmani (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'fadhilah.rahmani@konstanta.my.id',
    crypt('Konstanta3190', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Fadhilah Rahmani"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'fadhilah.rahmani@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Fadhilah Rahmani"}'::jsonb,
    updated_at = now()
  WHERE email = 'fadhilah.rahmani@konstanta.my.id';

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
  WHERE u.email = 'fadhilah.rahmani@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Fadhilah Rahmani', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'fadhilah.rahmani@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Fahmi Firmansyah (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'fahmi.firmansyah@konstanta.my.id',
    crypt('Konstanta3168', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Fahmi Firmansyah"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'fahmi.firmansyah@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Fahmi Firmansyah"}'::jsonb,
    updated_at = now()
  WHERE email = 'fahmi.firmansyah@konstanta.my.id';

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
  WHERE u.email = 'fahmi.firmansyah@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Fahmi Firmansyah', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'fahmi.firmansyah@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Fawaidul Khoir (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'fawaidul.khoir@konstanta.my.id',
    crypt('Konstanta2590', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Fawaidul Khoir"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'fawaidul.khoir@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Fawaidul Khoir"}'::jsonb,
    updated_at = now()
  WHERE email = 'fawaidul.khoir@konstanta.my.id';

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
  WHERE u.email = 'fawaidul.khoir@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Fawaidul Khoir', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'fawaidul.khoir@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Fasniyanto (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'fasniyanto@konstanta.my.id',
    crypt('Konstanta9611', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Fasniyanto"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'fasniyanto@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Fasniyanto"}'::jsonb,
    updated_at = now()
  WHERE email = 'fasniyanto@konstanta.my.id';

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
  WHERE u.email = 'fasniyanto@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Fasniyanto', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'fasniyanto@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Fathan Mubinan (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'fathan.mubinan@konstanta.my.id',
    crypt('Konstanta7153', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Fathan Mubinan"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'fathan.mubinan@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Fathan Mubinan"}'::jsonb,
    updated_at = now()
  WHERE email = 'fathan.mubinan@konstanta.my.id';

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
  WHERE u.email = 'fathan.mubinan@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Fathan Mubinan', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'fathan.mubinan@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Frimadani (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'frimadani@konstanta.my.id',
    crypt('Konstanta3074', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Frimadani"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'frimadani@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Frimadani"}'::jsonb,
    updated_at = now()
  WHERE email = 'frimadani@konstanta.my.id';

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
  WHERE u.email = 'frimadani@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Frimadani', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'frimadani@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Gentur Meshubudi (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'gentur.meshubudi@konstanta.my.id',
    crypt('Konstanta6152', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Gentur Meshubudi"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'gentur.meshubudi@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Gentur Meshubudi"}'::jsonb,
    updated_at = now()
  WHERE email = 'gentur.meshubudi@konstanta.my.id';

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
  WHERE u.email = 'gentur.meshubudi@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Gentur Meshubudi', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'gentur.meshubudi@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Gianni Benhardi (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'gianni.benhardi@konstanta.my.id',
    crypt('Konstanta2274', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Gianni Benhardi"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'gianni.benhardi@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Gianni Benhardi"}'::jsonb,
    updated_at = now()
  WHERE email = 'gianni.benhardi@konstanta.my.id';

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
  WHERE u.email = 'gianni.benhardi@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Gianni Benhardi', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'gianni.benhardi@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Gilang Ainan (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'gilang.ainan@konstanta.my.id',
    crypt('Konstanta9912', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Gilang Ainan"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'gilang.ainan@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Gilang Ainan"}'::jsonb,
    updated_at = now()
  WHERE email = 'gilang.ainan@konstanta.my.id';

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
  WHERE u.email = 'gilang.ainan@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Gilang Ainan', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'gilang.ainan@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Hanunah Sofa (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'hanunah.sofa@konstanta.my.id',
    crypt('Konstanta5570', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Hanunah Sofa"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'hanunah.sofa@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Hanunah Sofa"}'::jsonb,
    updated_at = now()
  WHERE email = 'hanunah.sofa@konstanta.my.id';

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
  WHERE u.email = 'hanunah.sofa@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Hanunah Sofa', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'hanunah.sofa@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Hasbiyallah (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'hasbiyallah@konstanta.my.id',
    crypt('Konstanta9243', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Hasbiyallah"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'hasbiyallah@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Hasbiyallah"}'::jsonb,
    updated_at = now()
  WHERE email = 'hasbiyallah@konstanta.my.id';

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
  WHERE u.email = 'hasbiyallah@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Hasbiyallah', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'hasbiyallah@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Jurio Susilo (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'jurio.susilo@konstanta.my.id',
    crypt('Konstanta8589', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Jurio Susilo"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'jurio.susilo@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Jurio Susilo"}'::jsonb,
    updated_at = now()
  WHERE email = 'jurio.susilo@konstanta.my.id';

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
  WHERE u.email = 'jurio.susilo@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Jurio Susilo', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'jurio.susilo@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Kartim (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'kartim@konstanta.my.id',
    crypt('Konstanta8811', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Kartim"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'kartim@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Kartim"}'::jsonb,
    updated_at = now()
  WHERE email = 'kartim@konstanta.my.id';

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
  WHERE u.email = 'kartim@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Kartim', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'kartim@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Kelik Adi Trinugroho (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'kelik.adi.trinugroho@konstanta.my.id',
    crypt('Konstanta7425', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Kelik Adi Trinugroho"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'kelik.adi.trinugroho@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Kelik Adi Trinugroho"}'::jsonb,
    updated_at = now()
  WHERE email = 'kelik.adi.trinugroho@konstanta.my.id';

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
  WHERE u.email = 'kelik.adi.trinugroho@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Kelik Adi Trinugroho', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'kelik.adi.trinugroho@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Lidia Rentina Pardede (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'lidia.rentina.pardede@konstanta.my.id',
    crypt('Konstanta5993', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Lidia Rentina Pardede"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'lidia.rentina.pardede@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Lidia Rentina Pardede"}'::jsonb,
    updated_at = now()
  WHERE email = 'lidia.rentina.pardede@konstanta.my.id';

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
  WHERE u.email = 'lidia.rentina.pardede@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Lidia Rentina Pardede', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'lidia.rentina.pardede@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Lisa Rosaline (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'lisa.rosaline@konstanta.my.id',
    crypt('Konstanta8623', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Lisa Rosaline"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'lisa.rosaline@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Lisa Rosaline"}'::jsonb,
    updated_at = now()
  WHERE email = 'lisa.rosaline@konstanta.my.id';

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
  WHERE u.email = 'lisa.rosaline@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Lisa Rosaline', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'lisa.rosaline@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Muarif Ambari (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'muarif.ambari@konstanta.my.id',
    crypt('Konstanta6051', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Muarif Ambari"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'muarif.ambari@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Muarif Ambari"}'::jsonb,
    updated_at = now()
  WHERE email = 'muarif.ambari@konstanta.my.id';

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
  WHERE u.email = 'muarif.ambari@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Muarif Ambari', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'muarif.ambari@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- M. Tulodo A (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'm..tulodo.a@konstanta.my.id',
    crypt('Konstanta2537', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"M. Tulodo A"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'm..tulodo.a@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"M. Tulodo A"}'::jsonb,
    updated_at = now()
  WHERE email = 'm..tulodo.a@konstanta.my.id';

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
  WHERE u.email = 'm..tulodo.a@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'M. Tulodo A', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'm..tulodo.a@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Muhammad Arief (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'muhammad.arief@konstanta.my.id',
    crypt('Konstanta7410', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Muhammad Arief"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'muhammad.arief@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Muhammad Arief"}'::jsonb,
    updated_at = now()
  WHERE email = 'muhammad.arief@konstanta.my.id';

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
  WHERE u.email = 'muhammad.arief@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Muhammad Arief', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'muhammad.arief@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Mujahidin Faruqul Adzim (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'mujahidin.faruqul.adzim@konstanta.my.id',
    crypt('Konstanta5438', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Mujahidin Faruqul Adzim"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mujahidin.faruqul.adzim@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Mujahidin Faruqul Adzim"}'::jsonb,
    updated_at = now()
  WHERE email = 'mujahidin.faruqul.adzim@konstanta.my.id';

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
  WHERE u.email = 'mujahidin.faruqul.adzim@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Mujahidin Faruqul Adzim', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'mujahidin.faruqul.adzim@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Muhammad Faisal Aulia (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'muhammad.faisal.aulia@konstanta.my.id',
    crypt('Konstanta4795', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Muhammad Faisal Aulia"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'muhammad.faisal.aulia@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Muhammad Faisal Aulia"}'::jsonb,
    updated_at = now()
  WHERE email = 'muhammad.faisal.aulia@konstanta.my.id';

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
  WHERE u.email = 'muhammad.faisal.aulia@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Muhammad Faisal Aulia', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'muhammad.faisal.aulia@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Muhamad Ridho (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'muhamad.ridho@konstanta.my.id',
    crypt('Konstanta4802', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Muhamad Ridho"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'muhamad.ridho@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Muhamad Ridho"}'::jsonb,
    updated_at = now()
  WHERE email = 'muhamad.ridho@konstanta.my.id';

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
  WHERE u.email = 'muhamad.ridho@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Muhamad Ridho', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'muhamad.ridho@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Natasya Adysaphira (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'natasya.adysaphira@konstanta.my.id',
    crypt('Konstanta3291', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Natasya Adysaphira"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'natasya.adysaphira@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Natasya Adysaphira"}'::jsonb,
    updated_at = now()
  WHERE email = 'natasya.adysaphira@konstanta.my.id';

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
  WHERE u.email = 'natasya.adysaphira@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Natasya Adysaphira', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'natasya.adysaphira@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Nyimas Komariah S (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'nyimas.komariah.s@konstanta.my.id',
    crypt('Konstanta9477', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Nyimas Komariah S"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nyimas.komariah.s@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Nyimas Komariah S"}'::jsonb,
    updated_at = now()
  WHERE email = 'nyimas.komariah.s@konstanta.my.id';

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
  WHERE u.email = 'nyimas.komariah.s@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Nyimas Komariah S', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'nyimas.komariah.s@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Pambudi Rahardjo (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'pambudi.rahardjo@konstanta.my.id',
    crypt('Konstanta2019', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Pambudi Rahardjo"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'pambudi.rahardjo@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Pambudi Rahardjo"}'::jsonb,
    updated_at = now()
  WHERE email = 'pambudi.rahardjo@konstanta.my.id';

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
  WHERE u.email = 'pambudi.rahardjo@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Pambudi Rahardjo', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'pambudi.rahardjo@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Purnomo (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'purnomo@konstanta.my.id',
    crypt('Konstanta9766', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Purnomo"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'purnomo@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Purnomo"}'::jsonb,
    updated_at = now()
  WHERE email = 'purnomo@konstanta.my.id';

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
  WHERE u.email = 'purnomo@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Purnomo', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'purnomo@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Putri Khumaeroh (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'putri.khumaeroh@konstanta.my.id',
    crypt('Konstanta3682', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Putri Khumaeroh"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'putri.khumaeroh@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Putri Khumaeroh"}'::jsonb,
    updated_at = now()
  WHERE email = 'putri.khumaeroh@konstanta.my.id';

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
  WHERE u.email = 'putri.khumaeroh@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Putri Khumaeroh', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'putri.khumaeroh@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Raihana Zahra (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'raihana.zahra@konstanta.my.id',
    crypt('Konstanta6912', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Raihana Zahra"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'raihana.zahra@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Raihana Zahra"}'::jsonb,
    updated_at = now()
  WHERE email = 'raihana.zahra@konstanta.my.id';

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
  WHERE u.email = 'raihana.zahra@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Raihana Zahra', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'raihana.zahra@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Rama Akbar Saputra (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'rama.akbar.saputra@konstanta.my.id',
    crypt('Konstanta4856', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Rama Akbar Saputra"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'rama.akbar.saputra@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Rama Akbar Saputra"}'::jsonb,
    updated_at = now()
  WHERE email = 'rama.akbar.saputra@konstanta.my.id';

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
  WHERE u.email = 'rama.akbar.saputra@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Rama Akbar Saputra', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'rama.akbar.saputra@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Ramadhan Sagala (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'ramadhan.sagala@konstanta.my.id',
    crypt('Konstanta5076', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Ramadhan Sagala"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ramadhan.sagala@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Ramadhan Sagala"}'::jsonb,
    updated_at = now()
  WHERE email = 'ramadhan.sagala@konstanta.my.id';

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
  WHERE u.email = 'ramadhan.sagala@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Ramadhan Sagala', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'ramadhan.sagala@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Ratih Novia Pratiwi (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'ratih.novia.pratiwi@konstanta.my.id',
    crypt('Konstanta1329', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Ratih Novia Pratiwi"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ratih.novia.pratiwi@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Ratih Novia Pratiwi"}'::jsonb,
    updated_at = now()
  WHERE email = 'ratih.novia.pratiwi@konstanta.my.id';

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
  WHERE u.email = 'ratih.novia.pratiwi@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Ratih Novia Pratiwi', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'ratih.novia.pratiwi@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Restu Asegaf (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'restu.asegaf@konstanta.my.id',
    crypt('Konstanta2018', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Restu Asegaf"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'restu.asegaf@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Restu Asegaf"}'::jsonb,
    updated_at = now()
  WHERE email = 'restu.asegaf@konstanta.my.id';

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
  WHERE u.email = 'restu.asegaf@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Restu Asegaf', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'restu.asegaf@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Rian Pratama (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'rian.pratama@konstanta.my.id',
    crypt('Konstanta6472', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Rian Pratama"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'rian.pratama@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Rian Pratama"}'::jsonb,
    updated_at = now()
  WHERE email = 'rian.pratama@konstanta.my.id';

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
  WHERE u.email = 'rian.pratama@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Rian Pratama', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'rian.pratama@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Roy Hadiyanto (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'roy.hadiyanto@konstanta.my.id',
    crypt('Konstanta3861', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Roy Hadiyanto"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'roy.hadiyanto@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Roy Hadiyanto"}'::jsonb,
    updated_at = now()
  WHERE email = 'roy.hadiyanto@konstanta.my.id';

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
  WHERE u.email = 'roy.hadiyanto@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Roy Hadiyanto', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'roy.hadiyanto@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Sigit Ramires (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'sigit.ramires@konstanta.my.id',
    crypt('Konstanta8655', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Sigit Ramires"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sigit.ramires@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Sigit Ramires"}'::jsonb,
    updated_at = now()
  WHERE email = 'sigit.ramires@konstanta.my.id';

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
  WHERE u.email = 'sigit.ramires@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Sigit Ramires', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'sigit.ramires@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Susilawati (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'susilawati@konstanta.my.id',
    crypt('Konstanta2115', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Susilawati"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'susilawati@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Susilawati"}'::jsonb,
    updated_at = now()
  WHERE email = 'susilawati@konstanta.my.id';

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
  WHERE u.email = 'susilawati@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Susilawati', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'susilawati@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Taufik Hidayat (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'taufik.hidayat@konstanta.my.id',
    crypt('Konstanta5231', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Taufik Hidayat"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'taufik.hidayat@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Taufik Hidayat"}'::jsonb,
    updated_at = now()
  WHERE email = 'taufik.hidayat@konstanta.my.id';

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
  WHERE u.email = 'taufik.hidayat@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Taufik Hidayat', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'taufik.hidayat@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Tranggono Setya R (Tio) (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'tranggono.setya.r@konstanta.my.id',
    crypt('Konstanta5257', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Tranggono Setya R (Tio)"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'tranggono.setya.r@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Tranggono Setya R (Tio)"}'::jsonb,
    updated_at = now()
  WHERE email = 'tranggono.setya.r@konstanta.my.id';

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
  WHERE u.email = 'tranggono.setya.r@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Tranggono Setya R (Tio)', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'tranggono.setya.r@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Wahyu (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'wahyu@konstanta.my.id',
    crypt('Konstanta2241', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Wahyu"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'wahyu@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Wahyu"}'::jsonb,
    updated_at = now()
  WHERE email = 'wahyu@konstanta.my.id';

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
  WHERE u.email = 'wahyu@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Wahyu', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'wahyu@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Yana (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'yana@konstanta.my.id',
    crypt('Konstanta3221', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Yana"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'yana@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Yana"}'::jsonb,
    updated_at = now()
  WHERE email = 'yana@konstanta.my.id';

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
  WHERE u.email = 'yana@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Yana', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'yana@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Yasmine (kangguru)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'yasmine@konstanta.my.id',
    crypt('Konstanta5293', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    '{"full_name":"Yasmine"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'yasmine@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Yasmine"}'::jsonb,
    updated_at = now()
  WHERE email = 'yasmine@konstanta.my.id';

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
  WHERE u.email = 'yasmine@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'kangguru', 'Yasmine', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'yasmine@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Sumardi (karyawan)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'sumardi@konstanta.my.id',
    crypt('Konstanta7986', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"karyawan","roles":["karyawan"]}'::jsonb,
    '{"full_name":"Sumardi"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sumardi@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"karyawan","roles":["karyawan"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Sumardi"}'::jsonb,
    updated_at = now()
  WHERE email = 'sumardi@konstanta.my.id';

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
  WHERE u.email = 'sumardi@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'karyawan', 'Sumardi', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'sumardi@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Imanoeddin (karyawan)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'imanoeddin@konstanta.my.id',
    crypt('Konstanta8843', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"karyawan","roles":["karyawan"]}'::jsonb,
    '{"full_name":"Imanoeddin"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'imanoeddin@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"karyawan","roles":["karyawan"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Imanoeddin"}'::jsonb,
    updated_at = now()
  WHERE email = 'imanoeddin@konstanta.my.id';

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
  WHERE u.email = 'imanoeddin@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'karyawan', 'Imanoeddin', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'imanoeddin@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  -- Ahmad Fatihul Ihsan (karyawan)
  INSERT INTO auth.users (
    instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'ahmad.fatihul.ihsan@konstanta.my.id',
    crypt('Konstanta3731', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"karyawan","roles":["karyawan"]}'::jsonb,
    '{"full_name":"Ahmad Fatihul Ihsan"}'::jsonb,
    false, false, now(), now(), '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ahmad.fatihul.ihsan@konstanta.my.id');

  UPDATE auth.users SET
    raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"karyawan","roles":["karyawan"]}'::jsonb,
    raw_user_meta_data = '{"full_name":"Ahmad Fatihul Ihsan"}'::jsonb,
    updated_at = now()
  WHERE email = 'ahmad.fatihul.ihsan@konstanta.my.id';

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
  WHERE u.email = 'ahmad.fatihul.ihsan@konstanta.my.id'
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i WHERE i.provider = 'email' AND i.provider_id = u.email
    );

  INSERT INTO public.profiles (id, role, full_name, must_change_password, created_at, updated_at)
  SELECT u.id, 'karyawan', 'Ahmad Fatihul Ihsan', true, now(), now()
  FROM auth.users u
  WHERE u.email = 'ahmad.fatihul.ihsan@konstanta.my.id'
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    updated_at = now();

END $$;
