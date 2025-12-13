'use client'
import { Button, TextField } from '@radix-ui/themes'
import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import 'easymde/dist/easymde.min.css'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/navigation'

// Dynamically import SimpleMDE with SSR disabled
const SimpleMdeReact = dynamic(() => import('react-simplemde-editor'), {
    ssr: false,
})

interface IssueForm {
    title: string;
    description: string;
}

const NewIssuePage = () => {
    const router = useRouter();
    const { register, control, handleSubmit } = useForm<IssueForm>();

    // Memoize the options to prevent unnecessary re-renders
    const simpleMdeOptions = useMemo(() => ({
        placeholder: "Description"
    }), []);

    return (
        <form className='max-w-xl space-y-3' onSubmit={handleSubmit(async (data) => {
            await axios.post('/api/issues', data);
            router.push('/issues');
        })}>
            <TextField.Root placeholder="Title" {...register('title')}>
            </TextField.Root>
            <Controller
                name='description'
                control={control}
                render={({ field }) => (
                    <SimpleMdeReact
                        options={simpleMdeOptions}
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />

            <Button>Submit New Issue</Button>
        </form>
    )
}

export default NewIssuePage