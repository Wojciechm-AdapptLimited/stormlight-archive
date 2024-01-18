import {Entity} from "@/base/entity.ts";

class Product extends Entity {
    readonly id: number;
    name: string;
    description: string | null;
    image: string | null;
    category: string;
    price: number;
    quantity: number;

    constructor(id: number, name?: string, price?: number, quantity?: number, category?: string, image?: string, description?: string) {
        if (name && name.length === 0) {
            throw new Error("Name cannot be empty");
        }

        if (price && price < 0) {
            throw new Error("Price cannot be negative");
        }

        if (quantity && quantity < 0) {
            throw new Error("Quantity cannot be negative");
        }

        super();
        this.id = id;
        this.name = name ?? "";
        this.description = description ?? null;
        this.category = category ?? "";
        this.price = price ?? 0;
        this.quantity = quantity ?? 0;
        this.image = image ?? null;
    }

    static fromObject(obj: any) {
        return new Product(
            obj["id"],
            obj["name"],
            obj["price"],
            obj["quantity"],
            obj["category"],
            obj["image"],
            obj["description"]
        );
    }

    static fromArray(arr: any[]) {
        return arr.map(Product.fromObject);
    }
}

type ProductMiniDto = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    category: string;
    image?: string;
}

type ProductDto = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    category: string;
    image?: string;
    description?: string;
}

export {Product, ProductDto, ProductMiniDto};