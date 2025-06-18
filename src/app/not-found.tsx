import Link from 'next/link';
import {Button} from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-10">
            <h2 className="text-3xl font-bold">404 - Not Found</h2>
            <p className="text-muted-foreground">Could not find the requested page.</p>
            <Button asChild>
                <Link href="/">Go back home</Link>
            </Button>
        </div>
    );
}
