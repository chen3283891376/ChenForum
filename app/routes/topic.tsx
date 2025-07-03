import * as React from 'react';
import { Container, Typography, Card, CardHeader, CardContent } from '@mui/material';
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

    React.useEffect(() => {
        let ignore = false;

        const func = async () => {
            const response = await fetch(`/api/topics/${loaderData.id}`);
            const responseData: TypeTopic = await response.json();
            setTopic(responseData);
            const md = new MarkdownIt();
            const content = md.render(responseData.content);
            setMdContent(DomPurify.sanitize(content));
        };

        if (!ignore) func();

        return () => {
            ignore = true;
        };
    }, []);

    React.useEffect(() => {
        hljs.highlightAll();
        renderMathInElement(document.body, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
                { left: '\\(', right: '\\)', display: false },
                { left: '\\[', right: '\\]', display: true },
            ],
        });
        document.querySelectorAll('.markdown-body pre code').forEach(element => {
            const el = element as HTMLElement;
            if (el.parentNode === null) return;

            const lang = el.className.replace('language-', '').replace(' hljs', '').replace('hljs ', '');
            let head_el = document.createElement('div');
            head_el.className = 'code-header';

            let lang_el = document.createElement('span');
            if (lang === 'undefined') {
                lang_el.innerText = 'Plain Text';
            } else {
                lang_el.innerText = lang;
            }
            head_el.appendChild(lang_el);

            let copy_el = document.createElement('button');
            copy_el.className = 'copy-btn';
            copy_el.innerText = 'Copy';
            copy_el.addEventListener('click', () => {
                navigator.clipboard.writeText(el.outerText).then(() => null);
                copy_el.innerText = 'Copied!';
                setTimeout(() => {
                    copy_el.innerText = 'Copy';
                }, 1000);
            });
            head_el.appendChild(copy_el);

            el.parentNode.insertBefore(head_el, el);
        });
    }, [mdContent]);

    return (
        <>
            <Navbar isLoggedIn={loaderData.isLoggedIn} name={loaderData.name} />
            <Container sx={{ position: 'relative', top: '80px' }}>
                {topic && (
                    <>
                        <Card sx={{ mb: 2 }}>
                            <CardHeader title={topic.name} subheader={topic.description} />
                            <CardContent>
                                <Typography variant="caption" color="text.secondary">
                                    作者：{topic.author}
                                </Typography>
                            </CardContent>
                        </Card>
                        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: mdContent }} />
                        <CommentBox
                            topic_id={loaderData.id}
                            author={loaderData.name}
                            isLoggedIn={loaderData.isLoggedIn}
                        />
                    </>
                )}
            </Container>
        </>
    );
}
