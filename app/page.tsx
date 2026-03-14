import HeroSection from '@/components/HeroSection';
import PremiumAbout from '@/components/PremiumAbout';
import CosmicNavbar from '@/components/CosmicNavbar';
import PremiumServices from '@/components/PremiumServices';
import ProcessPillars from '@/components/ProcessPillars';
import CosmicFooter from '@/components/CosmicFooter';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <CosmicNavbar />
      <HeroSection />
      <PremiumAbout />
      <PremiumServices />
      <ProcessPillars />
      <CosmicFooter />
    </main>
  );
}