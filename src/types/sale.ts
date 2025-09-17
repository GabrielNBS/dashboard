// src/types/sale.ts
import { ElementType } from 'react';
import { ProductState } from './products';

export type PaymentMethod = 'cash' | 'debit' | 'credit' | 'ifood';
export type DiscountType = 'percentage' | 'fixed';

export interface PaymentDiscount {
  type: DiscountType;
  value: number;
}

export interface PaymentFees {
  cash: number;
  debit: number;
  credit: number;
  ifood: number;
}

export interface SellingResume {
  paymentMethod: PaymentMethod;
  discount?: PaymentDiscount;
  fees?: number; // valor em R$
  subtotal: number; // soma dos subtotais dos items
  totalValue: number; // subtotal - desconto + fees
}

export interface CartItem {
  uid: string; // productId
  quantity: number;
}

// Item que vai dentro da Sale
export interface SaleItem {
  product: ProductState;
  quantity: number;
  subtotal: number;
}

// Venda (carrinho fechado)
export interface Sale {
  id: string;
  date: string;
  items: SaleItem[];
  sellingResume: SellingResume;
}

// Configuração de pagamento local (estado do form)
export interface PaymentConfig {
  method: PaymentMethod;
  discount: PaymentDiscount;
  fees: PaymentFees;
}

// Opções para renderizar botões de método de pagamento na UI
export interface PaymentOption {
  id: PaymentMethod;
  label: string;
  icon: ElementType;
  fee: number;
}

export const PAYMENT_METHODS = {
  CASH: 'dinheiro' as const,
  DEBIT: 'débito' as const,
  CREDIT: 'crédito' as const,
  IFOOD: 'Ifood' as const,
} as const;

export const DEFAULT_PAYMENT_FEES: PaymentFees = {
  cash: 0,
  debit: 2.5,
  credit: 3.5,
  ifood: 15,
};
