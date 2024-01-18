import postgres from "postgres";
import {Result} from "@/base/result.ts";

export class UnitOfWork {
    options: postgres.Options<{}>

    constructor(options: postgres.Options<{}>) {
        this.options = options;
    }

    async withTransaction<T>(fn: (sql: postgres.Sql<{}>) => Promise<Result<T>>): Promise<Result<T>> {
        const connection = postgres(this.options);
        try {
            return await connection.begin(sql => fn(sql));
        } catch (e) {
            return Result.Failure<T>(e.message);
        } finally {
            await connection.end();
        }
    }
}