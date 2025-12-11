// validate helper
export const validatePrice = (price: number, min: number, max: number) =>
    price >= min && price <= max;

export const validateScore = (score: number) =>
    score >= 8;
