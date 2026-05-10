import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppLayout({ children, noPadding = false }) {
  return (
    <div className="flex min-h-screen bg-surface-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className={`flex-1 animate-fade-in ${noPadding ? '' : 'p-4 md:p-6 lg:p-8'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
