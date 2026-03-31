// src/hooks/useTimezone.js
import { useSelector } from 'react-redux';

export const useTimezone = () => {
  return useSelector((state) => state.timezone.timezone);
};

