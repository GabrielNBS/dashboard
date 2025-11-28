import { useState, useCallback, useEffect, useRef } from 'react';

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
  maxValue,
}: UseRTLMaskProps) {
  // Estado interno para armazenar apenas os dígitos
  const [digits, setDigits] = useState<string>('');

  // Ref para evitar loops infinitos no useEffect
  const isInitializing = useRef(true);
  const lastExternalValue = useRef<string | number | undefined>(initialValue);

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
    [decimals, prefix, suffix]
  );

  // Inicializa o estado com base no valor inicial
  useEffect(() => {
    // Só atualiza se o valor mudou externamente (não por digitação do usuário)
    if (lastExternalValue.current === initialValue && !isInitializing.current) {
      return;
    }

    lastExternalValue.current = initialValue;
    isInitializing.current = false;

    if (initialValue === undefined || initialValue === '' || initialValue === null) {
      setDigits('');
      return;
    }

    // Converte o valor inicial para dígitos
    const numValue = typeof initialValue === 'string' ? parseFloat(initialValue) : initialValue;

    if (isNaN(numValue) || numValue === 0) {
      setDigits('');
      return;
    }

    // Converte para centavos/dígitos inteiros
    const multiplier = Math.pow(10, decimals);
    const integerValue = Math.round(numValue * multiplier);
    const digitsStr = integerValue.toString();

    setDigits(digitsStr);
  }, [initialValue, decimals]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Remove tudo que não for dígito
      const newDigits = inputValue.replace(/\D/g, '');

      // Se vazio, limpa tudo
      if (!newDigits) {
        setDigits('');
        onChange('');
        return;
      }

      // Remove zeros à esquerda, mas mantém pelo menos um dígito
      const cleanDigits = newDigits.replace(/^0+/, '') || '0';

      // Limita o tamanho para evitar overflow
      const maxLength = maxIntegerDigits + decimals;
      if (cleanDigits.length > maxLength) {
        return;
      }

      // Calcula o valor real
      const numberValue = parseInt(cleanDigits, 10);
      const multiplier = Math.pow(10, decimals);
      const realValue = numberValue / multiplier;

      // Verifica maxValue se definido
      if (maxValue !== undefined && realValue > maxValue) {
        return;
      }

      // Atualiza apenas se o valor mudou
      if (cleanDigits !== digits) {
        setDigits(cleanDigits);

        // Chama onChange com o valor formatado
        // Se for 0, passa string vazia para permitir limpar o campo
        onChange(realValue === 0 ? '' : realValue.toString());
      }
    },
    [decimals, maxIntegerDigits, onChange, maxValue, digits]
  );

  return {
    displayValue: formatDisplay(digits),
    handleChange,
  };
}
