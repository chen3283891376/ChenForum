import type { PaletteMode } from '@mui/material';

const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                  primary: { main: '#42a5f5' },
                  secondary: { main: '#7e57c2' },
                  background: {
                      default: '#f0f7ff',
                      paper: 'rgba(255, 255, 255, 0.9)',
                  },
                  text: {
                      primary: '#1a1a1a',
                      secondary: '#595959',
                  },
                  divider: 'rgba(220, 220, 220, 0.6)',
              }
            : {
                  primary: { main: '#64b5f6' },
                  secondary: { main: '#ba68c8' },
                  background: {
                      default: '#121212',
                      paper: 'rgba(28, 28, 28, 0.9)',
                  },
                  text: {
                      primary: '#f5f5f5',
                      secondary: '#9e9e9e',
                  },
                  divider: 'rgba(50, 50, 50, 0.6)',
              }),
    },
    typography: {
        fontFamily: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'].join(','),
        h5: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        body1: {
            lineHeight: 1.6,
        },
        button: {
            lineHeight: 1.5,
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backdropFilter: 'blur(24px)',
                    backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(20, 20, 20, 0.85)',
                    borderBottom:
                        mode === 'light' ? '1px solid rgba(220, 220, 220, 0.5)' : '1px solid rgba(50, 50, 50, 0.5)',
                    boxShadow: mode === 'light' ? '0 2px 8px rgba(0, 0, 0, 0.05)' : '0 2px 8px rgba(0, 0, 0, 0.2)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none' as const,
                    fontWeight: 600,
                    borderRadius: '8px',
                    // 按钮基础样式 - 根据模式区分
                    backgroundColor: mode === 'light' ? '#ffffff' : '#2d2d2d',
                    color: mode === 'light' ? '#1a1a1a' : '#f5f5f5',
                    border: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #3d3d3d',

                    boxShadow: mode === 'light' ? '0 4px 6px rgba(0, 0, 0, 0.08)' : '0 4px 6px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

                    // 悬停状态 - 增强暗色模式差异
                    '&:hover': {
                        transform: 'scale(1.03)',
                        backgroundColor: mode === 'light' ? '#f5f5f5' : '#383838',
                        boxShadow:
                            mode === 'light' ? '0 6px 12px rgba(0, 0, 0, 0.12)' : '0 6px 12px rgba(0, 0, 0, 0.4)',
                        borderColor: mode === 'light' ? '#d0d0d0' : '#484848',
                    },

                    // 点击状态
                    '&:active': {
                        transform: 'scale(0.99)',
                        backgroundColor: mode === 'light' ? '#eaeaea' : '#333333',
                    },

                    // 禁用状态
                    '&:disabled': {
                        backgroundColor: mode === 'light' ? '#f0f0f0' : '#2a2a2a',
                        color: mode === 'light' ? '#9e9e9e' : '#6e6e6e',
                        borderColor: mode === 'light' ? '#e0e0e0' : '#3a3a3a',
                        boxShadow: 'none',
                        transform: 'none',
                    },
                },
                // 突出显示的按钮变体
                containedPrimary: {
                    background: getButtonGradient({ mode }),
                    color: '#ffffff',
                    border: 'none',

                    '&:hover': {
                        background:
                            mode === 'light'
                                ? 'linear-gradient(to right, #3991e6, #7046b3)'
                                : 'linear-gradient(to right, #5aa2e0, #ab47bc)',
                        color: '#ffffff',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow:
                            mode === 'light' ? '0 12px 20px rgba(0, 0, 0, 0.1)' : '0 12px 20px rgba(0, 0, 0, 0.3)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': {
                            borderColor: mode === 'light' ? 'rgba(200, 200, 200, 0.5)' : 'rgba(70, 70, 70, 0.5)',
                        },
                        '&:hover fieldset': {
                            borderColor: mode === 'light' ? 'rgba(150, 150, 150, 0.8)' : 'rgba(100, 100, 100, 0.8)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: mode === 'light' ? '#42a5f5' : '#64b5f6',
                            boxShadow:
                                mode === 'light'
                                    ? '0 0 0 3px rgba(66, 165, 245, 0.1)'
                                    : '0 0 0 3px rgba(100, 181, 246, 0.2)',
                        },
                    },
                },
            },
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: '1.5rem',
                },
            },
        },
    },
});

const getGradientStyle = ({ mode }: { mode: PaletteMode }) => {
    return mode === 'light'
        ? 'linear-gradient(to bottom right, #f0f7ff, #f3e5f5)'
        : 'linear-gradient(135deg, #121212, #1e1e2f, #2a2a40)';
};

const getButtonGradient = ({ mode }: { mode: PaletteMode }) => {
    return mode === 'light'
        ? 'linear-gradient(135deg, #42a5f5 0%, #7e57c2 100%)'
        : 'linear-gradient(135deg, #3980c9 0%, #8a56b9 100%)';
};

const getTextGradient = ({ mode }: { mode: PaletteMode }) => {
    return {
        background:
            mode === 'light'
                ? 'linear-gradient(to right, #42a5f5, #7e57c2)'
                : 'linear-gradient(to right, #64b5f6, #ba68c8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textFillColor: 'transparent',
    };
};

export { getDesignTokens, getGradientStyle, getButtonGradient, getTextGradient };
