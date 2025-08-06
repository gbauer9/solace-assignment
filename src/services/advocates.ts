import { asc, count, desc, eq, ilike, or } from "drizzle-orm";
import db from "../db";
import { advocates } from "../db/schema";
import { SortableField } from "@/types/advocates";
import { SortDirection } from "@/types/common";

export async function getAdvocates(
  page: number,
  pageSize: number,
  query: string,
  sortField?: SortableField,
  sortDirection?: SortDirection
) {
  const offset = (page - 1) * pageSize;

  const whereClause = or(
    ilike(advocates.firstName, `%${query}%`),
    ilike(advocates.lastName, `%${query}%`),
    ilike(advocates.city, `%${query}%`),
    ilike(advocates.degree, `%${query}%`),
  );

  let baseQuery = db
    .select()
    .from(advocates)
    .where(whereClause)
    .$dynamic();

  if (sortField) {
    const column = advocates[sortField];
    baseQuery = baseQuery.orderBy(
      sortDirection === "desc" ? desc(column) : asc(column)
    );
  }

  const items = await baseQuery.limit(pageSize).offset(offset);

  const totalCount = (await db.select({ count: count() }).from(advocates).where(whereClause))[0].count;

  return { items, totalCount };
}
