'use client'
import { Button, Callout, Text, TextField } from '@radix-ui/themes'
import React, { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import 'easymde/dist/easymde.min.css'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { createIssueSchema } from '@/app/validationSchemas'
import { z } from "zod";
import ErrorMessage from '@/app/components/ErrorMessage'
import Spinner from '@/app/components/Spinner'

// Dynamically import SimpleMDE with SSR disabled
const SimpleMdeReact = dynamic(() => import('react-simplemde-editor'), {
    ssr: false,
})


type IssueForm = z.infer<typeof createIssueSchema>;

// interface IssueForm {               //instead of this interface we use this infer so we no need to update multiple places in future
//     title: string;
//     description: string;
// }

const NewIssuePage = () => {
    const router = useRouter();
    const { register, control, handleSubmit, formState: { errors } } = useForm<IssueForm>({ resolver: zodResolver(createIssueSchema) });

    const [error, setError] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);

    // Memoize the options to prevent unnecessary re-renders
    const simpleMdeOptions = useMemo(() => ({
        placeholder: "Description"
    }), []);

    const onSubmit = handleSubmit(async (data) => {
        setSubmitting(true)
        try {
            await axios.post('/api/issues', data);
            router.push('/issues');
        } catch (error) {
            setSubmitting(false)
            setError('An Unexpected Error Occur!')
        }

    })


    return (
        <div className='max-w-xl '>
            {error && <Callout.Root color='red' className='mb-5'>

                <Callout.Text >
                    {error}
                </Callout.Text>
            </Callout.Root>
            }
            <form className='space-y-3' onSubmit={onSubmit}>
                <TextField.Root placeholder="Title" {...register('title')}>
                </TextField.Root>
                <ErrorMessage>
                    {errors.title?.message}
                </ErrorMessage>
                <Controller
                    name='description'
                    control={control}
                    defaultValue=''
                    render={({ field }) => (
                        <SimpleMdeReact
                            options={simpleMdeOptions}
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <ErrorMessage>
                    {errors.description?.message}
                </ErrorMessage>
                <Button disabled={isSubmitting}>Submit New Issue {isSubmitting && <Spinner />}</Button>
            </form>
        </div>
    )
}

export default NewIssuePage