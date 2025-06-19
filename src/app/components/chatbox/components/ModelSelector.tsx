import type React from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import type { AIModel } from "../types"

type ModelSelectorProps = {
    models: AIModel[]
    selectedModel: AIModel | null
    onSelectModel: (model: AIModel) => void
}

export function ModelSelector({ models, selectedModel, onSelectModel }: ModelSelectorProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <span>{selectedModel?.name ?? 'None'}</span>
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {models.map((model) => (
                    <DropdownMenuItem key={model.id} onSelect={() => onSelectModel(model)}>
                        {model.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

