"use client"

import {UseFormReturn} from "react-hook-form"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Switch} from "@/components/ui/switch"
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import React from "react";
import {useTranslations} from "next-intl";
import {UploadFormInputs} from "@/app/(home)/uploads/schemas/schema";

interface VideoDetailsFormProps {
    handleUpload?: ((e: React.FormEvent) => void) | undefined,
    form: UseFormReturn<UploadFormInputs>
}

export function VideoDetailsForm({form}: VideoDetailsFormProps) {
    const t = useTranslations('Home.upload.form');
    const categories = ["entertainment", "music", "education", "gaming", "tech"];

    return (
        <div className="space-y-6">
            <FormField
                control={form.control}
                name="title"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>{t('title.label')}</FormLabel>
                        <FormControl>
                            <Input
                                placeholder={t('title.placeholder')}
                                className="h-12"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="description"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>{t('description.label')}</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder={t('description.placeholder')}
                                className="min-h-[120px] resize-none"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <FormField
                    control={form.control}
                    name="visibility"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>{t('privacy.label')}</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="h-12 w-56">
                                        <SelectValue placeholder={t('privacy.label')}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PRIVATE">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                                {t('privacy.private')}
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="FRIEND">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                                {t('privacy.unlisted')}
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="PUBLIC">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                {t('privacy.public')}
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="category"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>{t('category.label')}</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="h-12 w-56">
                                        <SelectValue placeholder={t('category.placeholder')}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category.charAt(0).toUpperCase() + category.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </div>

            <div className="space-y-4 pt-2">
                <FormField
                    control={form.control}
                    name="allowComments"
                    render={({field}) => (
                        <FormItem className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <FormLabel>{t('comments.label')}</FormLabel>
                                <p className="text-sm text-muted-foreground">{t('comments.description')}</p>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-label={t('comments.label')}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="ageRestricted"
                    render={({field}) => (
                        <FormItem className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <FormLabel>{t('ageRestriction.label')}</FormLabel>
                                <p className="text-sm text-muted-foreground">{t('ageRestriction.description')}</p>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-label={t('ageRestriction.label')}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}