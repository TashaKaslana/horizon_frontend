'use client'

import {UploadForm} from "@/app/components/post-details/uploadForm";
import {useQuery} from "@tanstack/react-query";
import {getPostById} from "@/api/postApi";
import {Video} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import React from "react";
import {Spinner} from "@/components/ui/spinner";

interface PostEditContainerProps {
    postId: string
}

const PostEditContainer = ({postId}: PostEditContainerProps) => {
    const {data, isLoading} = useQuery({
        queryKey: ['posts', postId],
        queryFn: () => getPostById(postId),
    });

    const post = data?.data;

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex justify-center">
            {isLoading ? <Spinner/> : (
                <div className="container max-w-5xl py-12">
                    <header className="mb-10 text-center">
                        <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
                            <Video className="h-6 w-6 text-primary"/>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">Edit your video</h1>
                        <p className="text-muted-foreground mt-3 max-w-md mx-auto">
                            You could update your video details here. Make sure to fill in all the required fields.
                        </p>
                    </header>

                    <Card className="border-none shadow-lg">
                        <CardContent className="p-0">
                            <div className="space-y-8">
                                <UploadForm
                                    existingData={post}
                                    mode={"edit"}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
export default PostEditContainer;