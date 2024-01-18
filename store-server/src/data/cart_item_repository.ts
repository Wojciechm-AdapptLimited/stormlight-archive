import {CartItem} from "@/model/cart_item.ts";
import {IRepository} from "@/base/repository.ts";
import {Sql} from "postgres";

export interface ICartItemRepository extends IRepository<CartItem> {
    toArrayCart(sessionId: string): Promise<CartItem[]>;
    clear(sessionId: string): Promise<void>;
    cartTotal(sessionId: string): Promise<number>;
    cartCount(sessionId: string): Promise<number>;
}

export class CartItemRepository implements ICartItemRepository {
    readonly connection: Sql;

    constructor(connection: Sql) {
        this.connection = connection;
    }

    async toArray(): Promise<CartItem[]> {
        const result = await this.connection`
            SELECT *
            FROM "cart_item"
        `;

        return CartItem.fromArray(result);
    }

    async toArrayCart(sessionId: string): Promise<CartItem[]> {
        const result = await this.connection`
            SELECT *
            FROM "cart_item"
            WHERE session_id = ${sessionId}
        `;

        return CartItem.fromArray(result);
    }

    async add(entity: CartItem): Promise<CartItem> {
        const result = await this.connection`
            INSERT INTO "cart_item" (session_id, product_id, quantity)
            VALUES (${entity.sessionId}, ${entity.productId}, ${entity.quantity})
            RETURNING *
        `;

        if (result.length === 0 || !result[0]) {
            throw new Error("Couldn't create cart item");
        }

        return CartItem.fromObject(result[0]);
    }

    async update(entity: CartItem): Promise<CartItem> {
        const result = await this.connection`
            UPDATE "cart_item"
            SET quantity = ${entity.quantity}
            WHERE session_id = ${entity.sessionId} AND product_id = ${entity.productId}
            RETURNING *
        `;

        if (result.length === 0 || !result[0]) {
            throw new Error("Couldn't update cart item");
        }

        return CartItem.fromObject(result[0]);
    }

    async remove(entity: CartItem): Promise<void> {
        const result = await this.connection`
            DELETE FROM "cart_item"
            WHERE session_id = ${entity.sessionId} AND product_id = ${entity.productId}
        `;

        if (result.length === 0 || !result[0]) {
            throw new Error("Couldn't delete cart item");
        }
    }

    async clear(sessionId: string): Promise<void> {
       const result = await this.connection`
            DELETE FROM "cart_item"
            WHERE session_id = ${sessionId}
            RETURNING *
        `;

        if (result.length === 0 || !result[0]) {
            throw new Error("Cart is already empty");
        }
    }

    async count(): Promise<number> {
        const result = await this.connection`
            SELECT COUNT(*) AS count
            FROM "cart_item"
        `;

        if (result.length === 0 || !result[0]) {
            throw new Error("Couldn't count cart items");
        }

        return result[0]["count"];
    }

    async any(): Promise<boolean> {
        const result = await this.connection`
            SELECT EXISTS(
                SELECT 1
                FROM "cart_item"
            )
        `;

        if (result.length === 0 || !result[0]) {
            throw new Error("Couldn't check if cart items exist");
        }

        return result[0]["exists"];
    }

    async find(entity: CartItem): Promise<CartItem | undefined> {
        const result = await this.connection`
            SELECT *
            FROM "cart_item"
            WHERE session_id = ${entity.sessionId} AND product_id = ${entity.productId}
        `;

        if (result.length === 0) {
            return undefined;
        }

        return CartItem.fromObject(result[0]);
    }

    async cartCount(sessionId: string): Promise<number> {
        const result = await this.connection`
            SELECT COALESCE(SUM(quantity), 0) AS count
            FROM "cart_item"
            WHERE session_id = ${sessionId}
        `;

        if (result.length === 0 || !result[0]) {
            throw new Error("Couldn't count cart items");
        }

        return Number(result[0]["count"]);
    }

    async cartTotal(sessionId: string): Promise<number> {
        const result = await this.connection`
            SELECT COALESCE(SUM(p.price * c.quantity), 0.0) AS total
            FROM cart_item c
            JOIN public.product p on p.id = c.product_id
            WHERE session_id = ${sessionId}
        `;

        if (result.length === 0 || !result[0]) {
            throw new Error("Couldn't get cart total")
        }

        return Number(result[0]["total"]);
    }
}
