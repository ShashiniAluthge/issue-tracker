'use client'

import dynamic from 'next/dynamic'
import IssueFormSkeleton from './loading'
import { useEffect } from 'react'

const IssueForm = dynamic(
    () => import('@/app/issues/components/IssueForm'),
    {
        ssr: false,
        loading: () => <IssueFormSkeleton />
    }
)

const NewIssuePage = () => {
    useEffect(() => {
        document.title = 'Issue Tracker - New Issue'
    }, [])

    return (
        <IssueForm />
    )
}

export default NewIssuePage