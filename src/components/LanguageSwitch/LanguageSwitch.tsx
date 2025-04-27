import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {useTranslation} from 'react-i18next';
import {FiCheck, FiChevronDown, FiGlobe} from 'react-icons/fi';
import {AnimatePresence, motion} from 'framer-motion';
import {colorTransition, fadeIn} from '@/styles/animations';
import usePreferenceStore from '@/store/preferenceStore';

interface Language {
    code: string;
    name: string;
    nativeName: string;
    flag?: string;
}

const languages: Language[] = [
    {code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸'},
    {code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳'},
    // Add more languages as needed
];

const LanguageSwitch: React.FC = () => {
    const {i18n} = useTranslation();
    const {updateLanguage} = usePreferenceStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    const changeLanguage = async (lng: string) => {
        i18n.changeLanguage(lng);
        // Save to localStorage for immediate effect
        localStorage.setItem('acot-language', lng);
        // Also update in backend through preference store
        await updateLanguage(lng);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <LanguageSwitchContainer ref={dropdownRef}>
            <LanguageButton
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                animate={{
                    backgroundColor: isOpen ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0)',
                    transition: {duration: 0.2}
                }}
                whileHover={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transition: {duration: 0.2}
                }}
                whileTap={{scale: 0.97}}
            >
                <div className="language-info">
                    <Globe><FiGlobe size={16}/></Globe>
                    <span>{currentLanguage.flag}</span>
                    <LanguageText>{currentLanguage.nativeName}</LanguageText>
                </div>
                <ChevronIcon $isOpen={isOpen}>
                    <FiChevronDown size={16}/>
                </ChevronIcon>
            </LanguageButton>

            <AnimatePresence>
                {isOpen && (
                    <DropdownMenu
                        initial={{opacity: 0, y: -10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -10}}
                        transition={{duration: 0.2}}
                    >
                        {languages.map(language => (
                            <LanguageOption
                                key={language.code}
                                onClick={() => changeLanguage(language.code)}
                                $isActive={i18n.language === language.code}
                                whileHover={{backgroundColor: 'rgba(255, 255, 255, 0.07)'}}
                                whileTap={{scale: 0.98}}
                            >
                                <div className="lang-option-content">
                                    <span className="flag">{language.flag}</span>
                                    <span className="lang-name">{language.nativeName}</span>
                                    <span className="lang-native-name">
                    {language.name !== language.nativeName && `(${language.name})`}
                  </span>
                                </div>
                                {i18n.language === language.code && (
                                    <CheckIcon>
                                        <FiCheck size={16}/>
                                    </CheckIcon>
                                )}
                            </LanguageOption>
                        ))}
                    </DropdownMenu>
                )}
            </AnimatePresence>
        </LanguageSwitchContainer>
    );
};

const LanguageSwitchContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

const Globe = styled.span`
    display: flex;
    align-items: center;
    margin-right: 6px;
    color: ${({theme}) => theme.colors.text};
`;

const LanguageButton = styled(motion.button)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 12px;
    background: transparent;
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: ${({theme}) => theme.borderRadius};
    color: ${({theme}) => theme.colors.text};
    cursor: pointer;
    width: 100%;
    transition: ${colorTransition};

    .language-info {
        display: flex;
        align-items: center;
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px ${({theme}) => theme.colors.primary}40;
    }
`;

const LanguageText = styled.span`
    margin-left: 6px;
    font-size: 0.9rem;

    @media (max-width: 576px) {
        display: none;
    }
`;

const ChevronIcon = styled.span<{ $isOpen: boolean }>`
    display: flex;
    align-items: center;
    margin-left: 8px;
    transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
    transition: transform 0.2s ease;
`;

const DropdownMenu = styled(motion.div)`
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    width: max-content;
    min-width: 100%;
    background-color: ${({theme}) => theme.colors.card};
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: ${({theme}) => theme.borderRadius};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    z-index: 100;
`;

const LanguageOption = styled(motion.div)<{ $isActive: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    cursor: pointer;
    transition: ${colorTransition};
    background-color: ${props => props.$isActive ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0)'};

    .lang-option-content {
        display: flex;
        align-items: center;
    }

    .flag {
        margin-right: 8px;
    }

    .lang-native-name {
        margin-left: 6px;
        opacity: 0.7;
        font-size: 0.85rem;
    }

    &:not(:last-child) {
        border-bottom: 1px solid ${({theme}) => theme.colors.border}40;
    }
`;

const CheckIcon = styled.span`
    display: flex;
    align-items: center;
    color: ${({theme}) => theme.colors.primary};
    animation: ${fadeIn} 0.2s ease;
`;

export default LanguageSwitch; 
