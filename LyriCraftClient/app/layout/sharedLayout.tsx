import React from 'react';
import Header from './header';
import Footer from './footer';

type Props = {
    children: React.ReactNode;
  };
export default function SharedLayout({ children }: Props) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
