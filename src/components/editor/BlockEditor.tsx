
import { useState, useRef, useEffect } from 'react';
import { Block } from '../../types';
import { useWorkspace } from '../../context/WorkspaceContext';
import { cn } from '../../lib/utils';
import { 
  ChevronDown, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Separator } from '../ui/separator';
import { Checkbox } from '../ui/checkbox';

type BlockEditorProps = {
  pageId: string;
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  isFirst: boolean;
  isLast: boolean;
};

export function BlockEditor({ 
  pageId, 
  block, 
  isSelected, 
  onSelect,
  isFirst,
  isLast
}: BlockEditorProps) {
  const { updateBlock, deleteBlock, moveBlockUp, moveBlockDown } = useWorkspace();
  const [content, setContent] = useState(block.content);
  const [showMenu, setShowMenu] = useState(false);
  const [showBlockTypeMenu, setShowBlockTypeMenu] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setContent(block.content);
  }, [block.content]);

  useEffect(() => {
    if (isSelected && contentRef.current) {
      contentRef.current.focus();
    }
  }, [isSelected]);

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.textContent || '';
    setContent(newContent);
    updateBlock(pageId, { ...block, content: newContent });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === '/') {
      e.preventDefault();
      setShowBlockTypeMenu(true);
    }
  };

  const handleBlur = () => {
    updateBlock(pageId, { ...block, content });
  };

  const changeBlockType = (newType: Block['type']) => {
    updateBlock(pageId, { ...block, type: newType });
    setShowBlockTypeMenu(false);
  };

  const handleCheckboxChange = (checked: boolean) => {
    updateBlock(pageId, { ...block, checked });
  };

  const renderBlockContent = () => {
    switch (block.type) {
      case 'paragraph':
        return (
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            className="outline-none py-1 min-h-[1.5em] w-full"
            onInput={handleContentChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={onSelect}
            dir="ltr"
          >
            {content}
          </div>
        );
      case 'heading1':
        return (
          <h1
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            className="outline-none text-3xl font-bold py-1 min-h-[1.5em] w-full"
            onInput={handleContentChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={onSelect}
            dir="ltr"
          >
            {content}
          </h1>
        );
      case 'heading2':
        return (
          <h2
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            className="outline-none text-2xl font-bold py-1 min-h-[1.5em] w-full"
            onInput={handleContentChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={onSelect}
            dir="ltr"
          >
            {content}
          </h2>
        );
      case 'heading3':
        return (
          <h3
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            className="outline-none text-xl font-bold py-1 min-h-[1.5em] w-full"
            onInput={handleContentChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={onSelect}
            dir="ltr"
          >
            {content}
          </h3>
        );
      case 'bulletList':
        return (
          <div className="flex">
            <div className="mr-2 mt-2">•</div>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              className="outline-none py-1 min-h-[1.5em] w-full"
              onInput={handleContentChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onClick={onSelect}
              dir="ltr"
            >
              {content}
            </div>
          </div>
        );
      case 'numberedList':
        return (
          <div className="flex">
            <div className="mr-2 mt-1">1.</div>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              className="outline-none py-1 min-h-[1.5em] w-full"
              onInput={handleContentChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onClick={onSelect}
              dir="ltr"
            >
              {content}
            </div>
          </div>
        );
      case 'todo':
        return (
          <div className="flex items-start gap-2">
            <Checkbox 
              checked={block.checked} 
              onCheckedChange={handleCheckboxChange}
              className="mt-1.5"
            />
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              className={cn(
                "outline-none py-1 min-h-[1.5em] w-full",
                block.checked && "line-through text-muted-foreground"
              )}
              onInput={handleContentChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onClick={onSelect}
              dir="ltr"
            >
              {content}
            </div>
          </div>
        );
      case 'quote':
        return (
          <blockquote className="border-l-4 border-primary-500 pl-4 italic">
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              className="outline-none py-1 min-h-[1.5em] w-full"
              onInput={handleContentChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onClick={onSelect}
              dir="ltr"
            >
              {content}
            </div>
          </blockquote>
        );
      case 'divider':
        return <hr className="my-4" />;
      case 'image':
        return (
          <div className="my-2">
            {block.imageUrl ? (
              <img 
                src={block.imageUrl} 
                alt={content} 
                className="max-w-full rounded-md" 
              />
            ) : (
              <div className="flex items-center justify-center h-32 bg-muted rounded-md">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              className="outline-none py-1 text-sm text-center text-muted-foreground"
              onInput={handleContentChange}
              onBlur={handleBlur}
              onClick={onSelect}
              dir="ltr"
            >
              {content || 'Add caption...'}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={cn(
        "group relative flex items-start gap-2 px-2 py-1 rounded-md transition-colors",
        isSelected && "bg-accent/30"
      )}
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      <div className={cn(
        "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full opacity-0 transition-opacity",
        (showMenu || isSelected) && "opacity-100"
      )}>
        <Popover open={showBlockTypeMenu} onOpenChange={setShowBlockTypeMenu}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="start">
            <div className="space-y-1">
              <h3 className="font-medium text-sm">Basic blocks</h3>
              <Separator />
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => changeBlockType('paragraph')}
              >
                <span className="mr-2">¶</span> Text
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => changeBlockType('heading1')}
              >
                <span className="mr-2 font-bold">H1</span> Heading 1
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => changeBlockType('heading2')}
              >
                <span className="mr-2 font-bold">H2</span> Heading 2
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => changeBlockType('heading3')}
              >
                <span className="mr-2 font-bold">H3</span> Heading 3
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => changeBlockType('bulletList')}
              >
                <span className="mr-2">•</span> Bullet List
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => changeBlockType('numberedList')}
              >
                <span className="mr-2">1.</span> Numbered List
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => changeBlockType('todo')}
              >
                <Check className="mr-2 h-4 w-4" /> To-do
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => changeBlockType('quote')}
              >
                <span className="mr-2">"</span> Quote
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => changeBlockType('divider')}
              >
                <span className="mr-2">—</span> Divider
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => changeBlockType('image')}
              >
                <ImageIcon className="mr-2 h-4 w-4" /> Image
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex-1">
        {renderBlockContent()}
      </div>
      
      <div className={cn(
        "absolute right-0 top-1/2 -translate-y-1/2 translate-x-full opacity-0 transition-opacity flex gap-1",
        (showMenu || isSelected) && "opacity-100"
      )}>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          disabled={isFirst}
          onClick={() => moveBlockUp(pageId, block.id)}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          disabled={isLast}
          onClick={() => moveBlockDown(pageId, block.id)}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 text-destructive hover:text-destructive"
          onClick={() => deleteBlock(pageId, block.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}