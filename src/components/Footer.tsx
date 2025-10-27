import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              SIPELAN - Sistem Pengaduan Layanan
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Platform pengaduan online Dinas Tenaga Kerja Kabupaten Pati untuk menampung 
              aspirasi dan keluhan masyarakat terkait permasalahan ketenagakerjaan.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Kontak</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">
                  Jl. Contoh Alamat No. 123, Pati, Jawa Tengah
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-sm">(0295) 123456</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-sm">disnaker@patikab.go.id</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Tautan Cepat
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-blue-400 transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="/buat-aduan"
                  className="hover:text-blue-400 transition-colors"
                >
                  Buat Pengaduan
                </a>
              </li>
              <li>
                <a
                  href="/lacak-aduan"
                  className="hover:text-blue-400 transition-colors"
                >
                  Lacak Pengaduan
                </a>
              </li>
              <li>
                <a
                  href="/alur-pengaduan"
                  className="hover:text-blue-400 transition-colors"
                >
                  Alur Pengaduan
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Dinas Tenaga Kerja Kabupaten Pati.
            Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
