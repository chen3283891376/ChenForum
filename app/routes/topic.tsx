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
    const [htmlContent, setHtmlContent] = React.useState<string>('');
    const [codeBlocks, setCodeBlocks] = React.useState<{ code: string; lang: string; id: string }[]>([]);

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
        setHtmlContent(html);

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const codeElements = doc.querySelectorAll('pre code');

        const blocks = Array.from(codeElements).map((el, index) => {
            const lang = el.className.replace('language-', '').replace(' hljs', '').replace('hljs ', '');
            const id = `code-block-${index}`;
            el.setAttribute('id', id)
            return { code: el.textContent || '', lang, id };
        });

        setCodeBlocks(blocks);
    }, [content]);

    return (
        <div style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '4px' }}>
            {/* 渲染完整的 HTML 内容 */}
            <div
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                ref={(node) => {
                    if (node) {
                        // 移除原始的代码块，避免重复渲染
                        const codeElements = node.querySelectorAll(`pre`);
                        codeElements.forEach((codeElement) => {
                            if (codeElement) {
                                codeElement.parentNode?.removeChild(codeElement);
                            }
                        });
                    }
                }}
            />
            {/* 渲染自定义的代码块 */}
            {codeBlocks.map((block) => (
                <CodeBlock key={block.id} code={block.code} lang={block.lang} />
            ))}
        </div>
    );
};

export async function loader({ request, params }: Route.LoaderArgs) {
    return {
        isLoggedIn: request.headers.get('Cookie')?.includes('isLoggedIn=true') || false,
        name: request.headers.get('Cookie')?.split('; name=')[1].split(';')[0] || '',
        id: params.id,
    };
}

export default function Topic({ loaderData = { id: '1', isLoggedIn: false, name: '' } }) {
    const [topic, setTopic] = React.useState<TypeTopic | null>(null);

    React.useEffect(() => {
        let ignore = false;

        const func = async () => {
            const response = await fetch(`/api/topics/${loaderData.id}`);
            const responseData = await response.json();
            setTopic(responseData);
        };

        func();

        return () => {
            ignore = true;
        };
    }, [loaderData.id]);

    return (
        <>
            <Navbar isLoggedIn={loaderData.isLoggedIn} name={loaderData.name} />
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
