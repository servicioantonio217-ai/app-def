import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
    const interactiveClasses = onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : '';
    
    return (
        <div 
            className={`bg-brand-gray-dark rounded-2xl shadow-md overflow-hidden transition-all duration-300 border border-transparent ${interactiveClasses} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;