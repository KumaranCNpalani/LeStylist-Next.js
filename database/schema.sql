-- ============================================
-- Lé Stylist Salon - Complete Database Schema
-- ============================================
-- This is the single source of truth for the database structure
-- Supports: Services, Gallery, Content Management, Appointments, Offers, Admin

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS lestylist_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lestylist_db;

-- ============================================
-- ADMIN & AUTHENTICATION
-- ============================================

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role ENUM('super_admin', 'admin', 'manager') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    profile_image VARCHAR(500),
    permissions TEXT,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SERVICES MANAGEMENT
-- ============================================

-- Service categories (Women, Men, Makeup, Hydrafacial with subcategories)
CREATE TABLE IF NOT EXISTS service_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    type ENUM('women', 'men', 'makeup', 'hydrafacial') NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_slug (slug),
    INDEX idx_active (is_active),
    INDEX idx_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Individual services
CREATE TABLE IF NOT EXISTS services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    service_group_id INT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    price_type ENUM('fixed', 'starts_from') DEFAULT 'fixed',
    unit VARCHAR(50),
    duration_minutes INT,
    discount DECIMAL(10, 2),
    tax_percentage DECIMAL(5, 2),
    ratings DECIMAL(3, 2),
    number_of_ratings INT,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE CASCADE,
    INDEX idx_category (category_id),
    INDEX idx_slug (slug),
    INDEX idx_active (is_active),
    INDEX idx_featured (is_featured),
    INDEX idx_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- GALLERY MANAGEMENT
-- ============================================

-- Client images and gallery
CREATE TABLE IF NOT EXISTS client_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_id INT,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    category ENUM('general', 'awards', 'shop', 'client', 'hair', 'makeup', 'skin', 'before_after') DEFAULT 'general',
    description TEXT,
    tags VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
    INDEX idx_category (category),
    INDEX idx_featured (is_featured),
    INDEX idx_order (display_order),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- APPOINTMENTS & BOOKINGS
-- ============================================

-- Customer appointments
CREATE TABLE IF NOT EXISTS appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20) NOT NULL,
    service_id INT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no_show') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
    INDEX idx_date (appointment_date),
    INDEX idx_status (status),
    INDEX idx_phone (customer_phone),
    INDEX idx_email (customer_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- OFFERS & PROMOTIONS
-- ============================================

-- Special offers and promotions
CREATE TABLE IF NOT EXISTS offers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_id INT,
    category_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    offer_type ENUM('percentage', 'fixed_amount', 'festival', 'seasonal') DEFAULT 'percentage',
    discount_value DECIMAL(10, 2),
    terms_conditions TEXT,
    image_url VARCHAR(500),
    valid_from DATE,
    valid_until DATE,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE SET NULL,
    INDEX idx_active (is_active),
    INDEX idx_valid_from (valid_from),
    INDEX idx_valid_until (valid_until),
    INDEX idx_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CONTENT MANAGEMENT
-- ============================================

-- Home page content
CREATE TABLE IF NOT EXISTS home_content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255),
    subtitle VARCHAR(500),
    content TEXT,
    image_url VARCHAR(500),
    cta_text VARCHAR(100),
    cta_link VARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_section (section),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Header settings
CREATE TABLE IF NOT EXISTS header_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    logo_url VARCHAR(500),
    tagline VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    social_facebook VARCHAR(500),
    social_instagram VARCHAR(500),
    social_twitter VARCHAR(500),
    social_youtube VARCHAR(500),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Footer settings
CREATE TABLE IF NOT EXISTS footer_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    about_text TEXT,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    whatsapp VARCHAR(20),
    working_hours TEXT,
    copyright_text VARCHAR(255),
    social_facebook VARCHAR(500),
    social_instagram VARCHAR(500),
    social_twitter VARCHAR(500),
    social_youtube VARCHAR(500),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- About page content
CREATE TABLE IF NOT EXISTS about_content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255),
    content TEXT,
    image_url VARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_section (section),
    INDEX idx_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Franchise page content
CREATE TABLE IF NOT EXISTS franchise_content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255),
    content TEXT,
    image_url VARCHAR(500),
    whatsapp_number VARCHAR(20),
    contact_email VARCHAR(255),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_section (section),
    INDEX idx_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TESTIMONIALS & REVIEWS
-- ============================================

-- Customer testimonials
CREATE TABLE IF NOT EXISTS testimonials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(255) NOT NULL,
    customer_image VARCHAR(500),
    rating TINYINT CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT NOT NULL,
    service_type VARCHAR(100),
    is_featured BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_approved (is_approved),
    INDEX idx_featured (is_featured),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CONTACT & INQUIRIES
-- ============================================

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    inquiry_type ENUM('general', 'appointment', 'franchise', 'feedback') DEFAULT 'general',
    status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_type (inquiry_type),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INITIAL DATA SEEDING
-- ============================================

-- Insert default admin user (password: admin123 - CHANGE THIS IN PRODUCTION!)
INSERT INTO admin_users (username, email, password_hash, full_name, role) 
VALUES ('admin', 'admin@lestylist.com', '$2b$10$rN8qJ5Z5Z5Z5Z5Z5Z5Z5ZuXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX', 'Admin User', 'super_admin')
ON DUPLICATE KEY UPDATE username=username;

-- Insert service categories for Women
INSERT INTO service_categories (name, slug, type, description, display_order) VALUES
('Hair Care', 'hair-care', 'women', 'Professional haircuts, coloring, treatments, and styling', 1),
('Skin Care', 'skin-care', 'women', 'Advanced facials and skincare treatments', 2),
('Body Care', 'body-care', 'women', 'Manicures, pedicures, waxing, and massage services', 3),
('Nail Care', 'nail-care', 'women', 'Manicure, pedicure, nail art, and extensions', 4)
ON DUPLICATE KEY UPDATE name=name;

-- Insert service categories for Men
INSERT INTO service_categories (name, slug, type, description, display_order) VALUES
('Hair Cut & Style', 'hair-cut-style', 'men', 'Professional haircuts and styling for men', 1),
('Beard & Shave', 'beard-shave', 'men', 'Beard trimming, styling, and traditional shaves', 2),
('Skin Care', 'skin-care-men', 'men', 'Facials and skincare treatments for men', 3),
('Body Care', 'body-care-men', 'men', 'Massage and grooming services', 4)
ON DUPLICATE KEY UPDATE name=name;

-- Insert service categories for Makeup
INSERT INTO service_categories (name, slug, type, description, display_order) VALUES
('Bridal Makeup', 'bridal-makeup', 'makeup', 'Complete bridal makeup packages', 1),
('Groom Makeup', 'groom-makeup', 'makeup', 'Professional groom makeup', 2),
('Party Makeup', 'party-makeup', 'makeup', 'Makeup for parties and events', 3),
('HD & Airbrush', 'hd-airbrush', 'makeup', 'HD and airbrush makeup services', 4)
ON DUPLICATE KEY UPDATE name=name;

-- Insert service categories for Hydrafacial
INSERT INTO service_categories (name, slug, type, description, display_order) VALUES
('Classic Hydrafacial', 'classic-hydrafacial', 'hydrafacial', 'Standard hydrafacial treatment', 1),
('Advanced Hydrafacial', 'advanced-hydrafacial', 'hydrafacial', 'Enhanced treatment with boosters', 2),
('Premium Hydrafacial', 'premium-hydrafacial', 'hydrafacial', 'Complete treatment with LED therapy', 3)
ON DUPLICATE KEY UPDATE name=name;

-- Insert default header settings
INSERT INTO header_settings (id, phone, email, social_instagram, social_facebook) 
VALUES (1, '+91 1234567890', 'info@lestylist.com', 'https://instagram.com/lestylist', 'https://facebook.com/lestylist')
ON DUPLICATE KEY UPDATE id=id;

-- Insert default footer settings
INSERT INTO footer_settings (id, about_text, address, phone, email, whatsapp, copyright_text) 
VALUES (
    1, 
    'Lé Stylist is a premium beauty salon offering world-class services in hair, makeup, skincare, and wellness.',
    '123 Beauty Street, Avadi, Chennai - 600054',
    '+91 1234567890',
    'info@lestylist.com',
    '+91 1234567890',
    '© 2024 Lé Stylist. All rights reserved.'
)
ON DUPLICATE KEY UPDATE id=id;

-- Insert sample services for Women - Hair Care
INSERT INTO services (category_id, name, slug, description, price, duration_minutes) VALUES
((SELECT id FROM service_categories WHERE slug = 'hair-care' AND type = 'women'), 'Women''s Haircut', 'womens-haircut', 'A classic haircut for women', 500.00, 30)
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO services (category_id, name, slug, description, price, duration_minutes) VALUES
((SELECT id FROM service_categories WHERE slug = 'hair-care' AND type = 'women'), 'Hair Coloring', 'hair-coloring', 'Single process hair color', 1200.00, 60)
ON DUPLICATE KEY UPDATE name=name;

-- Insert sample services for Men - Hair Cut & Style
INSERT INTO services (category_id, name, slug, description, price, duration_minutes) VALUES
((SELECT id FROM service_categories WHERE slug = 'hair-cut-style' AND type = 'men'), 'Men''s Haircut', 'mens-haircut', 'A classic haircut for men', 300.00, 20)
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO services (category_id, name, slug, description, price, duration_minutes) VALUES
((SELECT id FROM service_categories WHERE slug = 'hair-cut-style' AND type = 'men'), 'Beard Trim', 'beard-trim', 'A professional beard trim', 200.00, 15)
ON DUPLICATE KEY UPDATE name=name;

-- Insert sample services for Makeup - Bridal Makeup
INSERT INTO services (category_id, name, slug, description, price, duration_minutes) VALUES
((SELECT id FROM service_categories WHERE slug = 'bridal-makeup' AND type = 'makeup'), 'Bridal Makeup Package', 'bridal-makeup-package', 'Complete bridal makeup package with consultation', 5000.00, 120)
ON DUPLICATE KEY UPDATE name=name;

-- Insert sample services for Hydrafacial - Classic Hydrafacial
INSERT INTO services (category_id, name, slug, description, price, duration_minutes) VALUES
((SELECT id FROM service_categories WHERE slug = 'classic-hydrafacial' AND type = 'hydrafacial'), 'Classic Hydrafacial Treatment', 'classic-hydrafacial-treatment', 'A standard hydrafacial treatment', 2500.00, 45)
ON DUPLICATE KEY UPDATE name=name;

-- ============================================
-- NOTE: Sample services data can be added via Admin Dashboard
-- ============================================

-- ============================================
-- END OF SCHEMA
-- ============================================