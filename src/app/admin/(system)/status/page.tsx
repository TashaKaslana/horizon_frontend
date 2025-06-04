"use client"

import { StatusContainer } from "./components/status-container"

export default function StatusPage() {
    const data = {
        database: {
            status: "online",
        },
        maintenance: {
            status: true,
        },
        cloudinary: {
            status: "online",
            latency_ms: "120ms",
            last_checked: ".....(ISO)",
            storage: {
                last_updated: "2025-06-02",
                date_requested: "2025-06-03T00:00:00Z",
                bandwidth: {
                    usage: 287644975,
                    credits_usage: 0.27,
                },
                objects: {
                    usage: 152,
                },
                resources: 105,
                storage: {
                    usage: 406461410,
                    credits_usage: 0.38,
                },
                impressions: {
                    usage: 16,
                    credits_usage: 0.0,
                },
                requests: 358,
                derived_resources: 47,
                media_limits: {
                    video_max_size_bytes: 104857600,
                    image_max_size_bytes: 10485760,
                    image_max_px: 25000000,
                    raw_max_size_bytes: 10485760,
                    asset_max_total_px: 50000000,
                },
                credits: {
                    usage: 1.5,
                    limit: 31.0,
                    used_percent: 4.84,
                },
                transformations: {
                    usage: 846,
                    credits_usage: 0.85,
                    breakdown: {
                        sd_video_second: 79,
                        hd_video_second: 144,
                        transformation: 24,
                    },
                },
                seconds_delivered: {
                    usage: 0,
                    credits_usage: 0.0,
                },
                plan: "Free",
            },
        },
        auth0: {
            status: "offline",
            latency_ms: "120ms",
            last_checked: ".....(ISO)",
            error: "Auth0 service is currently unavailable. Please try again later.",
        },
    }

    return <StatusContainer data={data}/>
}
