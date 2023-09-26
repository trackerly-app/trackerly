import {create} from 'zustand';
import { Application, Company } from '../../types';

export type Store = {
  user_id: number;
  applications: Application[];
  companies: Company[];
  setUserId: (id: number) => void;
  setApplications: (applications: Application[]) => void;
  setCompanies: (companies: Company[]) => void;
}

const useStore = create<Store>((set) => ({
  user_id: 3,
  applications: [],
  companies: [],
  setUserId(id) {
    set((state) => ({
      ...state,
      user_id: id
    }));
  },
  setApplications(applications) {
    set((state) => ({
      ...state,
      applications: applications
    }));
  },
  setCompanies(companies) {
    set((state) => ({
      ...state,
      companies: companies
    }));
  },
}));

export default useStore;


