-- ============================================================
-- Konstanta Education Web — Auto-Generated Staff Seeds (konstanta.my.id)
-- Paste ke Supabase SQL Editor dan jalankan.
-- Aman dijalankan berkali-kali.
-- ============================================================

DO $$
BEGIN
  -- --------------------------------------------------------
  -- DEMO ACCOUNTS
  -- --------------------------------------------------------

  -- Demo Admin (admin)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'd0000000-0000-0000-0000-000000000001') THEN
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
      'd0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'demo.admin@konstanta.my.id',
      crypt('AdminDemo123!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"admin","roles":["admin"]}'::jsonb,
      '{"full_name":"Demo Admin"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'd0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001',
      'demo.admin@konstanta.my.id', 'email',
      json_build_object('sub', 'd0000000-0000-0000-0000-000000000001'::text, 'email', 'demo.admin@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'd0000000-0000-0000-0000-000000000001', 'admin', 'Demo Admin', false, now(), now()
    );
  END IF;

  -- Demo Akademik (akademik)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'd0000000-0000-0000-0000-000000000002') THEN
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
      'd0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'demo.akademik@konstanta.my.id',
      crypt('AkademikDemo123!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"akademik","roles":["akademik"]}'::jsonb,
      '{"full_name":"Demo Akademik"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'd0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002',
      'demo.akademik@konstanta.my.id', 'email',
      json_build_object('sub', 'd0000000-0000-0000-0000-000000000002'::text, 'email', 'demo.akademik@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'd0000000-0000-0000-0000-000000000002', 'akademik', 'Demo Akademik', false, now(), now()
    );
  END IF;

  -- Demo KETetap (ketetap)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'd0000000-0000-0000-0000-000000000003') THEN
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
      'd0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'demo.ketetap@konstanta.my.id',
      crypt('KetetapDemo123!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
      '{"full_name":"Demo KETetap"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'd0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003',
      'demo.ketetap@konstanta.my.id', 'email',
      json_build_object('sub', 'd0000000-0000-0000-0000-000000000003'::text, 'email', 'demo.ketetap@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'd0000000-0000-0000-0000-000000000003', 'ketetap', 'Demo KETetap', false, now(), now()
    );
  END IF;

  -- Demo KangGuru (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'd0000000-0000-0000-0000-000000000004') THEN
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
      'd0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'demo.kangguru@konstanta.my.id',
      crypt('KangguruDemo123!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Demo KangGuru"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'd0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000004',
      'demo.kangguru@konstanta.my.id', 'email',
      json_build_object('sub', 'd0000000-0000-0000-0000-000000000004'::text, 'email', 'demo.kangguru@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'd0000000-0000-0000-0000-000000000004', 'kangguru', 'Demo KangGuru', false, now(), now()
    );
  END IF;

  -- Demo Karyawan (karyawan)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'd0000000-0000-0000-0000-000000000005') THEN
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
      'd0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'demo.karyawan@konstanta.my.id',
      crypt('KaryawanDemo123!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"karyawan","roles":["karyawan"]}'::jsonb,
      '{"full_name":"Demo Karyawan"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'd0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000005',
      'demo.karyawan@konstanta.my.id', 'email',
      json_build_object('sub', 'd0000000-0000-0000-0000-000000000005'::text, 'email', 'demo.karyawan@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'd0000000-0000-0000-0000-000000000005', 'karyawan', 'Demo Karyawan', false, now(), now()
    );
  END IF;

  -- --------------------------------------------------------
  -- STAFF ACCOUNTS
  -- --------------------------------------------------------

  -- Anisa Zunayah (admin, ketetap)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '35770b69-4dc7-442d-a119-7b2a5b1fa523') THEN
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
      '35770b69-4dc7-442d-a119-7b2a5b1fa523', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'anisa.zunayah@konstanta.my.id',
      crypt('Konstanta6716', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"admin","roles":["admin","ketetap"]}'::jsonb,
      '{"full_name":"Anisa Zunayah"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '35770b69-4dc7-442d-a119-7b2a5b1fa523', '35770b69-4dc7-442d-a119-7b2a5b1fa523',
      'anisa.zunayah@konstanta.my.id', 'email',
      json_build_object('sub', '35770b69-4dc7-442d-a119-7b2a5b1fa523'::text, 'email', 'anisa.zunayah@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '35770b69-4dc7-442d-a119-7b2a5b1fa523', 'admin', 'Anisa Zunayah', true, now(), now()
    );
  END IF;

  -- Farid Fachrudin (admin, akademik, ketetap)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'b649a58b-f09b-49bf-ab2b-865001d44dfb') THEN
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
      'b649a58b-f09b-49bf-ab2b-865001d44dfb', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'farid.fachrudin@konstanta.my.id',
      crypt('Konstanta1386', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"admin","roles":["admin","akademik","ketetap"]}'::jsonb,
      '{"full_name":"Farid Fachrudin"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'b649a58b-f09b-49bf-ab2b-865001d44dfb', 'b649a58b-f09b-49bf-ab2b-865001d44dfb',
      'farid.fachrudin@konstanta.my.id', 'email',
      json_build_object('sub', 'b649a58b-f09b-49bf-ab2b-865001d44dfb'::text, 'email', 'farid.fachrudin@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'b649a58b-f09b-49bf-ab2b-865001d44dfb', 'admin', 'Farid Fachrudin', true, now(), now()
    );
  END IF;

  -- Farhanul Karim (admin, ketetap)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '5342c3f6-6be1-4206-a848-2a5e6838010d') THEN
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
      '5342c3f6-6be1-4206-a848-2a5e6838010d', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'farhanul.karim@konstanta.my.id',
      crypt('Konstanta9928', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"admin","roles":["admin","ketetap"]}'::jsonb,
      '{"full_name":"Farhanul Karim"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '5342c3f6-6be1-4206-a848-2a5e6838010d', '5342c3f6-6be1-4206-a848-2a5e6838010d',
      'farhanul.karim@konstanta.my.id', 'email',
      json_build_object('sub', '5342c3f6-6be1-4206-a848-2a5e6838010d'::text, 'email', 'farhanul.karim@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '5342c3f6-6be1-4206-a848-2a5e6838010d', 'admin', 'Farhanul Karim', true, now(), now()
    );
  END IF;

  -- Budi Rahman (akademik, ketetap)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '9ae208b4-3b07-477f-a21f-994fd342ce7e') THEN
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
      '9ae208b4-3b07-477f-a21f-994fd342ce7e', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'budi.rahman@konstanta.my.id',
      crypt('Konstanta2332', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"akademik","roles":["akademik","ketetap"]}'::jsonb,
      '{"full_name":"Budi Rahman"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '9ae208b4-3b07-477f-a21f-994fd342ce7e', '9ae208b4-3b07-477f-a21f-994fd342ce7e',
      'budi.rahman@konstanta.my.id', 'email',
      json_build_object('sub', '9ae208b4-3b07-477f-a21f-994fd342ce7e'::text, 'email', 'budi.rahman@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '9ae208b4-3b07-477f-a21f-994fd342ce7e', 'akademik', 'Budi Rahman', true, now(), now()
    );
  END IF;

  -- Tisya Aulika Nuri (akademik, karyawan)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '75eefb53-00c5-44d7-aca9-6f5c8f646b42') THEN
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
      '75eefb53-00c5-44d7-aca9-6f5c8f646b42', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'tisya.aulika.nuri@konstanta.my.id',
      crypt('Konstanta2094', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"akademik","roles":["akademik","karyawan"]}'::jsonb,
      '{"full_name":"Tisya Aulika Nuri"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '75eefb53-00c5-44d7-aca9-6f5c8f646b42', '75eefb53-00c5-44d7-aca9-6f5c8f646b42',
      'tisya.aulika.nuri@konstanta.my.id', 'email',
      json_build_object('sub', '75eefb53-00c5-44d7-aca9-6f5c8f646b42'::text, 'email', 'tisya.aulika.nuri@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '75eefb53-00c5-44d7-aca9-6f5c8f646b42', 'akademik', 'Tisya Aulika Nuri', true, now(), now()
    );
  END IF;

  -- M. Rasya Azmi (akademik, karyawan)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '769fba40-bd5e-4251-abac-149447d8af9f') THEN
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
      '769fba40-bd5e-4251-abac-149447d8af9f', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'm..rasya.azmi@konstanta.my.id',
      crypt('Konstanta1903', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"akademik","roles":["akademik","karyawan"]}'::jsonb,
      '{"full_name":"M. Rasya Azmi"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '769fba40-bd5e-4251-abac-149447d8af9f', '769fba40-bd5e-4251-abac-149447d8af9f',
      'm..rasya.azmi@konstanta.my.id', 'email',
      json_build_object('sub', '769fba40-bd5e-4251-abac-149447d8af9f'::text, 'email', 'm..rasya.azmi@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '769fba40-bd5e-4251-abac-149447d8af9f', 'akademik', 'M. Rasya Azmi', true, now(), now()
    );
  END IF;

  -- Mukti Karya Utama (ketetap)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '26000432-f706-43fd-a485-acd941bdcb4b') THEN
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
      '26000432-f706-43fd-a485-acd941bdcb4b', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'mukti.karya.utama@konstanta.my.id',
      crypt('Konstanta2389', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
      '{"full_name":"Mukti Karya Utama"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '26000432-f706-43fd-a485-acd941bdcb4b', '26000432-f706-43fd-a485-acd941bdcb4b',
      'mukti.karya.utama@konstanta.my.id', 'email',
      json_build_object('sub', '26000432-f706-43fd-a485-acd941bdcb4b'::text, 'email', 'mukti.karya.utama@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '26000432-f706-43fd-a485-acd941bdcb4b', 'ketetap', 'Mukti Karya Utama', true, now(), now()
    );
  END IF;

  -- M. Arief Ridwan (ketetap)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '0c1b1a74-b107-42bb-ad9b-7bdc9bec5d98') THEN
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
      '0c1b1a74-b107-42bb-ad9b-7bdc9bec5d98', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'm..arief.ridwan@konstanta.my.id',
      crypt('Konstanta9771', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
      '{"full_name":"M. Arief Ridwan"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '0c1b1a74-b107-42bb-ad9b-7bdc9bec5d98', '0c1b1a74-b107-42bb-ad9b-7bdc9bec5d98',
      'm..arief.ridwan@konstanta.my.id', 'email',
      json_build_object('sub', '0c1b1a74-b107-42bb-ad9b-7bdc9bec5d98'::text, 'email', 'm..arief.ridwan@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '0c1b1a74-b107-42bb-ad9b-7bdc9bec5d98', 'ketetap', 'M. Arief Ridwan', true, now(), now()
    );
  END IF;

  -- Retno Yusniawati (ketetap)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '22bc2ab8-a809-4b70-a9b6-88e49b295c4a') THEN
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
      '22bc2ab8-a809-4b70-a9b6-88e49b295c4a', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'retno.yusniawati@konstanta.my.id',
      crypt('Konstanta6142', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
      '{"full_name":"Retno Yusniawati"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '22bc2ab8-a809-4b70-a9b6-88e49b295c4a', '22bc2ab8-a809-4b70-a9b6-88e49b295c4a',
      'retno.yusniawati@konstanta.my.id', 'email',
      json_build_object('sub', '22bc2ab8-a809-4b70-a9b6-88e49b295c4a'::text, 'email', 'retno.yusniawati@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '22bc2ab8-a809-4b70-a9b6-88e49b295c4a', 'ketetap', 'Retno Yusniawati', true, now(), now()
    );
  END IF;

  -- Ibnu Sina (ketetap)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '48b495b4-4d49-4f11-a89d-f2257f86eb95') THEN
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
      '48b495b4-4d49-4f11-a89d-f2257f86eb95', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'ibnu.sina@konstanta.my.id',
      crypt('Konstanta5764', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
      '{"full_name":"Ibnu Sina"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '48b495b4-4d49-4f11-a89d-f2257f86eb95', '48b495b4-4d49-4f11-a89d-f2257f86eb95',
      'ibnu.sina@konstanta.my.id', 'email',
      json_build_object('sub', '48b495b4-4d49-4f11-a89d-f2257f86eb95'::text, 'email', 'ibnu.sina@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '48b495b4-4d49-4f11-a89d-f2257f86eb95', 'ketetap', 'Ibnu Sina', true, now(), now()
    );
  END IF;

  -- Inggrit Maylinda (ketetap)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '8ba5964e-b8be-4eb0-a417-e47445154325') THEN
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
      '8ba5964e-b8be-4eb0-a417-e47445154325', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'inggrit.maylinda@konstanta.my.id',
      crypt('Konstanta1903', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
      '{"full_name":"Inggrit Maylinda"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '8ba5964e-b8be-4eb0-a417-e47445154325', '8ba5964e-b8be-4eb0-a417-e47445154325',
      'inggrit.maylinda@konstanta.my.id', 'email',
      json_build_object('sub', '8ba5964e-b8be-4eb0-a417-e47445154325'::text, 'email', 'inggrit.maylinda@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '8ba5964e-b8be-4eb0-a417-e47445154325', 'ketetap', 'Inggrit Maylinda', true, now(), now()
    );
  END IF;

  -- Ponco Arief Triyasto (ketetap)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'd7f7f90e-6a55-47a2-abd9-1f93cda64adc') THEN
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
      'd7f7f90e-6a55-47a2-abd9-1f93cda64adc', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'ponco.arief.triyasto@konstanta.my.id',
      crypt('Konstanta5647', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
      '{"full_name":"Ponco Arief Triyasto"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'd7f7f90e-6a55-47a2-abd9-1f93cda64adc', 'd7f7f90e-6a55-47a2-abd9-1f93cda64adc',
      'ponco.arief.triyasto@konstanta.my.id', 'email',
      json_build_object('sub', 'd7f7f90e-6a55-47a2-abd9-1f93cda64adc'::text, 'email', 'ponco.arief.triyasto@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'd7f7f90e-6a55-47a2-abd9-1f93cda64adc', 'ketetap', 'Ponco Arief Triyasto', true, now(), now()
    );
  END IF;

  -- M. Rafly Novanto (ketetap)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '3c97d756-e7a1-42aa-a516-a7f864e8ff4e') THEN
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
      '3c97d756-e7a1-42aa-a516-a7f864e8ff4e', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'm..rafly.novanto@konstanta.my.id',
      crypt('Konstanta7838', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
      '{"full_name":"M. Rafly Novanto"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '3c97d756-e7a1-42aa-a516-a7f864e8ff4e', '3c97d756-e7a1-42aa-a516-a7f864e8ff4e',
      'm..rafly.novanto@konstanta.my.id', 'email',
      json_build_object('sub', '3c97d756-e7a1-42aa-a516-a7f864e8ff4e'::text, 'email', 'm..rafly.novanto@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '3c97d756-e7a1-42aa-a516-a7f864e8ff4e', 'ketetap', 'M. Rafly Novanto', true, now(), now()
    );
  END IF;

  -- Akbar Ramadhian (ketetap)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '5f54523d-5225-4685-a852-a783982b6d1d') THEN
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
      '5f54523d-5225-4685-a852-a783982b6d1d', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'akbar.ramadhian@konstanta.my.id',
      crypt('Konstanta3669', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
      '{"full_name":"Akbar Ramadhian"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '5f54523d-5225-4685-a852-a783982b6d1d', '5f54523d-5225-4685-a852-a783982b6d1d',
      'akbar.ramadhian@konstanta.my.id', 'email',
      json_build_object('sub', '5f54523d-5225-4685-a852-a783982b6d1d'::text, 'email', 'akbar.ramadhian@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '5f54523d-5225-4685-a852-a783982b6d1d', 'ketetap', 'Akbar Ramadhian', true, now(), now()
    );
  END IF;

  -- Fairuz Salsabilla (ketetap)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '273a6c1c-1def-48ca-a9ec-90ba1cf1ef71') THEN
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
      '273a6c1c-1def-48ca-a9ec-90ba1cf1ef71', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'fairuz.salsabilla@konstanta.my.id',
      crypt('Konstanta9763', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"ketetap","roles":["ketetap"]}'::jsonb,
      '{"full_name":"Fairuz Salsabilla"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '273a6c1c-1def-48ca-a9ec-90ba1cf1ef71', '273a6c1c-1def-48ca-a9ec-90ba1cf1ef71',
      'fairuz.salsabilla@konstanta.my.id', 'email',
      json_build_object('sub', '273a6c1c-1def-48ca-a9ec-90ba1cf1ef71'::text, 'email', 'fairuz.salsabilla@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '273a6c1c-1def-48ca-a9ec-90ba1cf1ef71', 'ketetap', 'Fairuz Salsabilla', true, now(), now()
    );
  END IF;

  -- Achmad Rivai (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'cee6d465-0ca1-4829-a9c7-796f7c171efe') THEN
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
      'cee6d465-0ca1-4829-a9c7-796f7c171efe', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'achmad.rivai@konstanta.my.id',
      crypt('Konstanta2934', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Achmad Rivai"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'cee6d465-0ca1-4829-a9c7-796f7c171efe', 'cee6d465-0ca1-4829-a9c7-796f7c171efe',
      'achmad.rivai@konstanta.my.id', 'email',
      json_build_object('sub', 'cee6d465-0ca1-4829-a9c7-796f7c171efe'::text, 'email', 'achmad.rivai@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'cee6d465-0ca1-4829-a9c7-796f7c171efe', 'kangguru', 'Achmad Rivai', true, now(), now()
    );
  END IF;

  -- Ade K Irawan (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '49c884dd-3361-4357-acac-664fcb83c780') THEN
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
      '49c884dd-3361-4357-acac-664fcb83c780', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'ade.k.irawan@konstanta.my.id',
      crypt('Konstanta1179', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Ade K Irawan"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '49c884dd-3361-4357-acac-664fcb83c780', '49c884dd-3361-4357-acac-664fcb83c780',
      'ade.k.irawan@konstanta.my.id', 'email',
      json_build_object('sub', '49c884dd-3361-4357-acac-664fcb83c780'::text, 'email', 'ade.k.irawan@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '49c884dd-3361-4357-acac-664fcb83c780', 'kangguru', 'Ade K Irawan', true, now(), now()
    );
  END IF;

  -- Aditya Perbawa (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '579ddd42-777a-49de-a185-b00a79cbf179') THEN
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
      '579ddd42-777a-49de-a185-b00a79cbf179', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'aditya.perbawa@konstanta.my.id',
      crypt('Konstanta7097', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Aditya Perbawa"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '579ddd42-777a-49de-a185-b00a79cbf179', '579ddd42-777a-49de-a185-b00a79cbf179',
      'aditya.perbawa@konstanta.my.id', 'email',
      json_build_object('sub', '579ddd42-777a-49de-a185-b00a79cbf179'::text, 'email', 'aditya.perbawa@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '579ddd42-777a-49de-a185-b00a79cbf179', 'kangguru', 'Aditya Perbawa', true, now(), now()
    );
  END IF;

  -- Ahmad Faris (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '48b797e3-c564-4125-ac26-5d8900545cec') THEN
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
      '48b797e3-c564-4125-ac26-5d8900545cec', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'ahmad.faris@konstanta.my.id',
      crypt('Konstanta7210', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Ahmad Faris"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '48b797e3-c564-4125-ac26-5d8900545cec', '48b797e3-c564-4125-ac26-5d8900545cec',
      'ahmad.faris@konstanta.my.id', 'email',
      json_build_object('sub', '48b797e3-c564-4125-ac26-5d8900545cec'::text, 'email', 'ahmad.faris@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '48b797e3-c564-4125-ac26-5d8900545cec', 'kangguru', 'Ahmad Faris', true, now(), now()
    );
  END IF;

  -- Al Akrom (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '7e42cb3b-b856-4b30-ad80-ec1a08feac04') THEN
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
      '7e42cb3b-b856-4b30-ad80-ec1a08feac04', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'al.akrom@konstanta.my.id',
      crypt('Konstanta3143', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Al Akrom"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '7e42cb3b-b856-4b30-ad80-ec1a08feac04', '7e42cb3b-b856-4b30-ad80-ec1a08feac04',
      'al.akrom@konstanta.my.id', 'email',
      json_build_object('sub', '7e42cb3b-b856-4b30-ad80-ec1a08feac04'::text, 'email', 'al.akrom@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '7e42cb3b-b856-4b30-ad80-ec1a08feac04', 'kangguru', 'Al Akrom', true, now(), now()
    );
  END IF;

  -- Akhit Anis (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '6a3763e4-6f51-4936-a54d-d9438e301648') THEN
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
      '6a3763e4-6f51-4936-a54d-d9438e301648', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'akhit.anis@konstanta.my.id',
      crypt('Konstanta3107', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Akhit Anis"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '6a3763e4-6f51-4936-a54d-d9438e301648', '6a3763e4-6f51-4936-a54d-d9438e301648',
      'akhit.anis@konstanta.my.id', 'email',
      json_build_object('sub', '6a3763e4-6f51-4936-a54d-d9438e301648'::text, 'email', 'akhit.anis@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '6a3763e4-6f51-4936-a54d-d9438e301648', 'kangguru', 'Akhit Anis', true, now(), now()
    );
  END IF;

  -- Andromeda (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '55698a55-e142-40c9-a824-6ad073b5873f') THEN
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
      '55698a55-e142-40c9-a824-6ad073b5873f', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'andromeda@konstanta.my.id',
      crypt('Konstanta3738', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Andromeda"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '55698a55-e142-40c9-a824-6ad073b5873f', '55698a55-e142-40c9-a824-6ad073b5873f',
      'andromeda@konstanta.my.id', 'email',
      json_build_object('sub', '55698a55-e142-40c9-a824-6ad073b5873f'::text, 'email', 'andromeda@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '55698a55-e142-40c9-a824-6ad073b5873f', 'kangguru', 'Andromeda', true, now(), now()
    );
  END IF;

  -- Annahel Aliesta (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '50a1d3d5-b70d-41f6-abed-668db95a49cd') THEN
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
      '50a1d3d5-b70d-41f6-abed-668db95a49cd', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'annahel.aliesta@konstanta.my.id',
      crypt('Konstanta2858', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Annahel Aliesta"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '50a1d3d5-b70d-41f6-abed-668db95a49cd', '50a1d3d5-b70d-41f6-abed-668db95a49cd',
      'annahel.aliesta@konstanta.my.id', 'email',
      json_build_object('sub', '50a1d3d5-b70d-41f6-abed-668db95a49cd'::text, 'email', 'annahel.aliesta@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '50a1d3d5-b70d-41f6-abed-668db95a49cd', 'kangguru', 'Annahel Aliesta', true, now(), now()
    );
  END IF;

  -- Annisa Michellia (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'da7fa440-2a25-4d7b-a875-f37bd588297e') THEN
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
      'da7fa440-2a25-4d7b-a875-f37bd588297e', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'annisa.michellia@konstanta.my.id',
      crypt('Konstanta8173', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Annisa Michellia"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'da7fa440-2a25-4d7b-a875-f37bd588297e', 'da7fa440-2a25-4d7b-a875-f37bd588297e',
      'annisa.michellia@konstanta.my.id', 'email',
      json_build_object('sub', 'da7fa440-2a25-4d7b-a875-f37bd588297e'::text, 'email', 'annisa.michellia@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'da7fa440-2a25-4d7b-a875-f37bd588297e', 'kangguru', 'Annisa Michellia', true, now(), now()
    );
  END IF;

  -- Arif Sapta Diputra (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '1c9de345-ab1c-433a-a4f9-1a48293e096a') THEN
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
      '1c9de345-ab1c-433a-a4f9-1a48293e096a', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'arif.sapta.diputra@konstanta.my.id',
      crypt('Konstanta2335', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Arif Sapta Diputra"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '1c9de345-ab1c-433a-a4f9-1a48293e096a', '1c9de345-ab1c-433a-a4f9-1a48293e096a',
      'arif.sapta.diputra@konstanta.my.id', 'email',
      json_build_object('sub', '1c9de345-ab1c-433a-a4f9-1a48293e096a'::text, 'email', 'arif.sapta.diputra@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '1c9de345-ab1c-433a-a4f9-1a48293e096a', 'kangguru', 'Arif Sapta Diputra', true, now(), now()
    );
  END IF;

  -- Aulia Dini (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '258d9260-5033-4058-a43f-a2b113452b1a') THEN
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
      '258d9260-5033-4058-a43f-a2b113452b1a', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'aulia.dini@konstanta.my.id',
      crypt('Konstanta5513', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Aulia Dini"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '258d9260-5033-4058-a43f-a2b113452b1a', '258d9260-5033-4058-a43f-a2b113452b1a',
      'aulia.dini@konstanta.my.id', 'email',
      json_build_object('sub', '258d9260-5033-4058-a43f-a2b113452b1a'::text, 'email', 'aulia.dini@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '258d9260-5033-4058-a43f-a2b113452b1a', 'kangguru', 'Aulia Dini', true, now(), now()
    );
  END IF;

  -- Cahya Sasmita (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'ec14962d-da2b-4232-a998-8b8196bb4963') THEN
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
      'ec14962d-da2b-4232-a998-8b8196bb4963', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'cahya.sasmita@konstanta.my.id',
      crypt('Konstanta8444', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Cahya Sasmita"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'ec14962d-da2b-4232-a998-8b8196bb4963', 'ec14962d-da2b-4232-a998-8b8196bb4963',
      'cahya.sasmita@konstanta.my.id', 'email',
      json_build_object('sub', 'ec14962d-da2b-4232-a998-8b8196bb4963'::text, 'email', 'cahya.sasmita@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'ec14962d-da2b-4232-a998-8b8196bb4963', 'kangguru', 'Cahya Sasmita', true, now(), now()
    );
  END IF;

  -- Candra Riyadi (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '24fabfdf-4d61-4063-a970-94d0b274826e') THEN
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
      '24fabfdf-4d61-4063-a970-94d0b274826e', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'candra.riyadi@konstanta.my.id',
      crypt('Konstanta7721', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Candra Riyadi"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '24fabfdf-4d61-4063-a970-94d0b274826e', '24fabfdf-4d61-4063-a970-94d0b274826e',
      'candra.riyadi@konstanta.my.id', 'email',
      json_build_object('sub', '24fabfdf-4d61-4063-a970-94d0b274826e'::text, 'email', 'candra.riyadi@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '24fabfdf-4d61-4063-a970-94d0b274826e', 'kangguru', 'Candra Riyadi', true, now(), now()
    );
  END IF;

  -- Cecep Saepudin Ahmad (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'd6395e77-df78-439c-ab32-578dfc543b73') THEN
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
      'd6395e77-df78-439c-ab32-578dfc543b73', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'cecep.saepudin.ahmad@konstanta.my.id',
      crypt('Konstanta6777', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Cecep Saepudin Ahmad"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'd6395e77-df78-439c-ab32-578dfc543b73', 'd6395e77-df78-439c-ab32-578dfc543b73',
      'cecep.saepudin.ahmad@konstanta.my.id', 'email',
      json_build_object('sub', 'd6395e77-df78-439c-ab32-578dfc543b73'::text, 'email', 'cecep.saepudin.ahmad@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'd6395e77-df78-439c-ab32-578dfc543b73', 'kangguru', 'Cecep Saepudin Ahmad', true, now(), now()
    );
  END IF;

  -- Daulat Harahap (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '891a24b9-0074-4d8c-a0bf-248fc23a4e66') THEN
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
      '891a24b9-0074-4d8c-a0bf-248fc23a4e66', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'daulat.harahap@konstanta.my.id',
      crypt('Konstanta7738', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Daulat Harahap"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '891a24b9-0074-4d8c-a0bf-248fc23a4e66', '891a24b9-0074-4d8c-a0bf-248fc23a4e66',
      'daulat.harahap@konstanta.my.id', 'email',
      json_build_object('sub', '891a24b9-0074-4d8c-a0bf-248fc23a4e66'::text, 'email', 'daulat.harahap@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '891a24b9-0074-4d8c-a0bf-248fc23a4e66', 'kangguru', 'Daulat Harahap', true, now(), now()
    );
  END IF;

  -- Dede Abdul Hakim (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '7fdbf725-ae81-4e32-ae00-5cdb3f93d957') THEN
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
      '7fdbf725-ae81-4e32-ae00-5cdb3f93d957', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'dede.abdul.hakim@konstanta.my.id',
      crypt('Konstanta2178', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Dede Abdul Hakim"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '7fdbf725-ae81-4e32-ae00-5cdb3f93d957', '7fdbf725-ae81-4e32-ae00-5cdb3f93d957',
      'dede.abdul.hakim@konstanta.my.id', 'email',
      json_build_object('sub', '7fdbf725-ae81-4e32-ae00-5cdb3f93d957'::text, 'email', 'dede.abdul.hakim@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '7fdbf725-ae81-4e32-ae00-5cdb3f93d957', 'kangguru', 'Dede Abdul Hakim', true, now(), now()
    );
  END IF;

  -- Dewi Siska (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '802ac2ee-a235-42d9-ae38-21b48ffe2e8e') THEN
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
      '802ac2ee-a235-42d9-ae38-21b48ffe2e8e', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'dewi.siska@konstanta.my.id',
      crypt('Konstanta7314', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Dewi Siska"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '802ac2ee-a235-42d9-ae38-21b48ffe2e8e', '802ac2ee-a235-42d9-ae38-21b48ffe2e8e',
      'dewi.siska@konstanta.my.id', 'email',
      json_build_object('sub', '802ac2ee-a235-42d9-ae38-21b48ffe2e8e'::text, 'email', 'dewi.siska@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '802ac2ee-a235-42d9-ae38-21b48ffe2e8e', 'kangguru', 'Dewi Siska', true, now(), now()
    );
  END IF;

  -- Dika Amalia Lutfiana (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'd834a6ba-6bc9-495f-a062-fc6e25611a84') THEN
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
      'd834a6ba-6bc9-495f-a062-fc6e25611a84', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'dika.amalia.lutfiana@konstanta.my.id',
      crypt('Konstanta7711', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Dika Amalia Lutfiana"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'd834a6ba-6bc9-495f-a062-fc6e25611a84', 'd834a6ba-6bc9-495f-a062-fc6e25611a84',
      'dika.amalia.lutfiana@konstanta.my.id', 'email',
      json_build_object('sub', 'd834a6ba-6bc9-495f-a062-fc6e25611a84'::text, 'email', 'dika.amalia.lutfiana@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'd834a6ba-6bc9-495f-a062-fc6e25611a84', 'kangguru', 'Dika Amalia Lutfiana', true, now(), now()
    );
  END IF;

  -- Dolly Fernando (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '0179afa2-788b-40fe-ab62-81ec0ce13ab3') THEN
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
      '0179afa2-788b-40fe-ab62-81ec0ce13ab3', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'dolly.fernando@konstanta.my.id',
      crypt('Konstanta8801', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Dolly Fernando"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '0179afa2-788b-40fe-ab62-81ec0ce13ab3', '0179afa2-788b-40fe-ab62-81ec0ce13ab3',
      'dolly.fernando@konstanta.my.id', 'email',
      json_build_object('sub', '0179afa2-788b-40fe-ab62-81ec0ce13ab3'::text, 'email', 'dolly.fernando@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '0179afa2-788b-40fe-ab62-81ec0ce13ab3', 'kangguru', 'Dolly Fernando', true, now(), now()
    );
  END IF;

  -- Eko Priono (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'f011a93e-dea4-4843-acd9-8e952f8a544e') THEN
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
      'f011a93e-dea4-4843-acd9-8e952f8a544e', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'eko.priono@konstanta.my.id',
      crypt('Konstanta1757', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Eko Priono"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'f011a93e-dea4-4843-acd9-8e952f8a544e', 'f011a93e-dea4-4843-acd9-8e952f8a544e',
      'eko.priono@konstanta.my.id', 'email',
      json_build_object('sub', 'f011a93e-dea4-4843-acd9-8e952f8a544e'::text, 'email', 'eko.priono@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'f011a93e-dea4-4843-acd9-8e952f8a544e', 'kangguru', 'Eko Priono', true, now(), now()
    );
  END IF;

  -- Eko Wandoyo (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '454bbcec-294d-4a9f-a8b8-49efdf67566a') THEN
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
      '454bbcec-294d-4a9f-a8b8-49efdf67566a', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'eko.wandoyo@konstanta.my.id',
      crypt('Konstanta4726', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Eko Wandoyo"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '454bbcec-294d-4a9f-a8b8-49efdf67566a', '454bbcec-294d-4a9f-a8b8-49efdf67566a',
      'eko.wandoyo@konstanta.my.id', 'email',
      json_build_object('sub', '454bbcec-294d-4a9f-a8b8-49efdf67566a'::text, 'email', 'eko.wandoyo@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '454bbcec-294d-4a9f-a8b8-49efdf67566a', 'kangguru', 'Eko Wandoyo', true, now(), now()
    );
  END IF;

  -- Fachrizal Nurrachman (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '1e17d47f-b837-42e4-ae85-457df4c7f5f0') THEN
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
      '1e17d47f-b837-42e4-ae85-457df4c7f5f0', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'fachrizal.nurrachman@konstanta.my.id',
      crypt('Konstanta1591', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Fachrizal Nurrachman"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '1e17d47f-b837-42e4-ae85-457df4c7f5f0', '1e17d47f-b837-42e4-ae85-457df4c7f5f0',
      'fachrizal.nurrachman@konstanta.my.id', 'email',
      json_build_object('sub', '1e17d47f-b837-42e4-ae85-457df4c7f5f0'::text, 'email', 'fachrizal.nurrachman@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '1e17d47f-b837-42e4-ae85-457df4c7f5f0', 'kangguru', 'Fachrizal Nurrachman', true, now(), now()
    );
  END IF;

  -- Fadhilah Rahmani (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'dacb0ee5-cd79-4ce7-a9ea-59c7bfc98404') THEN
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
      'dacb0ee5-cd79-4ce7-a9ea-59c7bfc98404', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'fadhilah.rahmani@konstanta.my.id',
      crypt('Konstanta3190', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Fadhilah Rahmani"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'dacb0ee5-cd79-4ce7-a9ea-59c7bfc98404', 'dacb0ee5-cd79-4ce7-a9ea-59c7bfc98404',
      'fadhilah.rahmani@konstanta.my.id', 'email',
      json_build_object('sub', 'dacb0ee5-cd79-4ce7-a9ea-59c7bfc98404'::text, 'email', 'fadhilah.rahmani@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'dacb0ee5-cd79-4ce7-a9ea-59c7bfc98404', 'kangguru', 'Fadhilah Rahmani', true, now(), now()
    );
  END IF;

  -- Fahmi Firmansyah (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '5123fa24-2c05-4386-ad8b-c13a20c1fd8b') THEN
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
      '5123fa24-2c05-4386-ad8b-c13a20c1fd8b', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'fahmi.firmansyah@konstanta.my.id',
      crypt('Konstanta3168', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Fahmi Firmansyah"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '5123fa24-2c05-4386-ad8b-c13a20c1fd8b', '5123fa24-2c05-4386-ad8b-c13a20c1fd8b',
      'fahmi.firmansyah@konstanta.my.id', 'email',
      json_build_object('sub', '5123fa24-2c05-4386-ad8b-c13a20c1fd8b'::text, 'email', 'fahmi.firmansyah@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '5123fa24-2c05-4386-ad8b-c13a20c1fd8b', 'kangguru', 'Fahmi Firmansyah', true, now(), now()
    );
  END IF;

  -- Fawaidul Khoir (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'd769b2e9-9b4d-4fa6-aa51-c1f8db4560ab') THEN
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
      'd769b2e9-9b4d-4fa6-aa51-c1f8db4560ab', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'fawaidul.khoir@konstanta.my.id',
      crypt('Konstanta2590', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Fawaidul Khoir"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'd769b2e9-9b4d-4fa6-aa51-c1f8db4560ab', 'd769b2e9-9b4d-4fa6-aa51-c1f8db4560ab',
      'fawaidul.khoir@konstanta.my.id', 'email',
      json_build_object('sub', 'd769b2e9-9b4d-4fa6-aa51-c1f8db4560ab'::text, 'email', 'fawaidul.khoir@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'd769b2e9-9b4d-4fa6-aa51-c1f8db4560ab', 'kangguru', 'Fawaidul Khoir', true, now(), now()
    );
  END IF;

  -- Fasniyanto (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '172e56ee-15e9-40ea-ad48-b939fbe1442e') THEN
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
      '172e56ee-15e9-40ea-ad48-b939fbe1442e', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'fasniyanto@konstanta.my.id',
      crypt('Konstanta9611', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Fasniyanto"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '172e56ee-15e9-40ea-ad48-b939fbe1442e', '172e56ee-15e9-40ea-ad48-b939fbe1442e',
      'fasniyanto@konstanta.my.id', 'email',
      json_build_object('sub', '172e56ee-15e9-40ea-ad48-b939fbe1442e'::text, 'email', 'fasniyanto@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '172e56ee-15e9-40ea-ad48-b939fbe1442e', 'kangguru', 'Fasniyanto', true, now(), now()
    );
  END IF;

  -- Fathan Mubinan (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '8eda52bb-5966-4bfd-a188-c7b606cee2b5') THEN
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
      '8eda52bb-5966-4bfd-a188-c7b606cee2b5', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'fathan.mubinan@konstanta.my.id',
      crypt('Konstanta7153', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Fathan Mubinan"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '8eda52bb-5966-4bfd-a188-c7b606cee2b5', '8eda52bb-5966-4bfd-a188-c7b606cee2b5',
      'fathan.mubinan@konstanta.my.id', 'email',
      json_build_object('sub', '8eda52bb-5966-4bfd-a188-c7b606cee2b5'::text, 'email', 'fathan.mubinan@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '8eda52bb-5966-4bfd-a188-c7b606cee2b5', 'kangguru', 'Fathan Mubinan', true, now(), now()
    );
  END IF;

  -- Frimadani (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '26fc7d5a-d02e-41a4-a924-fdaee5b95bf7') THEN
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
      '26fc7d5a-d02e-41a4-a924-fdaee5b95bf7', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'frimadani@konstanta.my.id',
      crypt('Konstanta3074', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Frimadani"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '26fc7d5a-d02e-41a4-a924-fdaee5b95bf7', '26fc7d5a-d02e-41a4-a924-fdaee5b95bf7',
      'frimadani@konstanta.my.id', 'email',
      json_build_object('sub', '26fc7d5a-d02e-41a4-a924-fdaee5b95bf7'::text, 'email', 'frimadani@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '26fc7d5a-d02e-41a4-a924-fdaee5b95bf7', 'kangguru', 'Frimadani', true, now(), now()
    );
  END IF;

  -- Gentur Meshubudi (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'f4df1d99-3403-40d8-a63b-86a1eedc49bd') THEN
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
      'f4df1d99-3403-40d8-a63b-86a1eedc49bd', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'gentur.meshubudi@konstanta.my.id',
      crypt('Konstanta6152', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Gentur Meshubudi"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'f4df1d99-3403-40d8-a63b-86a1eedc49bd', 'f4df1d99-3403-40d8-a63b-86a1eedc49bd',
      'gentur.meshubudi@konstanta.my.id', 'email',
      json_build_object('sub', 'f4df1d99-3403-40d8-a63b-86a1eedc49bd'::text, 'email', 'gentur.meshubudi@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'f4df1d99-3403-40d8-a63b-86a1eedc49bd', 'kangguru', 'Gentur Meshubudi', true, now(), now()
    );
  END IF;

  -- Gianni Benhardi (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '97eac963-fc7a-4ca1-a4e4-68ba92fa4405') THEN
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
      '97eac963-fc7a-4ca1-a4e4-68ba92fa4405', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'gianni.benhardi@konstanta.my.id',
      crypt('Konstanta2274', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Gianni Benhardi"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '97eac963-fc7a-4ca1-a4e4-68ba92fa4405', '97eac963-fc7a-4ca1-a4e4-68ba92fa4405',
      'gianni.benhardi@konstanta.my.id', 'email',
      json_build_object('sub', '97eac963-fc7a-4ca1-a4e4-68ba92fa4405'::text, 'email', 'gianni.benhardi@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '97eac963-fc7a-4ca1-a4e4-68ba92fa4405', 'kangguru', 'Gianni Benhardi', true, now(), now()
    );
  END IF;

  -- Gilang Ainan (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '93123b88-1d7e-4fd5-a42f-b29afa5d8546') THEN
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
      '93123b88-1d7e-4fd5-a42f-b29afa5d8546', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'gilang.ainan@konstanta.my.id',
      crypt('Konstanta9912', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Gilang Ainan"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '93123b88-1d7e-4fd5-a42f-b29afa5d8546', '93123b88-1d7e-4fd5-a42f-b29afa5d8546',
      'gilang.ainan@konstanta.my.id', 'email',
      json_build_object('sub', '93123b88-1d7e-4fd5-a42f-b29afa5d8546'::text, 'email', 'gilang.ainan@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '93123b88-1d7e-4fd5-a42f-b29afa5d8546', 'kangguru', 'Gilang Ainan', true, now(), now()
    );
  END IF;

  -- Hanunah Sofa (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '5d11102b-14fe-4094-a0d1-5780ad966787') THEN
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
      '5d11102b-14fe-4094-a0d1-5780ad966787', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'hanunah.sofa@konstanta.my.id',
      crypt('Konstanta5570', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Hanunah Sofa"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '5d11102b-14fe-4094-a0d1-5780ad966787', '5d11102b-14fe-4094-a0d1-5780ad966787',
      'hanunah.sofa@konstanta.my.id', 'email',
      json_build_object('sub', '5d11102b-14fe-4094-a0d1-5780ad966787'::text, 'email', 'hanunah.sofa@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '5d11102b-14fe-4094-a0d1-5780ad966787', 'kangguru', 'Hanunah Sofa', true, now(), now()
    );
  END IF;

  -- Hasbiyallah (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '83c85113-1cff-476a-ae23-7fb023bae0b3') THEN
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
      '83c85113-1cff-476a-ae23-7fb023bae0b3', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'hasbiyallah@konstanta.my.id',
      crypt('Konstanta9243', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Hasbiyallah"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '83c85113-1cff-476a-ae23-7fb023bae0b3', '83c85113-1cff-476a-ae23-7fb023bae0b3',
      'hasbiyallah@konstanta.my.id', 'email',
      json_build_object('sub', '83c85113-1cff-476a-ae23-7fb023bae0b3'::text, 'email', 'hasbiyallah@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '83c85113-1cff-476a-ae23-7fb023bae0b3', 'kangguru', 'Hasbiyallah', true, now(), now()
    );
  END IF;

  -- Jurio Susilo (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '6de9dc04-2ebe-4dea-ae48-6ea1b09cef1c') THEN
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
      '6de9dc04-2ebe-4dea-ae48-6ea1b09cef1c', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'jurio.susilo@konstanta.my.id',
      crypt('Konstanta8589', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Jurio Susilo"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '6de9dc04-2ebe-4dea-ae48-6ea1b09cef1c', '6de9dc04-2ebe-4dea-ae48-6ea1b09cef1c',
      'jurio.susilo@konstanta.my.id', 'email',
      json_build_object('sub', '6de9dc04-2ebe-4dea-ae48-6ea1b09cef1c'::text, 'email', 'jurio.susilo@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '6de9dc04-2ebe-4dea-ae48-6ea1b09cef1c', 'kangguru', 'Jurio Susilo', true, now(), now()
    );
  END IF;

  -- Kartim (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '02817d18-1787-41f6-a27b-1283e3ffb020') THEN
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
      '02817d18-1787-41f6-a27b-1283e3ffb020', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'kartim@konstanta.my.id',
      crypt('Konstanta8811', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Kartim"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '02817d18-1787-41f6-a27b-1283e3ffb020', '02817d18-1787-41f6-a27b-1283e3ffb020',
      'kartim@konstanta.my.id', 'email',
      json_build_object('sub', '02817d18-1787-41f6-a27b-1283e3ffb020'::text, 'email', 'kartim@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '02817d18-1787-41f6-a27b-1283e3ffb020', 'kangguru', 'Kartim', true, now(), now()
    );
  END IF;

  -- Kelik Adi Trinugroho (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'bcc52fdd-8e89-4ea8-ae04-7356fe05676c') THEN
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
      'bcc52fdd-8e89-4ea8-ae04-7356fe05676c', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'kelik.adi.trinugroho@konstanta.my.id',
      crypt('Konstanta7425', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Kelik Adi Trinugroho"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'bcc52fdd-8e89-4ea8-ae04-7356fe05676c', 'bcc52fdd-8e89-4ea8-ae04-7356fe05676c',
      'kelik.adi.trinugroho@konstanta.my.id', 'email',
      json_build_object('sub', 'bcc52fdd-8e89-4ea8-ae04-7356fe05676c'::text, 'email', 'kelik.adi.trinugroho@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'bcc52fdd-8e89-4ea8-ae04-7356fe05676c', 'kangguru', 'Kelik Adi Trinugroho', true, now(), now()
    );
  END IF;

  -- Lidia Rentina Pardede (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '59af0991-e2f8-4226-a99c-1b7b2641853d') THEN
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
      '59af0991-e2f8-4226-a99c-1b7b2641853d', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'lidia.rentina.pardede@konstanta.my.id',
      crypt('Konstanta5993', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Lidia Rentina Pardede"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '59af0991-e2f8-4226-a99c-1b7b2641853d', '59af0991-e2f8-4226-a99c-1b7b2641853d',
      'lidia.rentina.pardede@konstanta.my.id', 'email',
      json_build_object('sub', '59af0991-e2f8-4226-a99c-1b7b2641853d'::text, 'email', 'lidia.rentina.pardede@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '59af0991-e2f8-4226-a99c-1b7b2641853d', 'kangguru', 'Lidia Rentina Pardede', true, now(), now()
    );
  END IF;

  -- Lisa Rosaline (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '01f6f9c7-e6fa-455e-ae47-2908d2af49d4') THEN
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
      '01f6f9c7-e6fa-455e-ae47-2908d2af49d4', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'lisa.rosaline@konstanta.my.id',
      crypt('Konstanta8623', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Lisa Rosaline"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '01f6f9c7-e6fa-455e-ae47-2908d2af49d4', '01f6f9c7-e6fa-455e-ae47-2908d2af49d4',
      'lisa.rosaline@konstanta.my.id', 'email',
      json_build_object('sub', '01f6f9c7-e6fa-455e-ae47-2908d2af49d4'::text, 'email', 'lisa.rosaline@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '01f6f9c7-e6fa-455e-ae47-2908d2af49d4', 'kangguru', 'Lisa Rosaline', true, now(), now()
    );
  END IF;

  -- Muarif Ambari (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '4974253f-4a97-4a0a-ad83-b2fe80b25f3d') THEN
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
      '4974253f-4a97-4a0a-ad83-b2fe80b25f3d', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'muarif.ambari@konstanta.my.id',
      crypt('Konstanta6051', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Muarif Ambari"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '4974253f-4a97-4a0a-ad83-b2fe80b25f3d', '4974253f-4a97-4a0a-ad83-b2fe80b25f3d',
      'muarif.ambari@konstanta.my.id', 'email',
      json_build_object('sub', '4974253f-4a97-4a0a-ad83-b2fe80b25f3d'::text, 'email', 'muarif.ambari@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '4974253f-4a97-4a0a-ad83-b2fe80b25f3d', 'kangguru', 'Muarif Ambari', true, now(), now()
    );
  END IF;

  -- M. Tulodo A (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'eea66b5f-6fcc-4c06-a636-2061e024691c') THEN
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
      'eea66b5f-6fcc-4c06-a636-2061e024691c', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'm..tulodo.a@konstanta.my.id',
      crypt('Konstanta2537', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"M. Tulodo A"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'eea66b5f-6fcc-4c06-a636-2061e024691c', 'eea66b5f-6fcc-4c06-a636-2061e024691c',
      'm..tulodo.a@konstanta.my.id', 'email',
      json_build_object('sub', 'eea66b5f-6fcc-4c06-a636-2061e024691c'::text, 'email', 'm..tulodo.a@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'eea66b5f-6fcc-4c06-a636-2061e024691c', 'kangguru', 'M. Tulodo A', true, now(), now()
    );
  END IF;

  -- Muhammad Arief (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'c4946a48-cf23-4e6e-a6d7-9a91a380fac4') THEN
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
      'c4946a48-cf23-4e6e-a6d7-9a91a380fac4', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'muhammad.arief@konstanta.my.id',
      crypt('Konstanta7410', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Muhammad Arief"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'c4946a48-cf23-4e6e-a6d7-9a91a380fac4', 'c4946a48-cf23-4e6e-a6d7-9a91a380fac4',
      'muhammad.arief@konstanta.my.id', 'email',
      json_build_object('sub', 'c4946a48-cf23-4e6e-a6d7-9a91a380fac4'::text, 'email', 'muhammad.arief@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'c4946a48-cf23-4e6e-a6d7-9a91a380fac4', 'kangguru', 'Muhammad Arief', true, now(), now()
    );
  END IF;

  -- Mujahidin Faruqul Adzim (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '242a11f0-1a08-4160-a835-5113a2f78168') THEN
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
      '242a11f0-1a08-4160-a835-5113a2f78168', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'mujahidin.faruqul.adzim@konstanta.my.id',
      crypt('Konstanta5438', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Mujahidin Faruqul Adzim"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '242a11f0-1a08-4160-a835-5113a2f78168', '242a11f0-1a08-4160-a835-5113a2f78168',
      'mujahidin.faruqul.adzim@konstanta.my.id', 'email',
      json_build_object('sub', '242a11f0-1a08-4160-a835-5113a2f78168'::text, 'email', 'mujahidin.faruqul.adzim@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '242a11f0-1a08-4160-a835-5113a2f78168', 'kangguru', 'Mujahidin Faruqul Adzim', true, now(), now()
    );
  END IF;

  -- Muhammad Faisal Aulia (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'cb94bbb8-7c1f-45fe-abef-5517f90c94c6') THEN
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
      'cb94bbb8-7c1f-45fe-abef-5517f90c94c6', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'muhammad.faisal.aulia@konstanta.my.id',
      crypt('Konstanta4795', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Muhammad Faisal Aulia"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'cb94bbb8-7c1f-45fe-abef-5517f90c94c6', 'cb94bbb8-7c1f-45fe-abef-5517f90c94c6',
      'muhammad.faisal.aulia@konstanta.my.id', 'email',
      json_build_object('sub', 'cb94bbb8-7c1f-45fe-abef-5517f90c94c6'::text, 'email', 'muhammad.faisal.aulia@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'cb94bbb8-7c1f-45fe-abef-5517f90c94c6', 'kangguru', 'Muhammad Faisal Aulia', true, now(), now()
    );
  END IF;

  -- Muhamad Ridho (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '3e562bb4-15b0-4827-a846-c852dd86fc6a') THEN
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
      '3e562bb4-15b0-4827-a846-c852dd86fc6a', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'muhamad.ridho@konstanta.my.id',
      crypt('Konstanta4802', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Muhamad Ridho"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '3e562bb4-15b0-4827-a846-c852dd86fc6a', '3e562bb4-15b0-4827-a846-c852dd86fc6a',
      'muhamad.ridho@konstanta.my.id', 'email',
      json_build_object('sub', '3e562bb4-15b0-4827-a846-c852dd86fc6a'::text, 'email', 'muhamad.ridho@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '3e562bb4-15b0-4827-a846-c852dd86fc6a', 'kangguru', 'Muhamad Ridho', true, now(), now()
    );
  END IF;

  -- Natasya Adysaphira (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '293d5c9b-bbd5-4dcc-af78-eafd6a220f3c') THEN
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
      '293d5c9b-bbd5-4dcc-af78-eafd6a220f3c', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'natasya.adysaphira@konstanta.my.id',
      crypt('Konstanta3291', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Natasya Adysaphira"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '293d5c9b-bbd5-4dcc-af78-eafd6a220f3c', '293d5c9b-bbd5-4dcc-af78-eafd6a220f3c',
      'natasya.adysaphira@konstanta.my.id', 'email',
      json_build_object('sub', '293d5c9b-bbd5-4dcc-af78-eafd6a220f3c'::text, 'email', 'natasya.adysaphira@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '293d5c9b-bbd5-4dcc-af78-eafd6a220f3c', 'kangguru', 'Natasya Adysaphira', true, now(), now()
    );
  END IF;

  -- Nyimas Komariah S (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '742d2856-4a0f-4340-ab49-50741d0882d3') THEN
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
      '742d2856-4a0f-4340-ab49-50741d0882d3', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'nyimas.komariah.s@konstanta.my.id',
      crypt('Konstanta9477', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Nyimas Komariah S"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '742d2856-4a0f-4340-ab49-50741d0882d3', '742d2856-4a0f-4340-ab49-50741d0882d3',
      'nyimas.komariah.s@konstanta.my.id', 'email',
      json_build_object('sub', '742d2856-4a0f-4340-ab49-50741d0882d3'::text, 'email', 'nyimas.komariah.s@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '742d2856-4a0f-4340-ab49-50741d0882d3', 'kangguru', 'Nyimas Komariah S', true, now(), now()
    );
  END IF;

  -- Pambudi Rahardjo (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '4ab3c7f5-c398-4e74-a678-33c1c9e5cd79') THEN
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
      '4ab3c7f5-c398-4e74-a678-33c1c9e5cd79', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'pambudi.rahardjo@konstanta.my.id',
      crypt('Konstanta2019', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Pambudi Rahardjo"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '4ab3c7f5-c398-4e74-a678-33c1c9e5cd79', '4ab3c7f5-c398-4e74-a678-33c1c9e5cd79',
      'pambudi.rahardjo@konstanta.my.id', 'email',
      json_build_object('sub', '4ab3c7f5-c398-4e74-a678-33c1c9e5cd79'::text, 'email', 'pambudi.rahardjo@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '4ab3c7f5-c398-4e74-a678-33c1c9e5cd79', 'kangguru', 'Pambudi Rahardjo', true, now(), now()
    );
  END IF;

  -- Purnomo (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'a0505a39-644f-4fa2-a80f-f5656643d2c1') THEN
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
      'a0505a39-644f-4fa2-a80f-f5656643d2c1', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'purnomo@konstanta.my.id',
      crypt('Konstanta9766', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Purnomo"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'a0505a39-644f-4fa2-a80f-f5656643d2c1', 'a0505a39-644f-4fa2-a80f-f5656643d2c1',
      'purnomo@konstanta.my.id', 'email',
      json_build_object('sub', 'a0505a39-644f-4fa2-a80f-f5656643d2c1'::text, 'email', 'purnomo@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'a0505a39-644f-4fa2-a80f-f5656643d2c1', 'kangguru', 'Purnomo', true, now(), now()
    );
  END IF;

  -- Putri Khumaeroh (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '5d7d5811-17e4-41cd-a00d-785ac2739d71') THEN
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
      '5d7d5811-17e4-41cd-a00d-785ac2739d71', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'putri.khumaeroh@konstanta.my.id',
      crypt('Konstanta3682', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Putri Khumaeroh"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '5d7d5811-17e4-41cd-a00d-785ac2739d71', '5d7d5811-17e4-41cd-a00d-785ac2739d71',
      'putri.khumaeroh@konstanta.my.id', 'email',
      json_build_object('sub', '5d7d5811-17e4-41cd-a00d-785ac2739d71'::text, 'email', 'putri.khumaeroh@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '5d7d5811-17e4-41cd-a00d-785ac2739d71', 'kangguru', 'Putri Khumaeroh', true, now(), now()
    );
  END IF;

  -- Raihana Zahra (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '51dd5d93-068d-4f75-a57d-e4a1750f01f3') THEN
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
      '51dd5d93-068d-4f75-a57d-e4a1750f01f3', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'raihana.zahra@konstanta.my.id',
      crypt('Konstanta6912', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Raihana Zahra"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '51dd5d93-068d-4f75-a57d-e4a1750f01f3', '51dd5d93-068d-4f75-a57d-e4a1750f01f3',
      'raihana.zahra@konstanta.my.id', 'email',
      json_build_object('sub', '51dd5d93-068d-4f75-a57d-e4a1750f01f3'::text, 'email', 'raihana.zahra@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '51dd5d93-068d-4f75-a57d-e4a1750f01f3', 'kangguru', 'Raihana Zahra', true, now(), now()
    );
  END IF;

  -- Rama Akbar Saputra (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '77ba4391-5a73-44ea-a222-5d6cb3bc75e0') THEN
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
      '77ba4391-5a73-44ea-a222-5d6cb3bc75e0', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'rama.akbar.saputra@konstanta.my.id',
      crypt('Konstanta4856', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Rama Akbar Saputra"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '77ba4391-5a73-44ea-a222-5d6cb3bc75e0', '77ba4391-5a73-44ea-a222-5d6cb3bc75e0',
      'rama.akbar.saputra@konstanta.my.id', 'email',
      json_build_object('sub', '77ba4391-5a73-44ea-a222-5d6cb3bc75e0'::text, 'email', 'rama.akbar.saputra@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '77ba4391-5a73-44ea-a222-5d6cb3bc75e0', 'kangguru', 'Rama Akbar Saputra', true, now(), now()
    );
  END IF;

  -- Ramadhan Sagala (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '3e2cd2c3-bc59-4214-af95-1dbb7345dacf') THEN
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
      '3e2cd2c3-bc59-4214-af95-1dbb7345dacf', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'ramadhan.sagala@konstanta.my.id',
      crypt('Konstanta5076', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Ramadhan Sagala"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '3e2cd2c3-bc59-4214-af95-1dbb7345dacf', '3e2cd2c3-bc59-4214-af95-1dbb7345dacf',
      'ramadhan.sagala@konstanta.my.id', 'email',
      json_build_object('sub', '3e2cd2c3-bc59-4214-af95-1dbb7345dacf'::text, 'email', 'ramadhan.sagala@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '3e2cd2c3-bc59-4214-af95-1dbb7345dacf', 'kangguru', 'Ramadhan Sagala', true, now(), now()
    );
  END IF;

  -- Ratih Novia Pratiwi (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'd049c17d-d29e-4799-a304-271ec15c8ea2') THEN
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
      'd049c17d-d29e-4799-a304-271ec15c8ea2', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'ratih.novia.pratiwi@konstanta.my.id',
      crypt('Konstanta1329', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Ratih Novia Pratiwi"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'd049c17d-d29e-4799-a304-271ec15c8ea2', 'd049c17d-d29e-4799-a304-271ec15c8ea2',
      'ratih.novia.pratiwi@konstanta.my.id', 'email',
      json_build_object('sub', 'd049c17d-d29e-4799-a304-271ec15c8ea2'::text, 'email', 'ratih.novia.pratiwi@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'd049c17d-d29e-4799-a304-271ec15c8ea2', 'kangguru', 'Ratih Novia Pratiwi', true, now(), now()
    );
  END IF;

  -- Restu Asegaf (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '853d6578-b981-4f65-a9c1-c395ead5e65f') THEN
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
      '853d6578-b981-4f65-a9c1-c395ead5e65f', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'restu.asegaf@konstanta.my.id',
      crypt('Konstanta2018', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Restu Asegaf"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '853d6578-b981-4f65-a9c1-c395ead5e65f', '853d6578-b981-4f65-a9c1-c395ead5e65f',
      'restu.asegaf@konstanta.my.id', 'email',
      json_build_object('sub', '853d6578-b981-4f65-a9c1-c395ead5e65f'::text, 'email', 'restu.asegaf@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '853d6578-b981-4f65-a9c1-c395ead5e65f', 'kangguru', 'Restu Asegaf', true, now(), now()
    );
  END IF;

  -- Rian Pratama (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'ea48c0ba-26aa-4176-a120-295e7d486e0b') THEN
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
      'ea48c0ba-26aa-4176-a120-295e7d486e0b', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'rian.pratama@konstanta.my.id',
      crypt('Konstanta6472', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Rian Pratama"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'ea48c0ba-26aa-4176-a120-295e7d486e0b', 'ea48c0ba-26aa-4176-a120-295e7d486e0b',
      'rian.pratama@konstanta.my.id', 'email',
      json_build_object('sub', 'ea48c0ba-26aa-4176-a120-295e7d486e0b'::text, 'email', 'rian.pratama@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'ea48c0ba-26aa-4176-a120-295e7d486e0b', 'kangguru', 'Rian Pratama', true, now(), now()
    );
  END IF;

  -- Roy Hadiyanto (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '0bb3d493-05ee-4416-ad18-24e4c22dbd61') THEN
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
      '0bb3d493-05ee-4416-ad18-24e4c22dbd61', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'roy.hadiyanto@konstanta.my.id',
      crypt('Konstanta3861', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Roy Hadiyanto"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '0bb3d493-05ee-4416-ad18-24e4c22dbd61', '0bb3d493-05ee-4416-ad18-24e4c22dbd61',
      'roy.hadiyanto@konstanta.my.id', 'email',
      json_build_object('sub', '0bb3d493-05ee-4416-ad18-24e4c22dbd61'::text, 'email', 'roy.hadiyanto@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '0bb3d493-05ee-4416-ad18-24e4c22dbd61', 'kangguru', 'Roy Hadiyanto', true, now(), now()
    );
  END IF;

  -- Sigit Ramires (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'f44d8fe4-f080-48ed-a9ac-8e3f16f2898a') THEN
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
      'f44d8fe4-f080-48ed-a9ac-8e3f16f2898a', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'sigit.ramires@konstanta.my.id',
      crypt('Konstanta8655', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Sigit Ramires"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'f44d8fe4-f080-48ed-a9ac-8e3f16f2898a', 'f44d8fe4-f080-48ed-a9ac-8e3f16f2898a',
      'sigit.ramires@konstanta.my.id', 'email',
      json_build_object('sub', 'f44d8fe4-f080-48ed-a9ac-8e3f16f2898a'::text, 'email', 'sigit.ramires@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'f44d8fe4-f080-48ed-a9ac-8e3f16f2898a', 'kangguru', 'Sigit Ramires', true, now(), now()
    );
  END IF;

  -- Susilawati (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'b9a975a8-300a-4626-aa8e-411438fdabea') THEN
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
      'b9a975a8-300a-4626-aa8e-411438fdabea', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'susilawati@konstanta.my.id',
      crypt('Konstanta2115', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Susilawati"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'b9a975a8-300a-4626-aa8e-411438fdabea', 'b9a975a8-300a-4626-aa8e-411438fdabea',
      'susilawati@konstanta.my.id', 'email',
      json_build_object('sub', 'b9a975a8-300a-4626-aa8e-411438fdabea'::text, 'email', 'susilawati@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'b9a975a8-300a-4626-aa8e-411438fdabea', 'kangguru', 'Susilawati', true, now(), now()
    );
  END IF;

  -- Taufik Hidayat (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '4d22e51f-39fc-43fd-ac69-ed6110efec83') THEN
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
      '4d22e51f-39fc-43fd-ac69-ed6110efec83', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'taufik.hidayat@konstanta.my.id',
      crypt('Konstanta5231', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Taufik Hidayat"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '4d22e51f-39fc-43fd-ac69-ed6110efec83', '4d22e51f-39fc-43fd-ac69-ed6110efec83',
      'taufik.hidayat@konstanta.my.id', 'email',
      json_build_object('sub', '4d22e51f-39fc-43fd-ac69-ed6110efec83'::text, 'email', 'taufik.hidayat@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '4d22e51f-39fc-43fd-ac69-ed6110efec83', 'kangguru', 'Taufik Hidayat', true, now(), now()
    );
  END IF;

  -- Tranggono Setya R (Tio) (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '502740e5-bcad-434c-a072-17297eefa1e1') THEN
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
      '502740e5-bcad-434c-a072-17297eefa1e1', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'tranggono.setya.r@konstanta.my.id',
      crypt('Konstanta5257', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Tranggono Setya R (Tio)"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '502740e5-bcad-434c-a072-17297eefa1e1', '502740e5-bcad-434c-a072-17297eefa1e1',
      'tranggono.setya.r@konstanta.my.id', 'email',
      json_build_object('sub', '502740e5-bcad-434c-a072-17297eefa1e1'::text, 'email', 'tranggono.setya.r@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '502740e5-bcad-434c-a072-17297eefa1e1', 'kangguru', 'Tranggono Setya R (Tio)', true, now(), now()
    );
  END IF;

  -- Wahyu (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '6ce0e9c7-dff4-44bb-a77c-b6dd043fcad7') THEN
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
      '6ce0e9c7-dff4-44bb-a77c-b6dd043fcad7', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'wahyu@konstanta.my.id',
      crypt('Konstanta2241', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Wahyu"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '6ce0e9c7-dff4-44bb-a77c-b6dd043fcad7', '6ce0e9c7-dff4-44bb-a77c-b6dd043fcad7',
      'wahyu@konstanta.my.id', 'email',
      json_build_object('sub', '6ce0e9c7-dff4-44bb-a77c-b6dd043fcad7'::text, 'email', 'wahyu@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '6ce0e9c7-dff4-44bb-a77c-b6dd043fcad7', 'kangguru', 'Wahyu', true, now(), now()
    );
  END IF;

  -- Yana (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '93a9e2fb-e654-4953-abe2-765a01975a8d') THEN
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
      '93a9e2fb-e654-4953-abe2-765a01975a8d', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'yana@konstanta.my.id',
      crypt('Konstanta3221', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Yana"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '93a9e2fb-e654-4953-abe2-765a01975a8d', '93a9e2fb-e654-4953-abe2-765a01975a8d',
      'yana@konstanta.my.id', 'email',
      json_build_object('sub', '93a9e2fb-e654-4953-abe2-765a01975a8d'::text, 'email', 'yana@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '93a9e2fb-e654-4953-abe2-765a01975a8d', 'kangguru', 'Yana', true, now(), now()
    );
  END IF;

  -- Yasmine (kangguru)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '36700891-5356-46a5-adcb-071dd1d1710f') THEN
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
      '36700891-5356-46a5-adcb-071dd1d1710f', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'yasmine@konstanta.my.id',
      crypt('Konstanta5293', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"kangguru","roles":["kangguru"]}'::jsonb,
      '{"full_name":"Yasmine"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '36700891-5356-46a5-adcb-071dd1d1710f', '36700891-5356-46a5-adcb-071dd1d1710f',
      'yasmine@konstanta.my.id', 'email',
      json_build_object('sub', '36700891-5356-46a5-adcb-071dd1d1710f'::text, 'email', 'yasmine@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '36700891-5356-46a5-adcb-071dd1d1710f', 'kangguru', 'Yasmine', true, now(), now()
    );
  END IF;

  -- Sumardi (karyawan)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'fd87212d-e4aa-45df-a183-0ff670f8e4bc') THEN
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
      'fd87212d-e4aa-45df-a183-0ff670f8e4bc', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'sumardi@konstanta.my.id',
      crypt('Konstanta7986', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"karyawan","roles":["karyawan"]}'::jsonb,
      '{"full_name":"Sumardi"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      'fd87212d-e4aa-45df-a183-0ff670f8e4bc', 'fd87212d-e4aa-45df-a183-0ff670f8e4bc',
      'sumardi@konstanta.my.id', 'email',
      json_build_object('sub', 'fd87212d-e4aa-45df-a183-0ff670f8e4bc'::text, 'email', 'sumardi@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      'fd87212d-e4aa-45df-a183-0ff670f8e4bc', 'karyawan', 'Sumardi', true, now(), now()
    );
  END IF;

  -- Imanoeddin (karyawan)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '1c4c22cd-a0af-44a5-a0b9-afe0f31580a9') THEN
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
      '1c4c22cd-a0af-44a5-a0b9-afe0f31580a9', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'imanoeddin@konstanta.my.id',
      crypt('Konstanta8843', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"karyawan","roles":["karyawan"]}'::jsonb,
      '{"full_name":"Imanoeddin"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '1c4c22cd-a0af-44a5-a0b9-afe0f31580a9', '1c4c22cd-a0af-44a5-a0b9-afe0f31580a9',
      'imanoeddin@konstanta.my.id', 'email',
      json_build_object('sub', '1c4c22cd-a0af-44a5-a0b9-afe0f31580a9'::text, 'email', 'imanoeddin@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '1c4c22cd-a0af-44a5-a0b9-afe0f31580a9', 'karyawan', 'Imanoeddin', true, now(), now()
    );
  END IF;

  -- Ahmad Fatihul Ihsan (karyawan)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '32f1688f-444e-4968-afd6-8d0e75a5d33d') THEN
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
      '32f1688f-444e-4968-afd6-8d0e75a5d33d', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'ahmad.fatihul.ihsan@konstanta.my.id',
      crypt('Konstanta3731', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"karyawan","roles":["karyawan"]}'::jsonb,
      '{"full_name":"Ahmad Fatihul Ihsan"}'::jsonb,
      false, false, now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, last_sign_in_at,
      created_at, updated_at
    ) values
    (
      '32f1688f-444e-4968-afd6-8d0e75a5d33d', '32f1688f-444e-4968-afd6-8d0e75a5d33d',
      'ahmad.fatihul.ihsan@konstanta.my.id', 'email',
      json_build_object('sub', '32f1688f-444e-4968-afd6-8d0e75a5d33d'::text, 'email', 'ahmad.fatihul.ihsan@konstanta.my.id', 'email_verified', true, 'provider', 'email')::jsonb,
      now(), now(), now()
    );

    INSERT INTO public.profiles (
      id, role, full_name, must_change_password, created_at, updated_at
    ) values
    (
      '32f1688f-444e-4968-afd6-8d0e75a5d33d', 'karyawan', 'Ahmad Fatihul Ihsan', true, now(), now()
    );
  END IF;

END $$;
