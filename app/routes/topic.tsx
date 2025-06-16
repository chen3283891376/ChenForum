import * as React from 'react';
import { Container, Typography, Card, CardHeader, CardContent } from '@mui/material';
import Navbar from '~/components/Navbar';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/stackoverflow-light.min.css';
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
            const md = new MarkdownIt({
                highlight: (str, lang) => {
                    if (lang && hljs.getLanguage(lang)) {
                        try {
                            return hljs.highlight(lang, str).value;
                        } catch (__) {
                            return '';
                        }
                    }
                    return '';
                },
            });
            const content = md.render(responseData.content);
            setMdContent(content);
        };

        if (!ignore) func();

        return () => {
            ignore = true;
        };
    }, []);

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
                    </>
                )}
            </Container>
        </>
    );
}
