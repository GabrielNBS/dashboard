type Props = {
  onClick: () => void;
  children: React.ReactElement;
};

export default function IconHamburger({ onClick, children }: Props) {
  return (
    <button className="hamburger-menu" aria-label="Abrir menu de navegação" onClick={onClick}>
      {children}
    </button>
  );
}
