import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function KontakPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Kontak</h1>
        <p className="text-gray-600">Halaman kontak akan segera tersedia.</p>
      </main>
      <Footer />
    </div>
  );
}
