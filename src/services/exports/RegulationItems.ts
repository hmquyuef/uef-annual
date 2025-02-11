import { DefaultItem } from "./exportDetailForUser";

export interface RegulationItems {
    employees: Employees;
    lecture: Lecture;
}

export interface Lecture extends DefaultItem {
    detail: {
        notifiedAbsences: number;
        unnotifiedAbsences: number;
        lateEarly: number;
        entryDate: number;
    }
}

export interface Employees extends DefaultItem {
    detail: {
        attendanceDays: number;
        attendanceHours: number;
        lateArrivals: number;
        earlyDepartures: number;
        unexcusedAbsences: number;
        leaveDays: number;
        maternityLeaveDays: number;
        unpaidLeaveDays: number;
        businessTripDays: number;
        missedFingerprint: number;
        entryDate: number;
    }
}