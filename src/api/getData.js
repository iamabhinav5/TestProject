import {useQuery} from "@tanstack/react-query";

export async function getData() {
  const response = await fetch("https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete", {});
  const data = await response.json();

  return data;
}

export function useData() {
  return useQuery({
    queryKey: ["data", "getData"],
    queryFn: async () => getData(),
  });
}
