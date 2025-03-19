"use client"

import {UseFormReturn} from "react-hook-form"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Switch} from "@/components/ui/switch"
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import React from "react";
import {uploadSchema} from "@/app/(home)/uploads/schemas/schema";
import {z} from "zod";

interface VideoDetailsFormProps {
    handleUpload?: ((e: React.FormEvent) => void) | undefined,
    form: UseFormReturn<z.infer<typeof uploadSchema>>
}

export function VideoDetailsForm({form}: VideoDetailsFormProps) {
    return (
        <div className="space-y-6">
            <FormField
                control={form.control}
                name="title"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input placeholder="Add a title that describes your video" className="h-12" {...field} />
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
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Tell viewers about your video"
                                      className="min-h-[120px] resize-none" {...field} />
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
                            <FormLabel>Visibility</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="h-12 w-56">
                                        <SelectValue placeholder="Select visibility"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="private">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                                Private
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="unlisted">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                                Unlisted
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="public">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                Public
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
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="h-12 w-56">
                                        <SelectValue placeholder="Select category"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="entertainment">Entertainment</SelectItem>
                                        <SelectItem value="music">Music</SelectItem>
                                        <SelectItem value="education">Education</SelectItem>
                                        <SelectItem value="gaming">Gaming</SelectItem>
                                        <SelectItem value="tech">Technology</SelectItem>
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
                                <FormLabel>Comments</FormLabel>
                                <p className="text-sm text-muted-foreground">Allow viewers to comment</p>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange}/>
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
                                <FormLabel>Age restriction</FormLabel>
                                <p className="text-sm text-muted-foreground">Restrict to viewers 18+</p>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange}/>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
}