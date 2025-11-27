import { useState, useCallback, useEffect } from 'react';

interface UseRTLMaskProps {
  initialValue?: string | number;
  onChange: (value: string) => void;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  maxIntegerDigits?: number;
  autoAdjustSmallValues?: boolean; 
  maxValue?: number;
}

export function useRTLMask({
  initialValue,
  onChange,
  decimals = 2,
  prefix = '',
  suffix = '',
  maxIntegerDigits = 9,
  autoAdjustSmallValues = false,
  maxValue,
}: UseRTLMaskProps) {
  // Estado interno para armazenar apenas os dígitos
  const [digits, setDigits] = useState<string>('');

  // Formata os dígitos para exibição (ex: 1234 -> 12,34)
  const formatDisplay = useCallback(
    (rawDigits: string) => {
      if (!rawDigits) return '';

      const numberValue = parseInt(rawDigits, 10);
      if (isNaN(numberValue)) return '';

      // Se decimals for 0, trata como inteiro
      if (decimals === 0) {
        return `${prefix}${numberValue.toLocaleString('pt-BR')}${suffix}`;
      }



      // Divide por 10^decimals para obter o valor real
      const realValue = numberValue / Math.pow(10, decimals);
      
      return `${prefix}${realValue.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;
    },
    [decimals, prefix, suffix, autoAdjustSmallValues]
  );

  // Inicializa o estado com base no valor inicial
  useEffect(() => {
    if (initialValue === undefined || initialValue === '' || initialValue === null) {
      setDigits('');
      return;
    }

    // Converte o valor inicial para dígitos
    // Ex: 12.34 -> "1234" (se decimals=2)
    const numValue = typeof initialValue === 'string' ? parseFloat(initialValue) : initialValue;
    if (!isNaN(numValue)) {
      const fixed = numValue.toFixed(decimals);
      const raw = fixed.replace(/\D/g, '');
      // Remove zeros à esquerda, mas mantém se for zero
      const cleanRaw = raw.replace(/^0+/, '') || (numValue === 0 ? '0' : '');
      setDigits(cleanRaw);
    }
  }, [initialValue, decimals]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Remove tudo que não for dígito
      const newDigits = inputValue.replace(/\D/g, '');

      // Limita o tamanho para evitar overflow
      if (newDigits.length > maxIntegerDigits + decimals) return;

      // Remove zeros à esquerda
      const cleanDigits = newDigits.replace(/^0+/, '');

      // Verifica maxValue se definido
      if (maxValue !== undefined && cleanDigits) {
        const numberValue = parseInt(cleanDigits, 10);
        const realValue = numberValue / Math.pow(10, decimals);
        if (realValue > maxValue) return; // Impede a atualização se exceder o máximo
      }

      setDigits(cleanDigits);

      // Calcula o valor real para o onChange
      if (!cleanDigits) {
        onChange('');
        return;
      }

      const numberValue = parseInt(cleanDigits, 10);
      const realValue = numberValue / Math.pow(10, decimals);
      
      onChange(realValue.toString());
    },
    [decimals, maxIntegerDigits, onChange, maxValue]
  );

  return {
    displayValue: formatDisplay(digits),
    handleChange,
  };
}
