import "./galaxy/galaxy.css";
import StackedLayout from "./galaxy/fallback/StackedLayout";
import GalaxyApp from "./galaxy/GalaxyApp";
import ClientHideOnHydrate from "./galaxy/ClientHideOnHydrate";

export const metadata = {
  title: "Prithvi Raj · Software Engineer",
  description: "A scroll-driven WebGL portfolio — CS at UVA, SWE & Applied AI.",
};

export default function Home() {
  return (
    <>
      <ClientHideOnHydrate>
        <StackedLayout />
      </ClientHideOnHydrate>
      <GalaxyApp />
    </>
  );
}
