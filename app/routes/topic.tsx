import * as React from 'react';
import { Container, Typography, Button } from '@mui/material';
import Navbar from '~/components/Navbar';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/stackoverflow-light.min.css';
import '~/styles/topics.css';

import type { Route } from './+types/topic';
import type { Topic as TypeTopic } from '~/interface/topics';

const CodeHeader = ({ lang, code }: { lang: string; code: string }) => {
    const [copyText, setCopyText] = React.useState('Copy');

    const handleCopyClick = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopyText('Copied!');
            setTimeout(() => {
                setCopyText('Copy');
            }, 1000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="code-header">
            <span className="code-lang">{lang === 'undefined' ? 'Plain Text' : lang}</span>
            <Button size="small" variant="contained" onClick={handleCopyClick} color="primary">
                {copyText}
            </Button>
        </div>
    );
};

const CodeBlock = ({ code, lang }: { code: string; lang: string }) => {
    return (
        <div className="code-wrapper">
            <CodeHeader lang={lang} code={code} />
            <pre>
                <code
                    className={`language-${lang} hljs`}
                    dangerouslySetInnerHTML={{ __html: hljs.highlight(code, { language: lang }).value }}
                />
            </pre>
        </div>
    );
};

const MarkdownContent = ({ content }: { content: string }) => {
    const [codeBlocks, setCodeBlocks] = React.useState<{ code: string; lang: string }[]>([]);

    React.useEffect(() => {
        const md = new MarkdownIt({
            html: true,
            linkify: true,
            typographer: true,
            xhtmlOut: true,
            breaks: true,
            langPrefix: 'language-',
            quotes: '“”‘’',
        });
        const html = md.render(content);
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const codeElements = doc.querySelectorAll('pre code');

        const blocks = Array.from(codeElements).map(el => {
            const lang = el.className.replace('language-', '').replace(' hljs', '').replace('hljs ', '');
            return { code: el.textContent || '', lang };
        });

        setCodeBlocks(blocks);
    }, [content]);

    return (
        <>
            {codeBlocks.map((block, index) => (
                <CodeBlock key={index} code={block.code} lang={block.lang} />
            ))}
        </>
    );
};

export async function loader({ request, params }: Route.LoaderArgs) {
    return {
        id: params.id,
    };
}

export default function Topic({ loaderData = { id: '1' } }: { loaderData: { id: string } }) {
    const [topic, setTopic] = React.useState<TypeTopic | null>(null);

    React.useEffect(() => {
        let ignore = false;

        const func = async () => {
            const response = await fetch(`/api/topics/${loaderData.id}`);
            const responseData = await response.json();
            if (!ignore) setTopic(responseData);
        };

        func();

        return () => {
            ignore = true;
        };
    }, [loaderData.id]);

    return (
        <>
            <Navbar />
            <Container sx={{ position: 'relative', top: '80px' }}>
                {topic && (
                    <>
                        <Typography variant="h4" sx={{ mb: 2 }}>
                            {topic.name}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {topic.description}
                        </Typography>
                        <MarkdownContent content={topic.content} />
                    </>
                )}
            </Container>
        </>
    );
}
