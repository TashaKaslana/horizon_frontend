"use client";

import React, { useState, useEffect } from "react";
import { useMaintenanceStore } from "@/stores/useMaintenanceStore";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { MaintenanceStatusDisplay } from "@/app/components/maintenance-status-display";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MaintenanceSettingsProps {
  className?: string;
}

export const MaintenanceSettings = ({ className }: MaintenanceSettingsProps) => {
  const { isMaintenanceMode, message, toggleMaintenanceMode, setMaintenanceMessage, activatedAt, completionDateTime, setCompletionDateTime } = useMaintenanceStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(isMaintenanceMode);
  const [customMessage, setCustomMessage] = useState(message);
  const [date, setDate] = useState<Date | undefined>(completionDateTime ? parseISO(completionDateTime) : undefined);
  const [time, setTime] = useState<string>(completionDateTime ? format(parseISO(completionDateTime), "HH:mm") : "");
  const [activeTab, setActiveTab] = useState<string>("settings");

  const formattedCompletionTime = completionDateTime
    ? format(parseISO(completionDateTime), "PPP 'at' p")
    : "Not set";

  useEffect(() => {
    setIsEnabled(isMaintenanceMode);
    setCustomMessage(message);
    if (completionDateTime) {
      setDate(parseISO(completionDateTime));
      setTime(format(parseISO(completionDateTime), "HH:mm"));
    }
  }, [isMaintenanceMode, message, completionDateTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEnabled !== isMaintenanceMode) {
        toggleMaintenanceMode();
      }

      if (customMessage !== message) {
        setMaintenanceMessage(customMessage);
      }

      if (date && time) {
        const [hours, minutes] = time.split(":").map(Number);
        const completionDate = new Date(date);
        completionDate.setHours(hours, minutes);
        setCompletionDateTime(completionDate.toISOString());
      } else {
        setCompletionDateTime(null);
      }

      toast.success("Maintenance settings updated successfully");
    } catch (error) {
      toast.error("Failed to update maintenance settings");
      console.error("Error updating maintenance settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const PreviewContext = () => {
    const PreviewMaintenancePage = () => {
      return (
        <div className="overflow-hidden rounded-md border">
          <div className="bg-slate-100 dark:bg-slate-800 py-1 px-3 text-xs flex items-center">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Eye size={14} />
              Preview
            </span>
            <span className="ml-auto text-xs text-muted-foreground">
              {isEnabled ? "Currently active" : "Not currently active"}
            </span>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            <MaintenanceStatusDisplay message={customMessage} />
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <PreviewMaintenancePage />

        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md text-sm">
          <p className="font-medium">Maintenance Status</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Status:</span>
              <Badge variant={isMaintenanceMode ? "destructive" : "outline"}>
                {isMaintenanceMode ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            {completionDateTime && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expected Completion:</span>
                <span>{formattedCompletionTime}</span>
              </div>
            )}
            {activatedAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Activated:</span>
                <span>{format(new Date(activatedAt), "PPP 'at' p")}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`container max-w-3xl py-4 ${className}`}>
      <Tabs defaultValue="settings" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-2">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Maintenance Mode</CardTitle>
                  <CardDescription>When enabled, users will see a maintenance page instead of your site</CardDescription>
                </div>
                <Badge variant={isEnabled ? "destructive" : "outline"}>{isEnabled ? "Enabled" : "Disabled"}</Badge>
              </div>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="maintenance-toggle" className="font-medium">
                    Enable Maintenance Mode
                  </Label>
                  <Switch
                    id="maintenance-toggle"
                    checked={isEnabled}
                    onCheckedChange={setIsEnabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Custom Message</Label>
                  <Textarea
                    id="message"
                    placeholder="We're currently performing scheduled maintenance. We'll be back shortly."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Expected Completion Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate}/>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Expected Completion Time</Label>
                    <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                  </div>
                </div>

                {activatedAt && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                      Maintenance mode was activated on{" "}
                      <span className="font-medium text-foreground">{format(new Date(activatedAt), "PPP 'at' p")}</span>
                    </p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("preview")}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Settings
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Page Preview</CardTitle>
              <CardDescription>This is how your maintenance page will appear to visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <PreviewContext />
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="ml-auto"
                onClick={() => setActiveTab("settings")}
              >
                Back to Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
