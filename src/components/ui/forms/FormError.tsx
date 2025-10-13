import { FormErrorProps } from '@/types/components';
import clsx from 'clsx';

const FormError = ({ message, className }: FormErrorProps) => {
  if (!message) return null;
  return (
    <p
      className={clsx(
        'text-on-bad bg-bad rounded-lg p-2 text-center text-sm font-medium',
        className
      )}
    >
      {message}
    </p>
  );
};

export default FormError;
