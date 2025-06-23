import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Benefits from '../components/Benefits';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import CallToAction from '../components/CallToAction';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <Services />
      <Benefits />
      <Testimonials />
      <FAQ />
      <CallToAction />
    </>
  );
};

export default HomePage;