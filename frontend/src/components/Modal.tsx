type Props = {
  onClose: () => void;
  children: React.ReactNode;
  maxWidthClassName?: string;
  className?: string;
};

export function Modal({ onClose, children, maxWidthClassName = 'max-w-sm', className = '' }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className={`bg-white rounded-2xl p-6 w-full shadow-xl ${maxWidthClassName} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
