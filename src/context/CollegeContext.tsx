import React, { createContext, useContext, useEffect, useState } from 'react';
import { College } from '../types';
import { appStore } from '../services/store';

interface CollegeContextType {
  selectedCollegeId: string;
  selectedCollege: College | undefined;
  colleges: College[];
  selectCollege: (collegeId: string) => void;
  isSelectorOpen: boolean;
  openSelector: () => void;
  closeSelector: () => void;
}

const CollegeContext = createContext<CollegeContextType | undefined>(undefined);

export const CollegeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colleges, setColleges] = useState<College[]>(appStore.getColleges());
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>(appStore.getSelectedCollegeId());
  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsub = appStore.subscribe(() => {
      setColleges(appStore.getColleges());
      setSelectedCollegeId(appStore.getSelectedCollegeId());
    });
    return unsub;
  }, []);

  const selectCollege = (collegeId: string) => {
    appStore.setSelectedCollegeId(collegeId);
    setSelectedCollegeId(collegeId);
    setIsSelectorOpen(false);
  };

  const selectedCollege = colleges.find((c) => c.id === selectedCollegeId) || colleges[0];

  return (
    <CollegeContext.Provider
      value={{
        selectedCollegeId,
        selectedCollege,
        colleges,
        selectCollege,
        isSelectorOpen,
        openSelector: () => setIsSelectorOpen(true),
        closeSelector: () => setIsSelectorOpen(false),
      }}
    >
      {children}
    </CollegeContext.Provider>
  );
};

export const useCollege = () => {
  const context = useContext(CollegeContext);
  if (!context) {
    throw new Error('useCollege must be used within a CollegeProvider');
  }
  return context;
};
