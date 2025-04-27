import React, {ReactNode, useState} from 'react';
import styled from 'styled-components';
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
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        const isMobile = window.innerWidth < 992;
        if (isMobile) {
            setMobileSidebarOpen(!mobileSidebarOpen);
        } else {
            setSidebarOpen(!sidebarOpen);
        }
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const closeMobileSidebar = () => {
        setMobileSidebarOpen(false);
    };

    return (
        <LayoutContainer className={showSidebar ? 'with-sidebar' : ''}>
            <Header onToggleSidebar={toggleSidebar}/>

            <MainContent>
                {isAuthenticated && showSidebar && (
                    <SidebarWrapper style={{width: sidebarOpen ? '270px' : '0'}}>
                        <Sidebar
                            isOpen={sidebarOpen}
                            isMobileOpen={mobileSidebarOpen}
                            onClose={closeSidebar}
                            onMobileClose={closeMobileSidebar}
                        />
                    </SidebarWrapper>
                )}

                <ContentArea
                    className={`${isAuthenticated && showSidebar ? 'with-sidebar' : ''} ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
                >
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

const SidebarWrapper = styled.div`
    width: 270px;
    animation: ${fadeIn} 0.3s ease;

    @media (max-width: 991px) {
        width: 0;
    }
`;

const ContentArea = styled.div`
    flex: 1;
    padding: 20px;
    transition: margin-left 0.3s ease;
    overflow-x: hidden;
    animation: ${fadeIn} 0.3s ease;
    position: relative;

    &.with-sidebar {
        @media (min-width: 992px) {
            margin-left: 0;
        }
    }
`;

export default Layout; 