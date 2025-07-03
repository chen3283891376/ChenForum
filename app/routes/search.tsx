import * as React from 'react';
import { Typography, Container, Icon, Tabs, Tab, Card } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import Navbar from '~/components/Navbar';
import { WorkCard } from '~/components/WorkCard';
import 'tailwindcss/index.css';

import type { Route } from './+types/search';
import type { Topic } from '~/interface/topics';
import type { IUser } from '~/interface/user';

const SearchTabs = {
    WorkTab: ({ keyword }: { keyword: string }) => {
        const [searchResult, setSearchResult] = React.useState<Topic[]>([]);
        React.useEffect(() => {
            let ignore = false;
            const func = async () => {
                const response = await fetch(`/api/topics/search?keyword=${keyword}`);
                const responseData = await response.json();
                setSearchResult(responseData);
            };
            if (!ignore) func();
            return () => {
                ignore = true;
            };
        }, []);
        return (
            <>
                {searchResult.length === 0 && <Typography variant="h5">没有搜索到相关内容</Typography>}
                <div className="grid grid-cols-4 gap-4 md:grid-cols-4">
                    {searchResult.map(topic => (
                        <WorkCard key={topic.id} topic={topic} />
                    ))}
                </div>
            </>
        );
    },
    UserTab: ({ keyword }: { keyword: string }) => {
        const [searchResult, setSearchResult] = React.useState<IUser[]>([]);
        React.useEffect(() => {
            let ignore = false;
            const func = async () => {
                const response = await fetch(`/api/accounts/search?keyword=${keyword}`);
                const responseData: { users: IUser[] } = await response.json();
                setSearchResult(responseData.users);
            };
            if (!ignore) func();
            return () => {
                ignore = true;
            };
        }, []);
        return (
            <>
                {searchResult.length === 0 && <Typography variant="h5">没有搜索到相关内容</Typography>}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                    {searchResult.map(user => (
                        <Card key={user.username} sx={{ p: 2, border: '1px solid #ccc' }}>
                            <Typography
                                variant="h5"
                                component={'a'}
                                href={`/user/${user.username}`}
                                sx={{ textDecoration: 'none' }}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {user.username}
                            </Typography>
                        </Card>
                    ))}
                </div>
            </>
        );
    },
};
export async function loader({ request }: Route.LoaderArgs) {
    return {
        keyword: new URL(request.url).searchParams.get('keyword') || null,
        isLoggedIn: request.headers.get('Cookie')?.includes('isLoggedIn=true') || false,
        name: request.headers.get('Cookie')?.split('; name=')[1].split(';')[0] || '',
        tab: new URL(request.url).searchParams.get('tab') || 'WorkTab',
    };
}
export default function Search({ loaderData = { keyword: null, isLoggedIn: false, name: '', tab: 'WorkTab' } }) {
    if (!loaderData.keyword) {
        return <Typography variant="h1">请输入关键字</Typography>;
    }
    const keyword = loaderData.keyword;
    const [tab, setTab] = React.useState(loaderData.tab);

    const handleTabChange = (event: React.SyntheticEvent, newTab: string) => {
        if (newTab) {
            setTab(newTab);
            window.scrollTo(0, 0);
            history.pushState(null, '', `/search?keyword=${keyword}&tab=${newTab}`);
        }
    };

    return (
        <>
            <Navbar isLoggedIn={loaderData.isLoggedIn} name={loaderData.name} />
            <Container sx={{ position: 'relative', top: '80px' }}>
                <Tabs value={tab} onChange={handleTabChange}>
                    <Tab label="作者" value="UserTab" className="mx-2" />
                    <Tab label="作品" value="WorkTab" className="mx-2" />
                </Tabs>
                <Typography variant="h5">
                    <Icon sx={{ mr: 1 }} fontSize="medium">
                        <SearchIcon />
                    </Icon>
                    搜索结果
                </Typography>
                {tab === 'WorkTab' && <SearchTabs.WorkTab keyword={keyword} />}
                {tab === 'UserTab' && <SearchTabs.UserTab keyword={keyword} />}
            </Container>
        </>
    );
}
