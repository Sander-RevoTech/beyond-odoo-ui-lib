export const graphQlBydke = (take?: number | null) => {
  return `take: ${take || 1000}`;
};

export const graphQlPaginationFields = () => {
  return `
        pageInfo {
            hasNextPage
            hasPreviousPage
        }
        totalCount
    `;
};
