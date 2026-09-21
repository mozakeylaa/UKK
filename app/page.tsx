import LandingHeader from "@/components/landing/LandingHeader";
import LandingHero from "@/components/landing/LandingHero";
import LandingHowItWorks from "@/components/landing/LandingHowItWorks";
import LandingFooter from "@/components/landing/LandingFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-navy-gradient">
        <LandingHeader />
        <LandingHero />
      </div>
      <LandingHowItWorks />
      <LandingFooter />
    </div>
  );
}