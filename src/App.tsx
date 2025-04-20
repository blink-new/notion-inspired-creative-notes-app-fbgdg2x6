
import { useState, useEffect } from 'react';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { Sidebar } from './components/layout/Sidebar';
import { PageEditor } from './components/editor/PageEditor';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { Menu } from 'lucide-react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <WorkspaceProvider>
      <div className="flex h-screen bg-background text-foreground">
        {sidebarOpen && (
          <div className={`${isMobile ? 'fixed inset-0 z-50 bg-background' : ''}`}>
            <Sidebar />
          </div>
        )}
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {isMobile && (
            <div className="p-4 border-b">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          )}
          <div className="flex-1 overflow-auto">
            <PageEditor />
          </div>
        </div>
      </div>
      <Toaster />
    </WorkspaceProvider>
  );
}

export default App;