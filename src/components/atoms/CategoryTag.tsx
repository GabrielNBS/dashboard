interface Props {
  label: string;
  onClick?: () => void;
}

export default function CategoryTag({ label, onClick }: Props) {
  return (
    <span className="bg-primary cursor-pointer rounded-lg p-2" onClick={onClick}>
      {label}
    </span>
  );
}
