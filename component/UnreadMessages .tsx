import React, { createContext, useContext, useState } from 'react';

export const UnreadMessagesContext = createContext(0);

export const useUnreadMessages = () => {
    const context = useContext(UnreadMessagesContext);
    if (!context) {
        throw new Error('useUnreadMessages must be used within an UnreadMessagesProvider');
    }
    return context;
};

export const UnreadMessagesProvider = ({ children }: any) => {
    const [unreadMessages, setUnreadMessages] = useState(0);

    return (
        <UnreadMessagesContext.Provider value={{ unreadMessages, setUnreadMessages }}>
            {children}
        </UnreadMessagesContext.Provider>
    );
};