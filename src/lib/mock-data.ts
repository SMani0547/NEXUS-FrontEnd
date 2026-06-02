// Mock data for NEXUS — replaces real Pacific Dataviz Challenge datasets

export const COUNTRIES = [
  "Fiji", "Samoa", "Tonga", "Vanuatu", "Solomon Islands",
  "Papua New Guinea", "New Caledonia", "French Polynesia",
  "Kiribati", "Cook Islands", "Tuvalu", "Niue", "Palau",
  "Marshall Islands", "Micronesia",
];

export const CROPS = [
  "Taro", "Cassava", "Sweet Potato", "Yam", "Banana",
  "Coconut", "Sugarcane", "Pineapple", "Vanilla", "Kava",
];

export const LIVESTOCK = ["Cattle", "Pigs", "Goats", "Poultry", "Sheep"];

export type YieldRow = {
  country: string;
  product: string;
  type: "Crop" | "Livestock";
  year: number;
  yield: number; // tonnes / head
};

// deterministic pseudo-random
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export const YEARS = Array.from({ length: 24 }, (_, i) => 2000 + i);

export const DATASET: YieldRow[] = (() => {
  const rows: YieldRow[] = [];
  const rng = seeded(42);
  const all = [
    ...CROPS.map((p) => ({ p, t: "Crop" as const })),
    ...LIVESTOCK.map((p) => ({ p, t: "Livestock" as const })),
  ];
  COUNTRIES.forEach((country, ci) => {
    all.forEach(({ p, t }, pi) => {
      if (rng() < 0.25) return; // not every country reports every product
      const base = 50 + rng() * 500 + ci * 8 + pi * 3;
      const trend = (rng() - 0.4) * 8;
      YEARS.forEach((year, yi) => {
        if (rng() < 0.05) return; // missing year
        const noise = (rng() - 0.5) * 40;
        rows.push({
          country,
          product: p,
          type: t,
          year,
          yield: Math.max(5, Math.round(base + trend * yi + noise)),
        });
      });
    });
  });
  return rows;
})();

export const STATS = {
  countries: 16,
  products: 78,
  years: 64,
  records: 20725,
};
