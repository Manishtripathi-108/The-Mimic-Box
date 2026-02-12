import { CTASection, FeaturesSection, Footer, HeroSection, HowItWorksSection, UseCasesSection } from '@/components/landing';

const LandingPageView = () => {
    return (
        <div className="min-h-calc-full-height">
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <UseCasesSection />
            <CTASection />
            <Footer />
        </div>
    );
};

export default LandingPageView;
