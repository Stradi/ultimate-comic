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
        className="overflow-y-hidden fixed top-0 left-0 w-screen h-screen bg-black/90"
        onClick={onClose}
      />
      <div className="overflow-y-hidden fixed top-1/2 left-1/2 p-4 text-white bg-neutral-800 rounded-md -translate-x-1/2 -translate-y-1/2">
        {children}
      </div>
    </>,
    document.body
  );
};

export { Modal };
