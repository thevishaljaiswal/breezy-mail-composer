
import EmailComposer from "@/components/EmailComposer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-email-primary">Advanced Email Composer</h1>
        <EmailComposer />
      </div>
    </div>
  );
};

export default Index;
