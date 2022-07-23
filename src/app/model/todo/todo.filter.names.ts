export const ALL = 'all';
export const ACTIVE = 'active';
export const COMPLETED = 'completed';

type FilterType = typeof ALL | typeof ACTIVE | typeof COMPLETED
export default FilterType
