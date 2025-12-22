import prisma from '@/prisma/client';
import { Issue } from '../generated/prisma/client';
import { Status } from '../generated/prisma/enums';
import IssueActions from './issueActions';

import Pagination from '../components/Pagination';
import IssueTable, { columnNames } from './IssueTable';
import { Flex } from '@radix-ui/themes';
import { Metadata } from 'next';

interface Props {
    searchParams: Promise<
        {
            status?: Status,
            orderBy: keyof Issue,
            page: string
        }
    > //searchParams define as Promise
}

const IssuesPage = async ({ searchParams }: Props) => {
    // await the searchParams Promise
    const resolvedParams = await searchParams;

    const statuses = Object.values(Status);

    // Handle both undefined and 'ALL' as "show all"
    const status = resolvedParams.status && statuses.includes(resolvedParams.status)
        ? resolvedParams.status
        : undefined;

    const orderBy = columnNames.includes(resolvedParams.orderBy)
        ?
        { [resolvedParams.orderBy]: 'asc' }
        : undefined

    const page = parseInt(resolvedParams.page) || 1;
    const pageSize = 10;

    const issues = await prisma.issue.findMany({
        where: status ? { status } : {},// Empty where clause shows all
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize
    });

    const issueCount = await prisma.issue.count({ where: status ? { status } : {}, })

    return (
        <Flex direction={'column'} gap={'3'}>
            <IssueActions />
            <IssueTable searchParams={searchParams} issues={issues} />
            <Pagination pageSize={pageSize} currentPage={page} itemCount={issueCount} />
        </Flex>
    );
}

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Issue Tracker - Issue List',
    description: 'View all project issues'
}
export default IssuesPage;