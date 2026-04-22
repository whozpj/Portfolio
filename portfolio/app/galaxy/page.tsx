import "./galaxy.css";
import StackedLayout from "./fallback/StackedLayout";
import GalaxyApp from "./GalaxyApp";
import ClientHideOnHydrate from "./ClientHideOnHydrate";

export const metadata = {
  title: "Prithvi Raj · Galaxy",
  description: "A scroll-driven WebGL portfolio — CS at UVA, SWE & Applied AI.",
};

export default function GalaxyPage() {
  return (
    <>
      <ClientHideOnHydrate>
        <StackedLayout />
      </ClientHideOnHydrate>
      <GalaxyApp />
    </>
  );
}
