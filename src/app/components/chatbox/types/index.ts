export type Message = {
    id: string
    content: string
    role: "user" | "assistant" | "system"
    timestamp: Date
}

export type AIModel = {
    id: string
    name: string
    provider: string
    model: string
}

