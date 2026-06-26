import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Dashboard } from './dashboard';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Dashboard />
      <Footer />
    </div>
  );
}
