import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Company } from '../../types';
import {
  ApplicationSlice,
  createApplicationSlice,
} from './slices/createApplicationSlice';

export type Store = {
  user_id: number;
  companies: Company[];
  resumes: any;
  setUserId: (id: number) => void;
  setCompanies: (companies: Company[]) => void;
  setResumes: (resumes: any) => void;
};

export const useStore = create<Store>()(
  persist((...a) => ({
    ...createApplicationSlice(...a),
  })),
  {}
);
