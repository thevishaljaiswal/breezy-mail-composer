export interface CustomerData {
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  project?: string;
  unitNumber?: string;
  customerID?: string;
}

export const AVAILABLE_PLACEHOLDERS = [
  { key: '{{firstName}}', description: 'Customer first name' },
  { key: '{{lastName}}', description: 'Customer last name' },
  { key: '{{name}}', description: 'Customer full name' },
  { key: '{{email}}', description: 'Customer email address' },
  { key: '{{company}}', description: 'Company name' },
  { key: '{{phone}}', description: 'Phone number' },
  { key: '{{project}}', description: 'Project name' },
  { key: '{{unitNumber}}', description: 'Unit number' },
  { key: '{{customerID}}', description: 'Customer ID' },
];

/**
 * Replace placeholders in text with customer data
 * @param text - Text containing placeholders like {{firstName}}, {{email}}, etc.
 * @param customerData - Customer data object
 * @returns Text with placeholders replaced
 */
export function replacePlaceholders(text: string, customerData: CustomerData): string {
  if (!text || !customerData) return text;

  let result = text;

  // Replace each placeholder with customer data
  result = result.replace(/\{\{firstName\}\}/gi, customerData.firstName || '');
  result = result.replace(/\{\{lastName\}\}/gi, customerData.lastName || '');
  result = result.replace(/\{\{name\}\}/gi, customerData.name || '');
  result = result.replace(/\{\{email\}\}/gi, customerData.email || '');
  result = result.replace(/\{\{company\}\}/gi, customerData.company || '');
  result = result.replace(/\{\{phone\}\}/gi, customerData.phone || '');
  result = result.replace(/\{\{project\}\}/gi, customerData.project || '');
  result = result.replace(/\{\{unitNumber\}\}/gi, customerData.unitNumber || '');
  result = result.replace(/\{\{customerID\}\}/gi, customerData.customerID || '');

  return result;
}

/**
 * Check if text contains any placeholders
 */
export function hasPlaceholders(text: string): boolean {
  return /\{\{[a-zA-Z]+\}\}/g.test(text);
}
