
export enum UserRole {
  ADMIN = 'ADMIN',
  CASHIER = 'CASHIER',
  MANAGER = 'MANAGER'
}

export enum POSMode {
  RETAIL = 'RETAIL',
  RESTO = 'RESTO'
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  image: string;
  discount: number; // percentage
  sku: string;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  points: number;
  joinDate: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Transaction {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paymentMethod: 'CASH' | 'DEBIT' | 'QRIS' | 'MEMBER_POINTS';
  memberId?: string;
  pointsEarned: number;
}

export interface CashFlow {
  id: string;
  date: string;
  type: 'IN' | 'OUT';
  amount: number;
  description: string;
  category: string;
}

export interface SupplierPayable {
  id: string;
  supplierName: string;
  amount: number;
  dueDate: string;
  status: 'PENDING' | 'PAID';
}

export interface StoreSettings {
  name: string;
  address: string;
  phone: string;
  taxRate: number;
  currency: string;
  printerType: 'BLUETOOTH' | 'LOCAL';
  posMode: POSMode;
}
