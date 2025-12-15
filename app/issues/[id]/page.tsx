import prisma from '@/prisma/client';
import { Box, Grid } from '@radix-ui/themes';
import delay from 'delay';
import { notFound } from 'next/navigation';
import EditIssueButton from './EditIssueButton';
import IssueDetails from './IssueDetails';

interface Props {
    params: Promise<{ id: string }>;
}
const IssueDetailPage = async ({ params }: Props) => {
    const { id } = await params;

    // if (typeof id !== 'number') notFound();

    const issue = await prisma.issue.findUnique({
        where: { id: parseInt(id) }
    })

    if (!issue)
        notFound();

    await delay(2000);

    return (
        <Grid columns={{ initial: '1', md: '2' }} gap={'5'}>
            <Box>
                <IssueDetails issue={issue} /> {/* here pass issue as a prop */}
            </Box>
            <Box>
                <EditIssueButton issueId={issue.id} />
            </Box>

        </Grid>
    )
}

export default IssueDetailPage