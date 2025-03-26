import React, {ReactNode, useState} from 'react';
import styled from 'styled-components';
import {AnimatePresence} from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';
import useAuthStore from '@/store/authStore';
import {fadeIn} from '@/styles/animations';

interface LayoutProps {
    children: ReactNode;
    showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({children, showSidebar = true}) => {
    const {isAuthenticated} = useAuthStore();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const toggleMobileSidebar = () => {
        setMobileSidebarOpen(!mobileSidebarOpen);
    };

    const closeMobileSidebar = () => {
        setMobileSidebarOpen(false);
    };

    return (
        <LayoutContainer className={showSidebar ? 'with-sidebar' : ''}>
            <Header onToggleSidebar={toggleMobileSidebar}/>

            <MainContent>
                {isAuthenticated && showSidebar && (
                    <>
                        {/* Desktop Sidebar */}
                        <DesktopSidebar>
                            <Sidebar/>
                        </DesktopSidebar>

                        {/* Mobile Sidebar */}
                        <AnimatePresence>
                            <MobileSidebar>
                                <Sidebar
                                    isMobileOpen={mobileSidebarOpen}
                                    onMobileClose={closeMobileSidebar}
                                />
                            </MobileSidebar>
                        </AnimatePresence>
                    </>
                )}

                <ContentArea className={`${isAuthenticated && showSidebar ? 'with-sidebar' : ''}`}>
                    {children}
                </ContentArea>
            </MainContent>
        </LayoutContainer>
    );
};

const LayoutContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: ${({theme}) => theme.colors.background};
`;

const MainContent = styled.main`
    display: flex;
    flex: 1;
    position: relative;
`;

const DesktopSidebar = styled.div`
    display: block;
    width: 250px;
    animation: ${fadeIn} 0.3s ease;

    @media (max-width: 991px) {
        display: none;
    }
`;

const MobileSidebar = styled.div`
    display: none;

    @media (max-width: 991px) {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 990;
        pointer-events: none;

        & > * {
            pointer-events: auto;
        }
    }
`;

const ContentArea = styled.div`
    flex: 1;
    padding: 20px;
    transition: margin-left 0.3s ease;
    overflow-x: hidden;
    animation: ${fadeIn} 0.3s ease;

    &.with-sidebar {
        @media (min-width: 992px) {
            margin-left: 0;
        }
    }
`;

export default Layout; 