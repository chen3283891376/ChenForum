import * as React from 'react';
import { Card, CardContent, CardHeader, Typography, Button } from '@mui/material';

import type { Topic } from '~/interface/topics';

export function WorkCard({ topic }: { topic: Topic }) {
    return (
        <Card key={topic.id}>
            <CardHeader title={topic.name} subheader={topic.description} />
            <CardContent>
                <Typography
                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    variant="body2"
                    color="text.primary"
                >
                    {topic.content}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    作者：{topic.author}
                </Typography>
                <Button variant="contained" color="primary" href={`/topic/${topic.id}`}>
                    详情
                </Button>
            </CardContent>
        </Card>
    );
}
