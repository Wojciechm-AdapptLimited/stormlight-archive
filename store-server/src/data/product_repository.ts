import {Product} from "@/model/product.ts";
import {Sql} from "postgres";
import {IRepository} from "@/base/repository.ts";


export interface IProductRepository extends IRepository<Product> {
    toArrayMinified(): Promise<Product[]>;
}

export class ProductRepository implements IProductRepository {
    readonly connection: Sql;

    constructor(connection: Sql) {
        this.connection = connection;
    }

    async toArray(): Promise<Product[]> {
        const result = await this.connection`
            SELECT *
            FROM "product"
        `;

        return Product.fromArray(result);
    }

    async toArrayMinified(): Promise<Product[]> {
        const result = await this.connection`
            SELECT id, name, price, image, quantity
            FROM "product"
        `;

        return Product.fromArray(result);
    }

    async find(entity: Product): Promise<Product | undefined> {
        const result = await this.connection`
            SELECT *
            FROM "product"
            WHERE id = ${entity.id}
        `;

        if (result.length === 0) {
            return undefined;
        }

        return Product.fromObject(result[0]);
    }

    async add(entity: Product): Promise<Product> {
        const result = await this.connection`
            INSERT INTO "product" (name, description, image, category, price, quantity)
            VALUES (${entity.name}, ${entity.description}, ${entity.image}, ${entity.category}, ${entity.price}, ${entity.quantity})
            RETURNING *
        `;

        if (result.length === 0 || !result[0]) {
            throw new Error("Couldn't create product");
        }

        return Product.fromObject(result[0]);
    }
    async update(entity: Product): Promise<Product> {
        const result = await this.connection`
            UPDATE "product"
            SET name = ${entity.name}, description = ${entity.description}, image = ${entity.image}, category = ${entity.category}, price = ${entity.price}, quantity = ${entity.quantity}
            WHERE id = ${entity.id}
            RETURNING *
        `;

        if (result.length === 0) {
            throw new Error("Couldn't update product");
        }

        return Product.fromObject(result[0]);
    }
    async remove(entity:Product): Promise<void> {
        const result = await this.connection`
            DELETE FROM "product"
            WHERE id = ${entity.id}
            RETURNING *
        `;

        if (result.length === 0) {
            throw new Error("Couldn't delete product");
        }
    }

    async count(): Promise<number> {
        const result = await this.connection`
            SELECT COUNT(*)
            FROM "product"
        `;

        if (result.length === 0 || !result[0]) {
            throw new Error("Couldn't count products");
        }

        return result[0]["count"];
    }
    async any(): Promise<boolean> {
        const result = await this.connection`
            SELECT EXISTS(SELECT 1 FROM "product")
        `;

        if (result.length === 0 || !result[0]) {
            throw new Error("Couldn't check if products exist");
        }

        return result[0]["exists"];
    }
}
