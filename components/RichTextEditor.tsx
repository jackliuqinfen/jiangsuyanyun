
import React, { useRef, useEffect } from 'react';
import { Bold, Italic, List, AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Link as LinkIcon, RemoveFormatting, Code } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, className, placeholder }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Sync value to contentEditable div only when value changes externally and is different
  useEffect(() => {
    if (contentRef.current) {
      // Check if the element is currently focused to avoid cursor jumping during typing
      const isFocused = document.activeElement === contentRef.current;
      const currentHTML = contentRef.current.innerHTML;
      
      // Only update DOM if not focused, or if the value is vastly different (e.g. initial load or reset)
      // This prevents the cursor from jumping to the beginning when typing
      if (!isFocused && currentHTML !== value) {
         if (value === '' && currentHTML === '<br>') return;
         contentRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (contentRef.current) {
      onChange(contentRef.current.innerHTML);
    }
  };

  const execCmd = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    handleInput(); // Trigger update immediately
    // Re-focus to keep editing
    if (contentRef.current) contentRef.current.focus();
  };

  const ToolbarButton = ({ icon: Icon, cmd, arg, title }: { icon: any, cmd: string, arg?: string, title?: string }) => (
    <button
      type="button"
      onClick={() => execCmd(cmd, arg)}
      className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
      title={title}
    >
      <Icon size={16} />
    </button>
  );

  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden bg-white flex flex-col ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-100 bg-gray-50/50">
        <ToolbarButton icon={Heading1} cmd="formatBlock" arg="H3" title="标题" />
        <ToolbarButton icon={Heading2} cmd="formatBlock" arg="H4" title="副标题" />
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <ToolbarButton icon={Bold} cmd="bold" title="加粗" />
        <ToolbarButton icon={Italic} cmd="italic" title="斜体" />
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <ToolbarButton icon={List} cmd="insertUnorderedList" title="列表" />
        <ToolbarButton icon={AlignLeft} cmd="justifyLeft" title="左对齐" />
        <ToolbarButton icon={AlignCenter} cmd="justifyCenter" title="居中" />
        <ToolbarButton icon={AlignRight} cmd="justifyRight" title="右对齐" />
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <ToolbarButton icon={LinkIcon} cmd="createLink" arg={prompt('请输入链接地址:') || ''} title="插入链接" />
        <ToolbarButton icon={RemoveFormatting} cmd="removeFormat" title="清除格式" />
      </div>

      {/* Editable Area */}
      <div
        ref={contentRef}
        contentEditable
        onInput={handleInput}
        className="flex-1 p-4 outline-none prose prose-sm max-w-none overflow-y-auto min-h-[300px]"
        style={{ whiteSpace: 'pre-wrap' }} // Preserves structure better
        data-placeholder={placeholder}
      />
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          display: block; /* For Firefox */
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
