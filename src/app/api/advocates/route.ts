import { getAdvocates } from "@/services/advocates";
import { AdvocateListResponseSchema } from "@/schemas/advocates";
import { WithPagination } from "@/types/common";
import { AdvocateResponse } from "@/types/advocates";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  const { items, totalCount } = await getAdvocates(page, pageSize);

  const response: WithPagination<AdvocateResponse> = {
    items: AdvocateListResponseSchema.parse(items),
    totalCount,
    page,
    pageSize,
  }

  return Response.json(response);
}
