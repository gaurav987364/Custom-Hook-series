import React from 'react';

interface Props {
    ref: React.RefObject<HTMLDivElement | null> | null,
    onOutsideClick: (event: React.MouseEvent<HTMLDivElement>) => void,
};

export const useOutsideClick :React.FC<Props> = ({
    ref,
    onOutsideClick,
}) => {
    React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (ref?.current &&!ref?.current.contains(event.target as Node)) {
            onOutsideClick(event as unknown as React.MouseEvent<HTMLDivElement>);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
    }, [ref, onOutsideClick]);
    return null; 
};
