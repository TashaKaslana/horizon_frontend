import {UseFormReturn} from "react-hook-form";
import {z} from "zod";
import {accountFormSchema} from "@/app/(home)/constraints/accountFormSchema";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

type FormType = z.infer<typeof accountFormSchema>

type FieldProps = {
    form: UseFormReturn<FormType>,
    name: 'currentPassword' | 'newPassword' | 'confirmPassword',
    label: string,
    placeholder: string,
    type: 'password' | 'email',
}

export const AccountField = ({form, name, label, type, placeholder} : FieldProps) => {
    return (
        <FormField control={form.control}
                   name={name}
                   render={({field}) => (
                       <FormItem>
                           <FormLabel>
                               {label}
                           </FormLabel>
                           <FormControl>
                               <Input placeholder={placeholder} {...field} type={type}/>
                           </FormControl>
                           <FormMessage/>
                       </FormItem>
                   )}/>
    )
}