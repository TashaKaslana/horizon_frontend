import { create } from 'zustand'
import type { Message, AIModel } from '../types'

type ChatState = {
    messages: Message[]
    models: AIModel[]
    selectedModel: AIModel | null
    input: string
    isLoading: boolean
    setMessages: (messages: Message[]) => void
    addMessage: (message: Message) => void
    setInput: (input: string) => void
    setIsLoading: (isLoading: boolean) => void
    setSelectedModel: (model: AIModel) => void
    isOpen: boolean,
    setIsOpen: (value: boolean | ((prev: boolean) => boolean)) => void
}

const defaultModels: AIModel[] = [
    {id: "llama",  name: "meta-llama/llama-4-maverick", provider: "meta", model: "meta-llama/llama-4-maverick:free"},
    { id: "gpt-4o", name: "GPT-4o", provider: "openai", model: "gpt-4o" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "openai", model: "gpt-3.5-turbo" },
]

export const useChatStore = create<ChatState>((set) => ({
    messages: [
        {
            id: "welcome",
            content: "Hello! How can I assist you today?",
            role: "assistant",
            timestamp: new Date(),
        },
    ],
    models: defaultModels,
    selectedModel: defaultModels[0],
    input: "",
    isLoading: false,
    setMessages: (messages) => set({ messages }),
    addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
    setInput: (input) => set({ input }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setSelectedModel: (model) => set({ selectedModel: model }),

    isOpen: false,
    setIsOpen: (value: boolean | ((prev: boolean) => boolean)) => {
        set(state => ({
            isOpen: typeof value === 'function' ? (value as (prev: boolean) => boolean)(state.isOpen) : value
        }));
    }
}));
