'use client'
import { Issue, User } from '@/app/generated/prisma/client'
import { Select } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/app/components'

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
    const { data: users, error, isLoading } = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: () => axios.get('/api/users').then(res => res.data),
        staleTime: 60 * 1000,
        retry: 3
    })

    if (isLoading) return <Skeleton />
    if (error) return null
    // const [users, setUsers] = useState<User[]>([]);

    // useEffect(() => {
    //     const fetchUsers = async () => {
    //         const { data } = await axios.get<User[]>('/api/users');
    //         setUsers(data)
    //     }
    //     fetchUsers();
    // }, [])

    return (
        <Select.Root
            defaultValue={issue.assignedToUserId || 'unassigned'}
            onValueChange={(userId) => {
                axios.patch('/api/issues/' + issue.id, { assignedToUserId: userId === 'unassigned' ? null : userId })
            }}>
            <Select.Trigger placeholder='Asign...' />
            <Select.Content>
                <Select.Group>
                    <Select.Label>Suggestions</Select.Label>
                    <Select.Item value='unassigned'>Unassigned</Select.Item>
                    {users?.map(user => (
                        <Select.Item key={user.id} value={user.id}>{user.name}</Select.Item>
                    ))}

                </Select.Group>
            </Select.Content>
        </Select.Root>

    )
}

export default AssigneeSelect