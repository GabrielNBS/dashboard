import { formatCurrency } from '@/utils/icons/formatCurrency';
import React from 'react';
import Image from 'next/image';

type Product = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
};

type BestProductsProps = {
  title: string;
  products: Product[];
};

export default function BestSellingProducts({ title, products }: BestProductsProps) {
  return (
    <>
      <h2 className="text-hero-title text-hero-center font-bold">{title}</h2>
      <ul className="flex flex-col gap-2">
        {products.map(product => (
          <li key={product.id} className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-neutral-200">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full rounded-full object-cover"
                  width={48}
                  height={48}
                />
              )}
            </div>
            <div className="flex flex-1 justify-between">
              <span className="font-medium">{product.name}</span>
              <span className="text-hero-neutral-600">{product.quantity} un.</span>
              <span className="font-bold">{formatCurrency(product.price)}</span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
