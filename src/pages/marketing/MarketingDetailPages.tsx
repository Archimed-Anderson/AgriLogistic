import type { ReactNode } from "react";
import { ProjectDetailPage } from "@/app/components/landing/pages/ProjectDetailPage";

type DetailPageProps = {
  onNavigate: (route: string) => void;
  title: string;
  category: string;
  date: string;
  client: string;
  image: string;
  content: ReactNode;
};

function DetailPage(props: DetailPageProps) {
  return <ProjectDetailPage {...props} />;
}

// Contact pages
export function ContactGeneralPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <DetailPage
      onNavigate={onNavigate}
      title="General Inquiries"
      category="Contact Us"
      date="24/7 Availability"
      client="AgroLogistic Support"
      image="/assets/images/landing/contact-general.png"
      content={
        <>
          <h2>We're Here to Help</h2>
          <p>
            Have a question about our platform, services, or pricing? Our team is ready to provide you with the answers
            you need to get started.
          </p>
          <h3>How we can assist:</h3>
          <ul>
            <li>Platform demonstrations and walkthroughs.</li>
            <li>Account setup and configuration guidance.</li>
            <li>General information about sustainable farming.</li>
          </ul>
        </>
      }
    />
  );
}

export function ContactSupportPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <DetailPage
      onNavigate={onNavigate}
      title="Technical Support"
      category="Customer Success"
      date="Immediate Response"
      client="Active Users"
      image="/assets/images/landing/contact-support.png"
      content={
        <>
          <h2>Expert Technical Assistance</h2>
          <p>
            Facing a technical issue? Our dedicated support engineers are here to ensure your operations run smoothly
            without interruption.
          </p>
          <h3>Support Services:</h3>
          <ul>
            <li>Real-time troubleshooting for IOT devices.</li>
            <li>Data synchronization and API integration help.</li>
            <li>System upgrade and maintenance support.</li>
          </ul>
        </>
      }
    />
  );
}

export function ContactPartnershipsPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <DetailPage
      onNavigate={onNavigate}
      title="Strategic Partnerships"
      category="Business Development"
      date="Global Network"
      client="Enterprise Partners"
      image="/assets/images/landing/contact-partners.png"
      content={
        <>
          <h2>Grow With Us</h2>
          <p>
            We are always looking to collaborate with organizations that share our vision for a sustainable agricultural
            future. Let's build something great together.
          </p>
          <h3>Partnership Opportunities:</h3>
          <ul>
            <li>Supply chain integration for retailers.</li>
            <li>Technology co-development and research.</li>
            <li>NGO and government sustainability initiatives.</li>
          </ul>
        </>
      }
    />
  );
}

// Story pages
export function StoryEcoPracticesPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <DetailPage
      onNavigate={onNavigate}
      title="Eco-Friendly Farming Practices"
      category="Our Story"
      date="Since 2018"
      client="Internal Initiative"
      image="/assets/images/landing/story-eco-practices.png"
      content={
        <>
          <h2>Preserving Nature, Enhancing Yields</h2>
          <p>
            We believe that high-yield agriculture shouldn't come at the cost of the environment. Our eco-friendly
            practices focus on regenerative agriculture, ensuring soil health and biodiversity are maintained.
          </p>
          <h3>Key Synergies</h3>
          <ul>
            <li>Regenerative Soil Management: Using cover crops and composting to sequester carbon.</li>
            <li>Integrated Pest Management (IPM): Reducing pesticide use by introducing natural predators.</li>
            <li>Water Conservation: Precision irrigation to minimize runoff and waste.</li>
          </ul>
        </>
      }
    />
  );
}

export function StoryFairTradePage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <DetailPage
      onNavigate={onNavigate}
      title="Fair Trade Marketplace"
      category="Social Impact"
      date="Global Reach"
      client="Community Driven"
      image="/assets/images/landing/story-fair-trade.png"
      content={
        <>
          <h2>Empowering Farmers Globally</h2>
          <p>
            AgroLogistic cuts out the middlemen, connecting smallholder farmers directly to global buyers. This ensures
            fairer prices, transparent transactions, and faster payments.
          </p>
          <h3>Marketplace Features</h3>
          <ul>
            <li>Direct Access: Farmers sell directly to retailers and processors.</li>
            <li>Price Transparency: Real-time market data available to all users.</li>
            <li>Secure Payments: Blockchain-verified transactions ensure trust and speed.</li>
          </ul>
        </>
      }
    />
  );
}

// Sustainable practices pages
export function PracticesYieldGrowthPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <DetailPage
      onNavigate={onNavigate}
      title="80% Yield Growth"
      category="Performance"
      date="Ongoing"
      client="AgroLogistic Standard"
      image="/assets/images/landing/practice-yield-growth.png"
      content={
        <>
          <h2>Maximizing Crop Potential</h2>
          <p>
            Our AI-driven analytics platform processes millions of data points daily to provide actionable insights.
            This allows farmers to optimize planting schedules, nutrient application, and pest control.
          </p>
          <h3>Impact Metrics</h3>
          <ul>
            <li>Average yield increase of 80% within first 2 years.</li>
            <li>Reduction in chemical usage by 35%.</li>
            <li>Real-time disease detection accuracy of 99%.</li>
          </ul>
        </>
      }
    />
  );
}

export function PracticesWaterEfficiencyPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <DetailPage
      onNavigate={onNavigate}
      title="100% Efficient Water Use"
      category="Sustainability"
      date="Standard Feature"
      client="Global Partners"
      image="/assets/images/landing/practice-water-efficiency.png"
      content={
        <>
          <h2>Smart Water Management</h2>
          <p>
            With precision irrigation powered by IoT sensors and predictive models, AgroLogistic helps farms reduce
            water waste while improving crop quality.
          </p>
          <h3>What you get</h3>
          <ul>
            <li>Soil moisture and evapotranspiration insights.</li>
            <li>Automated irrigation workflows (rules & schedules).</li>
            <li>Water usage analytics and anomaly alerts.</li>
          </ul>
        </>
      }
    />
  );
}

export function PracticesRenewableEnergyPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <DetailPage
      onNavigate={onNavigate}
      title="Renewable Energy Adoption"
      category="Green IT"
      date="2026 Roadmap"
      client="Partner Ecosystem"
      image="/assets/images/landing/practice-renewable-energy.png"
      content={
        <>
          <h2>Lower Costs, Lower Carbon</h2>
          <p>
            AgroLogistic supports farm electrification strategies and energy monitoring to reduce operational costs and
            emissions.
          </p>
          <h3>Key initiatives</h3>
          <ul>
            <li>Solar-powered cold chain monitoring.</li>
            <li>Equipment energy usage dashboards.</li>
            <li>Optimization recommendations via analytics.</li>
          </ul>
        </>
      }
    />
  );
}

// Projects pages
export function ProjectEcoFarmPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <DetailPage
      onNavigate={onNavigate}
      title="Eco Farm Transformation"
      category="Projects"
      date="2025"
      client="Eco Farm Cooperative"
      image="/assets/images/landing/project-eco-farm.png"
      content={
        <>
          <h2>From Traditional to Regenerative</h2>
          <p>
            A full transformation program supported by data-driven agronomy, marketplace access and logistics
            optimization.
          </p>
          <h3>Delivered outcomes</h3>
          <ul>
            <li>Improved soil health indicators and reduced chemical usage.</li>
            <li>Better margins through direct marketplace access.</li>
            <li>Optimized deliveries with real-time tracking.</li>
          </ul>
        </>
      }
    />
  );
}

export function ProjectSmartIrrigationPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <DetailPage
      onNavigate={onNavigate}
      title="Smart Irrigation Program"
      category="Projects"
      date="2025"
      client="Regional Growers"
      image="/assets/images/landing/project-smart-irrigation.png"
      content={
        <>
          <h2>Precision irrigation at scale</h2>
          <p>
            IoT sensor deployment, analytics and automation workflows combined to increase yields and reduce water
            usage.
          </p>
          <h3>Delivered outcomes</h3>
          <ul>
            <li>Reduced water waste and improved uniformity.</li>
            <li>Automated scheduling based on predictive models.</li>
            <li>Operational reporting for compliance and audits.</li>
          </ul>
        </>
      }
    />
  );
}

export function ProjectLogisticsPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <DetailPage
      onNavigate={onNavigate}
      title="Cold-Chain Logistics Optimization"
      category="Projects"
      date="2024"
      client="Agri Exporters"
      image="/assets/images/landing/project-logistics.png"
      content={
        <>
          <h2>Traceable delivery, lower spoilage</h2>
          <p>
            End-to-end visibility across shipments, driver operations and delivery status updates through the
            AgroLogistic logistics module.
          </p>
          <h3>Delivered outcomes</h3>
          <ul>
            <li>Real-time tracking and ETA improvements.</li>
            <li>Incident reporting and operational alerts.</li>
            <li>Reduced spoilage with improved cold-chain compliance.</li>
          </ul>
        </>
      }
    />
  );
}

