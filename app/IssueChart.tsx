'use client'

import { Card } from '@radix-ui/themes';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar } from 'recharts';
import { useEffect, useState } from 'react';

interface Props {
    open: number
    inProgress: number
    closed: number
}
const IssueChart = ({ open, inProgress, closed }: Props) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const data = [
        { label: 'Open', value: open },
        { label: 'In Progress', value: inProgress },
        { label: 'Closed', value: closed },
    ]

    return (
        <Card>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 20,
                        left: isMobile ? -40 : 10,
                        bottom: 15
                    }}
                >
                    <XAxis
                        dataKey={'label'}
                        style={{ fontSize: isMobile ? '12px' : '14px' }}
                        interval={0}
                    />
                    <YAxis />
                    <Bar dataKey={'value'} barSize={60} style={{ fill: 'var(--accent-9)' }} />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    )
}

export default IssueChart