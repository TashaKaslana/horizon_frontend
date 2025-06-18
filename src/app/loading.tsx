import {Spinner} from '@/components/ui/spinner';

export default function Loading() {
    return (
        <div className="flex flex-1 h-full items-center justify-center py-10">
            <Spinner size="large" />
        </div>
    );
}
