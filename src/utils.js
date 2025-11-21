export const generateUniqueCode = () => {
    return 'TRIP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};
