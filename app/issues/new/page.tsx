'use client'
import { Button, Callout, TextField } from '@radix-ui/themes'
import React, { useMemo, useState } from 'react'
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

    const [error, setError] = useState('');

    // Memoize the options to prevent unnecessary re-renders
    const simpleMdeOptions = useMemo(() => ({
        placeholder: "Description"
    }), []);

    return (
        <div className='max-w-xl '>
            {error && <Callout.Root color='red' className='mb-5'>

                <Callout.Text >
                    {error}
                </Callout.Text>
            </Callout.Root>
            }
            <form className='space-y-3' onSubmit={handleSubmit(async (data) => {
                try {
                    await axios.post('/api/issues', data);
                    router.push('/issues');
                } catch (error) {
                    setError('An Unexpected Error Occur!')
                }

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
        </div>
    )
}

export default NewIssuePage