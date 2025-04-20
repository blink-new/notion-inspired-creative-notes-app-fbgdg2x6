
import { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { BlockEditor } from './BlockEditor';
import { Button } from '../ui/button';
import { Plus, Star, StarOff } from 'lucide-react';
import { cn } from '../../lib/utils';

export function PageEditor() {
  const { 
    currentPageId, 
    getPageById, 
    updatePage, 
    addBlockToPage,
    addToFavorites,
    removeFromFavorites,
    workspace
  } = useWorkspace();
  
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  
  const currentPage = currentPageId ? getPageById(currentPageId) : null;
  
  useEffect(() => {
    if (currentPage) {
      setTitle(currentPage.title);
      setIsFavorite(workspace.favorites.includes(currentPage.id));
    } else {
      setTitle('');
      setIsFavorite(false);
    }
    setSelectedBlockId(null);
  }, [currentPage, workspace.favorites]);
  
  const handleTitleChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newTitle = e.currentTarget.textContent || '';
    setTitle(newTitle);
  };
  
  const handleTitleBlur = () => {
    if (currentPage && title !== currentPage.title) {
      updatePage({ ...currentPage, title });
    }
  };
  
  const handleAddBlock = () => {
    if (currentPageId) {
      const newBlockId = addBlockToPage(currentPageId, {
        type: 'paragraph',
        content: '',
      });
      setSelectedBlockId(newBlockId);
    }
  };
  
  const toggleFavorite = () => {
    if (!currentPageId) return;
    
    if (isFavorite) {
      removeFromFavorites(currentPageId);
    } else {
      addToFavorites(currentPageId);
    }
  };
  if (!currentPage) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to NotionClone</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Select a page from the sidebar or create a new one to get started.
        </p>
        <img 
          src="https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
          alt="Notebook and coffee"
          className="max-w-md rounded-lg shadow-lg opacity-80"
        />
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 flex items-center justify-center rounded bg-primary-100 text-primary-700">
          {currentPage.emoji || '📝'}
        </div>
        <div
          contentEditable
          suppressContentEditableWarning
          className="text-3xl font-bold outline-none flex-1"
          onInput={handleTitleChange}
          onBlur={handleTitleBlur}
          dir="ltr"
        >
          {title}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFavorite}
          className={cn(isFavorite && "text-yellow-500")}
        >
          {isFavorite ? <Star className="h-5 w-5 fill-yellow-400" /> : <StarOff className="h-5 w-5" />}
        </Button>
      </div>
      
      <div className="space-y-1">
        {currentPage.blocks.map((block, index) => (
          <BlockEditor
            key={block.id}
            pageId={currentPage.id}
            block={block}
            isSelected={selectedBlockId === block.id}
            onSelect={() => setSelectedBlockId(block.id)}
            isFirst={index === 0}
            isLast={index === currentPage.blocks.length - 1}
          />
        ))}
      </div>
      
      <Button
        variant="ghost"
        className="mt-4 text-muted-foreground justify-start"
        onClick={handleAddBlock}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add block
      </Button>
    </div>
  );
}