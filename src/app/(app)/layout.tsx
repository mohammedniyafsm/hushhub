import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";


interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        {children}
      </div>
      <div className="py-2">
       <Footer />
      </div>
    </>
  );
}