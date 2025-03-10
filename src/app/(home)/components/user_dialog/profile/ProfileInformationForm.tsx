"use client"

import {useForm, type UseFormReturn} from "react-hook-form"
import type {z} from "zod"
import formProfileSchema from "@/app/(home)/constraints/formProfileSchema"
import {zodResolver} from "@hookform/resolvers/zod"
import {Form} from "@/components/ui/form"
import {Button} from "@/components/ui/button"
import {DatePickerFormField} from "@/app/(home)/components/user_dialog/profile/DatePickerFormField";
import {SelectFormField} from "@/app/(home)/components/user_dialog/profile/SelectFormField";
import {InputFormField} from "@/app/(home)/components/user_dialog/profile/InputFormField";

type FormSchemaType = z.infer<typeof formProfileSchema>

const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
]

const countryOptions = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "au", label: "Australia" },
    { value: "fr", label: "France" },
    { value: "de", label: "Germany" },
    { value: "jp", label: "Japan" },
]

const fields: {
    name: keyof FormSchemaType
    label: string
    placeholder?: string
    type?: string
    options?: { value: string; label: string }[]
}[] = [
    { name: "username", label: "Username", placeholder: "Enter username", type: "text" },
    { name: "displayName", label: "Display Name", placeholder: "Enter display name", type: "text" },
    { name: "email", label: "Email", placeholder: "Enter an email", type: "email" },
    { name: "password", label: "Password", placeholder: "Enter a password", type: "password" },
    { name: "gender", label: "Gender", placeholder: "Select gender", type: "select", options: genderOptions },
    { name: "country", label: "Country", placeholder: "Select country", type: "select", options: countryOptions },
    { name: "birthday", label: "Birthday", type: "date" },
    { name: "phoneNumber", label: "Phone Number", placeholder: "Enter phone number", type: "text" },
]

export const ProfileInformationForm = () => {
    const form: UseFormReturn<FormSchemaType> = useForm<FormSchemaType>({
        defaultValues: {
            username: "Username",
            displayName: "User Display",
            email: "user@example.com",
            password: "password123",
            gender: "male",
            country: "us",
            birthday: new Date(),
            phoneNumber: "1234567890",
        },
        resolver: zodResolver(formProfileSchema),
    })

    const onSubmit = (values: FormSchemaType) => {
        console.log(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-start">
                    {fields.map(({ name, label, placeholder, type, options }) => {
                        if (type === "select") {
                            return (
                                <SelectFormField
                                    key={name}
                                    form={form}
                                    name={name}
                                    label={label}
                                    placeholder={placeholder ?? ""}
                                    options={options ?? []}
                                />
                            )
                        } else if (type === "date") {
                            return <DatePickerFormField key={name} form={form} name={name} label={label} />
                        } else {
                            return (
                                <InputFormField
                                    key={name}
                                    form={form}
                                    name={name}
                                    label={label}
                                    placeholder={placeholder ?? ""}
                                    type={type}
                                />
                            )
                        }
                    })}
                </div>
                <Button type="submit" className="mt-6">
                    Save Changes
                </Button>
            </form>
        </Form>
    )
}



