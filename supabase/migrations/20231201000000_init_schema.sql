-- ============================================
-- Lé Stylist Salon - PostgreSQL Schema for Supabase
-- ============================================
-- This schema is compatible with PostgreSQL and Supabase
-- Auto-timestamped, UUID primary keys, proper types

-- Enable required extensions
create extension if not exists "pgcrypto";

-- ============================================
-- ADMIN & AUTHENTICATION
-- ============================================

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  username varchar(100) unique not null,
  email varchar(255) unique not null,
  password_hash varchar(255) not null,
  full_name varchar(255),
  role text default 'admin' check (role in ('super_admin', 'admin', 'manager')),
  is_active boolean default true,
  last_login timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  profile_image varchar(500),
  permissions text
);

create index idx_admin_username on admin_users(username);
create index idx_admin_email on admin_users(email);
create index idx_admin_role on admin_users(role);

-- ============================================
-- SERVICES MANAGEMENT
-- ============================================

create table if not exists service_categories (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) not null,
  slug varchar(100) unique not null,
  type text not null check (type in ('women', 'men', 'makeup', 'hydrafacial')),
  description text,
  icon varchar(50),
  display_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_service_categories_type on service_categories(type);
create index idx_service_categories_slug on service_categories(slug);
create index idx_service_categories_active on service_categories(is_active);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references service_categories(id) on delete cascade,
  service_group_id uuid,
  name varchar(255) not null,
  slug varchar(255) unique not null,
  description text,
  price numeric(10, 2) not null,
  price_type text default 'fixed' check (price_type in ('fixed', 'starts_from')),
  unit varchar(50),
  duration_minutes int,
  discount numeric(10, 2),
  tax_percentage numeric(5, 2),
  ratings numeric(3, 2),
  number_of_ratings int default 0,
  is_active boolean default true,
  is_featured boolean default false,
  display_order int default 0,
  image_url varchar(500),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_services_category on services(category_id);
create index idx_services_slug on services(slug);
create index idx_services_active on services(is_active);

-- ============================================
-- GALLERY MANAGEMENT
-- ============================================

create table if not exists client_images (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references services(id) on delete set null,
  title varchar(255) not null,
  image_url varchar(500) not null,
  alt_text varchar(255),
  category text default 'general' check (category in ('general', 'awards', 'shop', 'client', 'hair', 'makeup', 'skin', 'before_after')),
  description text,
  tags varchar(500),
  is_featured boolean default false,
  display_order int default 0,
  uploaded_by uuid references admin_users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_client_images_category on client_images(category);
create index idx_client_images_featured on client_images(is_featured);

-- ============================================
-- APPOINTMENTS & BOOKINGS
-- ============================================

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  customer_name varchar(255) not null,
  customer_email varchar(255),
  customer_phone varchar(20) not null,
  service_id uuid references services(id) on delete set null,
  appointment_date date not null,
  appointment_time time not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_appointments_date on appointments(appointment_date);
create index idx_appointments_status on appointments(status);
create index idx_appointments_phone on appointments(customer_phone);

-- ============================================
-- OFFERS & PROMOTIONS
-- ============================================

create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references services(id) on delete set null,
  category_id uuid references service_categories(id) on delete set null,
  title varchar(255) not null,
  description text not null,
  offer_type text default 'percentage' check (offer_type in ('percentage', 'fixed_amount', 'festival', 'seasonal')),
  discount_value numeric(10, 2),
  terms_conditions text,
  image_url varchar(500),
  valid_from date,
  valid_until date,
  is_active boolean default true,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_offers_active on offers(is_active);

-- ============================================
-- CONTENT MANAGEMENT
-- ============================================

create table if not exists home_content (
  id uuid primary key default gen_random_uuid(),
  section varchar(100) not null unique,
  title varchar(255),
  subtitle varchar(500),
  content text,
  image_url varchar(500),
  cta_text varchar(100),
  cta_link varchar(500),
  display_order int default 0,
  is_active boolean default true,
  updated_at timestamptz default now()
);

create index idx_home_content_section on home_content(section);

create table if not exists header_settings (
  id uuid primary key default gen_random_uuid(),
  logo_url varchar(500),
  tagline varchar(255),
  phone varchar(20),
  email varchar(255),
  social_facebook varchar(500),
  social_instagram varchar(500),
  social_twitter varchar(500),
  social_youtube varchar(500),
  updated_at timestamptz default now()
);

create table if not exists footer_settings (
  id uuid primary key default gen_random_uuid(),
  about_text text,
  address text,
  phone varchar(20),
  email varchar(255),
  whatsapp varchar(20),
  working_hours text,
  copyright_text varchar(255),
  social_facebook varchar(500),
  social_instagram varchar(500),
  social_twitter varchar(500),
  social_youtube varchar(500),
  updated_at timestamptz default now()
);

create table if not exists about_content (
  id uuid primary key default gen_random_uuid(),
  section varchar(100) not null unique,
  title varchar(255),
  content text,
  image_url varchar(500),
  display_order int default 0,
  is_active boolean default true,
  updated_at timestamptz default now()
);

create table if not exists franchise_content (
  id uuid primary key default gen_random_uuid(),
  section varchar(100) not null unique,
  title varchar(255),
  content text,
  image_url varchar(500),
  whatsapp_number varchar(20),
  contact_email varchar(255),
  display_order int default 0,
  is_active boolean default true,
  updated_at timestamptz default now()
);

-- ============================================
-- TESTIMONIALS & REVIEWS
-- ============================================

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name varchar(255) not null,
  customer_image varchar(500),
  rating smallint check (rating between 1 and 5),
  review_text text not null,
  service_type varchar(100),
  is_featured boolean default false,
  is_approved boolean default false,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_testimonials_approved on testimonials(is_approved);
create index idx_testimonials_featured on testimonials(is_featured);

-- ============================================
-- CONTACT & INQUIRIES
-- ============================================

create table if not exists contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null,
  email varchar(255) not null,
  phone varchar(20),
  subject varchar(255),
  message text not null,
  inquiry_type text default 'general' check (inquiry_type in ('general', 'appointment', 'franchise', 'feedback')),
  status text default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_contact_inquiries_status on contact_inquiries(status);
create index idx_contact_inquiries_type on contact_inquiries(inquiry_type);

-- ============================================
-- INITIAL DATA SEEDING
-- ============================================

-- Insert default admin user (password: admin123 - CHANGE THIS IN PRODUCTION!)
insert into admin_users (username, email, password_hash, full_name, role)
values ('admin', 'admin@lestylist.com', '\$2b\$10\$rN8qJ5Z5Z5Z5Z5Z5Z5Z5ZuXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX', 'Admin User', 'super_admin')
on conflict(username) do nothing;

-- Insert default header settings
insert into header_settings (logo_url, phone, email, social_instagram, social_facebook)
values (null, '+91 1234567890', 'info@lestylist.com', 'https://instagram.com/lestylist', 'https://facebook.com/lestylist')
on conflict do nothing;

-- Insert default footer settings  
insert into footer_settings (about_text, address, phone, email, whatsapp, copyright_text)
values (
  'Lé Stylist is a premium beauty salon offering world-class services in hair, makeup, skincare, and wellness.',
  '123 Beauty Street, Avadi, Chennai - 600054',
  '+91 1234567890',
  'info@lestylist.com',
  '+91 1234567890',
  '© 2024 Lé Stylist. All rights reserved.'
)
on conflict do nothing;
