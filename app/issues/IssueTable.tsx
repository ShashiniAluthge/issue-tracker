import { ArrowUpIcon } from '@radix-ui/react-icons'
import { Table } from '@radix-ui/themes'
import { default as Link, default as NextLink } from 'next/link'
import { IssueStatusBadge } from '../components'
import { Issue, Status } from '../generated/prisma/client'


interface Props {
    searchParams: Promise<
        {
            status?: Status,
            orderBy: keyof Issue,
            page: string
        }
    >,
    issues: Issue[]
}
const IssueTable = async ({ searchParams, issues }: Props) => {
    // await the searchParams Promise
    const resolvedParams = await searchParams;


    return (
        <Table.Root variant='surface'>
            <Table.Header>
                <Table.Row>
                    {columns.map((column) => (
                        <Table.ColumnHeaderCell key={column.value} className={column.className}>
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
    )
}

const columns: {
    lable: string;
    value: keyof Issue;
    className?: string;
}[] = [
        { lable: 'Issue', value: 'title' },
        { lable: 'Status', value: 'status', className: "hidden md:table-cell" },
        { lable: 'Created', value: 'createdAt', className: "hidden md:table-cell" }
    ]

export const columnNames = columns.map(column => column.value)

export default IssueTable