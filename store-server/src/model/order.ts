import {Entity} from "@/base/entity.ts";

export class Order extends Entity {
    public readonly id: string
    public readonly sessionId: string
    public readonly total: number

    constructor(id?: string, sessionId: string, total: number) {
        if (total < 0) {
            throw new Error("Total cannot be negative");
        }

        super();
        this.id = id ?? "";
        this.sessionId = sessionId;
        this.total = total;
    }

    static fromObject(obj: any) {
        return new Order(
            obj["id"],
            obj["session_id"],
            obj["total"]
        );
    }

    static fromArray(arr: any[]) {
        return arr.map(Order.fromObject);
    }
}