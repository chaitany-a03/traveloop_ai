import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppLayout({ children, noPadding = false, fullScreen = false }) {
  return (
    <div className={`flex bg-surface-50 ${fullScreen ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <Navbar />
        <main className={`flex-1 min-h-0 animate-fade-in ${noPadding ? '' : 'p-4 md:p-6 lg:p-8'} ${fullScreen ? 'h-full overflow-hidden' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
