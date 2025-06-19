"use client"

import { useEffect, useState } from "react"
import { Bot } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useChat } from "./hooks/useChat"
import { ModelSelector } from "./components/ModelSelector"
import { MessageList } from "./components/MessageList"
import { ChatInput } from "./components/ChatInput"
import { Separator } from "@radix-ui/react-separator"

export function AiChat() {
    const {
        messages,
        input,
        isLoading,
        messagesEndRef,
        models,
        selectedModel,
        isOpen,
        setInput,
        handleSendMessage,
        setSelectedModel,
        setIsOpen,
    } = useChat()

    useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const isCtrlI = event.ctrlKey && event.key.toLowerCase() === "i";
      if (isCtrlI) {
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [setIsOpen]);

    return (
        <div>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button size="icon" className="h-12 w-12 rounded-full shadow-lg absolute bottom-4 right-4 z-50">
                        <Bot className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent
                    className="!min-w-1/3 p-0 flex flex-col h-screen"
                    style={{ height: '100vh' }} // hoặc 100% nếu container có height
                    >
                        <SheetHeader className="p-4 border-b space-y-3">
                            <SheetTitle className="flex items-center gap-2">
                            <Bot className="h-5 w-5" />
                            <span>AI Assistant</span>
                            </SheetTitle>
                            <div className="flex justify-end">
                            <ModelSelector models={models} selectedModel={selectedModel} onSelectModel={setSelectedModel} />
                            </div>
                        </SheetHeader>

                        <div className="overflow-y-auto min-h-0 flex-grow">
                            <MessageList
                            messages={messages}
                            isLoading={isLoading}
                            messagesEndRef={messagesEndRef}
                            />
                        </div>

                        {/* Thanh nhập liệu */}
                        <div className="relative flex-shrink-0 bg-white h-12 px-2 mr-4">
                            <ChatInput
                            input={input}
                            setInput={setInput}
                            handleSendMessage={handleSendMessage}
                            isLoading={isLoading}
                            />
                        </div>
                    </SheetContent>

            </Sheet>
        </div>
    )
}
