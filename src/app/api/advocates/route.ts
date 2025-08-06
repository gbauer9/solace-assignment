import { getAdvocates } from "@/services/advocates";
import { AdvocateListResponseSchema } from "@/schemas/advocates";
import { SortDirection, WithPagination } from "@/types/common";
import { AdvocateResponse, SortableField } from "@/types/advocates";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const sortField = searchParams.get("sortField") as SortableField | undefined;
  const sortDirection = searchParams.get("sortDirection") as SortDirection | undefined;
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  const { items, totalCount } = await getAdvocates(page, pageSize, query, sortField, sortDirection);

  const response: WithPagination<AdvocateResponse> = {
    items: AdvocateListResponseSchema.parse(items),
    totalCount,
    page,
    pageSize,
  }

  return Response.json(response);
}
