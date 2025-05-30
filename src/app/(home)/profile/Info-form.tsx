"use client"
import {
    useState
} from "react"
import {
    toast
} from "sonner"
import {
    useForm
} from "react-hook-form"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    cn
} from "@/lib/utils"
import {
    Button
} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Input
} from "@/components/ui/input"
import {
    format
} from "date-fns"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import {
    Calendar
} from "@/components/ui/calendar"
import {
    Calendar as CalendarIcon
} from "lucide-react"
import {
    RadioGroup, RadioGroupItem
} from "@/components/ui/radio-group"
import LocationSelector from "@/components/ui/location-input"
import {
    PhoneInput
} from "@/components/ui/phone-input";
import {updateProfileRequest} from "@/app/(home)/profile/libs/services/updateProfile";
import {getAccessToken} from "@auth0/nextjs-auth0";

const formSchema = z.object({
    firstName: z.string().min(3, {message : 'First name is least at 3 characters'}).max(30),
    lastName: z.string().min(3).max(30),
    dateOfBirth: z.coerce.date().refine((value) => value < new Date(), {
        message: 'Date of birth must be in the past',
    }),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    location: z.tuple([z.string(), z.string().optional()]),
    phoneNumber: z.string()
});


export default function InfoForm() {
    const [, setCountryName] = useState<string>('')
    const [stateName, setStateName] = useState<string>('')
    // const {user} = useUser()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            dateOfBirth: new Date(),
            gender: undefined,
            location: ['', ''],
            phoneNumber: ''
        },
    })

     async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const token = await getAccessToken()

            const { location, ...restOfValues } = values;
            await updateProfileRequest(token, {
                ...restOfValues,
                country: location[0],
                city: location[1],
                dateOfBirth: values.dateOfBirth.toISOString()
            })
            console.log(values);
            toast(
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-white">{JSON.stringify(values, null, 2)}</code>
                    </pre>
            );
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10 px-1">

                <div className="grid grid-cols-12 gap-4">

                    <div className="col-span-6">

                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="shadcn"
                                            type=""
                                            {...field}
                                            className={'border-black dark:border-white'}
                                        />
                                    </FormControl>
                                    <FormDescription>This is your first name</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-span-6">

                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="shadcn"
                                            className={'border-black dark:border-white'}
                                            type="text"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>This is your last name</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                </div>

                <div className="grid grid-cols-12 gap-4">

                    <div className="col-span-6">

                        <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={({field}) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date of birth</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>Your date of birth is used to calculate your age.</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-span-6">

                        <FormField
                            control={form.control}
                            name="gender"
                            render={({field}) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Gender</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            className="flex flex-col space-y-1 "
                                        >
                                            {[
                                                ["Male", "MALE"],
                                                ["Female", "FEMALE"],
                                                ["Other", "OTHER"]
                                            ].map((option, index) => (
                                                <FormItem className="flex items-center space-x-3 space-y-0" key={index}>
                                                    <FormControl>
                                                        <RadioGroupItem value={option[1]} className={'border-black dark:border-white'}/>
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        {option[0]}
                                                    </FormLabel>
                                                </FormItem>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormDescription>Select your gender</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                    </div>

                </div>

                <FormField
                    control={form.control}
                    name="location"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Select Country</FormLabel>
                            <FormControl>
                                <LocationSelector
                                    onCountryChange={(country) => {
                                        setCountryName(country?.name || '')
                                        form.setValue(field.name, [country?.name || '', stateName || ''])
                                    }}
                                    onStateChange={(state) => {
                                        setStateName(state?.name || '')
                                        form.setValue(field.name, [form.getValues(field.name)[0] || '', state?.name || ''])
                                    }}
                                />
                            </FormControl>
                            <FormDescription>If your country has states, it will be appear after selecting
                                country</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({field}) => (
                        <FormItem className="flex flex-col items-start">
                            <FormLabel>Phone number</FormLabel>
                            <FormControl className="w-full">
                                <PhoneInput
                                    placeholder="Placeholder"
                                    {...field}
                                    defaultCountry="TR"
                                    className={'border-black dark:border-white'}
                                />
                            </FormControl>
                            <FormDescription>Enter your phone number.</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <div className={'flex justify-center'}>
                    <Button type="submit" className={'lg:w-36'}>Submit</Button>
                </div>
            </form>
        </Form>
    )
}