// src/utils/calcSale.ts
import { SaleItem, SellingResume, PaymentMethod, PaymentDiscount, PaymentFees } from '@/types/sale';
import { DEFAULT_PAYMENT_FEES } from '@/types/sale';

export function calculateSellingResume(
  items: SaleItem[],
  paymentMethod: PaymentMethod,
  discount?: PaymentDiscount,
  feesConfig: PaymentFees = DEFAULT_PAYMENT_FEES
): SellingResume {
  const subtotal = items.reduce((acc, item) => acc + (item.subtotal ?? 0), 0);

  // calcula desconto em valor absoluto
  const discountValue = discount
    ? discount.type === 'percentage'
      ? (subtotal * discount.value) / 100
      : discount.value
    : 0;

  // determina porcentagem de fee (0 para cash)
  const feePercentage = paymentMethod === 'cash' ? 0 : ((feesConfig as any)[paymentMethod] ?? 0);

  // aplica a taxa sobre o valor após desconto (comportamento escolhido)
  const fees = ((subtotal - discountValue) * feePercentage) / 100;

  const totalValue = subtotal - discountValue + fees;

  return {
    paymentMethod,
    discount,
    fees,
    subtotal,
    totalValue,
  };
}
