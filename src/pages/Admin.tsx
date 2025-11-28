import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ToolSubmissions from "./ToolSubmissions";
import ToolReports from "./ToolReports";

const AdminSubmissions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-12 max-w-5xl mx-auto px-4 space-y-24">
        <ToolSubmissions />
        <ToolReports />
      </div>
      <Footer />
    </div>
  );
};

export default AdminSubmissions;
