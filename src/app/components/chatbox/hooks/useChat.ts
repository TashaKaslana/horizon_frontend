import { useRef, useEffect } from "react"
import { useChatStore } from "../stores/useChatStore"
import type { Message } from "../types"
import { useChatActions } from "./useChatActions"

export function useChat() {
    const {
        messages,
        input,
        models,
        selectedModel,
        isOpen,
        addMessage,
        setInput,
        setIsLoading,
        setSelectedModel,
        setIsOpen
    } = useChatStore()
    const {chatWithAI} = useChatActions()
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async () => {
        if (!input.trim() || !selectedModel) return

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            role: "user",
            timestamp: new Date(),
        }

        addMessage(userMessage)
        setInput("")
        setIsLoading(true)

        try {
            const conversationHistory = messages
                .filter((msg) => msg.role !== "system")
                .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
                .join("\n")

            const prompt = `${conversationHistory}\nUser: ${input}\nAssistant:`

            await chatWithAI(input)
        } catch (error) {
            console.error("Error generating response:", error)

            const errorMessage: Message = {
                id: Date.now().toString(),
                content: "Sorry, I encountered an error. Please try again.",
                role: "assistant",
                timestamp: new Date(),
            }

            addMessage(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isOpen,
        setIsOpen,
        messages,
        input,
        isLoading: useChatStore.getState().isLoading,
        messagesEndRef,
        models,
        selectedModel,
        setInput,
        handleSendMessage,
        setSelectedModel,
    }
}
