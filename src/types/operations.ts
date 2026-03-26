export interface ExtraService {
    id: string;
    serviceId: string;
    serviceName: string;
    amount: number;
    employeeId: string | null;
    employeeName: string | null;
    createdAt: string;
}

export interface RecordData {
    id: string;
    clientId: string;
    status: string;
    amount: number;
    boxNumber: string | null;
    createdAt: string;
    clientName: string;
    serviceName: string;
    serviceCategory: string | null;
    employeeName: string | null;
    employeeId: string | null;
    hasReview: boolean;
    extraServices: ExtraService[];
}
