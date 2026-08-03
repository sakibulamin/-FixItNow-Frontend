import { Hero } from "@/features/home/components/hero";
import { CategoriesSection } from "@/features/home/components/categories-section";
import { FeaturedServices } from "@/features/home/components/featured-services";
import { FeaturedTechnicians } from "@/features/home/components/featured-technicians";
import { TestimonialsSection } from "@/features/home/components/testimonials-section";
import { CtaSection } from "@/features/home/components/cta-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoriesSection />
      <FeaturedServices />
      <FeaturedTechnicians />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
