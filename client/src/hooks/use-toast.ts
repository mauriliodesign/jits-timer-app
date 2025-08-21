// Simple Toast Hook
export const toast = {
  success: (message: string) => {
    console.log('Toast Success:', message);
  },
  error: (message: string) => {
    console.error('Toast Error:', message);
  },
  info: (message: string) => {
    console.log('Toast Info:', message);
  }
};
