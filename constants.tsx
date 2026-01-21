
import { Product, Category, Member, UserRole, StoreSettings, POSMode } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Makanan' },
  { id: '2', name: 'Minuman' },
  { id: '3', name: 'Snack' },
  { id: '4', name: 'Alat Tulis' },
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Nasi Goreng Spesial', categoryId: '1', price: 25000, costPrice: 15000, stock: 50, minStock: 5, image: 'https://picsum.photos/seed/nasi/200', discount: 0, sku: 'SKU001' },
  { id: 'p2', name: 'Es Teh Manis', categoryId: '2', price: 5000, costPrice: 1500, stock: 100, minStock: 10, image: 'https://picsum.photos/seed/esteh/200', discount: 0, sku: 'SKU002' },
  { id: 'p3', name: 'Kopi Susu Gula Aren', categoryId: '2', price: 18000, costPrice: 8000, stock: 40, minStock: 5, image: 'https://picsum.photos/seed/kopi/200', discount: 10, sku: 'SKU003' },
  { id: 'p4', name: 'Chiki Balls', categoryId: '3', price: 8000, costPrice: 6000, stock: 20, minStock: 10, image: 'https://picsum.photos/seed/snack/200', discount: 0, sku: 'SKU004' },
];

export const INITIAL_MEMBERS: Member[] = [
  { id: 'm1', name: 'Budi Santoso', phone: '08123456789', points: 1500, joinDate: '2023-01-15' },
  { id: 'm2', name: 'Siti Aminah', phone: '08567891234', points: 200, joinDate: '2023-05-20' },
];

export const DEFAULT_SETTINGS: StoreSettings = {
  name: 'Gemini Mart & Cafe',
  address: 'Jl. Merdeka No. 123, Jakarta',
  phone: '021-5551234',
  taxRate: 11,
  currency: 'IDR',
  printerType: 'LOCAL',
  posMode: POSMode.RETAIL
};
