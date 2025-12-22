import { IssueStatusBadge, Link } from '@/app/components';
import prisma from '@/prisma/client';
import { Table } from '@radix-ui/themes';
import IssueActions from './issueActions';
import { Status } from '../generated/prisma/enums';
import { Issue } from '../generated/prisma/client';
import NextLink from 'next/link'
import { ArrowUpIcon } from '@radix-ui/react-icons';

interface Props {
    searchParams: Promise<{
        status?: Status,
        orderBy: keyof Issue
    }> // Changed to Promise
}

const IssuesPage = async ({ searchParams }: Props) => {
    // await the searchParams Promise
    const resolvedParams = await searchParams;

    const columns: {
        lable: string;
        value: keyof Issue;
        className?: string;
    }[] = [
            { lable: 'Issue', value: 'title' },
            { lable: 'Status', value: 'status', className: "hidden md:table-cell" },
            { lable: 'Created', value: 'createdAt', className: "hidden md:table-cell" }
        ]


    // console.log('=== IssuesPage Debug ===');
    // console.log('1. Resolved searchParams:', resolvedParams);
    // console.log('2. searchParams.status:', resolvedParams.status);

    const statuses = Object.values(Status);
    //console.log('3. Valid statuses:', statuses);

    // Handle both undefined and 'ALL' as "show all"
    const status = resolvedParams.status && statuses.includes(resolvedParams.status)
        ? resolvedParams.status
        : undefined;

    // console.log('4. Filtered status (used in query):', status);
    // console.log('5. Where clause:', status ? { status } : {});

    const orderBy = columns.map(column => column.value).includes(resolvedParams.orderBy)
        ?
        { [resolvedParams.orderBy]: 'asc' }
        : undefined

    const issues = await prisma.issue.findMany({
        where: status ? { status } : {},// Empty where clause shows all
        orderBy
    });

    // console.log('6. Number of issues found:', issues.length);
    // console.log('7. Issues:', issues.map(i => ({
    //     id: i.id,
    //     title: i.title,
    //     status: i.status
    // })));
    // console.log('=== End Debug ===\n');

    return (
        <div>
            <IssueActions />

            <Table.Root variant='surface'>
                <Table.Header>
                    <Table.Row>
                        {columns.map((column) => (
                            <Table.ColumnHeaderCell key={column.value}>
                                <NextLink href={{
                                    query: { ...resolvedParams, orderBy: column.value }
                                }
                                }>{column.lable}</NextLink>
                                {column.value === resolvedParams.orderBy && <ArrowUpIcon className='inline' />}
                            </Table.ColumnHeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {issues.map(issue => (
                        <Table.Row key={issue.id}>
                            <Table.Cell>
                                <Link href={`/issues/${issue.id}`}>
                                    {issue.title}
                                </Link>
                                <div className='block md:hidden'>
                                    <IssueStatusBadge status={issue.status} />
                                </div>
                            </Table.Cell>
                            <Table.Cell className='hidden md:table-cell'>
                                <IssueStatusBadge status={issue.status} />
                            </Table.Cell>
                            <Table.Cell className='hidden md:table-cell'>
                                {issue.createdAt.toDateString()}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </div>
    );
}

export const dynamic = 'force-dynamic';
export default IssuesPage;