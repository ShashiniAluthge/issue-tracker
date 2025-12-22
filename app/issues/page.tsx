import { IssueStatusBadge, Link } from '@/app/components';
import prisma from '@/prisma/client';
import { Table } from '@radix-ui/themes';
import IssueActions from './issueActions';
import { Status } from '../generated/prisma/enums';

interface Props {
    searchParams: Promise<{ status?: Status }> // Changed to Promise
}

const IssuesPage = async ({ searchParams }: Props) => {
    // await the searchParams Promise
    const resolvedParams = await searchParams;


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

    const issues = await prisma.issue.findMany({
        where: status ? { status } : {} // Empty where clause shows all
    });

    console.log('6. Number of issues found:', issues.length);
    console.log('7. Issues:', issues.map(i => ({
        id: i.id,
        title: i.title,
        status: i.status
    })));
    console.log('=== End Debug ===\n');

    return (
        <div>
            <IssueActions />

            <Table.Root variant='surface'>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Issue</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell className='hidden md:table-cell'>
                            Status
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell className='hidden md:table-cell'>
                            Created
                        </Table.ColumnHeaderCell>
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