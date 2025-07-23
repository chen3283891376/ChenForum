import * as React from 'react';
import Navbar from '~/components/Navbar';
import { Box, Container, createTheme, useMediaQuery, ThemeProvider } from '@mui/material';
import { WorkCard } from '~/components/WorkCard';
import 'tailwindcss/index.css';
import { getDesignTokens, getGradientStyle } from '~/theme';

import type { Topic } from '~/interface/topics';
import type { Route } from '../+types/root';
import type { PaletteMode } from '@mui/material';

export const loader = ({ request }: Route.LoaderArgs) => {
    return {
        isLoggedIn: request.headers.get('Cookie')?.includes('isLoggedIn=true') || false,
        name: request.headers.get('Cookie')?.split('; name=')[1].split(';')[0] || '',
    };
};

export default function Index({ loaderData = { isLoggedIn: false, name: '' } }) {
    const isLoggedIn = loaderData.isLoggedIn;
    const name = loaderData.name;
    const [topics, setTopics] = React.useState<Topic[]>([]);

    const [mode, setMode] = React.useState<PaletteMode>('light');
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const muiTheme = createTheme(getDesignTokens(mode));
    React.useEffect(() => {
        setMode(prefersDarkMode ? 'dark' : 'light');
    }, [prefersDarkMode]);

    React.useEffect(() => {
        let ignore = false;
        const func = async () => {
            const response = await fetch('/api/topics');
            const responseData = await response.json();
            console.log(responseData);
            setTopics(responseData);
        };
        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, []);
    return (
        <ThemeProvider theme={muiTheme}>
            <Box
                sx={{
                    minHeight: '100vh',
                    background: getGradientStyle({ mode }),
                    backgroundAttachment: 'fixed',
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    boxSizing: 'border-box',
                    margin: 0,
                    overflowX: 'hidden',
                }}
            >
                <Navbar mode={mode} setMode={setMode} isLoggedIn={isLoggedIn} name={name} />
                <Container className="relative top-[80px] grid grid-cols-4 gap-4 md:grid-cols-4">
                    {topics.map(topic => (
                        <WorkCard key={topic.id} topic={topic} mode={mode} />
                    ))}
                </Container>
            </Box>
        </ThemeProvider>
    );
}
