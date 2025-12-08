-- ============================================
-- INSERT ALL SERVICES FOR LE STYLIST SALON
-- ============================================

-- First, ensure service categories exist
-- MEN SERVICES CATEGORIES
INSERT INTO service_categories (name, slug, type, description, display_order) VALUES
('Hair Cut & Style', 'hair-cut-style-men', 'men', 'Professional haircuts and styling for men', 1),
('Hair Treatment', 'hair-treatment-men', 'men', 'Hair care and treatment services', 2),
('Hair Spa', 'hair-spa-men', 'men', 'Relaxing hair spa treatments', 3),
('Coloring', 'coloring-men', 'men', 'Hair coloring services', 4),
('Advanced Styling', 'advanced-styling-men', 'men', 'Advanced hair styling services', 5),
('Skin Care', 'skin-care-men', 'men', 'Facial and skin treatments', 6),
('Cleanup Services', 'cleanup-men', 'men', 'Face cleanup services', 7),
('Facial Services', 'facial-men', 'men', 'Professional facial treatments', 8),
('Express Glow', 'express-glow-men', 'men', 'Quick glow treatments', 9),
('Ultime Facial', 'ultime-facial-men', 'men', 'Premium facial services', 10),
('Bleach', 'bleach-men', 'men', 'Bleaching services', 11),
('Detan', 'detan-men', 'men', 'De-tan treatments', 12),
('Body Care', 'body-care-men', 'men', 'Manicure, pedicure and body treatments', 13)
ON DUPLICATE KEY UPDATE name=name;

-- MAKEUP SERVICES CATEGORIES
INSERT INTO service_categories (name, slug, type, description, display_order) VALUES
('Party Makeup', 'party-makeup', 'makeup', 'Makeup for parties and events', 1),
('Bridal Makeup', 'bridal-makeup', 'makeup', 'Complete bridal makeup packages', 2),
('Groom Makeup', 'groom-makeup', 'makeup', 'Professional groom makeup', 3),
('Special Occasion', 'special-occasion-makeup', 'makeup', 'Engagement and photoshoot makeup', 4)
ON DUPLICATE KEY UPDATE name=name;

-- HYDRAFACIAL CATEGORIES
INSERT INTO service_categories (name, slug, type, description, display_order) VALUES
('Hydrafacial Treatments', 'hydrafacial-treatments', 'hydrafacial', 'Advanced hydrafacial services', 1),
('Therapy Services', 'therapy-services', 'hydrafacial', 'Specialized therapy treatments', 2)
ON DUPLICATE KEY UPDATE name=name;

-- ============================================
-- MEN SERVICES
-- ============================================

-- Hair Cut & Style
INSERT INTO services (category_id, name, slug, price, price_type, display_order) VALUES
((SELECT id FROM service_categories WHERE slug = 'hair-cut-style-men'), 'Threading', 'threading-men', 40.00, 'fixed', 1),
((SELECT id FROM service_categories WHERE slug = 'hair-cut-style-men'), 'Hair Wash', 'hair-wash-men', 80.00, 'fixed', 2),
((SELECT id FROM service_categories WHERE slug = 'hair-cut-style-men'), 'Shave', 'shave-men', 80.00, 'fixed', 3),
((SELECT id FROM service_categories WHERE slug = 'hair-cut-style-men'), 'Beard Trim', 'beard-trim-men', 100.00, 'fixed', 4),
((SELECT id FROM service_categories WHERE slug = 'hair-cut-style-men'), 'Hair Cut', 'hair-cut-men', 100.00, 'fixed', 5),
((SELECT id FROM service_categories WHERE slug = 'hair-cut-style-men'), 'Kids Cut (Below 3 Yrs)', 'kids-cut-men', 120.00, 'fixed', 6),
((SELECT id FROM service_categories WHERE slug = 'hair-cut-style-men'), 'Beard Design', 'beard-design-men', 150.00, 'fixed', 7),
((SELECT id FROM service_categories WHERE slug = 'hair-cut-style-men'), 'Creative Look', 'creative-look-men', 250.00, 'fixed', 8),
((SELECT id FROM service_categories WHERE slug = 'hair-cut-style-men'), 'Kids Style Change', 'kids-style-change-men', 250.00, 'fixed', 9),
((SELECT id FROM service_categories WHERE slug = 'hair-cut-style-men'), 'Head Shave', 'head-shave-men', 300.00, 'fixed', 10),
((SELECT id FROM service_categories WHERE slug = 'hair-cut-style-men'), 'Change of Style', 'change-of-style-men', 300.00, 'fixed', 11)
ON DUPLICATE KEY UPDATE price=VALUES(price);

-- Hair Treatment
INSERT INTO services (category_id, name, slug, price, price_type, display_order) VALUES
((SELECT id FROM service_categories WHERE slug = 'hair-treatment-men'), 'Hair Fall Treatment', 'hair-fall-treatment-men', 850.00, 'fixed', 1),
((SELECT id FROM service_categories WHERE slug = 'hair-treatment-men'), 'Anti Dandruff Treatment', 'anti-dandruff-treatment-men', 950.00, 'fixed', 2),
((SELECT id FROM service_categories WHERE slug = 'hair-treatment-men'), 'Serie Expert Insta Treatment', 'serie-expert-insta-treatment-men', 1150.00, 'fixed', 3),
((SELECT id FROM service_categories WHERE slug = 'hair-treatment-men'), 'Anti-Tick Treatment', 'anti-tick-treatment-men', 1300.00, 'fixed', 4),
((SELECT id FROM service_categories WHERE slug = 'hair-treatment-men'), 'Keratin Treatment', 'keratin-treatment-men', 2000.00, 'fixed', 5)
ON DUPLICATE KEY UPDATE price=VALUES(price);

-- Hair Spa
INSERT INTO services (category_id, name, slug, price, price_type, display_order) VALUES
((SELECT id FROM service_categories WHERE slug = 'hair-spa-men'), 'Smooth Spa', 'smooth-spa-men', 650.00, 'fixed', 1),
((SELECT id FROM service_categories WHERE slug = 'hair-spa-men'), 'Repair Spa', 'repair-spa-men', 750.00, 'fixed', 2),
((SELECT id FROM service_categories WHERE slug = 'hair-spa-men'), 'Detox Spa', 'detox-spa-men', 950.00, 'fixed', 3)
ON DUPLICATE KEY UPDATE price=VALUES(price);

-- Coloring
INSERT INTO services (category_id, name, slug, price, price_type, display_order) VALUES
((SELECT id FROM service_categories WHERE slug = 'coloring-men'), 'Moustache', 'moustache-coloring-men', 90.00, 'fixed', 1),
((SELECT id FROM service_categories WHERE slug = 'coloring-men'), 'Prelightening (Per Streak)', 'prelightening-per-streak-men', 100.00, 'fixed', 2),
((SELECT id FROM service_categories WHERE slug = 'coloring-men'), 'Streak (Per Streak)', 'streak-per-streak-men', 200.00, 'fixed', 3),
((SELECT id FROM service_categories WHERE slug = 'coloring-men'), 'Beard', 'beard-coloring-men', 200.00, 'fixed', 4),
((SELECT id FROM service_categories WHERE slug = 'coloring-men'), 'Global (Prelightening)', 'global-prelightening-men', 300.00, 'fixed', 5),
((SELECT id FROM service_categories WHERE slug = 'coloring-men'), 'Henna', 'henna-men', 450.00, 'fixed', 6),
((SELECT id FROM service_categories WHERE slug = 'coloring-men'), 'Global (With Ammonia)', 'global-with-ammonia-men', 650.00, 'fixed', 7),
((SELECT id FROM service_categories WHERE slug = 'coloring-men'), 'Global (Ammonia Free)', 'global-ammonia-free-men', 700.00, 'fixed', 8),
((SELECT id FROM service_categories WHERE slug = 'coloring-men'), 'Highlights', 'highlights-men', 800.00, 'fixed', 9)
ON DUPLICATE KEY UPDATE price=VALUES(price);

-- Advanced Styling
INSERT INTO services (category_id, name, slug, price, price_type, display_order) VALUES
((SELECT id FROM service_categories WHERE slug = 'advanced-styling-men'), 'Hair Setting', 'hair-setting-men', 500.00, 'fixed', 1),
((SELECT id FROM service_categories WHERE slug = 'advanced-styling-men'), 'Ironing', 'ironing-men', 600.00, 'fixed', 2),
((SELECT id FROM service_categories WHERE slug = 'advanced-styling-men'), 'Perming', 'perming-men', 1400.00, 'starts_from', 3),
((SELECT id FROM service_categories WHERE slug = 'advanced-styling-men'), 'Smoothening', 'smoothening-men', 1400.00, 'starts_from', 4),
((SELECT id FROM service_categories WHERE slug = 'advanced-styling-men'), 'Straightening', 'straightening-men', 1600.00, 'starts_from', 5),
((SELECT id FROM service_categories WHERE slug = 'advanced-styling-men'), 'Rebonding', 'rebonding-men', 1600.00, 'starts_from', 6)
ON DUPLICATE KEY UPDATE price=VALUES(price);

-- Cleanup Services
INSERT INTO services (category_id, name, slug, price, price_type, display_order) VALUES
((SELECT id FROM service_categories WHERE slug = 'cleanup-men'), 'Herbal Cleanup', 'herbal-cleanup-men', 500.00, 'fixed', 1),
((SELECT id FROM service_categories WHERE slug = 'cleanup-men'), 'Skin Lightening Cleanup', 'skin-lightening-cleanup-men', 600.00, 'fixed', 2),
((SELECT id FROM service_categories WHERE slug = 'cleanup-men'), 'Insta Whitening Cleanup', 'insta-whitening-cleanup-men', 800.00, 'fixed', 3),
((SELECT id FROM service_categories WHERE slug = 'cleanup-men'), 'Insta Whitening Cleanup + Radiance Post Serum', 'insta-whitening-radiance-men', 1100.00, 'fixed', 4)
ON DUPLICATE KEY UPDATE price=VALUES(price);

-- Facial Services
INSERT INTO services (category_id, name, slug, price, price_type, display_order) VALUES
((SELECT id FROM service_categories WHERE slug = 'facial-men'), 'Fruit Facial', 'fruit-facial-men', 700.00, 'fixed', 1),
((SELECT id FROM service_categories WHERE slug = 'facial-men'), 'Wine Facial', 'wine-facial-men', 1000.00, 'fixed', 2),
((SELECT id FROM service_categories WHERE slug = 'facial-men'), 'Derma Facial', 'derma-facial-men', 1200.00, 'fixed', 3),
((SELECT id FROM service_categories WHERE slug = 'facial-men'), 'Detan Facial', 'detan-facial-men', 1400.00, 'fixed', 4),
((SELECT id FROM service_categories WHERE slug = 'facial-men'), 'Aroma Facial', 'aroma-facial-men', 1600.00, 'fixed', 5),
((SELECT id FROM service_categories WHERE slug = 'facial-men'), 'Gold Facial', 'gold-facial-men', 1800.00, 'fixed', 6),
((SELECT id FROM service_categories WHERE slug = 'facial-men'), 'Pearl Facial', 'pearl-facial-men', 1800.00, 'fixed', 7),
((SELECT id FROM service_categories WHERE slug = 'facial-men'), 'Diamond Facial', 'diamond-facial-men', 2000.00, 'fixed', 8)
ON DUPLICATE KEY UPDATE price=VALUES(price);

-- Express Glow
INSERT INTO services (category_id, name, slug, price, price_type, display_order) VALUES
((SELECT id FROM service_categories WHERE slug = 'express-glow-men'), 'Detan + Vit. Veg. Mask', 'detan-vit-veg-mask-men', 1200.00, 'fixed', 1),
((SELECT id FROM service_categories WHERE slug = 'express-glow-men'), 'Detan + Reaff. Mask', 'detan-reaff-mask-men', 1200.00, 'fixed', 2),
((SELECT id FROM service_categories WHERE slug = 'express-glow-men'), 'Detan + Goji Mask', 'detan-goji-mask-men', 1300.00, 'fixed', 3),
((SELECT id FROM service_categories WHERE slug = 'express-glow-men'), 'Detan + Gold Mask', 'detan-gold-mask-men', 1500.00, 'fixed', 4)
ON DUPLICATE KEY UPDATE price=VALUES(price);

-- Ultime Facial
INSERT INTO services (category_id, name, slug, price, price_type, display_order) VALUES
((SELECT id FROM service_categories WHERE slug = 'ultime-facial-men'), 'Active Charcoal', 'active-charcoal-men', 2200.00, 'fixed', 1),
((SELECT id FROM service_categories WHERE slug = 'ultime-facial-men'), 'Skin Lightening Advanced', 'skin-lightening-advanced-men', 2500.00, 'fixed', 2),
((SELECT id FROM service_categories WHERE slug = 'ultime-facial-men'), '24K Gold', '24k-gold-men', 2800.00, 'fixed', 3),
((SELECT id FROM service_categories WHERE slug = 'ultime-facial-men'), 'Insta Whitening', 'insta-whitening-men', 3000.00, 'fixed', 4),
((SELECT id FROM service_categories WHERE slug = 'ultime-facial-men'), 'Oxygen', 'oxygen-men', 3500.00, 'fixed', 5),
((SELECT id FROM service_categories WHERE slug = 'ultime-facial-men'), 'Radiance', 'radiance-men', 3500.00, 'fixed', 6)
ON DUPLICATE KEY UPDATE price=VALUES(price);

-- Bleach
INSERT INTO services (category_id, name, slug, price, price_type, display_order) VALUES
((SELECT id FROM service_categories WHERE slug = 'bleach-men'), 'Bleach - Nape', 'bleach-nape-men', 100.00, 'fixed', 1),
((SELECT id FROM service_categories WHERE slug = 'bleach-men'), 'Bleach - Under Arm', 'bleach-under-arm-men', 150.00, 'fixed', 2),
((SELECT id FROM service_categories WHERE slug = 'bleach-men'), 'Bleach - Upper Back', 'bleach-upper-back-men', 190.00, 'fixed', 3),
((SELECT id FROM service_categories WHERE slug = 'bleach-men'), 'Bleach - Lower Back', 'bleach-lower-back-men', 190.00, 'fixed', 4),
((SELECT id FROM service_categories WHERE slug = 'bleach-men'), 'Bleach - Neck', 'bleach-neck-men', 200.00, 'fixed', 5),
((SELECT id FROM service_categories WHERE slug = 'bleach-men'), 'Bleach - Face', 'bleach-face-men', 200.00, 'fixed', 6),
((SELECT id FROM service_categories WHERE slug = 'bleach-men'), 'Bleach - Half Arms', 'bleach-half-arms-men', 200.00, 'fixed', 7),
((SELECT id FROM service_categories WHERE slug = 'bleach-men'), 'Bleach - Feet', 'bleach-feet-men', 300.00, 'fixed', 8),
((SELECT id FROM service_categories WHERE slug = 'bleach-men'), 'Bleach - Full Back', 'bleach-full-back-men', 350.00, 'fixed', 9),
((SELECT id FROM service_categories WHERE slug = 'bleach-men'), 'Bleach - Full Arms', 'bleach-full-arms-men', 200.00, 'fixed', 10),
((SELECT id FROM service_categories WHERE slug = 'bleach-men'), 'Bleach - Half Legs', 'bleach-half-legs-men', 450.00, 'fixed', 11),
((SELECT id FROM service_categories WHERE slug = 'bleach-men'), 'Bleach - Full Legs', 'bleach-full-legs-men', 700.00, 'fixed', 12),
((SELECT id FROM service_categories WHERE slug = 'bleach-men'), 'Bleach - Full Body', 'bleach-full-body-men', 2500.00, 'fixed', 13)
ON DUPLICATE KEY UPDATE price=VALUES(price);

-- Detan
INSERT INTO services (category_id, name, slug, price, price_type, display_order) VALUES
((SELECT id FROM service_categories WHERE slug = 'detan-men'), 'Detan - Nape', 'detan-nape-men', 200.00, 'fixed', 1),
((SELECT id FROM service_categories WHERE slug = 'detan-men'), 'Detan - Under Arm', 'detan-under-arm-men', 180.00, 'fixed', 2),
((SELECT id FROM service_categories WHERE slug = 'detan-men'), 'Detan - Upper Back', 'detan-upper-back-men', 200.00, 'fixed', 3),
((SELECT id FROM service_categories WHERE slug = 'detan-men'), 'Detan - Lower Back', 'detan-lower-back-men', 200.00, 'fixed', 4),
((SELECT id FROM service_categories WHERE slug = 'detan-men'), 'Detan - Neck', 'detan-neck-men', 300.00, 'fixed', 5),
((SELECT id FROM service_categories WHERE slug = 'detan-men'), 'Detan - Face', 'detan-face-men', 300.00, 'fixed', 6),
((SELECT id FROM service_categories WHERE slug = 'detan-men'), 'Detan - Half Arms', 'detan-half-arms-men', 550.00, 'fixed', 7),
((SELECT id FROM service_categories WHERE slug = 'detan-men'), 'Detan - Feet', 'detan-feet-men', 500.00, 'fixed', 8),
((SELECT id FROM service_categories WHERE slug = 'detan-men'), 'Detan - Full Back', 'detan-full-back-men', 600.00, 'fixed', 9),
((SELECT id FROM service_categories WHERE slug = 'detan-men'), 'Detan - Full Arms', 'detan-full-arms-men', 850.00, 'fixed', 10),
((SELECT id FROM service_categories WHERE slug = 'detan-men'), 'Detan - Half Legs', 'detan-half-legs-men', 600.00, 'fixed', 11),
((SELECT id FROM service_categories WHERE slug = 'detan-men'), 'Detan - Full Legs', 'detan-full-legs-men', 1000.00, 'fixed', 12),
((SELECT id FROM service_categories WHERE slug = 'detan-men'), 'Detan - Full Body', 'detan-full-body-men', 2750.00, 'fixed', 13)
ON DUPLICATE KEY UPDATE price=VALUES(price);

-- Body Care
INSERT INTO services (category_id, name, slug, price, price_type, display_order) VALUES
((SELECT id FROM service_categories WHERE slug = 'body-care-men'), 'Pedicure (Basic)', 'pedicure-basic-men', 300.00, 'fixed', 1),
((SELECT id FROM service_categories WHERE slug = 'body-care-men'), 'Pedicure (Premium)', 'pedicure-premium-men', 1500.00, 'fixed', 2),
((SELECT id FROM service_categories WHERE slug = 'body-care-men'), 'Manicure (Basic)', 'manicure-basic-men', 150.00, 'fixed', 3),
((SELECT id FROM service_categories WHERE slug = 'body-care-men'), 'Manicure (Premium)', 'manicure-premium-men', 1100.00, 'fixed', 4),
((SELECT id FROM service_categories WHERE slug = 'body-care-men'), 'Reflexology', 'reflexology-men', 800.00, 'fixed', 5),
((SELECT id FROM service_categories WHERE slug = 'body-care-men'), 'Head Massage (Basic)', 'head-massage-basic-men', 100.00, 'fixed', 6),
((SELECT id FROM service_categories WHERE slug = 'body-care-men'), 'Head Massage (Premium)', 'head-massage-premium-men', 250.00, 'fixed', 7)
ON DUPLICATE KEY UPDATE price=VALUES(price);

-- ============================================
-- MAKEUP SERVICES
-- ============================================

INSERT INTO services (category_id, name, slug, price, price_type, display_order) VALUES
((SELECT id FROM service_categories WHERE slug = 'party-makeup'), 'Simple Party Makeup', 'simple-party-makeup', 3500.00, 'fixed', 1),
((SELECT id FROM service_categories WHERE slug = 'party-makeup'), 'M.A.C Makeup', 'mac-makeup', 7500.00, 'fixed', 2),
((SELECT id FROM service_categories WHERE slug = 'party-makeup'), 'Kryolan Makeup', 'kryolan-makeup', 5000.00, 'fixed', 3),
((SELECT id FROM service_categories WHERE slug = 'party-makeup'), 'HD Makeup', 'hd-makeup', 17500.00, 'fixed', 4),
((SELECT id FROM service_categories WHERE slug = 'party-makeup'), 'Elite Makeup Services', 'elite-makeup-services', 12000.00, 'fixed', 5)
ON DUPLICATE KEY UPDATE price=VALUES(price);

INSERT INTO services (category_id, name, slug, price, price_type, display_order) VALUES
((SELECT id FROM service_categories WHERE slug = 'bridal-makeup'), 'Bridal Makeup (Basic Package)', 'bridal-makeup-basic', 18000.00, 'fixed', 1),
((SELECT id FROM service_categories WHERE slug = 'bridal-makeup'), 'Bridal Makeup (Premium Package)', 'bridal-makeup-premium', 25000.00, 'fixed', 2),
((SELECT id FROM service_categories WHERE slug = 'bridal-makeup'), 'Bridal Makeup (Luxury Package)', 'bridal-makeup-luxury', 35000.00, 'fixed', 3)
ON DUPLICATE KEY UPDATE price=VALUES(price);

INSERT INTO services (category_id, name, slug, price, price_type, display_order) VALUES
((SELECT id FROM service_categories WHERE slug = 'groom-makeup'), 'Groom Makeup (Basic)', 'groom-makeup-basic', 4000.00, 'fixed', 1),
((SELECT id FROM service_categories WHERE slug = 'groom-makeup'), 'Groom Makeup (Premium)', 'groom-makeup-premium', 7000.00, 'fixed', 2)
ON DUPLICATE KEY UPDATE price=VALUES(price);

INSERT INTO services (category_id, name, slug, price, price_type, display_order) VALUES
((SELECT id FROM service_categories WHERE slug = 'special-occasion-makeup'), 'Engagement Makeup (Basic)', 'engagement-makeup-basic', 10000.00, 'fixed', 1),
((SELECT id FROM service_categories WHERE slug = 'special-occasion-makeup'), 'Engagement Makeup (Premium)', 'engagement-makeup-premium', 18000.00, 'fixed', 2),
((SELECT id FROM service_categories WHERE slug = 'special-occasion-makeup'), 'Pre-Wedding Photoshoot Makeup (Basic)', 'pre-wedding-photoshoot-basic', 7000.00, 'fixed', 3),
((SELECT id FROM service_categories WHERE slug = 'special-occasion-makeup'), 'Pre-Wedding Photoshoot Makeup (Premium)', 'pre-wedding-photoshoot-premium', 12000.00, 'fixed', 4)
ON DUPLICATE KEY UPDATE price=VALUES(price);

-- ============================================
-- HYDRAFACIAL SERVICES
-- ============================================

INSERT INTO services (category_id, name, slug, price, price_type, display_order) VALUES
((SELECT id FROM service_categories WHERE slug = 'hydrafacial-treatments'), 'Hydrafacial', 'hydrafacial', 4500.00, 'fixed', 1),
((SELECT id FROM service_categories WHERE slug = 'hydrafacial-treatments'), 'Hydradermabrasion', 'hydradermabrasion', 3200.00, 'fixed', 2),
((SELECT id FROM service_categories WHERE slug = 'hydrafacial-treatments'), 'Ultrasonic Scrub', 'ultrasonic-scrub', 1500.00, 'fixed', 3),
((SELECT id FROM service_categories WHERE slug = 'hydrafacial-treatments'), 'Serum Infusion', 'serum-infusion', 2200.00, 'fixed', 4),
((SELECT id FROM service_categories WHERE slug = 'hydrafacial-treatments'), 'LED Mask', 'led-mask', 1500.00, 'fixed', 5)
ON DUPLICATE KEY UPDATE price=VALUES(price);

INSERT INTO services (category_id, name, slug, price, price_type, display_order) VALUES
((SELECT id FROM service_categories WHERE slug = 'therapy-services'), 'RF Therapy', 'rf-therapy', 2000.00, 'fixed', 1),
((SELECT id FROM service_categories WHERE slug = 'therapy-services'), 'Ultrasonic Therapy', 'ultrasonic-therapy', 1800.00, 'fixed', 2),
((SELECT id FROM service_categories WHERE slug = 'therapy-services'), 'Cold Therapy', 'cold-therapy', 1200.00, 'fixed', 3)
ON DUPLICATE KEY UPDATE price=VALUES(price);

-- ============================================
-- DONE!
-- ============================================
