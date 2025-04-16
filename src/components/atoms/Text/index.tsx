import React, { ReactNode } from 'react';

interface TextProps {
  children: ReactNode;
}

function Title({ children }: TextProps) {
  return <h1 className="text-5xl font-bold">{children}</h1>;
}
function Subtitle({ children }: TextProps) {
  return <h2 className="text-3xl font-semibold">{children}</h2>;
}
function Paragraph({ children }: TextProps) {
  return <p className="font-normal text-shadow-white">{children}</p>;
}
function Span({ children }: TextProps) {
  return <span className="text-sm font-light">{children}</span>;
}

export { Title, Subtitle, Paragraph, Span };
