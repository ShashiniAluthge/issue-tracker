import prisma from "@/prisma/client"
import IssueForm from "../../components/IssueForm"
import { notFound } from "next/navigation"
import { Metadata } from "next"

interface Props {
    params: Promise<{ id: string }>
}

const EditIssuePage = async ({ params }: Props) => {

    const { id } = await params

    const issue = await prisma.issue.findUnique({
        where: { id: parseInt(id) }
    })

    if (!issue) notFound();

    return (
        <IssueForm issue={issue} />
    )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params

    const issue = await prisma.issue.findUnique({
        where: { id: parseInt(id) }
    })

    return {
        title: issue ? `Edit Issue - ${issue.title}` : 'Issue Not Found',
        description: `Edit issue: ${issue?.title || 'Issue details'}`
    }
}

export default EditIssuePage