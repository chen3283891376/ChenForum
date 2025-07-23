import * as React from 'react';
import {
    Button,
    Box,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Typography,
    DialogActions,
} from '@mui/material';
import { WorkCard } from '~/components/WorkCard';
import Navbar from '~/components/Navbar';
import 'tailwindcss/index.css';

import type { Topic } from '~/interface/topics';
import type { Route } from '../+types/root';
import type { PaletteMode } from '@mui/material';
import { createTheme, useMediaQuery, ThemeProvider } from '@mui/material';
import { getDesignTokens, getButtonGradient, getGradientStyle } from '~/theme';

export const loader = ({ request, params }: Route.LoaderArgs) => {
    return {
        isLoggedIn: request.headers.get('Cookie')?.includes('isLoggedIn=true') || false,
        name: request.headers.get('Cookie')?.split('; name=')[1].split(';')[0] || '',
        username: params.id,
    };
};

export default function Index({ loaderData = { isLoggedIn: false, name: '', username: '' } }) {
    const isLoggedIn = loaderData.isLoggedIn;
    const name = loaderData.name;
    const username = loaderData.username;
    const signatureRef = React.useRef<HTMLSpanElement>(null);
    const [pageComponent, setPageComponent] = React.useState<React.JSX.Element>(
        <Typography variant="h4">加载中...</Typography>,
    );
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const [signatureContent, setSignatureContent] = React.useState<string>('');
    if (!isLoggedIn) {
        return <div>请登录</div>;
    }
    
    const [mode, setMode] = React.useState<PaletteMode>('light');
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const muiTheme = createTheme(getDesignTokens(mode));
    React.useEffect(() => {
        setMode(prefersDarkMode ? 'dark' : 'light');
    }, [prefersDarkMode]);

    React.useEffect(() => {
        let ignore = false;
        const func = async () => {
            const response = await fetch(`/api/accounts/check_username?username=${username}`);
            const responseData: { has_username: boolean } = await response.json();
            if (!responseData.has_username) {
                setPageComponent(<Typography variant="h4">用户名不存在</Typography>);
            } else {
                const response3 = await fetch(`/api/accounts/${username}/signature`);
                const responseData3: { signature: string } = await response3.json();

                const response2 = await fetch(`/api/accounts/${username}/topics`);
                const responseData2: { topics: Topic[] } = await response2.json();
                setSignatureContent(responseData3.signature || '');
                setPageComponent(
                    <>
                        <Typography variant="h4" color='text.primary'>{username}</Typography>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                width: '100%',
                                justifyItems: 'space-between',
                            }}
                        >
                            <Typography ref={signatureRef} sx={{ flexGrow: 1 }} variant="subtitle1" color='text.secondary'>
                                {responseData3.signature || '这个人还没有签名'}
                            </Typography>
                            {username === name && (
                                <Button sx={{ background: getButtonGradient({ mode }), color: 'white' }} onClick={() => setOpenDialog(true)}>
                                    编辑签名
                                </Button>
                            )}
                        </div>
                        <div className="grid grid-cols-4 gap-4 md:grid-cols-4">
                            {responseData2.topics.map(topic => (
                                <WorkCard key={topic.id} topic={topic} mode={mode} />
                            ))}
                        </div>
                    </>,
                );
            }
        };
        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, []);
    return (
        <ThemeProvider theme={muiTheme}>
            <Box sx={{
                minHeight: '100vh',
                background: getGradientStyle({ mode }),
                backgroundAttachment: 'fixed',
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                boxSizing: 'border-box',
                margin: 0,
                overflowX: 'hidden',
            }}>
                <Navbar isLoggedIn={isLoggedIn} name={name} mode={mode} setMode={setMode} />
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>编辑签名</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="签名"
                            variant="outlined"
                            fullWidth
                            value={signatureContent}
                            onChange={e => {
                                setSignatureContent(e.target.value);
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button sx={{ background: getButtonGradient({ mode }), color: 'white' }} onClick={() => setOpenDialog(false)}>取消</Button>
                        <Button
                            sx={{ background: getButtonGradient({ mode }), color: 'white' }}
                            onClick={async () => {
                                await fetch(`/api/accounts/${username}/signature`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        signature: signatureContent,
                                    }),
                                });
                                setOpenDialog(false);
                                if (signatureRef.current) {
                                    signatureRef.current.innerText = signatureContent;
                                }
                            }}
                        >
                            保存
                        </Button>
                    </DialogActions>
                </Dialog>
                <Container className="mt-2" sx={{ position: 'relative', top: '80px' }}>
                    {pageComponent}
                </Container>
            </Box>
        </ThemeProvider>
    );
}
