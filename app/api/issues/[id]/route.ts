import authOptions from "@/app/auth/authOptions";
import { issueSchema, patchIssueSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import delay from "delay";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Props {
    params: Promise<{ id: string }>
}

export async function PATCH
    (request: NextRequest, { params }: Props) {

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({}, { status: 401 })

    const { id } = await params

    const body = await request.json();

    const validation = patchIssueSchema.safeParse(body)
    if (!validation.success)
        return NextResponse.json(validation.error.format(), { status: 400 })

    const { assignedToUserId, title, description } = body;
    if (assignedToUserId) {
        const user = await prisma.user.findUnique({
            where: { id: assignedToUserId }
        })
        if (!user)
            return NextResponse.json(
                { error: 'Invalid user' },
                { status: 400 })
    }

    const issue = await prisma.issue.findUnique({
        where: { id: parseInt(id) }
    })

    if (!issue) return NextResponse.json({ error: 'Invalid issue' }, { status: 404 })


    const updatedIssue = await prisma.issue.update({
        where: { id: issue.id },
        data: {
            title,
            description,
            assignedToUserId
        }
    }
    )

    return NextResponse.json(JSON.parse(JSON.stringify(updatedIssue)));
}


export async function DELETE
    (request: NextRequest, { params }: Props) {

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({}, { status: 401 })

    const { id } = await params

    //await delay(2000)

    const issue = await prisma.issue.findUnique({
        where: { id: parseInt(id) }
    })

    if (!issue) return NextResponse.json({ error: 'Invalid issue' }, { status: 404 })

    await prisma.issue.delete({
        where: { id: parseInt(id) }
    })

    return NextResponse.json({})
}