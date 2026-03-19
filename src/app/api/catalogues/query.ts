import { useQuery } from "@tanstack/react-query";
import { getCatalogueByName, getCatalogueByNameWithCursor } from "./api";

export function useGetCatalogueQuery(locId: number, name: string = "") {
  return useQuery({
    queryKey: ["catalogue", name],
    queryFn: async () => {
      const response = await getCatalogueByName(name, locId);

      if (!response) {
        return [];
      }

      return response.data.map((item: any) => ({
        ...item,
      }));
    },
    enabled: !!locId
  });
}

export function useGetCatalogueQueryWithCursor(locId: number, name: string = "", cursor: string | null = null, filter_stock: boolean = false) {
  return useQuery({
    queryKey: ["catalogue", locId],
    queryFn: async () => {
      if (locId == 0) {
        return { data: [], nextCursor: null, prevCursor: null };
      }

      const response = await getCatalogueByNameWithCursor(name, locId, cursor, filter_stock);

      if (!response) {
        return { data: [], nextCursor: null, prevCursor: null };
      }

      const result = response.data
      if (!result) {
        return { data: [], nextCursor: null, prevCursor: null };
      }

      return {
        data: result.data.map((item: any) => ({
          ...item,
        })),
        nextCursor: result.nextCursor,
        prevCursor: result.prevCursor,
      };
    },
    enabled: !!locId
  });
}
