import { ReactNode } from "react";
import "./index.css"; // Importando o CSS

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Popup = ({ isOpen, onClose, children }: PopupProps) => {
    if (!isOpen) return null; // Não renderiza nada se o popup estiver fechado

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="popup-close" onClick={onClose}>×</button>
                {children} {/* Conteúdo do popup */}
            </div>
        </div>
    );
};

export default Popup;
