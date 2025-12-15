import { issueSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Props {
    params: Promise<{ id: string }>
}
export async function PATCH
    (request: NextRequest, { params }: Props) {
    const { id } = await params
    const body = await request.json();
    const validation = issueSchema.safeParse(body)

    if (!validation.success)

        return NextResponse.json(validation.error.format(), { status: 400 })

    const issue = await prisma.issue.findUnique({
        where: { id: parseInt(id) }
    })

    if (!issue) return NextResponse.json({ error: 'Invalid issue' }, { status: 404 })


    const updatedIssue = await prisma.issue.update({
        where: { id: issue.id },
        data: {
            title: body.title,
            description: body.description
        }
    }
    )
    // Instead of manually converting dates, use this:
    return NextResponse.json(JSON.parse(JSON.stringify(updatedIssue)));


}