-- =============================================================================
-- AgriTrade — Canonical Seed Data (Stage 4D)
-- Populates categories, 24 realistic products, and APMC Mandi market rates
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. CATEGORIES (6 Canonical Categories)
-- -----------------------------------------------------------------------------
INSERT INTO public.categories (id, name, icon, description, item_count, sort_order)
VALUES
  ('cat_seeds', 'Seeds', 'Sprout', 'Certified hybrid, high-yielding & disease-resistant crop seeds', 4, 1),
  ('cat_fertilizers', 'Fertilizers', 'FlaskConical', 'Bio-fertilizers, water-soluble NPKs & essential micronutrients', 4, 2),
  ('cat_protection', 'Crop Protection', 'ShieldCheck', 'Organic bio-pesticides, fungicides & insect controls', 4, 3),
  ('cat_irrigation', 'Irrigation', 'Droplets', 'Drip kits, rain guns, emitters & flexible delivery hoses', 4, 4),
  ('cat_tools', 'Farm Tools', 'Wrench', 'Ergonomic forged tools, battery sprayers & cultivators', 4, 5),
  ('cat_animal', 'Animal Care', 'Beef', 'Dairy mineral mixtures, calcium tonics & livestock supplements', 4, 6)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  item_count = EXCLUDED.item_count,
  sort_order = EXCLUDED.sort_order;

-- -----------------------------------------------------------------------------
-- 2. PRODUCTS (24 Realistic Indian Agricultural Products)
-- -----------------------------------------------------------------------------
INSERT INTO public.products (
  id, title, description, category_id, brand, seller_name, seller_rating,
  price, original_price, unit, stock_count, rating, review_count, delivery_location,
  highlights, specifications, image_url, is_featured
)
VALUES
  -- 2.1 SEEDS
  (
    'prod_1',
    'Premium Hybrid Soybean Seeds (JS-335)',
    'Certified high-germination hybrid soybean seeds bred for deep black and loamy soils across central and western India. Exceptional tolerance against yellow mosaic virus and sudden wilt.',
    'cat_seeds', 'AgriGrow', 'AgriGrow Official', 4.9,
    1250.00, 1450.00, '5 kg pack', 42, 4.8, 128, 'Pune, Maharashtra',
    '["Germination rate: >90%", "Maturity window: 95–100 days", "Oil content: 19–20%", "Certified government breeder seed"]'::jsonb,
    '{"Variety": "JS-335", "Crop": "Soybean", "Season": "Kharif", "Soil Type": "Black Loam", "Treated": "Thiram & Carbendazim"}'::jsonb,
    'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80',
    true
  ),
  (
    'prod_7',
    'High-Yield Bollgard II Bt Cotton Seeds',
    'Premium transgenic hybrid cotton with dual-toxin protection against American and pink bollworms. High boll retention with superior staple length.',
    'cat_seeds', 'Kaveri Seeds', 'Kaveri Agri Depot', 4.8,
    850.00, 950.00, '450g packet', 65, 4.7, 94, 'Nagpur, Maharashtra',
    '["BG-II approved hybrid", "Staple length: 29–30mm", "High ginning outturn (>35%)", "Deep root penetration"]'::jsonb,
    '{"Crop": "Cotton", "Seed Treatment": "Imidacloprid", "Sowing Spacing": "90x60 cm", "Irrigation": "Rainfed / Irrigated"}'::jsonb,
    'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80',
    true
  ),
  (
    'prod_8',
    'Sharbati Premium Certified Wheat Seeds (GW-322)',
    'A-grade golden grain Sharbati wheat offering high chapati softness, 12.5% protein content, and strong rust resistance under semi-irrigated conditions.',
    'cat_seeds', 'Mahyco', 'Vidarbha Agro Hub', 4.9,
    1100.00, 1250.00, '40 kg bag', 38, 4.9, 86, 'Amravati, Maharashtra',
    '["Amber lustrous bold grains", "Protein content: 12.5%", "High lodging resistance", "Yield potential: 22–24 qtl/acre"]'::jsonb,
    '{"Crop": "Wheat", "Maturity": "115–120 days", "Water Requirement": "3–4 Irrigations", "Zone": "Central India"}'::jsonb,
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    false
  ),
  (
    'prod_9',
    'Black Gold Hybrid Mustard Seeds (Pusa-31)',
    'High-oil content black mustard seeds suitable for northern and western plains. Tolerant to white rust and alternaria blight.',
    'cat_seeds', 'Pusa Agri', 'Indore Krishi Kendra', 4.7,
    480.00, 560.00, '1 kg pack', 110, 4.6, 52, 'Indore, Madhya Pradesh',
    '["Oil content: >41.5%", "Shattering resistant pods", "Early harvest: 105 days", "Low erucic acid profile"]'::jsonb,
    '{"Crop": "Mustard", "Seed Rate": "1.5 kg / acre", "Season": "Rabi", "Height": "160–180 cm"}'::jsonb,
    'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=600&q=80',
    false
  ),

  -- 2.2 FERTILIZERS
  (
    'prod_2',
    'IFFCO DAP Fertilizer (Di-Ammonium Phosphate 18:46:0)',
    'High-grade granular phosphatic fertilizer providing 18% Nitrogen and 46% Phosphorus. Essential for vigorous root establishment, tillering, and healthy flowering.',
    'cat_fertilizers', 'IFFCO', 'IFFCO Kisan Seva', 4.9,
    1350.00, 1500.00, '50 kg bag', 85, 4.8, 310, 'Pune, Maharashtra',
    '["18% Ammoniacal Nitrogen", "46% Available Phosphate (P2O5)", "100% water-soluble nutrient ratio", "Subsidized farmer gate pricing"]'::jsonb,
    '{"Grade": "18:46:0", "Form": "Granular", "Application": "Basal Dressing", "Packaging": "Moisture-proof HDPE"}'::jsonb,
    'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80',
    true
  ),
  (
    'prod_10',
    'NPK 19:19:19 100% Water Soluble Fertilizer',
    'Balanced foliar and drip grade fertilizer formulated with micro-nutrients. Rapidly absorbed through leaf stomata for quick recovery from nutrient stress.',
    'cat_fertilizers', 'Mahadhan', 'Mahadhan Direct', 4.8,
    220.00, 260.00, '1 kg pouch', 140, 4.7, 78, 'Nashik, Maharashtra',
    '["100% instant solubility in water", "Balanced 1:1:1 NPK macro profile", "Chelated EDTA micronutrients", "Zero chlorine & heavy metals"]'::jsonb,
    '{"Type": "Water Soluble", "Dose": "5g per liter foliar / 3kg per acre drip", "Compatibility": "Mixable with most pesticides"}'::jsonb,
    'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80',
    false
  ),
  (
    'prod_11',
    'Neem Coated Agricultural Urea 46% N',
    'Government approved slow-release nitrogenous fertilizer with biological neem oil coating to minimize nitrogen leaching and denitrification losses.',
    'cat_fertilizers', 'NFL', 'Kisan Sahakari Kendra', 4.9,
    266.50, 300.00, '45 kg bag', 200, 4.9, 420, 'Baramati, Maharashtra',
    '["46% Total Nitrogen content", "Neem extract coated (800 ppm)", "Enhanced nitrogen use efficiency (+15%)", "Prevents underground soil compaction"]'::jsonb,
    '{"Form": "Prilled", "Standard": "FCO Grade", "Shelf Life": "24 Months", "Handling": "Store in dry shed"}'::jsonb,
    'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80',
    false
  ),
  (
    'prod_12',
    'Chelated Zinc EDTA 12% Micronutrient',
    'High efficiency chelated zinc powder for resolving chlorosis, stunted internodes, and Khaira disease in paddy, maize, and citrus crops.',
    'cat_fertilizers', 'Aries Agro', 'Aries Krishi Point', 4.7,
    380.00, 440.00, '500g pack', 72, 4.6, 45, 'Kolhapur, Maharashtra',
    '["12% Pure Chelated Zinc (Zn-EDTA)", "Effective across pH range 4.0–9.0", "Quick leaf absorption in 24 hours", "Enhances chlorophyll synthesis"]'::jsonb,
    '{"Form": "Free-flowing micro-granules", "Foliar Dose": "1g / Liter", "Soil Drench": "500g / Acre"}'::jsonb,
    'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80',
    false
  ),

  -- 2.3 CROP PROTECTION
  (
    'prod_3',
    'Organic Neem Bio-Pesticide (10,000 PPM Azadirachtin)',
    'Cold-pressed pure neem seed kernel extract providing broad-spectrum insect repelling, anti-feedant, and ovicidal action against whiteflies, aphids, and thrips.',
    'cat_protection', 'GreenAgro', 'GreenAgro Organics', 4.8,
    450.00, 520.00, '1 Liter bottle', 90, 4.7, 164, 'Satara, Maharashtra',
    '["10,000 PPM pure Azadirachtin", "Certified organic input (NPOP/IFOAM)", "Zero harvest withholding interval", "Safe for honeybees & earthworms"]'::jsonb,
    '{"Active Ingredient": "Azadirachtin 1% EC", "Target Pests": "Sucking Pests, Caterpillars", "Dosage": "2.5 ml / Liter water"}'::jsonb,
    'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80',
    true
  ),
  (
    'prod_13',
    'Saaf Systemic & Contact Fungicide (Carbendazim 12% + Mancozeb 63% WP)',
    'Dual action proven fungicide providing preventative and curative protection against blast, powdery mildew, anthracnose, and root rot.',
    'cat_protection', 'UPL', 'UPL Farmer Connect', 4.9,
    340.00, 395.00, '500g pack', 120, 4.9, 230, 'Pune, Maharashtra',
    '["Carbendazim 12% + Mancozeb 63% WP", "Both systemic & contact barrier protection", "Rain-fast within 2 hours of spraying", "Cost-effective broad spectrum control"]'::jsonb,
    '{"Category": "Fungicide", "Mixing Ratio": "2g / Liter water", "Target Diseases": "Tikka, Blast, Blight"}'::jsonb,
    'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=600&q=80',
    false
  ),
  (
    'prod_14',
    'Coragen Insecticide (Chlorantraniliprole 18.5% SC)',
    'Industry-benchmark anthranilic diamide insecticide providing long-duration control against diamondback moth, stem borer, and armyworms.',
    'cat_protection', 'FMC', 'FMC Krishi Seva', 4.9,
    890.00, 990.00, '60 ml bottle', 55, 4.9, 188, 'Nashik, Maharashtra',
    '["Chlorantraniliprole 18.5% SC formulation", "Up to 21 days residual pest control", "Ovi-larvicidal action breaks pest life cycle", "Translaminar movement through leaf canopy"]'::jsonb,
    '{"Dose": "0.4 ml / Liter water", "Crops": "Rice, Sugarcane, Tomato, Cabbage", "Manufacturer": "FMC India"}'::jsonb,
    'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80',
    false
  ),
  (
    'prod_15',
    'Biozyme Bio-Stimulant Seaweed Extract Liquid',
    'Fermented Ascophyllum nodosum marine algae extract enriched with natural cytokinins, auxins, and enzymes to maximize flowering and fruit set.',
    'cat_protection', 'Biostadt', 'Kisan Mitra Agro', 4.7,
    580.00, 680.00, '1 Liter bottle', 68, 4.8, 92, 'Sangli, Maharashtra',
    '["100% natural cold-fermented seaweed extract", "Boosts fruit retention & prevents flower drop", "Mitigates drought and heat shock", "Certified safe for export grape farms"]'::jsonb,
    '{"Application": "Foliar Spray & Fertigation", "Dose": "2 ml / Liter", "pH": "5.5–6.5"}'::jsonb,
    'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80',
    false
  ),

  -- 2.4 IRRIGATION
  (
    'prod_4',
    'Complete Drip Irrigation Kit for 0.5 Acre Farm',
    'Complete micro-irrigation system with UV-stabilized 16mm inline drip lateral pipes (40cm emitter spacing, 2.4 LPH discharge), screen filter, take-offs, and connectors.',
    'cat_irrigation', 'Jain Irrigation', 'Jain Agri Solutions', 4.9,
    4200.00, 4800.00, 'Complete kit', 25, 4.8, 76, 'Jalgaon, Maharashtra',
    '["Water saving efficiency: >60%", "Virgin HDPE UV-treated lateral pipes", "Turbulent flow anti-clogging drippers", "Includes 2-inch screen filter & joiners"]'::jsonb,
    '{"Area Coverage": "0.5 Acre", "Emitter Discharge": "2.4 LPH", "Operating Pressure": "1.0–1.5 bar", "Pipe Grade": "IS-13488 certified"}'::jsonb,
    'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80',
    true
  ),
  (
    'prod_16',
    'Heavy-Duty Brass Rain Gun Sprinkler 360-Degree',
    'Adjustable arc commercial metal rain gun sprinkler with interchangeable nozzle set. Delivers uniform water curtain up to 100 feet radius.',
    'cat_irrigation', 'KisanKraft', 'Pashan Agro Tech', 4.7,
    1850.00, 2200.00, 'Unit', 45, 4.7, 58, 'Pune, Maharashtra',
    '["Coverage radius: 80–100 feet", "Solid brass & gunmetal construction", "360-degree full circle or sector part-circle", "Ideal for sugarcane, groundnut & pastures"]'::jsonb,
    '{"Inlet Thread": "1.25 inch female", "Operating Pressure": "3–5 kg/cm2", "Flow Rate": "120–180 LPM"}'::jsonb,
    'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80',
    false
  ),
  (
    'prod_17',
    '2-Inch Flexible Lay-Flat HDPE Delivery Pipe (50m)',
    'Reinforced heavy-duty agricultural lay-flat discharge hose designed for submersible pumps and canal water diversion. Rolls compact for easy field storage.',
    'cat_irrigation', 'Finolex', 'Finolex Pipes Depot', 4.8,
    1250.00, 1450.00, '50m roll', 60, 4.7, 83, 'Ahmednagar, Maharashtra',
    '["Burst pressure: 6 bar", "High tear & puncture resistance", "UV-stabilized virgin polymer", "Zero kinking during high volume flow"]'::jsonb,
    '{"Internal Diameter": "50mm (2 inch)", "Length": "50 Meters", "Color": "Black with green stripe"}'::jsonb,
    'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80',
    false
  ),
  (
    'prod_18',
    'Smart Solar Water Pump Controller 3HP MPPT',
    'Digital micro-controller with high efficiency Maximum Power Point Tracking (MPPT) for AC submersible pumps. Integrated dry-run and lightning surge protection.',
    'cat_irrigation', 'Tata Solar', 'GreenTech Energy', 4.9,
    12800.00, 14500.00, 'Controller unit', 12, 4.9, 34, 'Nagpur, Maharashtra',
    '["98.5% MPPT tracking efficiency", "Automatic sunrise start & sunset shut-off", "Dry-run and reverse polarity protection", "IP65 weatherproof enclosure"]'::jsonb,
    '{"Power Rating": "3 HP (2.2 kW)", "Input DC Range": "150–450V", "Output": "3-Phase 230V AC", "Warranty": "3 Years"}'::jsonb,
    'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=600&q=80',
    false
  ),

  -- 2.5 FARM TOOLS
  (
    'prod_5',
    'Heavy-Duty Forged Steel Khurpi & Sickle Tool Set',
    'Hand-forged carbon steel weeding khurpi (3-inch blade) paired with a serrated stainless steel paddy/grass harvesting sickle. Fitted with ergonomic oiled hardwood handles.',
    'cat_tools', 'Falcon Tools', 'Falcon Tools Official', 4.8,
    350.00, 420.00, '2-piece set', 150, 4.8, 192, 'Pune, Maharashtra',
    '["Drop-forged high-carbon steel", "Razor-sharp serrated sickle edge", "Comfortable anti-slip rosewood handles", "Rust-preventative black oxide coating"]'::jsonb,
    '{"Blade Material": "En-9 High Carbon Steel", "Handle": "Seasoned Hardwood", "Usage": "Weeding & Harvesting"}'::jsonb,
    'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80',
    true
  ),
  (
    'prod_19',
    '16-Liter 2-in-1 Dual Battery & Manual Knapsack Sprayer',
    'Rechargeable 12V 12Ah battery sprayer with backup manual brass pump. Delivers up to 6 hours continuous pesticide or fertilizer spraying on a single charge.',
    'cat_tools', 'Neptune', 'Krishi Machinery Store', 4.8,
    2150.00, 2600.00, 'Unit', 48, 4.8, 140, 'Aurangabad, Maharashtra',
    '["12V 12Ah heavy maintenance-free battery", "Dual operation: battery & hand pump lever", "Includes 4 brass & plastic nozzle variants", "Padded back harness for comfort"]'::jsonb,
    '{"Tank Capacity": "16 Liters", "Pressure": "0.2–0.45 MPa", "Battery Run Time": "6 Hours", "Weight": "5.2 kg"}'::jsonb,
    'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
    false
  ),
  (
    'prod_20',
    'Adjustable Push Wheel Weeder (Multi-Blade)',
    'Ergonomic manual push cultivator for inter-row weed eradication in vegetable beds, soybean, and pulses without bending. Replaces 4 manual laborers.',
    'cat_tools', 'AgriMate', 'AgriMate Equipments', 4.6,
    980.00, 1150.00, 'Unit', 52, 4.6, 68, 'Solapur, Maharashtra',
    '["Hardened spring steel weeding blades", "Adjustable working width (6 to 9 inches)", "Smooth ball-bearing ground wheel", "Reduces weeding cost by 70%"]'::jsonb,
    '{"Material": "Heavy MS Pipe & Steel", "Wheel Diameter": "8 inch", "Weight": "4.8 kg"}'::jsonb,
    'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80',
    false
  ),
  (
    'prod_21',
    'Professional Bypass Pruning Shear & Grafting Knife',
    'SK-5 Japanese high carbon steel blade garden secateurs capable of clean 20mm branch cuts without crushing plant bark. Safety thumb lock mechanism.',
    'cat_tools', 'Kraftool', 'Precision Agro Supplies', 4.9,
    490.00, 580.00, 'Set', 88, 4.9, 112, 'Nashik, Maharashtra',
    '["SK-5 Japanese high carbon steel blade", "Cuts branches up to 20mm diameter cleanly", "Sap groove prevents blade sticking", "Cushioned shock-absorbing bumper"]'::jsonb,
    '{"Blade": "Teflon Coated SK-5", "Overall Length": "210 mm", "Lock": "One-hand thumb lock"}'::jsonb,
    'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
    false
  ),

  -- 2.6 ANIMAL CARE
  (
    'prod_6',
    'Veterinary Mineral Mixture with Chelated Minerals (Agrimin Forte)',
    'Nutritional supplement formulated with chelated zinc, copper, cobalt, iodine, and vitamins A, D3, and E. Proven to increase milk fat yield and reproductive health.',
    'cat_animal', 'Virbac', 'Veterinary Supplies Direct', 4.9,
    650.00, 750.00, '5 kg bucket', 50, 4.8, 175, 'Kolhapur, Maharashtra',
    '["Chelated glycinate minerals for 95% absorption", "Boosts daily milk production & SNF percentage", "Improves conception rate & reduces repeat breeding", "Strengthens hooves & cattle coat shine"]'::jsonb,
    '{"Form": "Powder", "Daily Dose": "50g per adult cattle / buffalo", "Target": "Dairy Animals"}'::jsonb,
    'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80',
    true
  ),
  (
    'prod_22',
    'Ostovet Forte High Calcium Liquid Tonic (5 Liters)',
    'Synergistic calcium, phosphorus, vitamin D3, and B12 supplement for high-yielding milch cows and buffaloes to prevent milk fever and skeletal weakness.',
    'cat_animal', 'Virbac', 'Pashu Seva Kendra', 4.8,
    880.00, 1020.00, '5 Liter can', 40, 4.8, 134, 'Sangli, Maharashtra',
    '["35,000 mg active calcium per liter", "17,500 mg bio-available phosphorus", "Fortified with Vitamin D3 & B12", "Rapid absorption prevents post-calving milk fever"]'::jsonb,
    '{"Volume": "5 Liters", "Dosage": "100 ml daily per milch animal", "Flavor": "Palatable Sweet Base"}'::jsonb,
    'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80',
    false
  ),
  (
    'prod_23',
    'BioSilage Bacterial Inoculant & Fermentation Booster',
    'Multi-strain lactic acid bacteria culture for ensiling green maize, sorghum, and Napier grass. Prevents mold, preserves protein, and cuts fermentation time to 21 days.',
    'cat_animal', 'Lallemand', 'Dairy Tech Solutions', 4.7,
    720.00, 840.00, '100g pouch (Treats 50 tonnes)', 30, 4.7, 48, 'Pune, Maharashtra',
    '["Contains Lactobacillus plantarum & Pediococcus", "Rapid lactic acid fermentation drops pH < 4.0", "Maintains green color and aroma of silage", "Minimizes aerobic spoilage upon bunker opening"]'::jsonb,
    '{"Coverage": "Treats 50 Tonnes Green Fodder", "Form": "Water Soluble Powder", "Storage": "Cool dry place"}'::jsonb,
    'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80',
    false
  ),
  (
    'prod_24',
    'Fenbendazole & Ivermectin Broad Spectrum Deworming Bolus',
    'Veterinary broad-spectrum anthelmintic bolus for effective single-dose eradication of gastrointestinal nematodes, lungworms, and liver flukes.',
    'cat_animal', 'Intas', 'Intas Vet Care', 4.9,
    140.00, 170.00, 'Box of 10 boluses', 95, 4.9, 108, 'Pune, Maharashtra',
    '["Fenbendazole 3000mg + Ivermectin 100mg bolus", "Single dose broad-spectrum parasite clearance", "Eliminates both adult worms and immature larvae", "Increases livestock body weight gain"]'::jsonb,
    '{"Dosage": "1 bolus per 300–400 kg body weight", "Packaging": "10 Individually blistered boluses"}'::jsonb,
    'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80',
    false
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  brand = EXCLUDED.brand,
  seller_name = EXCLUDED.seller_name,
  seller_rating = EXCLUDED.seller_rating,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  unit = EXCLUDED.unit,
  stock_count = EXCLUDED.stock_count,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  delivery_location = EXCLUDED.delivery_location,
  highlights = EXCLUDED.highlights,
  specifications = EXCLUDED.specifications,
  image_url = EXCLUDED.image_url,
  is_featured = EXCLUDED.is_featured;

-- -----------------------------------------------------------------------------
-- 3. MANDI PRICES (Live APMC Benchmark Rates)
-- -----------------------------------------------------------------------------
INSERT INTO public.mandi_prices (id, crop, price, change, trend, market, state, modal_price, min_price, max_price, arrival_volume_tonnes, updated_at)
VALUES
  (gen_random_uuid(), 'Soybean (Yellow)', '₹4,320 / qtl', '+₹45 (+1.05%)', 'up', 'Indore APMC', 'Madhya Pradesh', 4320.00, 4150.00, 4420.00, 1250.00, now()),
  (gen_random_uuid(), 'Cotton (Medium Staple)', '₹7,150 / qtl', '+₹80 (+1.13%)', 'up', 'Rajkot APMC', 'Gujarat', 7150.00, 6900.00, 7350.00, 890.00, now()),
  (gen_random_uuid(), 'Wheat (Sharbati)', '₹2,480 / qtl', '₹0 (0.00%)', 'flat', 'Sehore APMC', 'Madhya Pradesh', 2480.00, 2350.00, 2560.00, 2100.00, now()),
  (gen_random_uuid(), 'Mustard (Black)', '₹5,620 / qtl', '+₹30 (+0.54%)', 'up', 'Jaipur Mandi', 'Rajasthan', 5620.00, 5450.00, 5750.00, 650.00, now()),
  (gen_random_uuid(), 'Onion (Red Nashik)', '₹1,850 / qtl', '-₹60 (-3.14%)', 'down', 'Lasalgaon APMC', 'Maharashtra', 1850.00, 1600.00, 2100.00, 4200.00, now()),
  (gen_random_uuid(), 'Tomato (Hybrid)', '₹1,250 / qtl', '+₹120 (+10.6%)', 'up', 'Narayangaon APMC', 'Maharashtra', 1250.00, 1000.00, 1450.00, 1800.00, now()),
  (gen_random_uuid(), 'Potato (Jyoti)', '₹1,420 / qtl', '-₹20 (-1.39%)', 'down', 'Pune APMC', 'Maharashtra', 1420.00, 1300.00, 1550.00, 1400.00, now()),
  (gen_random_uuid(), 'Maize (Kharif Feed)', '₹2,180 / qtl', '+₹15 (+0.69%)', 'up', 'Chhindwara APMC', 'Madhya Pradesh', 2180.00, 2050.00, 2280.00, 950.00, now());
