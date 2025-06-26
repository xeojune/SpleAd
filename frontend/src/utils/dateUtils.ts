/**
 * Date utility functions for campaign management
 */

/**
 * Convert a date string in format YYYY/MM/DD to a Date object in JST
 * @param dateStr Date string in format YYYY/MM/DD
 * @returns Date object in JST
 */
export const parseJSTDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Get current date in JST
 * @returns Current date in JST
 */
export const getCurrentJSTDate = (): Date => {
  const now = new Date();
  const jstNow = new Date(now.getTime() + (9 * 60 * 60 * 1000)); // Convert to JST
  jstNow.setHours(0, 0, 0, 0); // Start of day
  return jstNow;
};

/**
 * Check if a date range includes the current date
 * @param periodStr Date range string in format "YYYY/MM/DD ~ YYYY/MM/DD"
 * @returns boolean indicating if current date is within range
 */
export const isDateInRange = (periodStr: string): boolean => {
  try {
    const [startStr, endStr] = periodStr.split(' ~ ');
    const startDate = parseJSTDate(startStr);
    const endDate = parseJSTDate(endStr);
    endDate.setHours(23, 59, 59, 999); // End of day

    const now = getCurrentJSTDate();
    
    console.log('Date check:', {
      currentDate: now.toISOString(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isActive: now >= startDate && now <= endDate
    });

    return now >= startDate && now <= endDate;
  } catch (error) {
    console.error('Error parsing date range:', error);
    return false;
  }
};

export type RecruitmentStatus = 'オープン予定' | '募集中' | '募集終了';

/**
 * Check recruitment status based on date range
 * @param periodStr Date range string in format "YYYY/MM/DD ~ YYYY/MM/DD"
 * @returns Recruitment status in Japanese
 */
export const getRecruitmentStatus = (periodStr: string): RecruitmentStatus => {
  try {
    const [startStr, endStr] = periodStr.split(' ~ ');
    const startDate = parseJSTDate(startStr);
    const endDate = parseJSTDate(endStr);
    endDate.setHours(23, 59, 59, 999); // End of day

    const now = getCurrentJSTDate();
    
    console.log('Date check:', {
      currentDate: now.toISOString(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });

    if (now < startDate) {
      return 'オープン予定';
    } else if (now > endDate) {
      return '募集終了';
    } else {
      return '募集中';
    }
  } catch (error) {
    console.error('Error parsing date range:', error);
    return '募集終了';
  }
};
