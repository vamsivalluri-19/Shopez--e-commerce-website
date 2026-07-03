export interface FallbackCatalogProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  brand: string;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  inventory: number;
  rating: number;
  reviewsCount: number;
}

function generateZaraProducts(): FallbackCatalogProduct[] {
  const families = [
    { name: "Cashmere Trench Coat", desc: "Structured double-breasted coat crafted from a premium cashmere-wool blend, featuring a classic lapel, waist belt, and signature satin lining.", basePrice: 249.00 },
    { name: "Faux Leather Biker Jacket", desc: "Urban biker jacket in textured faux leather, detailed with asymmetrical silver zippers, snap-button lapels, and zipped cuffs.", basePrice: 89.99 },
    { name: "Textured Knit Cardigan", desc: "Heavyweight relaxed-fit cardigan knitted in a premium rib-stitch pattern, featuring tortoiseshell buttons and dropped shoulders.", basePrice: 69.99 },
    { name: "Tailored Slim Fit Blazer", desc: "Sharp formal suit blazer crafted from fine structured weave, styled with notch lapels, buttoned cuffs, and side flap pockets.", basePrice: 139.00 },
    { name: "Relaxed Fit Cargo Trousers", desc: "Comfortable casual cargo pants in heavy washed cotton canvas, displaying deep cargo patch pockets and elasticated cuffs.", basePrice: 59.99 },
    { name: "Premium Wool Blend Sweater", desc: "Fine-knit crewneck sweater made of organic merino wool blend, offering unmatched warmth, breathability, and layering ease.", basePrice: 79.99 },
    { name: "Cropped Linen Blend Jacket", desc: "Sleek cropped boxy jacket tailored from lightweight linen-cotton, complete with patch chest pockets and a neat pointed collar.", basePrice: 79.99 }
  ];

  const list: FallbackCatalogProduct[] = [];
  for (let i = 0; i < 20; i++) {
    const fam = families[i % families.length];
    
    const name = `Zara ${fam.name} V${Math.floor(i / families.length) + 1}`;
    const price = Math.round((fam.basePrice + (i * 5)) * 100) / 100;
    const discount = i % 4 === 0 ? 10 : i % 5 === 0 ? 15 : 0;
    
    const localImg1 = `/projectImg/zara_coat/zara_img${(i % 8) + 1}.webp`;
    const localImg2 = `/projectImg/zara_coat/zara_img${((i + 1) % 8) + 1}.webp`;
    const localImg3 = `/projectImg/zara_coat/img${(i % 4) + 1}.webp`;
    const localImg4 = `/projectImg/zara_coat/img${((i + 1) % 4) + 1}.webp`;
    
    const images = [localImg1, localImg2, localImg3, localImg4];
    
    list.push({
      _id: `fallback-zara-${i}`,
      name,
      description: `${fam.desc} Zara's modern silhouettes and fast-fashion forward designs make this an essential piece in your wardrobe.`,
      price,
      discount,
      brand: "Zara",
      category: "Men",
      images,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Beige", "Camel", "Midnight Black", "Slate Grey"].slice(0, (i % 2) + 1),
      inventory: 10 + (i % 10),
      rating: Math.round((4.3 + (i % 8) * 0.1) * 10) / 10,
      reviewsCount: 12 + i
    });
  }
  return list;
}

function generateLenovoLaptops(): FallbackCatalogProduct[] {
  const families = [
    { name: "ThinkPad X1 Carbon Gen 12", desc: "Ultra-premium business laptop crafted with carbon fiber, featuring an OLED display and enterprise-grade security.", basePrice: 1899.99 },
    { name: "Legion Pro 7i Gaming Laptop", desc: "High-performance gaming laptop with liquid metal cooling, customizable RGB, and blazing fast display.", basePrice: 2299.99 },
    { name: "LOQ 15 Gaming Laptop", desc: "Entry-level gaming powerhouse offering exceptional value with robust cooling and dedicated NVIDIA graphics.", basePrice: 899.99 },
    { name: "Yoga Slim 7i Carbon", desc: "Feather-light Intel Evo certified ultrabook featuring dual-stack OLED touchscreen and exceptional battery life.", basePrice: 1299.99 },
    { name: "ThinkBook 16p Creator Laptop", desc: "Sleek aluminum laptop designed for creative professionals, with high-color accuracy screen and powerful GPU.", basePrice: 1599.99 },
    { name: "IdeaPad Slim 5 Pro", desc: "Reliable everyday productivity laptop with thin bezels, metallic finish, and rapid charging.", basePrice: 699.99 }
  ];

  const processors = ["Intel Core Ultra 9 185H", "Intel Core i9-14900HX", "AMD Ryzen 7 8845HS", "Intel Core Ultra 7 155H", "AMD Ryzen 9 7945HX", "Intel Core i5-13450HX"];
  const graphics = ["NVIDIA RTX 4090 (16GB)", "NVIDIA RTX 4070 (8GB)", "NVIDIA RTX 4060 (8GB)", "Intel Arc Graphics", "NVIDIA RTX 4050 (6GB)"];
  const screens = ["14-inch 2.8K OLED 120Hz", "16-inch WQXGA 240Hz IPS", "15.6-inch FHD 144Hz IPS", "13.3-inch 3K Dual-OLED", "16-inch 3.2K 165Hz Mini-LED"];

  const photoIds = [
    "photo-1496181130204-755241544e35",
    "photo-1603302576837-37561b2e2302",
    "photo-1587620962725-abab7fe55159",
    "photo-1517694712202-14dd9538aa97",
    "photo-1525547719571-a2d4ac8945e2",
    "photo-1484788984921-03950022c9ef",
    "photo-1541807084-5c52b6b3adef",
    "photo-1593642632823-8f785ba67e45"
  ];

  const list: FallbackCatalogProduct[] = [];
  for (let i = 0; i < 32; i++) {
    const fam = families[i % families.length];
    const proc = processors[i % processors.length];
    const gpu = graphics[i % graphics.length];
    const scr = screens[i % screens.length];
    
    const name = `Lenovo ${fam.name} V${Math.floor(i / families.length) + 1}`;
    const price = Math.round((fam.basePrice + (i * 25)) * 100) / 100;
    const discount = i % 4 === 0 ? 10 : i % 6 === 0 ? 15 : 0;
    
    const localImg1 = i % 2 === 0 ? `/projectImg/lenovo_loq/lenovo_img${(i % 8) + 1}.webp` : `/projectImg/yoga_book/img${(i % 4) + 1}.webp`;
    const localImg2 = i % 2 === 0 ? `/projectImg/lenovo_loq/img${(i % 4) + 1}.webp` : `/projectImg/lenovo_loq/lenovo_img${((i + 1) % 8) + 1}.webp`;
    const localImg3 = `/projectImg/yoga_book/img${(i % 4) + 1}.webp`;
    const localImg4 = `/projectImg/yoga_book/img${((i + 1) % 4) + 1}.webp`;
    
    const images = [localImg1, localImg2, localImg3, localImg4];
    
    list.push({
      _id: `fallback-lenovo-${i}`,
      name,
      description: `${fam.desc} Powered by ${proc}, equipped with ${gpu} and a gorgeous ${scr} screen. Offers high-performance styling and seamless integration.`,
      price,
      discount,
      brand: "Lenovo",
      category: "Laptops",
      images,
      sizes: ["16-inch", "14-inch"],
      colors: ["Storm Grey", "Abyss Blue", "Cloud Grey"].slice(0, (i % 2) + 1),
      inventory: 5 + (i % 15),
      rating: Math.round((4.2 + (i % 9) * 0.1) * 10) / 10,
      reviewsCount: 5 + i
    });
  }
  return list;
}

function generateLenovoExtraProducts(): FallbackCatalogProduct[] {
  const families = [
    // Laptops (3 items)
    { name: "Legion Go Gaming Handheld", desc: "Revolutionary gaming handheld powered by AMD Ryzen Z1 Extreme, featuring a detachable controller and 8.8-inch QHD display.", basePrice: 699.99, category: "Laptops" },
    { name: "ThinkCentre Neo 50a AIO", desc: "All-in-one desktop featuring a 23.8-inch FHD display, Intel Core i7 processor, and AI-driven smart conference features.", basePrice: 949.99, category: "Laptops" },
    { name: "IdeaCentre Mini Gen 8", desc: "Ultra-compact desktop PC packed with desktop-grade power, multiple USB ports, and clean minimalist design.", basePrice: 549.99, category: "Laptops" },
    
    // Tablets (4 items)
    { name: "Tab P12 Pro Tablet", desc: "Premium 12.6-inch AMOLED display tablet with 120Hz refresh rate, Precision Pen 3 support, and Dolby Atmos audio.", basePrice: 499.99, category: "Tablets" },
    { name: "Yoga Tab 13 Premium", desc: "Flexible home entertainment tablet featuring a built-in stainless steel kickstand, micro-HDMI port, and JBL speakers.", basePrice: 599.99, category: "Tablets" },
    { name: "Tab M10 Plus Gen 3", desc: "Affordable family tablet with a crisp 10.6-inch 2K screen, kids space settings, and long battery life.", basePrice: 189.99, category: "Tablets" },
    { name: "Tab P11 Gen 2 Tablet", desc: "Versatile tablet bundled with keyboard and pen, perfect for remote studies and digital drawing tasks.", basePrice: 299.99, category: "Tablets" },
    
    // Mobiles (3 items)
    { name: "Legion Phone Duel 2 5G", desc: "Ultimate dual-architecture gaming smartphone featuring dual turbo-fans, pop-up selfie camera, and 90W fast charging.", basePrice: 799.99, category: "Mobiles" },
    { name: "K14 Note Smartphone", desc: "Everyday dual-sim smartphone with a 50MP triple camera setup, 5000mAh battery, and smooth 90Hz display.", basePrice: 199.99, category: "Mobiles" },
    { name: "Z6 Pro flagship Phone", desc: "High performance premium smartphone featuring Snapdragon 855, quad cameras, and liquid cooling tech.", basePrice: 399.99, category: "Mobiles" }
  ];

  const list: FallbackCatalogProduct[] = [];
  for (let i = 0; i < 20; i++) {
    const fam = families[i % families.length];
    
    const name = `Lenovo ${fam.name} V${Math.floor(i / families.length) + 1}`;
    const price = Math.round((fam.basePrice + (i * 10)) * 100) / 100;
    const discount = i % 4 === 0 ? 10 : i % 5 === 0 ? 15 : 0;
    
    const localImg1 = `/projectImg/lenovo_loq/lenovo_extra${(i % 8) + 1}.webp`;
    const localImg2 = `/projectImg/lenovo_loq/lenovo_extra${((i + 1) % 8) + 1}.webp`;
    const localImg3 = `/projectImg/lenovo_loq/lenovo_img${(i % 8) + 1}.webp`;
    const localImg4 = `/projectImg/lenovo_loq/lenovo_img${((i + 1) % 8) + 1}.webp`;
    
    const images = [localImg1, localImg2, localImg3, localImg4];
    
    list.push({
      _id: `fallback-lenovo-extra-${i}`,
      name,
      description: `${fam.desc} Built to Lenovo's strict reliability standards and designed for modern mobile productivity.`,
      price,
      discount,
      brand: "Lenovo",
      category: fam.category,
      images,
      sizes: fam.category === "Laptops" ? ["16-inch", "14-inch"] : fam.category === "Tablets" ? ["11-inch", "12.6-inch"] : ["6.7-inch", "6.4-inch"],
      colors: ["Storm Grey", "Abyss Blue", "Cloud Grey", "Matte Black"].slice(0, (i % 2) + 1),
      inventory: 20 + (i % 12),
      rating: Math.round((4.2 + (i % 8) * 0.1) * 10) / 10,
      reviewsCount: 15 + i
    });
  }
  return list;
}

function generateNikeProducts(): FallbackCatalogProduct[] {
  const families = [
    { name: "Air Zoom Pegasus 41", desc: "Classic daily road running shoe featuring responsive ReactX foam cushioning, Zoom Air units, and a breathable mesh upper.", basePrice: 130.00 },
    { name: "Air Max DN Trainers", desc: "Modern lifestyle sneakers featuring our revolutionary dynamic air chamber system for bouncy, energy-returning impact cushioning.", basePrice: 160.00 },
    { name: "Dunk Low Retro Sneakers", desc: "Iconic retro basketball style crafted from premium leather panels, bringing a vintage 80s aesthetic to modern streetwear.", basePrice: 115.00 },
    { name: "Air Force 1 '07", desc: "The legend lives on in this classic street sneaker, styling durable stitched leather overlays, clean profiles, and custom Air cushioning.", basePrice: 115.00 },
    { name: "Invincible 3 Marathon Shoes", desc: "Super-cushioned marathon road running shoes utilizing premium ZoomX foam for maximum shock absorption and high-mileage comfort.", basePrice: 180.00 },
    { name: "Metcon 9 Training Shoes", desc: "Elite gym workout and HIIT training shoes featuring an enlarged rubber rope wrap, Hyperlift plate, and supportive wide heel.", basePrice: 140.00 },
    { name: "Vaporfly 3 Racing Shoes", desc: "Elite road racing shoes engineered with a full-length carbon fiber Flyplate and responsive ZoomX foam to break personal records.", basePrice: 260.00 },
    { name: "Blazer Mid '77 Vintage", desc: "Heritage mid-top lifestyle sneakers showing clean leather uppers, exposed foam tongues, and a retro vulcanized outsole.", basePrice: 105.00 }
  ];

  const list: FallbackCatalogProduct[] = [];
  for (let i = 0; i < 16; i++) {
    const fam = families[i % families.length];
    
    const name = `Nike ${fam.name} V${Math.floor(i / families.length) + 1}`;
    const price = Math.round((fam.basePrice + (i * 4)) * 100) / 100;
    const discount = i % 4 === 0 ? 10 : i % 6 === 0 ? 15 : 0;
    
    const localImg1 = `/projectImg/shoes/nike_img${(i % 8) + 1}.webp`;
    const localImg2 = `/projectImg/shoes/nike_img${((i + 1) % 8) + 1}.webp`;
    const localImg3 = `/projectImg/shoes/img${(i % 4) + 1}.webp`;
    const localImg4 = `/projectImg/shoes/img${((i + 1) % 4) + 1}.webp`;
    
    const images = [localImg1, localImg2, localImg3, localImg4];
    
    list.push({
      _id: `fallback-nike-${i}`,
      name,
      description: `${fam.desc} Designed for ultimate comfort and durability, featuring a classic Nike silhouette.`,
      price,
      discount,
      brand: "Nike",
      category: "Men",
      images,
      sizes: ["US 8", "US 9", "US 10", "US 11", "US 12"],
      colors: ["White/Black", "Volt/Orange", "Triple Black"].slice(0, (i % 2) + 1),
      inventory: 10 + (i % 10),
      rating: Math.round((4.3 + (i % 8) * 0.1) * 10) / 10,
      reviewsCount: 15 + i
    });
  }
  return list;
}

function generateNoiseProducts(): FallbackCatalogProduct[] {
  const families = [
    { name: "ColorFit Pro 5 Smartwatch", desc: "AMOLED display smartwatch with advanced Bluetooth calling, customized health/fitness suites, and multi-sport tracking options.", basePrice: 49.99 },
    { name: "Air Buds Pro 3 Wireless Earbuds", desc: "Premium TWS earbuds featuring Hybrid Active Noise Cancellation (ANC up to 30dB), low latency gaming mode, and deep bass boost drivers.", basePrice: 39.99 },
    { name: "Buds VS104 Max Earbuds", desc: "High performance wireless earbuds offering massive 45-hour playback time, environmental noise cancellation, and quad mics.", basePrice: 24.99 },
    { name: "Tune Active Bluetooth Neckband", desc: "Ergonomically designed sports neckband utilizing magnetic earbud locks, flexible silicone band, and fast charging tech.", basePrice: 19.99 },
    { name: "ColorFit Ultra 3 Smartwatch", desc: "Large metallic bezel smartwatch carrying a functional crown, high refresh rate AMOLED display, and dynamic wallpaper selections.", basePrice: 69.99 },
    { name: "Airwave Max 4 Headphones", desc: "Over-ear Bluetooth headphones providing 70 hours playtime, dual-device pairing, ENC, and deep bass modes.", basePrice: 24.99 },
    { name: "Halo Luxe Leather Smartwatch", desc: "Classic luxury design smartwatch featuring a round metallic case, premium genuine leather strap, and custom watch face galleries.", basePrice: 79.99 }
  ];

  const list: FallbackCatalogProduct[] = [];
  for (let i = 0; i < 20; i++) {
    const fam = families[i % families.length];
    
    const name = `Noise ${fam.name} V${Math.floor(i / families.length) + 1}`;
    const price = Math.round((fam.basePrice + (i * 2)) * 100) / 100;
    const discount = i % 4 === 0 ? 10 : i % 5 === 0 ? 15 : 0;
    
    const localImg1 = `/projectImg/noise_headphones/noise_img${(i % 8) + 1}.webp`;
    const localImg2 = `/projectImg/noise_headphones/noise_img${((i + 1) % 8) + 1}.webp`;
    const localImg3 = `/projectImg/noise_headphones/img${(i % 4) + 1}.webp`;
    const localImg4 = `/projectImg/noise_headphones/img${((i + 1) % 4) + 1}.webp`;
    
    const images = [localImg1, localImg2, localImg3, localImg4];
    
    list.push({
      _id: `fallback-noise-${i}`,
      name,
      description: `${fam.desc} Designed with cutting-edge smart sensors and high-fidelity acoustics for the ultimate modern user experience.`,
      price,
      discount,
      brand: "Noise",
      category: "Accessories",
      images,
      sizes: ["One Size"],
      colors: ["Matte Black", "Teal Blue", "Forest Green", "Rose Gold"].slice(0, (i % 2) + 1),
      inventory: 30 + (i % 15),
      rating: Math.round((4.1 + (i % 9) * 0.1) * 10) / 10,
      reviewsCount: 18 + i
    });
  }
  return list;
}

function generateHMProducts(): FallbackCatalogProduct[] {
  const families = [
    { name: "Wool-Blend Overcoat", desc: "Classic structured warm winter overcoat crafted in a premium soft wool-blend, showing clean lines and double button closure.", basePrice: 129.00 },
    { name: "Relaxed Fit Twill Shacket", desc: "Shirt jacket hybrid made of heavy twill cotton, featuring chest pockets, classic button buttons, and a relaxed profile.", basePrice: 49.99 },
    { name: "Modern Linen-Blend Shirt", desc: "Breathable and lightweight casual shirt in a premium linen-cotton weave, perfect for warm weather styling.", basePrice: 29.99 },
    { name: "Ethnic Style Cotton Kurta", desc: "Modern fusion cotton kurta detailed with embroidered button plackets, straight hemlines, and split sides.", basePrice: 34.99 },
    { name: "Hooded Puffer Jacket", desc: "Water-repellent insulated winter puffer coat with a zip-off hood, stand-up collar, and cozy fleece-lined pockets.", basePrice: 79.99 },
    { name: "Double-Breasted Trench Coat", desc: "Classic double-breasted gabardine trench coat styled with adjustable storm flaps, shoulder epaulets, and a waist belt.", basePrice: 99.00 },
    { name: "Tailored Bomber Jacket", desc: "Sleek minimalist zip-up bomber jacket featuring rib-knit trims, side zip pockets, and a premium smooth satin lining.", basePrice: 59.99 }
  ];

  const list: FallbackCatalogProduct[] = [];
  for (let i = 0; i < 20; i++) {
    const fam = families[i % families.length];
    
    const name = `H&M ${fam.name} V${Math.floor(i / families.length) + 1}`;
    const price = Math.round((fam.basePrice + (i * 3)) * 100) / 100;
    const discount = i % 4 === 0 ? 10 : i % 5 === 0 ? 15 : 0;
    
    const localImg1 = `/projectImg/shirt/hm_img${(i % 8) + 1}.webp`;
    const localImg2 = `/projectImg/shirt/hm_img${((i + 1) % 8) + 1}.webp`;
    const localImg3 = `/projectImg/shirt/shirt.webp`;
    const localImg4 = `/projectImg/shirt/shirtb.webp`;
    
    const images = [localImg1, localImg2, localImg3, localImg4];
    
    list.push({
      _id: `fallback-hm-${i}`,
      name,
      description: `${fam.desc} Designed with H&M's signature contemporary aesthetics and sustainable manufacturing practices.`,
      price,
      discount,
      brand: "H&M",
      category: "Men",
      images,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Beige", "Charcoal Grey", "Sage Green", "Camel"].slice(0, (i % 2) + 1),
      inventory: 15 + (i % 12),
      rating: Math.round((4.2 + (i % 8) * 0.1) * 10) / 10,
      reviewsCount: 8 + i
    });
  }
  return list;
}

function generateGucciProducts(): FallbackCatalogProduct[] {
  const families = [
    { name: "Linen Button-Down Shirt", desc: "Luxury breathable shirt crafted from 100% premium Italian linen, styled with relaxed tailoring and mother-of-pearl buttons.", basePrice: 350.00 },
    { name: "Silk GG Monogram Shirt", desc: "Premium evening shirt made of pure mulberry silk with the classic all-over GG monogram jacquard design.", basePrice: 790.00 },
    { name: "Tailored Wool Dress Pants", desc: "Sharp-cut formal trousers in wool canvas featuring front crease lines, side pockets, and signature buttoned back welt pockets.", basePrice: 420.00 },
    { name: "Casual Cotton Chino Trousers", desc: "Sleek tailored chino trousers crafted in organic cotton twill, detailed with a subtle leather logo patch on the back waist.", basePrice: 390.00 },
    { name: "GG Embroidered Denim Jeans", desc: "Slim-fit raw denim jeans woven from Japanese selvedge denim, detailed with pocket GG monogram embroidery.", basePrice: 450.00 },
    { name: "Oxford Cotton Dress Shirt", desc: "Elegant formal dress shirt featuring a point collar, web stripe lining detail, and double-button cuffs.", basePrice: 320.00 },
    { name: "Linen Drawstring Pants", desc: "Relaxed summer trousers featuring a flexible drawstring waistband, detailed stitching, and lightweight textured fabric.", basePrice: 380.00 }
  ];

  const list: FallbackCatalogProduct[] = [];
  for (let i = 0; i < 20; i++) {
    const fam = families[i % families.length];
    
    const name = `Gucci ${fam.name} V${Math.floor(i / families.length) + 1}`;
    const price = Math.round((fam.basePrice + (i * 10)) * 100) / 100;
    const discount = i % 4 === 0 ? 10 : i % 5 === 0 ? 15 : 0;
    
    const localImg1 = `/projectImg/shirt2/gucci_img${(i % 8) + 1}.webp`;
    const localImg2 = `/projectImg/shirt2/gucci_img${((i + 1) % 8) + 1}.webp`;
    const localImg3 = `/projectImg/shirt2/img${(i % 5) + 1}.avif`;
    const localImg4 = `/projectImg/shirt2/img${((i + 1) % 5) + 1}.avif`;
    
    const images = [localImg1, localImg2, localImg3, localImg4];
    
    list.push({
      _id: `fallback-gucci-${i}`,
      name,
      description: `${fam.desc} Exquisite craftsmanship and classic styling details represent the absolute peak of luxury fashion.`,
      price,
      discount,
      brand: "Gucci",
      category: "Men",
      images,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Olive Green", "Ivory White", "Charcoal Grey", "Jet Black"].slice(0, (i % 2) + 1),
      inventory: 5 + (i % 8),
      rating: Math.round((4.4 + (i % 7) * 0.1) * 10) / 10,
      reviewsCount: 10 + i
    });
  }
  return list;
}

function generateAdeshCreationProducts(): FallbackCatalogProduct[] {
  const families = [
    { name: "Banarasi Silk Saree", desc: "Exquisite hand-woven Banarasi silk saree with intricate gold zari brocade work. Perfect for weddings and grand festive occasions.", basePrice: 89.99 },
    { name: "Anarkali Kurta Palazzo Set", desc: "Elegant flowy Anarkali kurta set featuring beautiful hand-block floral prints, paired with matching palazzo pants and a sheer chiffon dupatta.", basePrice: 45.99 },
    { name: "Georgette Floral Saree", desc: "Lightweight, fluid georgette saree featuring vibrant digital floral motifs and a delicate lace border. Sleek daily wear style.", basePrice: 34.99 },
    { name: "Ethnic Cotton A-Line Dress", desc: "Modern ethnic fusion A-line dress crafted from breathable pure organic cotton, styled with hand-embroidered mirror detailing.", basePrice: 29.99 },
    { name: "Embroidered Lehenga Choli Set", desc: "Stunning festive lehenga choli set decorated with premium resham embroidery, mirror work, and a matching net dupatta.", basePrice: 129.99 },
    { name: "Chanderi Silk Kurta Set", desc: "Traditional Chanderi silk straight kurta set with gold foil highlights, straight pants, and an organza dupatta.", basePrice: 59.99 },
    { name: "Bandhani Print Maxi Dress", desc: "Boho-chic ethnic maxi dress displaying traditional Rajasthani Bandhani tie-dye prints with a flared hemline.", basePrice: 39.99 }
  ];

  const fabrics = ["Pure Banarasi Silk", "Chanderi Silk", "Organic Cotton", "Flowy Georgette", "Viscose Rayon", "Premium Organza"];
  const colors = ["Crimson Red", "Mustard Yellow", "Royal Blue", "Emerald Green", "Peach Pink", "Teal Green", "Marigold"];

  const photoIds = [
    "photo-1583391733956-3750e0ff4e8b",
    "photo-1610030469983-98e550d6193c",
    "photo-1617627143750-d86bc21e42bb",
    "photo-1595777457583-95e059d581b8",
    "photo-1621184455862-c163dfb30e0f",
    "photo-1608748010899-18f300247112",
    "photo-1614088685112-0a760b71a3c8",
    "photo-1609357605129-26f69add5d6e"
  ];

  const list: FallbackCatalogProduct[] = [];
  for (let i = 0; i < 20; i++) {
    const fam = families[i % families.length];
    const fab = fabrics[i % fabrics.length];
    const col = colors[i % colors.length];
    
    const name = `Adesh Creation ${fam.name} V${Math.floor(i / families.length) + 1}`;
    const price = Math.round((fam.basePrice + (i * 5)) * 100) / 100;
    const discount = i % 3 === 0 ? 10 : i % 5 === 0 ? 15 : 0;
    
    const localImg1 = `/projectImg/women1/adesh_img${(i % 8) + 1}.webp`;
    const localImg2 = `/projectImg/women1/adesh_img${((i + 1) % 8) + 1}.webp`;
    const localImg3 = `/projectImg/women1/img${(i % 4) + 1}.webp`;
    const localImg4 = `/projectImg/women1/img${((i + 1) % 4) + 1}.webp`;
    
    const images = [localImg1, localImg2, localImg3, localImg4];
    
    list.push({
      _id: `fallback-adesh-${i}`,
      name,
      description: `${fam.desc} Crafted from premium ${fab} in a beautiful ${col} shade. Offers superior comfort and traditional elegance.`,
      price,
      discount,
      brand: "Adesh Creation",
      category: "Women",
      images,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [col, "Gold", "Ivory White"].slice(0, (i % 2) + 1),
      inventory: 10 + (i % 12),
      rating: Math.round((4.0 + (i % 10) * 0.1) * 10) / 10,
      reviewsCount: 12 + i
    });
  }
  return list;
}

export const fallbackCatalogProducts: FallbackCatalogProduct[] = [
  ...generateZaraProducts(),
  ...generateLenovoLaptops(),
  ...generateLenovoExtraProducts(),
  ...generateNoiseProducts(),
  ...generateHMProducts(),
  ...generateGucciProducts(),
  ...generateNikeProducts(),
  ...generateAdeshCreationProducts()
];

export function getFallbackProductById(productId: string) {
  return fallbackCatalogProducts.find(product => product._id === productId) || null;
}