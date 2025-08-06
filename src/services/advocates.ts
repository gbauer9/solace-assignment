import { count, ilike, or } from "drizzle-orm";
import db from "../db";
import { advocates } from "../db/schema";

export async function getAdvocates(
  page: number,
  pageSize: number,
) {
  const offset = (page - 1) * pageSize;

  const advocateList = await db
    .select()
    .from(advocates)
    .limit(pageSize)
    .offset(offset);

  const totalCount = (await db.select({ count: count() }).from(advocates))[0]
    .count;

  return { items: advocateList, totalCount };
}
