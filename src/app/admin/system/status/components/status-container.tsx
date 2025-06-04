"use client"

import {Badge} from "@/components/ui/badge"
import {AlertTriangle, CheckCircle, Settings} from "lucide-react"
import {DatabaseStatus} from "./database-status"
import {MaintenanceStatus} from "./maintenance-status"
import {CloudinaryStatus} from "@/app/admin/system/status/components/cloudinary-status";
import {Auth0Status} from "@/app/admin/system/status/components/auth0-status";
import {useSystemStatus} from "@/app/admin/system/status/hook/useSystemStatus";
import {Spinner} from "@/components/ui/spinner";

// Define the data structure
export interface StatusData {
    database: {
        status: "online" | "offline"
    },
    maintenance: {
        status: boolean
    },
    cloudinary: {
        status: "online" | "offline",
        latency_ms: string,
        last_checked: string,
        storage: {
            last_updated: string,
            date_requested: string,
            bandwidth: {
                usage: number,
                credits_usage: number,
            },
            objects: {
                usage: number,
            },
            resources: number,
            storage: {
                usage: number,
                credits_usage: number,
            },
            impressions: {
                usage: number,
                credits_usage: number,
            },
            requests: number,
            derived_resources: number,
            media_limits: {
                video_max_size_bytes: number,
                image_max_size_bytes: number,
                image_max_px: number,
                raw_max_size_bytes: number,
                asset_max_total_px: number,
            },
            credits: {
                usage: number,
                limit: number,
                used_percent: number,
            },
            transformations: {
                usage: number,
                credits_usage: number,
                breakdown: {
                    sd_video_second: number,
                    hd_video_second: number,
                    transformation: number,
                },
            },
            seconds_delivered: {
                usage: number,
                credits_usage: number,
            },
            plan: string,
        },
    },
    auth0: {
        status: "online" | "offline",
        latency_ms: string,
        last_checked: string,
    }
}

export const StatusContainer = () => {
    const {data: dataRetrieved, isLoading} = useSystemStatus()
    const data = dataRetrieved as unknown as StatusData;

    if (!data || isLoading) {
        return (
            <div className={'h-screen flex flex-col items-center justify-center'}>
                <Spinner/>
                <div className="text-center py-8">Loading system status...</div>
            </div>
        )
    }

    const isMaintenanceMode = typeof data === 'object' && true && 'maintenance' in data && typeof data.maintenance === 'object' && data.maintenance !== null &&
        'status' in data.maintenance ? data.maintenance.status : false;

    // Check if any service is down
    const servicesDown = Object.entries(data)
        .filter(([key]) => key !== "maintenance")
        .some(([, value]) => typeof value === 'object' && value !== null && 'status' in value && (value).status === "offline")

    const overallStatus = isMaintenanceMode ? "maintenance" : servicesDown ? "degraded" : "operational"

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">System Status</h1>
                <div className="flex items-center justify-center gap-2">
                    {overallStatus === "operational" && (
                        <Badge className="bg-green-500 hover:bg-green-600">
                            <CheckCircle className="h-4 w-4 mr-1"/>
                            All Systems Operational
                        </Badge>
                    )}
                    {overallStatus === "degraded" && (
                        <Badge className="bg-amber-500 hover:bg-amber-600">
                            <AlertTriangle className="h-4 w-4 mr-1"/>
                            Some Systems Degraded
                        </Badge>
                    )}
                    {overallStatus === "maintenance" && (
                        <Badge className="bg-blue-500 hover:bg-blue-600">
                            <Settings className="h-4 w-4 mr-1 animate-spin"/>
                            System Maintenance
                        </Badge>
                    )}
                </div>
                <p className="text-muted-foreground mt-2">Last updated: {new Date().toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DatabaseStatus status={data.database.status as "online" | "offline"}/>
                <MaintenanceStatus status={data?.maintenance.status}/>
                <CloudinaryStatus
                    status={data.cloudinary.status as "online" | "offline"}
                    latency_ms={data.cloudinary.latency_ms}
                    last_checked={data.cloudinary.last_checked}
                    storage={data.cloudinary.storage}
                />
                <Auth0Status
                    status={data.auth0.status as "online" | "offline"}
                    latency_ms={data.auth0.latency_ms}
                    last_checked={data.auth0.last_checked}
                />
            </div>
        </div>
    )
}
