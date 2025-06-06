"use client"
import {
    useEffect,
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
import {updateProfileRequest} from "@/app/(home)/profile/edit/libs/services/updateProfile";
import {getAccessToken} from "@auth0/nextjs-auth0";
import {useCurrentUser} from "@/stores/useCurrentUser";
import {Spinner} from "@/components/ui/spinner";
import {Textarea} from "@/components/ui/textarea";
import {useTranslations} from "next-intl";

export default function InfoForm() {
    const t = useTranslations("Home.profile.edit");
    const [, setCountryName] = useState<string>('')
    const [stateName, setStateName] = useState<string>('')
    const {user} = useCurrentUser()

    const formSchema = z.object({
        displayName: z.string(),
        firstName: z.string().min(3, {message: t('validation.firstName')}).max(30),
        lastName: z.string().min(3).max(30),
        dateOfBirth: z.coerce.date().refine((value) => value < new Date(), {
            message: 'Date of birth must be in the past',
        }),
        gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
        location: z.tuple([z.string(), z.string().optional()]),
        phoneNumber: z.string(),
        bio: z.string().max(500, {message: t('validation.bio')})
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            displayName: user?.displayName ?? '',
            firstName: user?.firstName ?? '',
            lastName: user?.lastName ?? '',
            dateOfBirth: user?.dateOfBirth ? new Date(user?.dateOfBirth) : new Date(),
            gender: user?.gender ?? undefined,
            location: [user?.country ?? '', user?.city ?? ''],
            phoneNumber: user?.phoneNumber ?? '',
            bio: user?.bio ?? ''
        },
    })

    useEffect(() => {
        if (user) {
            form.reset({
                displayName: user.displayName ?? '',
                firstName: user.firstName ?? '',
                lastName: user.lastName ?? '',
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : new Date(),
                gender: user.gender ?? undefined,
                location: [user.country ?? '', user.city ?? ''],
                phoneNumber: user.phoneNumber ?? '',
                bio: user.bio ?? ''
            });
        }
    }, [form, user]);
    
    if (!user) {
        return <div className={'h-full flex justify-center'}>
            <Spinner/>
        </div>
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const token = await getAccessToken()

            const {location, ...restOfValues} = values;
            await updateProfileRequest(token, {
                ...restOfValues,
                country: location[0],
                city: location[1],
                dateOfBirth: values.dateOfBirth.toISOString()
            })

            toast.success(t("success"));
        } catch (error) {
            console.error("Form submission error", error);
            toast.error(t("error"));
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10 px-1">

                <FormField
                    control={form.control}
                    name={'displayName'}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                {t("fields.displayName.label")}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={t("fields.displayName.placeholder")}
                                    type=""
                                    {...field}
                                    className={'border-black dark:border-white'}
                                />
                            </FormControl>
                            <FormDescription>{t("fields.displayName.description")}</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}/>

                <div className="grid grid-cols-12 gap-4">

                    <div className="col-span-6">

                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>{t("fields.firstName.label")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={t("fields.firstName.placeholder")}
                                            type=""
                                            {...field}
                                            className={'border-black dark:border-white'}
                                        />
                                    </FormControl>
                                    <FormDescription>{t("fields.firstName.description")}</FormDescription>
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
                                    <FormLabel>{t("fields.lastName.label")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={t("fields.lastName.placeholder")}
                                            className={'border-black dark:border-white'}
                                            type="text"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>{t("fields.lastName.description")}</FormDescription>
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
                                    <FormLabel>{t("fields.dateOfBirth.label")}</FormLabel>
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
                                                        <span>{t("fields.dateOfBirth.placeholder")}</span>
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
                                    <FormDescription>{t("fields.dateOfBirth.description")}</FormDescription>
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
                                    <FormLabel>{t("fields.gender.label")}</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            className="flex flex-col space-y-1 "
                                            defaultValue={user?.gender}
                                        >
                                            {[
                                                [t("fields.gender.options.male"), "MALE"],
                                                [t("fields.gender.options.female"), "FEMALE"],
                                                [t("fields.gender.options.other"), "OTHER"]
                                            ].map((option, index) => (
                                                <FormItem className="flex items-center space-x-3 space-y-0" key={index}>
                                                    <FormControl>
                                                        <RadioGroupItem value={option[1]}
                                                                        className={'border-black dark:border-white'}/>
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        {option[0]}
                                                    </FormLabel>
                                                </FormItem>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormDescription>{t("fields.gender.description")}</FormDescription>
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
                            <FormLabel>{t("fields.location.label")}</FormLabel>
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
                                    defaultCountry={field.value?.[0]}
                                    defaultState={field.value?.[1]}
                                />
                            </FormControl>
                            <FormDescription>{t("fields.location.description")}</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({field}) => (
                        <FormItem className="flex flex-col items-start">
                            <FormLabel>{t("fields.phoneNumber.label")}</FormLabel>
                            <FormControl className="w-full">
                                <PhoneInput
                                    placeholder={t("fields.phoneNumber.placeholder")}
                                    {...field}
                                    defaultCountry="TR"
                                    className={'border-black dark:border-white'}
                                />
                            </FormControl>
                            <FormDescription>{t("fields.phoneNumber.description")}</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({field}) => (
                        <FormItem className="flex flex-col items-start">
                            <FormLabel>{t("fields.bio.label")}</FormLabel>
                            <FormControl className="w-full max-h-64">
                                <Textarea {...field}
                                          placeholder={t("fields.bio.placeholder")}
                                />
                            </FormControl>
                            <FormDescription>{t("fields.bio.description")}</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <div className={'flex justify-center'}>
                    <Button type="submit" className={'lg:w-36'}>{t("submit")}</Button>
                </div>
            </form>
        </Form>
    )
}