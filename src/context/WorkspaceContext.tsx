
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Workspace, Page, Folder, Block } from '../types';

// Default workspace with sample content
const defaultWorkspace: Workspace = {
  folders: [
    {
      id: 'f1',
      name: 'Getting Started',
      pages: ['p1', 'p2'],
      createdAt: new Date().toISOString(),
    }
  ],
  pages: [
    {
      id: 'p1',
      title: 'Welcome to NotionClone',
      emoji: '👋',
      blocks: [
        {
          id: 'b1',
          type: 'heading1',
          content: 'Welcome to your NotionClone workspace',
        },
        {
          id: 'b2',
          type: 'paragraph',
          content: 'This is a Notion-inspired app for taking creative notes. You can create pages, add different types of content blocks, and organize your thoughts efficiently.',
        },
        {
          id: 'b3',
          type: 'heading2',
          content: 'Getting Started',
        },
        {
          id: 'b4',
          type: 'bulletList',
          content: 'Create a new page using the + button in the sidebar',
        },
        {
          id: 'b5',
          type: 'bulletList',
          content: 'Add different types of blocks using the + button or by typing /',
        },
        {
          id: 'b6',
          type: 'bulletList',
          content: 'Organize your pages into folders',
        },
        {
          id: 'b7',
          type: 'quote',
          content: 'The best way to predict the future is to create it.',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'p2',
      title: 'How to use blocks',
      emoji: '🧱',
      blocks: [
        {
          id: 'b1',
          type: 'heading1',
          content: 'Working with blocks',
        },
        {
          id: 'b2',
          type: 'paragraph',
          content: 'Blocks are the building units of your pages. Each block can contain different types of content.',
        },
        {
          id: 'b3',
          type: 'heading2',
          content: 'Available block types:',
        },
        {
          id: 'b4',
          type: 'bulletList',
          content: 'Text - for regular paragraphs',
        },
        {
          id: 'b5',
          type: 'bulletList',
          content: 'Headings - for section titles (H1, H2, H3)',
        },
        {
          id: 'b6',
          type: 'bulletList',
          content: 'Lists - bulleted or numbered',
        },
        {
          id: 'b7',
          type: 'bulletList',
          content: 'To-do - for checkable items',
        },
        {
          id: 'b8',
          type: 'todo',
          content: 'Try checking this item',
          checked: false,
        },
        {
          id: 'b9',
          type: 'todo',
          content: 'This one is already done',
          checked: true,
        },
        {
          id: 'b10',
          type: 'divider',
          content: '',
        },
        {
          id: 'b11',
          type: 'quote',
          content: 'Blocks make organizing information easy and flexible.',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ],
  recentPages: ['p1', 'p2'],
  favorites: ['p1'],
};

type WorkspaceContextType = {
  workspace: Workspace;
  currentPageId: string | null;
  setCurrentPageId: (id: string | null) => void;
  getPageById: (id: string) => Page | undefined;
  getFolderById: (id: string) => Folder | undefined;
  createPage: (title: string, folderId?: string) => string;
  updatePage: (page: Page) => void;
  deletePage: (id: string) => void;
  createFolder: (name: string) => string;
  updateFolder: (folder: Folder) => void;
  deleteFolder: (id: string) => void;
  addToFavorites: (pageId: string) => void;
  removeFromFavorites: (pageId: string) => void;
  addBlockToPage: (pageId: string, block: Omit<Block, 'id'>) => string;
  updateBlock: (pageId: string, block: Block) => void;
  deleteBlock: (pageId: string, blockId: string) => void;
  moveBlockUp: (pageId: string, blockId: string) => void;
  moveBlockDown: (pageId: string, blockId: string) => void;
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [workspace, setWorkspace] = useState<Workspace>(() => {
    const saved = localStorage.getItem('workspace');
    return saved ? JSON.parse(saved) : defaultWorkspace;
  });
  
  const [currentPageId, setCurrentPageId] = useState<string | null>(
    workspace.recentPages.length > 0 ? workspace.recentPages[0] : null
  );

  // Save workspace to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('workspace', JSON.stringify(workspace));
  }, [workspace]);

  // Update recent pages when current page changes
  useEffect(() => {
    if (currentPageId) {
      setWorkspace(prev => {
        const recentPages = [
          currentPageId,
          ...prev.recentPages.filter(id => id !== currentPageId)
        ].slice(0, 5); // Keep only 5 most recent
        
        return {
          ...prev,
          recentPages
        };
      });
    }
  }, [currentPageId]);

  const getPageById = (id: string) => {
    return workspace.pages.find(page => page.id === id);
  };

  const getFolderById = (id: string) => {
    return workspace.folders.find(folder => folder.id === id);
  };

  const createPage = (title: string, folderId?: string) => {
    const newId = uuidv4();
    const now = new Date().toISOString();
    
    const newPage: Page = {
      id: newId,
      title,
      blocks: [
        {
          id: uuidv4(),
          type: 'paragraph',
          content: '',
        }
      ],
      createdAt: now,
      updatedAt: now,
    };
    
    setWorkspace(prev => {
      const updatedFolders = folderId 
        ? prev.folders.map(folder => 
            folder.id === folderId 
              ? { ...folder, pages: [...folder.pages, newId] }
              : folder
          )
        : prev.folders;
      
      return {
        ...prev,
        pages: [...prev.pages, newPage],
        folders: updatedFolders,
      };
    });
    
    setCurrentPageId(newId);
    return newId;
  };

  const updatePage = (updatedPage: Page) => {
    setWorkspace(prev => ({
      ...prev,
      pages: prev.pages.map(page => 
        page.id === updatedPage.id 
          ? { ...updatedPage, updatedAt: new Date().toISOString() }
          : page
      ),
    }));
  };

  const deletePage = (id: string) => {
    setWorkspace(prev => {
      // Remove page from folders
      const updatedFolders = prev.folders.map(folder => ({
        ...folder,
        pages: folder.pages.filter(pageId => pageId !== id)
      }));
      
      // Remove page from favorites and recent
      const updatedFavorites = prev.favorites.filter(pageId => pageId !== id);
      const updatedRecent = prev.recentPages.filter(pageId => pageId !== id);
      
      return {
        ...prev,
        pages: prev.pages.filter(page => page.id !== id),
        folders: updatedFolders,
        favorites: updatedFavorites,
        recentPages: updatedRecent,
      };
    });
    
    // If current page is deleted, set to null or another page
    if (currentPageId === id) {
      const nextPage = workspace.recentPages.find(pageId => pageId !== id);
      setCurrentPageId(nextPage || null);
    }
  };

  const createFolder = (name: string) => {
    const newId = uuidv4();
    
    setWorkspace(prev => ({
      ...prev,
      folders: [
        ...prev.folders,
        {
          id: newId,
          name,
          pages: [],
          createdAt: new Date().toISOString(),
        }
      ],
    }));
    
    return newId;
  };

  const updateFolder = (updatedFolder: Folder) => {
    setWorkspace(prev => ({
      ...prev,
      folders: prev.folders.map(folder => 
        folder.id === updatedFolder.id ? updatedFolder : folder
      ),
    }));
  };

  const deleteFolder = (id: string) => {
    setWorkspace(prev => ({
      ...prev,
      folders: prev.folders.filter(folder => folder.id !== id),
    }));
  };

  const addToFavorites = (pageId: string) => {
    setWorkspace(prev => ({
      ...prev,
      favorites: prev.favorites.includes(pageId) 
        ? prev.favorites 
        : [...prev.favorites, pageId],
    }));
  };

  const removeFromFavorites = (pageId: string) => {
    setWorkspace(prev => ({
      ...prev,
      favorites: prev.favorites.filter(id => id !== pageId),
    }));
  };

  const addBlockToPage = (pageId: string, blockData: Omit<Block, 'id'>) => {
    const blockId = uuidv4();
    
    setWorkspace(prev => ({
      ...prev,
      pages: prev.pages.map(page => {
        if (page.id === pageId) {
          return {
            ...page,
            blocks: [...page.blocks, { id: blockId, ...blockData }],
            updatedAt: new Date().toISOString(),
          };
        }
        return page;
      }),
    }));
    
    return blockId;
  };

  const updateBlock = (pageId: string, updatedBlock: Block) => {
    setWorkspace(prev => ({
      ...prev,
      pages: prev.pages.map(page => {
        if (page.id === pageId) {
          return {
            ...page,
            blocks: page.blocks.map(block => 
              block.id === updatedBlock.id ? updatedBlock : block
            ),
            updatedAt: new Date().toISOString(),
          };
        }
        return page;
      }),
    }));
  };

  const deleteBlock = (pageId: string, blockId: string) => {
    setWorkspace(prev => ({
      ...prev,
      pages: prev.pages.map(page => {
        if (page.id === pageId) {
          return {
            ...page,
            blocks: page.blocks.filter(block => block.id !== blockId),
            updatedAt: new Date().toISOString(),
          };
        }
        return page;
      }),
    }));
  };

  const moveBlockUp = (pageId: string, blockId: string) => {
    setWorkspace(prev => ({
      ...prev,
      pages: prev.pages.map(page => {
        if (page.id === pageId) {
          const blockIndex = page.blocks.findIndex(block => block.id === blockId);
          if (blockIndex <= 0) return page;
          
          const newBlocks = [...page.blocks];
          const temp = newBlocks[blockIndex];
          newBlocks[blockIndex] = newBlocks[blockIndex - 1];
          newBlocks[blockIndex - 1] = temp;
          
          return {
            ...page,
            blocks: newBlocks,
            updatedAt: new Date().toISOString(),
          };
        }
        return page;
      }),
    }));
  };

  const moveBlockDown = (pageId: string, blockId: string) => {
    setWorkspace(prev => ({
      ...prev,
      pages: prev.pages.map(page => {
        if (page.id === pageId) {
          const blockIndex = page.blocks.findIndex(block => block.id === blockId);
          if (blockIndex === -1 || blockIndex >= page.blocks.length - 1) return page;
          
          const newBlocks = [...page.blocks];
          const temp = newBlocks[blockIndex];
          newBlocks[blockIndex] = newBlocks[blockIndex + 1];
          newBlocks[blockIndex + 1] = temp;
          
          return {
            ...page,
            blocks: newBlocks,
            updatedAt: new Date().toISOString(),
          };
        }
        return page;
      }),
    }));
  };

  const value = {
    workspace,
    currentPageId,
    setCurrentPageId,
    getPageById,
    getFolderById,
    createPage,
    updatePage,
    deletePage,
    createFolder,
    updateFolder,
    deleteFolder,
    addToFavorites,
    removeFromFavorites,
    addBlockToPage,
    updateBlock,
    deleteBlock,
    moveBlockUp,
    moveBlockDown,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};