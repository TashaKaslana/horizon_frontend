import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import type {UseFormReturn} from "react-hook-form";
import type {z} from "zod";
import formProfileSchema from "@/app/(home)/constraints/formProfileSchema";

type FormSchemaType = z.infer<typeof formProfileSchema>

interface SelectFormFieldProps {
    form: UseFormReturn<FormSchemaType>,
    name: keyof FormSchemaType,
    label: string,
    placeholder: string,
    options: { value: string; label: string }[],
    disabled?: boolean
}

export const SelectFormField = ({form, name, label, placeholder, options, disabled}: SelectFormFieldProps) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({field}) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value as string} disabled={disabled}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder}/>
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage/>
                </FormItem>
            )}
        />
    )
}