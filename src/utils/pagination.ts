export const buildPaginationResponse = <T>(data: T[], total: number, page: number, limit: number) => {
    const totalPages = Math.ceil(total / limit);
    return {
        data,
        total,
        currentPage: page,
        totalPages,
    };
};
