import {Entity} from "@/base/entity.ts";

export class OrderItem extends Entity {
    public readonly orderId;
    public readonly productId;
    public readonly quantity;

    constructor(orderId, productId, quantity) {
        if (quantity < 0) {
            throw new Error("Quantity cannot be negative");
        }
        super();
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
    }
    static fromObject(obj) {
        return new OrderItem(obj["order_id"], obj["product_id"], obj["quantity"]);
    }
    static fromArray(arr) {
        return arr.map(OrderItem.fromObject);
    }
}