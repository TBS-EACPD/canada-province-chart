export const provinceNames = {
  ab: {
    en: "Alberta",
    fr: "Alberta",
  },
  abroad: {
    en: "Abroad",
    fr: "À l'étranger",
  },
  bc: {
    en: "British Columbia",
    fr: "Colombie-Britannique",
  },
  mb: {
    en: "Manitoba",
    fr: "Manitoba",
  },
  nb: {
    en: "New Brunswick",
    fr: "Nouveau-Brunswick",
  },
  ncr: {
    en: "NCR",
    fr: "RCN",
  },
  ns: {
    en: "Nova Scotia",
    fr: "Nouvelle-Écosse",
  },
  nt: {
    en: "Northwest Territories",
    fr: "Territoires du Nord-Ouest",
  },
  nu: {
    text: "Nunavut",
  },
  on: {
    text: "Ontario",
  },
  onlessncr: {
    en: "Ontario (non-NCR)",
    fr: "Ontario (hors RCN)",
  },
  pe: {
    en: "Prince Edward Island",
    fr: "Île-du-Prince-Édouard",
  },
  qc: {
    en: "Quebec",
    fr: "Québec",
  },
  qclessncr: {
    en: "Quebec (non-NCR)",
    fr: "Québec (hors RCN)",
  },
  sk: {
    text: "Saskatchewan",
  },
  yt: {
    text: "Yukon",
  },
  nl: {
    en: "Newfoundland and Labrador",
    fr: "Terre-Neuve-et-Labrador",
  },
  na: {
    en: "Not Available",
    fr: "Non disponible",
  },
} as const;
export const provinceShortNames = {
  ab: {
    text: "AB",
  },
  abroad: {
    en: "Abroad",
    fr: "À l'étranger",
  },
  bc: {
    text: "BC",
  },
  mb: {
    text: "MB",
  },
  nb: {
    text: "NB",
  },
  ncr: {
    en: "NCR",
    fr: "RCN",
  },
  ns: {
    en: "NS",
    fr: "NE",
  },
  nt: {
    en: "NT",
    fr: "TN",
  },
  nu: {
    text: "NU",
  },
  on: {
    text: "ON",
  },
  onlessncr: {
    en: "ON (non-NCR)",
    fr: "ON (hors RCN)",
  },
  pe: {
    text: "PE",
  },
  qc: {
    text: "QC",
  },
  qclessncr: {
    en: "QC (non-NCR)",
    fr: "QC (hors RCN)",
  },
  sk: {
    text: "SK",
  },
  yt: {
    text: "YT",
  },
  nl: {
    text: "NL",
  },
  na: {
    en: "N.A.",
    fr: "N.D.",
  },
} as const;

export type ProvCode = keyof typeof provinceNames;

export function getProvinceShortName(provCode: ProvCode, language: "en" | "fr") {
  const entry = provinceShortNames[provCode];
  if(!entry){
    return undefined
  }
  if (entry.hasOwnProperty("text")) {
    return (entry as {text:string}).text;
  }
  return (entry as {en:string, fr: string})?.[language];
}
export function getProvinceName(provCode: ProvCode, language: "en" | "fr") {
  const entry = provinceNames[provCode];
  if(!entry){
    return undefined
  }
  if (entry.hasOwnProperty("text")) {
    return (entry as {text:string}).text;
  }
  return (entry as {en:string, fr: string})?.[language];
}
