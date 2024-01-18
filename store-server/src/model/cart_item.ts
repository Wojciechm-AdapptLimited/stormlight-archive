import {Entity} from "@/base/entity.ts";

class CartItem extends Entity {
    sessionId: string;
    productId: number;
    quantity: number;

    constructor(sessionId: string, productId: number, quantity?: number) {
        if (quantity < 0) {
            throw new Error("Quantity cannot be negative");
        }

        super();
        this.sessionId = sessionId;
        this.productId = productId;
        this.quantity = quantity ?? 0;
    }

    static fromObject(obj: any) {
        return new CartItem(
            obj["session_id"],
            obj["product_id"],
            obj["quantity"]
        );
    }

    static fromArray(arr: any[]) {
        return arr.map(CartItem.fromObject);
    }
}

type CartItemDto = {
    productId: number;
    quantity: number;
}

type CartDto = {
    total: number;
    quantity: number;
}

export {CartItem, CartItemDto, CartDto};