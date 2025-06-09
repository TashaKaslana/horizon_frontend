import {Form} from "@/components/ui/form";
import {ScrollArea} from "@/components/ui/scroll-area";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {AccountField} from "@/app/components/user_dialog/settings/AccountField";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {useTranslations} from "next-intl";

const AccountSetting = () => {
    const t = useTranslations('Home.user_dialog.settings_dialog.account_section');

    return (
        <ScrollArea className={'h-full overflow-y-auto'}>
            <section className={'p-1'}>
                <article>
                    <header>
                        <h1 className={'font-bold text-2xl'}>{t('title')}</h1>
                    </header>
                    <main>
                        <AccountForm />
                    </main>
                </article>
            </section>
        </ScrollArea>
    )
}

const formSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8)
}).refine(data => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
})

const AccountForm = () => {
    const t = useTranslations('Home.user_dialog.settings_dialog.account_section');

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            currentPassword: '123456',
            newPassword: '',
            confirmPassword: ''
        },
        resolver: zodResolver(formSchema)
    })

    const handleSubmit = () => {
        toast.success(t('submit_success'))
    }

    return (
        <Form {...form}>
            <form className={'space-y-2 mt-2'} onSubmit={form.handleSubmit(handleSubmit)}>
                <AccountField form={form}
                              name={'currentPassword'}
                              label={t('current_password')}
                              placeholder={t('current_password_placeholder')}
                              type={'password'}
                              />
                <AccountField form={form}
                              name={'newPassword'}
                              label={t('new_password')}
                              placeholder={t('new_password_placeholder')}
                              type={'password'}
                />
                <AccountField form={form}
                              name={'confirmPassword'}
                              label={t('confirm_password')}
                              placeholder={t('confirm_password_placeholder')}
                              type={'password'}
                />
                <div className={'flex justify-end'}>
                    <Button type={"submit"} className={'w-32'}>{t('submit')}</Button>
                </div>
            </form>
        </Form>
    )
}

export default AccountSetting