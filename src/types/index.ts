
export type Block = {
  id: string;
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'bulletList' | 'numberedList' | 'todo' | 'quote' | 'divider' | 'image';
  content: string;
  checked?: boolean;
  imageUrl?: string;
};

export type Page = {
  id: string;
  title: string;
  emoji?: string;
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
};

export type Folder = {
  id: string;
  name: string;
  pages: string[]; // Page IDs
  createdAt: string;
};

export type Workspace = {
  folders: Folder[];
  pages: Page[];
  recentPages: string[]; // Page IDs
  favorites: string[]; // Page IDs
};