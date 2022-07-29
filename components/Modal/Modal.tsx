interface IModalProps {
  isOpen: boolean;
  children?: React.ReactNode;
  onClose?: () => void;
}

import ReactDOM from 'react-dom';

const Modal = ({ children, onClose, isOpen }: IModalProps) => {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <>
      <div
        className="fixed top-0 left-0 h-screen w-screen overflow-y-hidden bg-black/90"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-y-hidden rounded-md bg-neutral-800 p-4 text-white">
        {children}
      </div>
    </>,
    document.body
  );
};

export { Modal };
