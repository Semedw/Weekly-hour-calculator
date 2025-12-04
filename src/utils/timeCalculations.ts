/**
 * Calculate valid hours spent at school for a given check-in and check-out time.
 * Only counts hours between 09:00 and 18:00.
 * 
 * @param checkIn - Check-in time string in HH:mm format
 * @param checkOut - Check-out time string in HH:mm format
 * @returns Number of valid hours (with decimals), or 0 if invalid
 */
export function calculateDailyHours(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;

  // Parse times
  const [inHour, inMin] = checkIn.split(':').map(Number);
  const [outHour, outMin] = checkOut.split(':').map(Number);

  // Create date objects for today (date doesn't matter, only time)
  const checkInTime = new Date();
  checkInTime.setHours(inHour, inMin, 0, 0);

  const checkOutTime = new Date();
  checkOutTime.setHours(outHour, outMin, 0, 0);

  // Define valid window: 09:00 to 18:00
  const validStart = new Date();
  validStart.setHours(9, 0, 0, 0);

  const validEnd = new Date();
  validEnd.setHours(18, 0, 0, 0);

  // Clamp check-in to valid window
  const clampedCheckIn = new Date(Math.max(checkInTime.getTime(), validStart.getTime()));

  // Clamp check-out to valid window
  const clampedCheckOut = new Date(Math.min(checkOutTime.getTime(), validEnd.getTime()));

  // If clamped check-out is before or equal to clamped check-in, no valid hours
  if (clampedCheckOut <= clampedCheckIn) return 0;

  // Calculate duration in milliseconds
  const durationMs = clampedCheckOut.getTime() - clampedCheckIn.getTime();

  // Convert to hours
  const hours = durationMs / (1000 * 60 * 60);

  return Number(hours.toFixed(2));
}

export interface TimeSession {
  checkIn: string;
  checkOut: string;
}

export interface DayData {
  day: string;
  sessions: TimeSession[];
}

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export const WEEKLY_REQUIREMENT = 15;

/**
 * Format hours to "XX H XX Min" format
 * @param hours - Number of hours (can have decimals)
 * @returns Formatted string like "2 H 30 Min"
 */
export function formatHoursMinutes(hours: number): string {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const min = totalMinutes % 60;
  return `${h}h ${min}min`;
}
