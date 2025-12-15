'use client'
import ErrorMessage from '@/app/components/ErrorMessage'
import Spinner from '@/app/components/Spinner'
import { Issue } from '@/app/generated/prisma/client'
import { issueSchema } from '@/app/validationSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Callout, TextField } from '@radix-ui/themes'
import axios from 'axios'
import 'easymde/dist/easymde.min.css'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from "zod"

// Dynamically import SimpleMDE with SSR disabled
const SimpleMdeReact = dynamic(() => import('react-simplemde-editor'), {
    ssr: false,
})


type IssueFormData = z.infer<typeof issueSchema>;

// interface IssueForm {               //instead of this interface we use this infer so we no need to update multiple places in future
//     title: string;
//     description: string;
// }

const IssueForm = ({ issue }: { issue?: Issue }) => {
    const router = useRouter();
    const { register, control, handleSubmit, formState: { errors } } = useForm<IssueFormData>({ resolver: zodResolver(issueSchema) });

    const [error, setError] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);

    // Memoize the options to prevent unnecessary re-renders
    const simpleMdeOptions = useMemo(() => ({
        placeholder: "Description"
    }), []);

    const onSubmit = handleSubmit(async (data) => {

        try {
            setSubmitting(true)
            if (issue)
                await axios.patch('/api/issues/' + issue.id, data)
            else
                await axios.post('/api/issues', data);
            router.push('/issues');
            router.refresh();
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
            <form className='space-y-3' onSubmit={onSubmit} suppressHydrationWarning>
                <TextField.Root defaultValue={issue?.title} placeholder="Title" {...register('title')}>
                </TextField.Root>
                <ErrorMessage>
                    {errors.title?.message}
                </ErrorMessage>
                <Controller
                    name='description'
                    control={control}
                    defaultValue={issue?.description}
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
                <Button disabled={isSubmitting}>{issue ? 'Update Issue' : 'Submit New Issue '}{' '}{isSubmitting && <Spinner />}</Button>
            </form>
        </div>
    )
}

export default IssueForm