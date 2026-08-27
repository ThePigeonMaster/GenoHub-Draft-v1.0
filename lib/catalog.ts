import type { KitComponent, PaymentTerms } from "./types";

export const suppliers = [
  {
    brand: "Thermo Fisher",
    name: "Thermo Fisher Scientific (M) Sdn Bhd",
    email: "orders.my@thermofisher.example",
  },
  {
    brand: "QIAGEN",
    name: "QIAGEN Malaysia Sdn Bhd",
    email: "supply.my@qiagen.example",
  },
  {
    brand: "Pigeon Labs",
    name: "Pigeon Labs OEM",
    email: "procurement@pigeonhub.example",
  },
] as const;

export const paymentTerms: PaymentTerms[] = ["COD", "Net 30", "Net 45", "LC 60"];

export const qpcrComponents: KitComponent[] = [
  { name: "2× qPCR master mix", spec: "12.5 µL / rxn", qtyPerKit: "1,320 µL (96 + 10%)" },
  { name: "Primer / probe mix", spec: "2.5 µL / rxn · 10×", qtyPerKit: "264 µL" },
  { name: "Nuclease-free water", spec: "to 20 µL", qtyPerKit: "1 vial" },
  { name: "Positive control", spec: "5 µL / plate", qtyPerKit: "1 tube" },
];

export const extractionComponents: KitComponent[] = [
  { name: "Lysis buffer + carrier RNA", spec: "560 µL / sample", qtyPerKit: "54 mL" },
  { name: "Wash 1 / Wash 2", spec: "500 µL each", qtyPerKit: "2 × 48 mL" },
  { name: "Spin columns", spec: "96-well", qtyPerKit: "1 plate" },
  { name: "Elution buffer", spec: "50–80 µL", qtyPerKit: "8 mL" },
];

export const tipComponents: KitComponent[] = [
  { name: "Filter tips 200 µL", spec: "sterile ART", qtyPerKit: "96 tips / rack" },
];
