import * as React from 'react';
import { Card, CardContent, CardHeader, Typography, Button } from '@mui/material';

import type { Topic } from '~/interface/topics';

export function WorkCard({ topic }: { topic: Topic }) {
    return (
        <Card key={topic.id} sx={{ position: 'relative' }}>
            <CardHeader title={topic.name} subheader={topic.description} />
            <CardContent>
                <Typography
                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#333' }}
                    component={'a'}
                    href={`/topic/${topic.id}`}
                    className='stretched-link'
                    variant="body2"
                    color="text.primary"
                >
                    {topic.content}
                </Typography>
                <br />
                <Typography variant="caption" color="text.secondary">
                    作者：{topic.author}
                </Typography>
            </CardContent>
        </Card>
    );
}
