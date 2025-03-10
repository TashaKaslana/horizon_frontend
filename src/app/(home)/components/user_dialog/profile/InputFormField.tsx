import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import type {UseFormReturn} from "react-hook-form";
import type {z} from "zod";
import formProfileSchema from "@/app/(home)/constraints/formProfileSchema";

type FormSchemaType = z.infer<typeof formProfileSchema>

interface InputFormFieldProps {
    form: UseFormReturn<FormSchemaType>
    name: keyof FormSchemaType
    label: string
    placeholder: string
    type?: string
}

export const InputFormField = ({form, name, label, placeholder, type}: InputFormFieldProps) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input placeholder={placeholder} type={type ?? "text"} {...field} value={field.value as string} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}