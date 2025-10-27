/**
 * Generate unique ticket number
 * Format: ADU-YYYYMM-XXXX
 */
export function generateTicketNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `ADU-${year}${month}-${random}`;
}

/**
 * Validate ticket number format
 */
export function isValidTicketNumber(ticketNumber: string): boolean {
  const pattern = /^ADU-\d{6}-\d{4}$/;
  return pattern.test(ticketNumber);
}
