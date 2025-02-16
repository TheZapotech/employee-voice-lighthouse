
import Hero from "@/components/Hero";
import SupabaseTest from "@/components/SupabaseTest";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Hero />
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <SupabaseTest />
      </div>
    </div>
  );
};

export default Index;
