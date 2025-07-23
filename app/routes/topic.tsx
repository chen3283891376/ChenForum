import * as React from 'react';
import { Container, Typography, Card, CardHeader, CardContent, Box } from '@mui/material';
import Navbar from '~/components/Navbar';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import renderMathInElement from '~/util/katex-auto-render';
import DomPurify from 'dompurify';
import CommentBox from '~/components/CommentBox';
import 'highlight.js/styles/stackoverflow-light.min.css';
import 'katex/dist/katex.min.css';
import '~/styles/topics.css';

import type { Route } from './+types/topic';
import type { Topic as TypeTopic } from '~/interface/topics';
import type { PaletteMode } from '@mui/material';
import { createTheme, useMediaQuery, ThemeProvider } from '@mui/material';
import { getDesignTokens, getGradientStyle } from '~/theme';

export async function loader({ request, params }: Route.LoaderArgs) {
    return {
        isLoggedIn: request.headers.get('Cookie')?.includes('isLoggedIn=true') || false,
        name: request.headers.get('Cookie')?.split('; name=')[1].split(';')[0] || '',
        id: params.id,
    };
}

export default function Topic({ loaderData = { id: '1', isLoggedIn: false, name: '' } }) {
    const [mdContent, setMdContent] = React.useState<string>('');
    const [topic, setTopic] = React.useState<TypeTopic>();

    const [mode, setMode] = React.useState<PaletteMode>('light');
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const muiTheme = createTheme(getDesignTokens(mode));
    React.useEffect(() => {
        setMode(prefersDarkMode ? 'dark' : 'light');
    }, [prefersDarkMode]);

    React.useEffect(() => {
        let ignore = false;

        const func = async () => {
            const response = await fetch(`/api/topics/${loaderData.id}`);
            const responseData: TypeTopic = await response.json();
            if (!ignore) {
                setTopic(responseData);
                const md = new MarkdownIt({
                    highlight: (str, lang) => {
                        if (lang && hljs.getLanguage(lang)) {
                            try {
                                return hljs.highlight(str, { language: lang }).value;
                            } catch (__) {}
                        }
                        return '';
                    },
                });
                const content = md.render(responseData.content);
                setMdContent(DomPurify.sanitize(content));
            }
        };

        func();

        return () => {
            ignore = true;
        };
    }, [loaderData.id]);

    React.useEffect(() => {
        if (mdContent) {
            hljs.highlightAll();
            renderMathInElement(document.body, {
                delimiters: [
                    { left: '$', right: '$', display: true },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true },
                ],
            });

            document.querySelectorAll('.markdown-body pre code').forEach(element => {
                const el = element as HTMLElement;
                if (el.parentNode === null) return;

                const lang = el.className.replace('language-', '').replace(' hljs', '').replace('hljs ', '');
                const headEl = document.createElement('div');
                headEl.className = 'code-header';

                const langEl = document.createElement('span');
                langEl.innerText = lang || 'Plain Text';
                headEl.appendChild(langEl);

                const copyEl = document.createElement('button');
                copyEl.className = 'copy-btn';
                copyEl.innerText = 'Copy';
                copyEl.addEventListener('click', () => {
                    navigator.clipboard.writeText(el.innerText).then(() => {
                        copyEl.innerText = 'Copied!';
                        setTimeout(() => {
                            copyEl.innerText = 'Copy';
                        }, 1000);
                    });
                });
                headEl.appendChild(copyEl);

                el.parentNode.insertBefore(headEl, el);
            });
        }
    }, [mdContent, mode]);

    return (
        <ThemeProvider theme={muiTheme}>
            <Box
                sx={{
                    minHeight: '100vh',
                    background: getGradientStyle({ mode }),
                    backgroundAttachment: 'fixed',
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    paddingTop: '64px',
                    boxSizing: 'border-box',
                    margin: 0,
                    overflowX: 'hidden',
                }}
            >
                <Navbar mode={mode} setMode={setMode} isLoggedIn={loaderData.isLoggedIn} name={loaderData.name} />

                <Container
                    sx={{
                        maxWidth: 'lg',
                        py: 4,
                        px: { xs: 2, md: 4 },
                    }}
                >
                    {topic ? (
                        <>
                            <Card
                                sx={{
                                    mb: 4,
                                    boxShadow: 3,
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <CardHeader
                                    title={
                                        <Typography variant="h4" component="div">
                                            {topic.name}
                                        </Typography>
                                    }
                                    subheader={
                                        <Typography variant="body1" color="text.secondary">
                                            {topic.description}
                                        </Typography>
                                    }
                                />
                                <CardContent>
                                    <Typography variant="caption" color="text.secondary">
                                        作者：
                                        <Typography
                                            component={'a'}
                                            href={`/user/${topic.author}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            bgcolor={'inherit'}
                                            sx={{ textDecoration: 'none' }}
                                        >
                                            {topic.author}
                                        </Typography>
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Card
                                sx={{
                                    mb: 4,
                                    p: 4,
                                    boxShadow: 2,
                                    backgroundColor: 'background.paper',
                                }}
                            >
                                <div
                                    className="markdown-body"
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                        fontSize: '1rem',
                                        lineHeight: 1.8,
                                    }}
                                    dangerouslySetInnerHTML={{ __html: mdContent }}
                                />
                            </Card>

                            <Card
                                sx={{
                                    boxShadow: 2,
                                    p: 3,
                                    backgroundColor: 'background.paper',
                                }}
                            >
                                <CommentBox
                                    topic_id={loaderData.id}
                                    author={loaderData.name}
                                    isLoggedIn={loaderData.isLoggedIn}
                                />
                            </Card>
                        </>
                    ) : (
                        <Typography>加载中...</Typography>
                    )}
                </Container>
            </Box>
        </ThemeProvider>
    );
}
