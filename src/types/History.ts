export type ActivityPart =
    | { type: 'text'; value: string }
    | { type: 'object'; entity: string; id: string; label: string };


export type History = {
    id: string;
    parts: ActivityPart[];
    createdAt: string;
};
