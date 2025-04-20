
import { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Search, 
  Settings, 
  Star, 
  Clock, 
  Folder, 
  File, 
  Home,
  MoreHorizontal
} from 'lucide-react';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';

export function Sidebar() {
  const { 
    workspace, 
    currentPageId, 
    setCurrentPageId, 
    createPage, 
    createFolder,
    getPageById
  } = useWorkspace();
  
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>(
    Object.fromEntries(workspace.folders.map(folder => [folder.id, true]))
  );
  
  const [newPageName, setNewPageName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [newPageDialogOpen, setNewPageDialogOpen] = useState(false);
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(undefined);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleCreatePage = () => {
    if (newPageName.trim()) {
      createPage(newPageName, selectedFolderId);
      setNewPageName('');
      setNewPageDialogOpen(false);
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName);
      setNewFolderName('');
      setNewFolderDialogOpen(false);
    }
  };

  return (
    <div className="h-screen w-64 bg-sidebar border-r border-border flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary-600 rounded-md flex items-center justify-center text-white font-semibold">
            N
          </div>
          <h1 className="font-semibold text-sidebar-foreground">NotionClone</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-sidebar-foreground">
          <Settings size={18} />
        </Button>
      </div>
      
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-8 bg-sidebar-accent text-sidebar-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start font-normal",
              !currentPageId && "bg-sidebar-accent"
            )}
            onClick={() => setCurrentPageId(null)}
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          
          {/* Favorites Section */}
          <div className="mt-6">
            <div className="flex items-center px-3 py-1.5">
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium ml-1 text-sidebar-foreground">Favorites</span>
            </div>
            <div className="mt-1 space-y-1">
              {workspace.favorites.map(pageId => {
                const page = getPageById(pageId);
                if (!page) return null;
                
                return (
                  <Button
                    key={pageId}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start font-normal pl-7",
                      currentPageId === pageId && "bg-sidebar-accent"
                    )}
                    onClick={() => setCurrentPageId(pageId)}
                  >
                    <Star className="mr-2 h-4 w-4 text-yellow-400" />
                    <span className="truncate">{page.title}</span>
                  </Button>
                );
              })}
            </div>
          </div>
          
          {/* Recent Section */}
          <div className="mt-4">
            <div className="flex items-center px-3 py-1.5">
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium ml-1 text-sidebar-foreground">Recent</span>
            </div>
            <div className="mt-1 space-y-1">
              {workspace.recentPages.slice(0, 3).map(pageId => {
                const page = getPageById(pageId);
                if (!page) return null;
                
                return (
                  <Button
                    key={pageId}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start font-normal pl-7",
                      currentPageId === pageId && "bg-sidebar-accent"
                    )}
                    onClick={() => setCurrentPageId(pageId)}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    <span className="truncate">{page.title}</span>
                  </Button>
                );
              })}
            </div>
          </div>
          
          {/* Folders Section */}
          <div className="mt-4">
            <div className="flex items-center justify-between px-3 py-1.5">
              <div className="flex items-center">
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium ml-1 text-sidebar-foreground">Folders</span>
              </div>
              <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5">
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create new folder</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="folder-name">Folder name</Label>
                      <Input 
                        id="folder-name" 
                        value={newFolderName} 
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="Untitled"
                      />
                    </div>
                    <Button onClick={handleCreateFolder} className="w-full">
                      Create folder
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="mt-1 space-y-1">
              {workspace.folders.map(folder => (
                <div key={folder.id}>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => toggleFolder(folder.id)}
                    >
                      {expandedFolders[folder.id] ? (
                        <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex-1 justify-start font-normal h-6 py-1 px-2"
                    >
                      <Folder className="mr-2 h-4 w-4" />
                      <span className="truncate">{folder.name}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setSelectedFolderId(folder.id);
                        setNewPageDialogOpen(true);
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  
                  {expandedFolders[folder.id] && (
                    <div className="ml-6 mt-1 space-y-1">
                      {folder.pages.map(pageId => {
                        const page = getPageById(pageId);
                        if (!page) return null;
                        
                        return (
                          <Button
                            key={pageId}
                            variant="ghost"
                            className={cn(
                              "w-full justify-start font-normal",
                              currentPageId === pageId && "bg-sidebar-accent"
                            )}
                            onClick={() => setCurrentPageId(pageId)}
                          >
                            <File className="mr-2 h-4 w-4" />
                            <span className="truncate">{page.title}</span>
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
      
      <Separator className="my-2" />
      
      <div className="p-3">
        <Dialog open={newPageDialogOpen} onOpenChange={setNewPageDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full justify-start" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Page
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new page</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="page-name">Page name</Label>
                <Input 
                  id="page-name" 
                  value={newPageName} 
                  onChange={(e) => setNewPageName(e.target.value)}
                  placeholder="Untitled"
                />
              </div>
              <Button onClick={handleCreatePage} className="w-full">
                Create page
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}