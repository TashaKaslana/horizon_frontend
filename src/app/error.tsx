'use client';

import {useEffect} from 'react';
import {Button} from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center gap-3 py-10">
            <h2 className="text-xl font-semibold">Something went wrong!</h2>
            <Button onClick={() => reset()}>Try again</Button>
        </div>
    );
}
