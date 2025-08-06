import { getAdvocates } from "@/app/services/advocates";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  const { advocateList, totalCount } = await getAdvocates(page, pageSize);

  return Response.json({
    advocateList,
    totalCount,
    page,
    pageSize,
  });
}
