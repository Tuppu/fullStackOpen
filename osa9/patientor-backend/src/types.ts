import { z } from 'zod';
import { NewPatientSchema as NewPatientSchema } from './utils';

export enum Gender {
    male = "male",
    female = "female",
    other = "other"
}

interface BaseEntry {
    id: string;
    description: string;
    date: string;
    specialist: string;
    diagnosisCodes?: Array<Diagnose['code']>;
}
  
export enum HealthCheckRating {
    Healthy = "0",
    LowRisk = "1",
    HighRisk = "2",
    CriticalRisk = "3"
}

export type Entry =
    | HospitalEntry
    | OccupationalHealthcareEntry
    | HealthCheckEntry;
  
export interface HealthCheckEntry extends BaseEntry {
    type: "HealthCheck";
    healthCheckRating: HealthCheckRating;
}

export type Discharge = {
    date: string,
    criteria: string
};

export interface HospitalEntry extends BaseEntry {
    type: "Hospital";
    discharge: { date: string, criteria: string }
}

export type SickLeave = {
    startDate: string,
    endDate: string
};

export interface OccupationalHealthcareEntry extends BaseEntry {
    type: "OccupationalHealthcare"
    employerName: string;
    sickLeave: SickLeave
}

export interface Patient {
    id: string;
    name: string;
    dateOfBirth: string;
    ssn: string;
    gender: Gender;
    occupation: string;
    entries: Entry[]
}

export interface Diagnose {
    code: string;
    name: string;
    latin?: string;
}

export type NewPatient = z.infer<typeof NewPatientSchema>; 
export type NonSensitivePatient = Omit<NewPatient, 'ssn' | 'entries'>;

// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry without the 'id' property
export type EntryWithoutId = UnionOmit<Entry, 'id'>;
export type EntryWithoutIdType = UnionOmit<Entry, 'id' | 'type'>;