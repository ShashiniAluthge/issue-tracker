import { Box, Flex, Grid } from '@radix-ui/themes';
import delay from 'delay';
import { notFound } from 'next/navigation';
import EditIssueButton from './EditIssueButton';
import IssueDetails from './IssueDetails';
import DeleteIssueButton from './DeleteIssueButton';
import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/auth/authOptions';
import AssigneeSelect from './AssigneeSelect';
import { cache } from 'react';

interface Props {
    params: Promise<{ id: string }>;

}

const fetchUser = cache((issueId: number) => prisma.issue.findUnique({ where: { id: issueId } }))

const IssueDetailPage = async ({ params }: Props) => {

    const session = await getServerSession(authOptions);

    const { id } = await params;

    const issueId = parseInt(id);

    //if (typeof id !== 'number') notFound();

    // Check if the parsed id is a valid number
    if (isNaN(issueId)) {
        notFound();
    }



    const issue = await fetchUser(issueId)

    if (!issue)
        notFound();

    await delay(2000);

    return (
        <Grid columns={{ initial: '1', md: '5' }} gap={'8'}>
            <Box className='lg:col-span-4'>
                <IssueDetails issue={issue} /> {/* here pass issue as a prop */}
            </Box>

            {session &&
                (
                    <Box>
                        <Flex direction={'column'} gap={'4'}>
                            <AssigneeSelect issue={issue} />
                            <EditIssueButton issueId={issue.id} />
                            <DeleteIssueButton issueId={issue.id} />
                        </Flex>
                    </Box>
                )
            }

        </Grid>
    )
}

export async function generateMetadata({ params }: Props) {
    const issue = await fetchUser(parseInt((await params).id))

    return {
        title: issue?.title,
        description: 'Details pf issue' + issue?.id
    }
}

export default IssueDetailPage