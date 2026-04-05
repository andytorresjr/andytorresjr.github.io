import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/sections/HeroSection'
import SkillsMarquee from '@/components/sections/SkillsMarquee'
import TechBrandSection from '@/components/sections/TechBrandSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import TechAreasSection from '@/components/sections/TechAreasSection'
import AboutSection from '@/components/sections/AboutSection'
import ExperienceSection from '@/components/sections/ExperienceSection'
import StatsSection from '@/components/sections/StatsSection'
import ContactSection from '@/components/sections/ContactSection'

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <SkillsMarquee />
        <TechBrandSection />
        <ProjectsSection />
        <TechAreasSection />
        <AboutSection />
        <ExperienceSection />
        <StatsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
