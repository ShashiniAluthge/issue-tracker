import React from 'react'
import { Status } from '../generated/prisma/enums'
import { Record } from '@prisma/client/runtime/client'
import { Badge } from '@radix-ui/themes'

interface Props {
    status: Status
}

const statusMap: Record<Status, { lable: string, color: 'red' | 'violet' | 'green' }> = {
    OPEN: { lable: 'OPEN', color: 'red' },
    IN_PROGRESS: { lable: 'In Progress', color: 'violet' },
    CLOSED: { lable: 'Closed', color: 'green' }
}

const IssueStatusBadge = ({ status }: Props) => {
    return (
        <Badge color={statusMap[status].color}>{statusMap[status].lable}</Badge>
    )
}

export default IssueStatusBadge