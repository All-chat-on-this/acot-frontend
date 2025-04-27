import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {Link, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {AnimatePresence, motion} from 'framer-motion';
import useAuthStore from '@/store/authStore';
import useTheme from '@/hooks/useTheme';
import {FiCheck, FiChevronDown, FiLogOut, FiMenu, FiMoon, FiServer, FiSun, FiUser} from 'react-icons/fi';
import LanguageSwitch from '../LanguageSwitch';
import {colorTransition} from '@/styles/animations';
import useConfigStore from '@/store/configStore';

interface HeaderProps {
    onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({onToggleSidebar}) => {
    const {t} = useTranslation();
    const {user, isAuthenticated, logout} = useAuthStore();
    const {currentTheme, toggleLightDark, toggleDreamlikeColor} = useTheme();
    const {configs, currentConfig, fetchConfigs, setCurrentConfig} = useConfigStore();
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    const [configDropdownOpen, setConfigDropdownOpen] = useState(false);
    const configDropdownRef = useRef<HTMLDivElement>(null);

    // Fetch configs if not present
    useEffect(() => {
        fetchConfigs();
    }, [fetchConfigs]);

    // Close config dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (configDropdownRef.current && !configDropdownRef.current.contains(event.target as Node)) {
                setConfigDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleConfigSelect = (configId: number) => {
        const config = configs.find(c => c.id === configId);
        if (config) {
            setCurrentConfig(config);
        }
        setConfigDropdownOpen(false);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const toggleUserMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const isLightTheme = currentTheme === 'light' || currentTheme === 'dreamlikeColorLight';
    const isDreamlikeColor = currentTheme === 'dreamlikeColorLight' || currentTheme === 'dreamlikeColorDark';

    return (
        <HeaderContainer>
            <HeaderContent className={isDreamlikeColor ? 'glass-effect' : ''}>
                <LogoContainer>
                    <MenuButton
                        onClick={onToggleSidebar}
                        whileHover={{scale: 1.1}}
                        whileTap={{scale: 0.9}}
                        className="sidebar-toggle"
                    >
                        <FiMenu size={24}/>
                    </MenuButton>
                    <Logo
                        to="/"
                        whileHover={{
                            scale: 1.05,
                            color: isLightTheme
                                ? 'rgba(24, 144, 255, 0.8)'
                                : 'rgba(24, 144, 255, 1)'
                        }}
                        whileTap={{scale: 0.95}}
                    >
                        {t('app_name')}
                    </Logo>
                </LogoContainer>

                <HeaderControls>
                    {/* Config Dropdown */}
                    {configs.length > 0 && (
                        <ConfigSwitchContainer ref={configDropdownRef}>
                            <ConfigButton
                                onClick={() => setConfigDropdownOpen(!configDropdownOpen)}
                                aria-expanded={configDropdownOpen}
                                animate={{
                                    backgroundColor: configDropdownOpen ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0)',
                                    transition: {duration: 0.2}
                                }}
                                whileHover={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    transition: {duration: 0.2}
                                }}
                                whileTap={{scale: 0.97}}
                            >
                                <div className="config-info">
                                    <FiServer size={16}/>
                                    {currentConfig && (
                                        <>
                                            <ConfigNameText>{currentConfig.name}</ConfigNameText>
                                            <StatusDot available={currentConfig.isAvailable}/>
                                        </>
                                    )}
                                </div>
                                <ChevronIcon $isOpen={configDropdownOpen}>
                                    <FiChevronDown size={16}/>
                                </ChevronIcon>
                            </ConfigButton>

                            <AnimatePresence>
                                {configDropdownOpen && (
                                    <ConfigDropdownMenu
                                        initial={{opacity: 0, y: -10}}
                                        animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0, y: -10}}
                                        transition={{duration: 0.2}}
                                    >
                                        {configs.map(config => (
                                            <ConfigOption
                                                key={config.id}
                                                onClick={() => handleConfigSelect(config.id)}
                                                $isActive={currentConfig?.id === config.id}
                                                whileHover={{backgroundColor: 'rgba(255, 255, 255, 0.07)'}}
                                                whileTap={{scale: 0.98}}
                                            >
                                                <div className="config-option-content">
                                                    <span className="config-name">{config.name}</span>
                                                    <StatusDot available={config.isAvailable}/>
                                                </div>
                                                {currentConfig?.id === config.id && (
                                                    <CheckIcon>
                                                        <FiCheck size={16}/>
                                                    </CheckIcon>
                                                )}
                                            </ConfigOption>
                                        ))}
                                        <AddConfigOption
                                            onClick={() => {
                                                navigate('/config');
                                                setConfigDropdownOpen(false);
                                            }}
                                            whileHover={{backgroundColor: 'rgba(255, 255, 255, 0.07)'}}
                                            whileTap={{scale: 0.98}}
                                        >
                                            {t('manage_configs')}
                                        </AddConfigOption>
                                    </ConfigDropdownMenu>
                                )}
                            </AnimatePresence>
                        </ConfigSwitchContainer>
                    )}

                    {/* Language Switch */}
                    <LanguageSwitch/>

                    {/* Theme Controls */}
                    <ThemeControls>
                        <ThemeButton
                            onClick={toggleLightDark}
                            title={isLightTheme ? t('switch_dark_mode') : t('switch_light_mode')}
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.9}}
                        >
                            {isLightTheme ? <FiMoon size={20}/> : <FiSun size={20}/>}
                        </ThemeButton>
                        <ThemeButton
                            onClick={toggleDreamlikeColor}
                            title={isDreamlikeColor ? t('switch_standard_theme') : t('switch_dreamlikeColor_theme')}
                            className={isDreamlikeColor ? 'active' : ''}
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.9}}
                        >
                            {t('dreamlikeColor')}
                        </ThemeButton>
                    </ThemeControls>

                    {/* User Menu */}
                    {isAuthenticated ? (
                        <UserMenuContainer>
                            <UserButton
                                onClick={toggleUserMenu}
                                whileHover={{backgroundColor: 'rgba(255, 255, 255, 0.1)'}}
                                whileTap={{scale: 0.97}}
                            >
                                <UserAvatar>
                                    {user?.nickname?.[0] || user?.username?.[0] || 'U'}
                                </UserAvatar>
                                <span>{user?.nickname || user?.username}</span>
                            </UserButton>

                            <UserMenu className={menuOpen ? 'open' : ''}>
                                <UserMenuItem
                                    to="/profile"
                                    onClick={() => setMenuOpen(false)}
                                    whileHover={{backgroundColor: 'rgba(24, 144, 255, 0.1)'}}
                                >
                                    <FiUser size={16}/>
                                    <span>{t('profile')}</span>
                                </UserMenuItem>
                                <UserMenuButton
                                    onClick={handleLogout}
                                    whileHover={{backgroundColor: 'rgba(255, 100, 100, 0.1)', color: '#e53935'}}
                                >
                                    <FiLogOut size={16}/>
                                    <span>{t('logout')}</span>
                                </UserMenuButton>
                            </UserMenu>
                        </UserMenuContainer>
                    ) : (
                        <LoginButton
                            onClick={() => navigate('/login')}
                            whileHover={{scale: 1.05, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'}}
                            whileTap={{scale: 0.95}}
                        >
                            {t('login')}
                        </LoginButton>
                    )}
                </HeaderControls>
            </HeaderContent>
        </HeaderContainer>
    );
};

const HeaderContainer = styled.header`
    position: sticky;
    top: 0;
    z-index: 1000;
    width: 100%;
`;

const HeaderContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 60px;
    background-color: ${({theme}) => theme.colors.card};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: ${colorTransition};

    &.glass-effect {
        background-color: transparent;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-bottom: 1px solid ${({theme}) => theme.colors.border};
    }
`;

const LogoContainer = styled.div`
    display: flex;
    align-items: center;
`;

const Logo = styled(motion(Link))`
    font-size: 1.5rem;
    font-weight: bold;
    color: ${({theme}) => theme.colors.primary};
    text-decoration: none;
    transition: ${colorTransition};
`;

const MenuButton = styled(motion.button)`
    display: flex;
    background: none;
    border: none;
    color: ${({theme}) => theme.colors.text};
    margin-right: 10px;
    cursor: pointer;
    padding: 5px;
    border-radius: ${({theme}) => theme.borderRadius};

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
`;

const HeaderControls = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
`;

const ThemeControls = styled.div`
    display: flex;
    align-items: center;
`;

const ThemeButton = styled(motion.button)`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: ${({theme}) => theme.borderRadius};
    color: ${({theme}) => theme.colors.text};
    padding: 5px 10px;
    margin-left: 10px;
    cursor: pointer;
    transition: ${colorTransition};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 140px;

    @media (max-width: 768px) {
        max-width: 100px;
    }

    @media (max-width: 576px) {
        max-width: 80px;
        font-size: 0.8rem;
        padding: 5px 8px;
    }

    &.active {
        background-color: ${({theme}) => theme.colors.primary};
        color: ${({theme}) => theme.colors.buttonText};
    }
`;

const UserMenuContainer = styled.div`
    position: relative;
`;

const UserAvatar = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: ${({theme}) => theme.colors.primary};
    color: ${({theme}) => theme.colors.buttonText};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1rem;
    margin-right: 10px;

    @media (max-width: 576px) {
        margin-right: 0;
    }
`;

const UserButton = styled(motion.button)`
    display: flex;
    align-items: center;
    background: none;
    border: none;
    color: ${({theme}) => theme.colors.text};
    cursor: pointer;
    padding: 5px 10px;
    border-radius: ${({theme}) => theme.borderRadius};
    transition: ${colorTransition};

    span {
        @media (max-width: 576px) {
            display: none;
        }
    }
`;

const UserMenu = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    width: 210px;
    background-color: ${({theme}) => theme.colors.card};
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: ${({theme}) => theme.borderRadius};
    padding: 8px 0;
    margin-top: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    transition: all 0.2s ease;
    z-index: 1001;

    &.open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }

    &::before {
        content: '';
        position: absolute;
        top: -6px;
        right: 24px;
        width: 12px;
        height: 12px;
        background-color: ${({theme}) => theme.colors.card};
        border-left: 1px solid ${({theme}) => theme.colors.border};
        border-top: 1px solid ${({theme}) => theme.colors.border};
        transform: rotate(45deg);
    }
`;

const UserMenuItem = styled(motion(Link))`
    display: flex;
    align-items: center;
    padding: 10px 16px;
    color: ${({theme}) => theme.colors.text};
    text-decoration: none;
    transition: ${colorTransition};

    span {
        margin-left: 12px;
        font-size: 16px;
    }
`;

const UserMenuButton = styled(motion.button)`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px 16px;
    background: none;
    border: none;
    color: ${({theme}) => theme.colors.text};
    cursor: pointer;
    text-align: left;
    transition: ${colorTransition};

    span {
        margin-left: 12px;
        font-size: 16px;
    }
`;

const LoginButton = styled(motion.button)`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 13px;
    background-color: ${({theme}) => theme.colors.primary};
    color: ${({theme}) => theme.colors.buttonText};
    border-radius: ${({theme}) => theme.borderRadius};
    text-decoration: none;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: ${colorTransition};
`;

const ConfigSwitchContainer = styled.div`
    position: relative;
`;

const ConfigButton = styled(motion.button)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: none;
    border: 1px solid ${({theme}) => theme.colors.border};
    color: ${({theme}) => theme.colors.text};
    cursor: pointer;
    padding: 6px 12px;
    border-radius: ${({theme}) => theme.borderRadius};
    transition: ${colorTransition};
    margin-right: 5px;

    .config-info {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        border-color: ${({theme}) => theme.colors.primary};
    }

    @media (max-width: 768px) {
        padding: 4px 8px;
    }
`;

const ConfigDropdownMenu = styled(motion.div)`
    position: absolute;
    top: 100%;
    right: 0;
    width: 220px;
    background-color: ${({theme}) => theme.colors.card};
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: ${({theme}) => theme.borderRadius};
    padding: 8px 0;
    margin-top: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1001;

    &::before {
        content: '';
        position: absolute;
        top: -6px;
        right: 24px;
        width: 12px;
        height: 12px;
        background-color: ${({theme}) => theme.colors.card};
        border-left: 1px solid ${({theme}) => theme.colors.border};
        border-top: 1px solid ${({theme}) => theme.colors.border};
        transform: rotate(45deg);
    }
`;

interface ConfigOptionProps {
    $isActive: boolean;
}

const ConfigOption = styled(motion.button)<ConfigOptionProps>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 16px;
    background: none;
    border: none;
    color: ${({theme}) => theme.colors.text};
    cursor: pointer;
    text-align: left;
    transition: ${colorTransition};
    background-color: ${props => props.$isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent'};

    .config-option-content {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    &:not(:last-child) {
        border-bottom: 1px solid ${({theme}) => theme.colors.border}20;
    }
`;

const CheckIcon = styled.div`
    color: ${({theme}) => theme.colors.success};
`;

const AddConfigOption = styled(motion.button)`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px 16px;
    background: none;
    border: none;
    color: ${({theme}) => theme.colors.text};
    cursor: pointer;
    text-align: left;
    transition: ${colorTransition};
    border-top: 1px solid ${({theme}) => theme.colors.border}40;
    margin-top: 4px;
    font-weight: 500;
`;

const ConfigNameText = styled.span`
    font-size: 14px;
    font-weight: 500;
    color: ${({theme}) => theme.colors.primary};
`;

const StatusDot = styled.span<{ available: boolean }>`
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({available, theme}) =>
            available ? theme.colors.success || '#4caf50' : theme.colors.error || '#f44336'};
    margin-left: 4px;
`;

const ChevronIcon = styled.div<{ $isOpen: boolean }>`
    transition: transform 0.2s ease;
    transform: ${({$isOpen}) => $isOpen ? 'rotate(180deg)' : 'rotate(0)'};
    display: flex;
    align-items: center;
    margin-left: 8px;
`;

export default Header; 