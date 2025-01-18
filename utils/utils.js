// Function to get initials from full name
export const getInitials = (fullName) => {
    if (!fullName) return ''; // Handle empty input gracefully
  
    // Split the full name into an array of words
    const nameParts = fullName.trim().split(' ');
  
    // Get the first letter of the first and last name
    const firstInitial = nameParts[0]?.[0] || ''; // First letter of the first name
    const lastInitial = nameParts[nameParts.length - 1]?.[0] || ''; // First letter of the last name
  
    // Combine and return the initials in uppercase
    return (firstInitial + lastInitial).toUpperCase();
  };
  
  // Optional: Add another utility function, for example, date formatting
  export const formatDate = (dateInput) => {
    if (!dateInput) return ''; // Handle empty input gracefully
  
    const date = new Date(dateInput);
    if (isNaN(date)) return 'Invalid Date'; // Handle invalid dates
  
    // Format the date as: Month Day, Year (e.g., January 1, 2023)
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  
  export const url = {
    // BASE_URL: 'http://192.168.1.4:8000',
    BASE_URL: 'http://172.16.86.46:8000', 
  };