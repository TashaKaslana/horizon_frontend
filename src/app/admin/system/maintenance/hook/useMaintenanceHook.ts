import {useMutation, useQuery} from "@tanstack/react-query";
import {useMaintenanceStore} from "@/stores/useMaintenanceStore";
import {
    disableMaintenanceMutation,
    enableMaintenanceMutation,
    getStatusMaintenanceOptions
} from "@/api/client/@tanstack/react-query.gen";
import {toast} from "sonner";
import {MaintenanceRequestDto, MaintenanceInfoDto} from "@/api/client";
import {useCallback, useEffect} from "react";

const useMaintenanceHook = () => {
    const {
        isMaintenanceMode,
        setActivatedAt,
        setMaintenanceMessage,
        setCompletionDateTime
    } = useMaintenanceStore();

    const updateMaintenanceStore = useCallback((maintenanceInfo: MaintenanceInfoDto) => {
        const currentState = useMaintenanceStore.getState();

        if (maintenanceInfo.active !== undefined && currentState.isMaintenanceMode !== maintenanceInfo.active) {
            useMaintenanceStore.setState({ isMaintenanceMode: maintenanceInfo.active });
        }

        if (maintenanceInfo.message && currentState.message !== maintenanceInfo.message) {
            setMaintenanceMessage(maintenanceInfo.message);
        }

        if (maintenanceInfo.activatedAt && currentState.activatedAt !== maintenanceInfo.activatedAt) {
            setActivatedAt(maintenanceInfo.activatedAt);
        }

        if (maintenanceInfo.completionDateTime && currentState.completionDateTime !== maintenanceInfo.completionDateTime) {
            setCompletionDateTime(maintenanceInfo.completionDateTime);
        }
    }, [setActivatedAt, setCompletionDateTime, setMaintenanceMessage]);

    const {data, isLoading} = useQuery({
        ...getStatusMaintenanceOptions(),
        enabled: typeof window !== 'undefined'
    });

    useEffect(() => {
        if (data?.data) {
            const maintenanceInfo: MaintenanceInfoDto = data.data;
            updateMaintenanceStore(maintenanceInfo);
        }
    }, [data?.data, updateMaintenanceStore]);

    const {mutate: enableMutate, isPending: isEnablePending} = useMutation({
        ...enableMaintenanceMutation(),
        onSuccess: (data1) => {
            toast.success(data1.message);
            if (data1.data !== undefined) {
                updateMaintenanceStore(data1.data);
            }
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const {mutate: disableMutate, isPending: isDisablePending} = useMutation({
        ...disableMaintenanceMutation(),
        onSuccess: (data1) => {
            toast.success(data1.message);
            if (data1.data !== undefined) {
                updateMaintenanceStore(data1.data);
            }
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
    
    const toggleMaintenance = (data?: MaintenanceRequestDto) => {
        if (isMaintenanceMode) {
            disableMutate({});
        } else {
            enableMutate({body: data});
        }
    };

    return {
        data,
        isLoading,
        isEnablePending,
        isDisablePending,
        toggleMaintenance
    };
};

export default useMaintenanceHook;