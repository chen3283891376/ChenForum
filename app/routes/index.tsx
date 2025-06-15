import * as React from'react';
import Navar from '~/components/Navbar';
import { Container } from '@mui/material';
import { WorkCard } from '~/components/WorkCard';

import type { Topic } from '~/interface/topics';

export default function Index() {
    const [topics, setTopics] = React.useState<Topic[]>([]);
    React.useEffect(() => {
        let ignore = false;
        const func = async () => {
            const response = await fetch('/api/topics');
            const responseData = await response.json();
            setTopics(responseData);
        }
        if (!ignore) func();
        return () => {
            ignore = true;
        }
    }, []);
    return (
        <>
            <Navar />
            <Container className='grid grid-cols-4 md:grid-cols-4 gap-4' sx={{ position: 'relative', top: '80px' }}>
                {topics.map((topic) => (
                    <WorkCard key={topic.id} topic={topic} />
                ))}
            </Container>
        </>
    )
}