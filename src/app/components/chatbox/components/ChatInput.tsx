import type React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

type ChatInputProps = {
    input: string
    setInput: (value: string) => void
    handleSendMessage: () => void
    isLoading: boolean
}

export function ChatInput({ input, setInput, handleSendMessage, isLoading }: ChatInputProps) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div className="flex gap-2 absolute w-full">
            <Input
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={isLoading} size="icon">
                <Send className="h-5 w-5" />
            </Button>
        </div>
    )
}

