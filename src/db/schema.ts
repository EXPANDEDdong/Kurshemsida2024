import { int, mysqlEnum, mysqlTable, bigint, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';
 
// declaring enum in database
export const countries = mysqlTable('countries', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  name: varchar('name', { length: 256 }),
}, (countries) => ({
  nameIndex: uniqueIndex('name_idx').on(countries.name),
}));
 
export const cities = mysqlTable('cities', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  name: varchar('name', { length: 256 }),
  countryId: int('country_id').references(() => countries.id),
  popularity: mysqlEnum('popularity', ['unknown', 'known', 'popular']),
});