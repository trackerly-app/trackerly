import Application from '@/app/application/page';
import axios from 'axios';
import { StateCreator } from 'zustand';

export interface Application {
  id: number;
  company_id: number;
  name: string;
  websit: string;
  position: string;
  salary: number;
  status: string; // enumerated status
  notes: string;
  application_url: string;
  created_on: Date;
}

export interface ApplicationSlice {
  applications: Application[];
  fetchApplications: () => void;
  saveApplication: (app: Application) => void;
}

export const createApplicationSlice: StateCreator<ApplicationSlice> = (
  set
) => ({
  applications: [],
  fetchApplications: async () => {
    const res = await axios.get('http://localhost:4000/getAllApplications/');
    set({ applications: res.data });
  },
  saveApplication: async (formData) => {
    const res = await axios.put(
      'http://localhost:4000/updateApplication/',
      formData,
      { headers: { 'Content-Type': 'application/json' } }
    );
    set((state) => ({ applications: [...state.applications, res.data] }));
  },
});
