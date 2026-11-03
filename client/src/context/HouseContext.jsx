import { createContext, useContext, useState, useEffect } from 'react';

export const HOUSES = {
  gryffindor: {
    name: 'Gryffindor', animal: '🦁', traits: 'Bravery · Nerve · Chivalry',
    primary: '#ae0001', secondary: '#d4000a', accent: '#eeba30', accent2: '#ffd700',
    bg: '#1a0000', bg2: '#240500', bg3: '#300a00', bg4: '#3d1200',
    border: '#6b1a00', border2: '#a02800',
    glow: 'rgba(174,0,1,0.35)', glowAccent: 'rgba(238,186,48,0.25)',
    textPrimary:   '#ffffff',
    textSecondary: '#ffd080',
    textDim:       '#ffaa50',
    gradient: 'linear-gradient(135deg, #7a0000 0%, #ae0001 45%, #eeba30 100%)',
    gradientBg: 'radial-gradient(ellipse at 0% 0%, rgba(174,0,1,0.55) 0%, transparent 50%), radial-gradient(ellipse at 100% 0%, rgba(238,186,48,0.35) 0%, transparent 45%), radial-gradient(ellipse at 50% 100%, rgba(120,0,0,0.4) 0%, transparent 55%), radial-gradient(ellipse at 50% 50%, rgba(60,10,0,1) 0%, transparent 100%)',
    shimmer: 'linear-gradient(90deg, transparent, rgba(238,186,48,0.2), transparent)',
    cardGlow: '0 0 30px rgba(174,0,1,0.4), 0 0 60px rgba(238,186,48,0.15)',
  },
  slytherin: {
    name: 'Slytherin', animal: '🐍', traits: 'Ambition · Cunning · Leadership',
    primary: '#1a7a40', secondary: '#0d6030', accent: '#c0c0c0', accent2: '#e0e0e0',
    bg: '#000f08', bg2: '#001a0e', bg3: '#002818', bg4: '#003820',
    border: '#005530', border2: '#008048',
    glow: 'rgba(26,122,64,0.35)', glowAccent: 'rgba(192,192,192,0.2)',
    textPrimary:   '#ffffff',
    textSecondary: '#80ffb0',
    textDim:       '#50e080',
    gradient: 'linear-gradient(135deg, #003820 0%, #1a7a40 50%, #c0c0c0 100%)',
    gradientBg: 'radial-gradient(ellipse at 0% 100%, rgba(26,122,64,0.6) 0%, transparent 50%), radial-gradient(ellipse at 100% 0%, rgba(192,192,192,0.2) 0%, transparent 45%), radial-gradient(ellipse at 50% 50%, rgba(0,30,15,1) 0%, transparent 100%), radial-gradient(ellipse at 80% 80%, rgba(0,80,40,0.3) 0%, transparent 40%)',
    shimmer: 'linear-gradient(90deg, transparent, rgba(192,192,192,0.15), transparent)',
    cardGlow: '0 0 30px rgba(26,122,64,0.4), 0 0 60px rgba(192,192,192,0.1)',
  },
  ravenclaw: {
    name: 'Ravenclaw', animal: '🦅', traits: 'Wisdom · Wit · Learning',
    primary: '#1a3a9a', secondary: '#2a50c0', accent: '#b8860b', accent2: '#ffe066',
    bg: '#00020f', bg2: '#00051a', bg3: '#000a2a', bg4: '#001040',
    border: '#001870', border2: '#0028a0',
    glow: 'rgba(26,58,154,0.4)', glowAccent: 'rgba(255,224,102,0.25)',
    textPrimary:   '#ffffff',
    textSecondary: '#b8d4ff',
    textDim:       '#7090e0',
    gradient: 'linear-gradient(135deg, #0a1060 0%, #1a3a9a 50%, #ffe066 100%)',
    gradientBg: 'radial-gradient(ellipse at 50% 0%, rgba(26,58,154,0.7) 0%, transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(255,224,102,0.2) 0%, transparent 45%), radial-gradient(ellipse at 0% 100%, rgba(10,16,96,0.5) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(0,2,20,1) 0%, transparent 100%)',
    shimmer: 'linear-gradient(90deg, transparent, rgba(255,224,102,0.2), transparent)',
    cardGlow: '0 0 30px rgba(26,58,154,0.5), 0 0 60px rgba(255,224,102,0.15)',
  },
  hufflepuff: {
    name: 'Hufflepuff', animal: '🦡', traits: 'Loyalty · Patience · Hard Work',
    primary: '#d4a000', secondary: '#f0c000', accent: '#2a2a2a', accent2: '#f5d060',
    bg: '#0f0a00', bg2: '#1a1000', bg3: '#261800', bg4: '#342200',
    border: '#5a3c00', border2: '#8a5c00',
    glow: 'rgba(212,160,0,0.35)', glowAccent: 'rgba(240,192,0,0.3)',
    textPrimary:   '#ffffff',
    textSecondary: '#ffe080',
    textDim:       '#ffc030',
    gradient: 'linear-gradient(135deg, #8a5c00 0%, #d4a000 50%, #f0c000 100%)',
    gradientBg: 'radial-gradient(ellipse at 100% 0%, rgba(240,192,0,0.45) 0%, transparent 50%), radial-gradient(ellipse at 0% 100%, rgba(212,160,0,0.35) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(26,16,0,1) 0%, transparent 100%), radial-gradient(ellipse at 50% 0%, rgba(180,120,0,0.25) 0%, transparent 40%)',
    shimmer: 'linear-gradient(90deg, transparent, rgba(240,192,0,0.25), transparent)',
    cardGlow: '0 0 30px rgba(212,160,0,0.4), 0 0 60px rgba(240,192,0,0.2)',
  },
};

const HouseContext = createContext(null);

export const HouseProvider = ({ children }) => {
  const [house, setHouseState] = useState(() => {
    // For new users (no house selected), return null to force house selection
    return localStorage.getItem('ss_house') || null;
  });

  const setHouse = (h) => { localStorage.setItem('ss_house', h); setHouseState(h); };
  const clearHouse = () => { localStorage.removeItem('ss_house'); setHouseState(null); };
  const theme = house ? HOUSES[house] : null;

  useEffect(() => {
    if (!theme) return;
    const r = document.documentElement;
    r.style.setProperty('--primary',     theme.primary);
    r.style.setProperty('--primary2',    theme.secondary);
    r.style.setProperty('--accent',      theme.accent);
    r.style.setProperty('--accent2',     theme.accent2);
    r.style.setProperty('--bg',          theme.bg);
    r.style.setProperty('--bg2',         theme.bg2);
    r.style.setProperty('--bg3',         theme.bg3);
    r.style.setProperty('--bg4',         theme.bg4);
    r.style.setProperty('--border',      theme.border);
    r.style.setProperty('--border2',     theme.border2);
    r.style.setProperty('--glow',        theme.glow);
    r.style.setProperty('--glow-accent', theme.glowAccent);
    r.style.setProperty('--text',        theme.textPrimary);
    r.style.setProperty('--text2',       theme.textSecondary);
    r.style.setProperty('--text3',       theme.textDim);
    r.style.setProperty('--gradient',    theme.gradient);
    r.style.setProperty('--shimmer',     theme.shimmer);
    r.style.setProperty('--card-glow',   theme.cardGlow);
  }, [house]);

  return (
    <HouseContext.Provider value={{ house, setHouse, clearHouse, theme, HOUSES }}>
      {children}
    </HouseContext.Provider>
  );
};

export const useHouse = () => useContext(HouseContext);
