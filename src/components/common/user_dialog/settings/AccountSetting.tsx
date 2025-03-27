import {Form} from "@/components/ui/form";
import {ScrollArea} from "@/components/ui/scroll-area";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {AccountField} from "@/components/common/user_dialog/settings/AccountField";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";

const AccountSetting = () => {
    return (
        <ScrollArea className={'h-full overflow-y-auto'}>
            <section className={'p-1'}>
                <article>
                    <header>
                        <h1 className={'font-bold text-2xl'}>Change Password</h1>
                    </header>
                    <main>
                        <AccountForm/>
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
    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            currentPassword: '123456',
            newPassword: '',
            confirmPassword: ''
        },
        resolver: zodResolver(formSchema)
    })

    const handleSubmit = () => {
        toast.success("Successfully submitted")
    }

    return (
        <Form {...form}>
            <form className={'space-y-2 mt-2'} onSubmit={form.handleSubmit(handleSubmit)}>
                <AccountField form={form}
                              name={'currentPassword'}
                              label={'Current Password'}
                              placeholder={'Enter current password'}
                              type={'password'}
                              />
                <AccountField form={form}
                              name={'newPassword'}
                              label={'New Password'}
                              placeholder={'Enter new password'}
                              type={'password'}
                />
                <AccountField form={form}
                              name={'confirmPassword'}
                              label={'Confirm Password'}
                              placeholder={'Enter confirm password'}
                              type={'password'}
                />
                <div className={'flex justify-end'}>
                    <Button type={"submit"} className={'w-32'}>Submit</Button>
                </div>
            </form>
        </Form>
    )
}

export default AccountSetting