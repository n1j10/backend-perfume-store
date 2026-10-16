// Dummy data for a perfume store.
// Run: npm run seed   (replaces the whole catalog: heroes, categories, products and everything linked to them)

require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const ADMIN_ID = process.env.ADMIN_USER_ID;
if (!ADMIN_ID) throw new Error("ADMIN_USER_ID is missing in .env");

// Pexels photos, cropped by the CDN to 2:3 so they fit the product cards exactly.
const photo = (id, { w = 800, h = 1200 } = {}) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

const avatar = (name) =>
  `https://api.dicebear.com/9.x/initials/png?seed=${encodeURIComponent(name)}&backgroundColor=b08d57,7a5c3e,c9a96e,5e4b3c&textColor=ffffff`;


// ================= Heroes =================

const heroes = [
  { title: "عطور شرقية صُنعت لأجلك", image: photo(2814832, { w: 1600, h: 900 }) },
  { title: "طقوس البخور الأصيلة", image: photo(6954562, { w: 1600, h: 900 }) },
  { title: "زهور ناعمة لكل المواسم", image: photo(8450248, { w: 1600, h: 900 }) },
];

// ================= Categories =================

const categories = [
  {
    key: "men",
    title: "عطور رجالية",
    description: "عطور خشبية وجلدية وعطرية جريئة، بفوحان قوي وثبات يدوم طويلًا.",
    image: photo(15260901),
  },
  {
    key: "women",
    title: "عطور نسائية",
    description: "عطور زهرية وفاكهية وبودرية أنيقة، من روائح النهار الناعمة إلى خلطات المساء الغنية.",
    image: photo(19086282),
  },
  {
    key: "oud",
    title: "دهن العود والزيوت العطرية",
    description: "زيوت عود نقية وعطور مركزة مصنوعة بالطريقة التقليدية، خالية من الكحول وغنية جدًا.",
    image: photo(12402366),
  },
  {
    key: "bakhoor",
    title: "البخور",
    description: "بخور ممزوج يدويًا لتعطير بيتك وملابسك ومجلسك بالطريقة الأصيلة.",
    image: photo(13081588),
  },
  {
    key: "unisex",
    title: "عطور للجنسين",
    description: "إبداعات عطرية مميزة صُنعت ليتشاركها الجميع، بلمسات منعشة ومسكية ومعدنية.",
    image: photo(7814959),
  },
  {
    key: "gifts",
    title: "أطقم الهدايا",
    description: "مجموعات مغلفة بعناية وأطقم استكشاف جاهزة للإهداء في كل مناسبة.",
    image: photo(7598173),
  },
];

// ================= Products =================

const products = [
  // ---- Men ----
  {
    category: "men",
    name: "نوار إنتنس",
    price: 65000,
    featured: true,
    image: photo(15260901),
    description:
      "عطر مسائي عميق وواثق يفتتح بالفلفل الأسود والهيل، ثم يستقر على الجلد المدخن ونجيل الهند، وينتهي بقاعدة دافئة من العنبر وحبوب التونكا. فوحان قوي يدوم طوال الليل.",
  },
  {
    category: "men",
    name: "رجل المدينة",
    price: 42000,
    featured: false,
    image: photo(30970926),
    description:
      "عطر يومي نظيف مبني على البرغموت والخزامى وخشب الأرز. منعش بما يكفي للعمل وناعم بما يكفي لسهرة هادئة، مع ختام مسكي لطيف.",
  },
  {
    category: "men",
    name: "الأرز الفضي",
    price: 48000,
    featured: false,
    image: photo(30970927),
    description:
      "الجريب فروت المنعش والنعناع يلتقيان بخشب أرز الأطلس الجاف والمريمية. عطر عصري ببساطة أنيقة، مثالي للأيام الدافئة ومن النادي حتى العشاء.",
  },
  {
    category: "men",
    name: "سلطان الذهب",
    price: 89000,
    featured: true,
    image: photo(8796322),
    description:
      "مزيج شرقي ملكي من الزعفران والورد والعود الكمبودي ملفوف بخشب الصندل واللادن. يأتي في زجاجة سوداء ثقيلة بلوحة ذهبية، صُنع للمناسبات الخاصة.",
  },
  {
    category: "men",
    name: "انعكاس العنبر",
    price: 55000,
    featured: false,
    image: photo(3059609),
    description:
      "عنبر ذهبي وقرفة وخوخ مجفف فوق قاعدة من الجاوي والباتشولي. عطر دافئ وحلو قليلًا يتألق في الأمسيات الباردة وليالي الشتاء الطويلة.",
  },

  // ---- Women ----
  {
    category: "women",
    name: "بتلات الفاوانيا",
    price: 58000,
    featured: true,
    image: photo(19086282),
    description:
      "الفاوانيا الوردية والليتشي تتفتح على قلب من الورد والماغنوليا، وتستقر على مسك أبيض ناعم. عطر رومانسي مشرق كأنه حديقة ربيعية في الصباح.",
  },
  {
    category: "women",
    name: "البتلات الذهبية",
    price: 62000,
    featured: false,
    image: photo(19086285),
    description:
      "الكمثرى والماندرين يمتزجان بالياسمين السمبك وزهر البرتقال، مع ختام من العسل وخشب الصندل الكريمي. عطر زهري مشع بتوهج ذهبي دافئ.",
  },
  {
    category: "women",
    name: "ماء الورد",
    price: 39000,
    featured: false,
    image: photo(12563417),
    description:
      "ماء تواليت خفيف مستوحى من ماء الورد الدمشقي والأوراق الخضراء ولمسة من الفلفل الوردي. لطيف ومنعش، مثالي للاستخدام اليومي في الطقس الدافئ.",
  },
  {
    category: "women",
    name: "الكرز المخملي",
    price: 67000,
    featured: true,
    image: photo(35825554),
    description:
      "الكرز الداكن واللوز يلتقيان بالورد التركي وقاعدة مخملية من الفانيليا والتونكا. عطر حلو جذاب يترك أثرًا جميلًا.",
  },
  {
    category: "women",
    name: "زنبق الصحراء",
    price: 46000,
    featured: false,
    image: photo(7796498),
    description:
      "الزنبق الأبيض والنيرولي يتراقصان فوق زهور مجففة وقش ذهبي وأخشاب الكشمير الناعمة. عطر رقيق وشاعري بإحساس طبيعي دافئ.",
  },
  {
    category: "women",
    name: "مرج الربيع",
    price: 44000,
    featured: false,
    image: photo(10536609),
    description:
      "البرغموت الأخضر والفريزيا والبنفسج البري تجسد حقلًا في أوج تفتحه. نظيف ومبهج وسهل الارتداء، مع ختام بودري من السوسن يبقى قريبًا من البشرة.",
  },
  {
    category: "women",
    name: "مسك اللؤلؤ",
    price: 52000,
    featured: false,
    image: photo(8450248),
    description:
      "عطر بشرة ناعم من المسك الأبيض وبودرة الأرز ولمسة من الكمثرى. مريح وأنيق، يمتزج بجمال مع أي عطر زهري أو يُستخدم وحده.",
  },

  // ---- Oud & Oils ----
  {
    category: "oud",
    name: "دهن العود الملكي",
    price: 120000,
    featured: true,
    image: photo(12402366),
    description:
      "دهن عود معتق نقي من آسام، مقطّر ببطء ليمنح طابعًا خشبيًا عميقًا. بضع قطرات تدوم أكثر من يوم كامل وتتطور بجمال على البشرة. زجاجة 12 مل.",
  },
  {
    category: "oud",
    name: "العطر القرمزي",
    price: 75000,
    featured: false,
    image: photo(12402362),
    description:
      "عطر زيتي تقليدي من الورد والزعفران على قاعدة من خشب الصندل، خالٍ من الكحول ولطيف على البشرة. مثالي ليوم الجمعة والأعياد والمجالس الخاصة.",
  },
  {
    category: "oud",
    name: "مسك الطهارة",
    price: 25000,
    featured: false,
    image: photo(5240625),
    description:
      "زيت مسك أبيض ناعم ونظيف برائحة الملابس المغسولة حديثًا والبشرة الدافئة. محبوب للاستخدام اليومي وقاعدة مثالية لمزجه مع عطور العود القوية.",
  },
  {
    category: "oud",
    name: "عود الليل",
    price: 95000,
    featured: false,
    image: photo(2814832),
    description:
      "مزيج ليلي غني من العود المدخن والجلد والورد الداكن مع لمسة من البخور. دهن عطري مركز بثبات ممتاز، يأتي في زجاجة كلاسيكية.",
  },
  {
    category: "oud",
    name: "دهن الصندل الذهبي",
    price: 68000,
    featured: false,
    image: photo(11711813),
    description:
      "زيت صندل كريمي على طريقة ميسور مع لمسة من الزعفران والعنبر. دافئ وناعم ومريح للنفس، يتوهج تحت الشمس وعلى البشرة معًا.",
  },

  // ---- Bakhoor ----
  {
    category: "bakhoor",
    name: "بخور المجلس",
    price: 30000,
    featured: true,
    image: photo(13081588),
    description:
      "بخور ممزوج يدويًا من رقائق العود المنقوعة بدهن العود والعنبر والورد. يملأ المجلس كله بدخان ترحيبي يدوم طويلًا ويعلق بجمال في الأقمشة.",
  },
  {
    category: "bakhoor",
    name: "أعواد بخور الصندل",
    price: 15000,
    featured: false,
    image: photo(6954562),
    description:
      "علبة من أربعين عود بخور بطيء الاحتراق بالصندل واللبان ولمسة من المر. مثالية للتأمل والقراءة وخلق أجواء هادئة في البيت.",
  },

  // ---- Unisex ----
  {
    category: "unisex",
    name: "الحجر والسوسن",
    price: 72000,
    featured: true,
    image: photo(7814959),
    description:
      "عطر نيش معدني من الحجارة المبللة وجذور السوسن وورق البنفسج فوق قاعدة من بذور المسك والأخشاب النظيفة. هادئ وبارد وفريد، صُنع ليتشاركه الجميع.",
  },
  {
    category: "unisex",
    name: "الرخام الأبيض",
    price: 64000,
    featured: false,
    image: photo(16722500),
    description:
      "الألدهيدات والفلفل الوردي تتلألأ فوق قلب من الشاي الأبيض وقاعدة باردة كالرخام من المسك والأرز. عطر عصري خفيف بأناقة هادئة.",
  },
  {
    category: "unisex",
    name: "الضباب المذهّب",
    price: 59000,
    featured: false,
    image: photo(16722501),
    description:
      "الزعفران والجريب فروت الوردي والعنبر الذهبي في رذاذ خفيف. منعش في البداية ودافئ في الختام، يناسب كل المواسم وكل الإطلالات.",
  },
  {
    category: "unisex",
    name: "ظل البحر",
    price: 54000,
    featured: false,
    image: photo(30990130),
    description:
      "ملح البحر والسرو الأزرق والعرعر تلتقي بخشب الشاطئ والمسك الناعم. عطر بحري منعش كأنه نزهة مسائية على البحر في الصيف.",
  },
  {
    category: "unisex",
    name: "رمال الكثبان",
    price: 61000,
    featured: false,
    image: photo(8361545),
    description:
      "نفحة الرمال الدافئة وورق التين وحليب جوز الهند فوق قاعدة من الصندل والمسك. عطر مشمس وهادئ مستوحى من كثبان الصحراء الذهبية عند الغروب.",
  },

  // ---- Gifts ----
  {
    category: "gifts",
    name: "طقم الاستكشاف السداسي",
    price: 85000,
    featured: false,
    image: photo(30999189),
    description:
      "ستة بخاخات سعة 10 مل من أكثر عطورنا مبيعًا في علبة هدايا وردية. الطريقة المثالية لاكتشاف عطرك المميز أو مفاجأة شخص عزيز.",
  },
  {
    category: "gifts",
    name: "صندوق التراث الخشبي",
    price: 150000,
    featured: true,
    image: photo(4925718),
    description:
      "صندوق هدايا خشبي مصنوع يدويًا يضم عطر عود سعة 50 مل ودهن مسك وكيسًا من البخور الفاخر، ملفوف بالكتان الطبيعي. هدية فاخرة للأعياد والأعراس.",
  },
];

// ================= Reviews =================

// The Latin seed keeps the generated avatar initials readable.
const reviewers = [
  { name: "علي حسن", seed: "Ali Hassan" },
  { name: "زينب كريم", seed: "Zainab Kareem" },
  { name: "مصطفى عادل", seed: "Mustafa Adel" },
  { name: "نور سلمان", seed: "Noor Salman" },
  { name: "حسين جابر", seed: "Hussein Jaber" },
  { name: "مريم فاضل", seed: "Maryam Fadhil" },
  { name: "عمر سعد", seed: "Omar Saad" },
  { name: "فاطمة رعد", seed: "Fatima Raad" },
];

const comments = [
  { rating: 5, comment: "رائحة مذهلة وتدوم طوال اليوم!" },
  { rating: 5, comment: "رائحة فخمة، أتلقى المديح في كل مكان." },
  { rating: 4, comment: "عطر جميل جدًا وقيمة ممتازة مقابل السعر." },
  { rating: 4, comment: "زجاجة أنيقة ورائحة رائعة." },
  { rating: 5, comment: "توصيل سريع والعطر أصلي." },
  { rating: 3, comment: "رائحة جيدة لكن الفوحان يحتاج أن يكون أقوى." },
  { rating: 5, comment: "عطري المميز الجديد، أنصح به بشدة." },
  { rating: 4, comment: "أنيق وناعم، مثالي للاستخدام اليومي." },
];

// ================= Seed =================

async function clearCatalog() {
  // Children first, so no foreign key is broken.
  await prisma.$transaction([
    prisma.qiCardWebhookEvent.deleteMany(),
    prisma.qiCardPayment.deleteMany(),
    prisma.order.deleteMany(),
    prisma.review.deleteMany(),
    prisma.favorite.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.cart.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.hero.deleteMany(),
  ]);
}

async function main() {
  console.log("Clearing old catalog...");
  await clearCatalog();

  await prisma.hero.createMany({
    data: heroes.map((hero) => ({ ...hero, clerkId: ADMIN_ID })),
  });
  console.log(`Heroes: ${heroes.length}`);

  const categoryIds = {};
  for (const { key, ...category } of categories) {
    const created = await prisma.category.create({ data: { ...category, clerkId: ADMIN_ID } });
    categoryIds[key] = created.id;
  }
  console.log(`Categories: ${categories.length}`);

  let reviewCount = 0;
  for (const [index, { category, ...product }] of products.entries()) {
    const created = await prisma.product.create({
      data: { ...product, categoryId: categoryIds[category], clerkId: ADMIN_ID },
    });

    // 2 or 3 reviews per product, picked in rotation so every product looks different.
    const count = 2 + (index % 2);
    const reviews = Array.from({ length: count }, (_, i) => {
      const { name, seed } = reviewers[(index + i * 3) % reviewers.length];
      const { rating, comment } = comments[(index * 2 + i) % comments.length];
      return {
        productId: created.id,
        clerkId: `seed_${seed.toLowerCase().replace(/\s+/g, "_")}`,
        authorName: name,
        authorImageUrl: avatar(seed),
        rating,
        comment,
      };
    });
    await prisma.review.createMany({ data: reviews });
    reviewCount += reviews.length;
  }
  console.log(`Products: ${products.length}`);
  console.log(`Reviews: ${reviewCount}`);
  console.log("Done.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
