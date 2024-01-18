import { Order } from "@/model/order.ts";
import { IRepository } from "@/base/repository.ts";
import { Sql } from "postgres";
import {OrderItem} from "@/model/order_item.ts";

export interface IOrderRepository extends IRepository<Order> {
    orderItems(entity: Order): Promise<OrderItem>
}

export class OrderRepository implements IOrderRepository {
    readonly connection: Sql;

    constructor(connection: Sql) {
        this.connection = connection;
    }

    async add(entity: Order): Promise<Order> {
        const result = await this.connection`
            INSERT INTO "order" (session_id, total)
            VALUES (${entity.sessionId}, ${entity.total})
            RETURNING *
        `;

        if (result.length === 0 || !result[0]) {
            throw new Error("Couldn't create order");
        }

        return Order.fromObject(result[0]);
    }

    async any(): Promise<boolean> {
        const result = await this.connection`
            SELECT EXISTS(
                SELECT 1
                FROM "order"
            )
        `;

        if (result.length === 0 || !result[0]) {
            throw new Error("Couldn't check if any orders exist");
        }

        return result[0]["exists"];
    }

    async count(): Promise<number> {
        const result = await this.connection`
            SELECT COUNT(*) AS count
            FROM "order"
        `;

        if (result.length === 0 || !result[0]) {
            throw new Error("Couldn't count orders");
        }

        return result[0]["count"];
    }

    async find(entity: Order): Promise<Order | undefined> {
        const result = await this.connection`
            SELECT *
            FROM "order"
            WHERE id = ${entity.id}
        `;

        if (result.length === 0) {
            return undefined;
        }

        return Order.fromObject(result[0]);
    }

    async remove(entity: Order): Promise<void> {
        const result = await this.connection`
            DELETE FROM "order"
            WHERE id = ${entity.id}
        `;

        if (result.length === 0 || !result[0]) {
            throw new Error("Couldn't delete order");
        }

        return;
    }

    async toArray(): Promise<Order[]> {
        const result = await this.connection`
            SELECT *
            FROM "order"
        `;

        if (result.length === 0) {
            return [];
        }

        return Order.fromArray(result);
    }

    async update(entity: Order): Promise<Order> {
        const result = await this.connection`
            UPDATE "order"
            SET session_id = ${entity.sessionId}, total = ${entity.total}
            WHERE id = ${entity.id}
            RETURNING *
        `;

        if (result.length === 0 || !result[0]) {
            throw new Error("Couldn't update order");
        }

        return Order.fromObject(result[0]);
    }

    async orderItems(entity: Order) {
        const result = await this.connection`
            INSERT INTO order_item (order_id, product_id, quantity)
            SELECT ${entity.id}, product_id, quantity
            FROM cart_item
            WHERE session_id = ${entity.sessionId}
            RETURNING product_id, quantity
        `;

        if (result.length === 0 || !result[0]) {
            throw new Error("Couldn't create order items");
        }

        return OrderItem.fromArray(result);
    }
}