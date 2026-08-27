export type OrderStatus =
  | "Pending"
  | "Approved"
  | "Partial Delivery"
  | "Fully Delivered";

export type TenderStatus = "Draft" | "Submitted" | "Shortlisted" | "Awarded" | "Lost";

export type PaymentTerms = "COD" | "Net 30" | "Net 45" | "LC 60";

export type FormulationParam = {
  label: string;
  value: string;
  hint: string;
};

export type KitComponent = {
  name: string;
  spec: string;
  qtyPerKit: string;
};

export type OrderLine = {
  skuId: string;
  sku: string;
  name: string;
  qty: number;
};

export type Order = {
  id: string;
  quotationId: string;
  partnerCode: string;
  partnerName: string;
  invNumber: string;
  amount: number;
  status: OrderStatus;
  doDate: string | null;
  createdAt: string;
  paymentTerms: PaymentTerms;
  creditLimit: number;
  creditExposure: number;
  lines: OrderLine[];
  dispatchNote: string | null;
  creditVerified: boolean;
  inventoryLocked: boolean;
};

export type InventoryItem = {
  id: string;
  sku: string;
  name: string;
  brand: string;
  supplier: string;
  supplierEmail: string;
  quantity: number;
  reorderPoint: number;
  unit: string;
  kitSize: number | null;
  formulation: FormulationParam[];
  components: KitComponent[];
  lastLot: string | null;
  lastBatchQty: number | null;
};

export type ComplianceItem = {
  id: string;
  label: string;
  done: boolean;
};

export type Tender = {
  id: string;
  reference: string;
  buyer: string;
  title: string;
  valueRm: number;
  estimatedCogs: number;
  status: TenderStatus;
  dueDate: string;
  compliance: ComplianceItem[];
};

export type AppView = "overview" | "orders" | "inventory" | "tenders" | "equipment";

export type ConnectionMode = "loading" | "live" | "demo";

export type EmailKind = "low-stock-po" | "tender-award";

export type EmailDraft = {
  kind: EmailKind;
  to: string;
  cc: string;
  subject: string;
  body: string;
};

export type ActivityEvent = {
  id: string;
  at: string;
  label: string;
};
