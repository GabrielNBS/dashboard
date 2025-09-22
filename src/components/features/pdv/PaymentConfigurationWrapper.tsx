'use client';

import React from 'react';
import { PaymentConfig } from '@/types/sale';
import PaymentConfiguration from './PaymentConfiguration';

interface PaymentConfigurationWrapperProps {
  payment: PaymentConfig;
  onPaymentChange: (payment: PaymentConfig) => void;
}

// Wrapper component to prevent re-render loops
export default React.memo(
  function PaymentConfigurationWrapper({
    payment,
    onPaymentChange,
  }: PaymentConfigurationWrapperProps) {
    return <PaymentConfiguration payment={payment} onPaymentChange={onPaymentChange} />;
  },
  (prevProps, nextProps) => {
    // Custom comparison to prevent unnecessary re-renders
    return (
      prevProps.payment.method === nextProps.payment.method &&
      prevProps.payment.discount.type === nextProps.payment.discount.type &&
      prevProps.payment.discount.value === nextProps.payment.discount.value &&
      prevProps.onPaymentChange === nextProps.onPaymentChange
    );
  }
);
