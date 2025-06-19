'use client'

import {useChatStore} from "@/app/components/chatbox/stores/useChatStore";
import {useMutation, useQuery} from "@tanstack/react-query";
import {chatWithOpenRouterMutation, getSupportedModelsOptions} from "@/api/client/@tanstack/react-query.gen";
import { useEffect } from "react";

export const useChatActions = () => {
    const { addMessage, setIsLoading } = useChatStore()

    // const {data, isLoading} = useQuery({
    //     ...getSupportedModelsOptions()
    // })

    // useEffect(() => {
    //     if (data?.data) {
    //         setModels(data.data)
    //     }
    // }, [data?.data])

    const {mutateAsync} = useMutation({
        ...chatWithOpenRouterMutation({
            // query: {
            //     selectedModel
            // }
        }),
        onMutate: () => {
            setIsLoading(true)
        },
        onSuccess: (res) => {
            const aiMessage = {
                id: Date.now().toString(),
                content: res.data?.message ?? '',
                role: "assistant",
                timestamp: new Date(),
            } as const
            addMessage(aiMessage)
            setIsLoading(false)
        },
        onError: (error) => {
            console.error("Error during chat mutation:", error)
            setIsLoading(false)
        },
    })

    const chatWithAI = (message: string) => {
        return mutateAsync({
            body: {
                message
            }
        })
    }

    return {
        chatWithAI
    }
}