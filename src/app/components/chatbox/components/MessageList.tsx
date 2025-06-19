import type React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Message } from "../types"

type MessageListProps = {
    messages: Message[]
    isLoading: boolean
    messagesEndRef: React.RefObject<HTMLDivElement | null>
}

export function MessageList({ messages, isLoading, messagesEndRef }: MessageListProps) {
    return (
        <div className="flex flex-col gap-4 overflow-y-auto px-2 py-1">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={cn("flex gap-3 max-w-[90%]", message.role === "user" ? "ml-auto" : "")}
                >
                    {message.role !== "user" && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                        </Avatar>
                    )}
                    <div
                        className={cn(
                            "rounded-lg p-3",
                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                        )}
                    >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <div className="text-xs mt-1 opacity-70">
                            {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </div>
                    </div>
                    {message.role === "user" && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                    )}
                </div>
            ))}
            {isLoading && (
                <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3">
                        <div className="flex space-x-2">
                            <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                            <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                            <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    )
}
