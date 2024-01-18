import {UnitOfWork} from "@/base/unit_of_work.ts";
import {CartItem} from "@/model/cart_item.ts";
import {CartItemRepository} from "@/data/cart_item_repository.ts";
import {Result} from "@/base/result.ts";
import {ProductRepository} from "@/data/product_repository.ts";
import {Product} from "@/model/product.ts";
import {Order} from "@/model/order.ts";
import {OrderRepository} from "@/data/order_repository.ts";

export class CartItemService {
    unitOfWork: UnitOfWork

    constructor(unitOfWork: UnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    async addToCart(sessionId: string, productId: number, quantity: number) {
        if (quantity < 0) {
            return Result.Failure<CartItem>("Quantity can't be negative");
        }

        return await this.unitOfWork.withTransaction<CartItem>(async (sql) => {
            const cartRepo = new CartItemRepository(sql);
            const productRepo = new ProductRepository(sql);

            const product = await productRepo.find(new Product(productId));

            if (!product) {
                return Result.Failure<CartItem>("Product does not exist");
            }

            if (product.quantity < quantity) {
                return Result.Failure<CartItem>("Not enough product in stock");
            }

            let cartItem = await cartRepo.find(new CartItem(sessionId, productId));

            if (!cartItem && quantity === 0) {
                return Result.Failure("Quantity for the new cart item cannot be 0")
            } else if (cartItem && quantity === 0) {
                const updatedCart = await cartRepo.remove(cartItem);
                return Result.Success(updatedCart);
            } else if (cartItem) {
                cartItem.quantity = quantity;
                const updatedCart = await cartRepo.update(cartItem);
                return Result.Success(updatedCart);
            }

            cartItem = await cartRepo.add(new CartItem(sessionId, productId, quantity));
            return Result.Success(cartItem);
        });
    }

    async getCart(sessionId: string) {
        return await this.unitOfWork.withTransaction<CartItem[]>(async (sql) => {
            const repo = new CartItemRepository(sql);
            const cartItems = await repo.toArrayCart(sessionId);

            return Result.Success(cartItems);
        });
    }

    async clearCart(sessionId: string) {
        return await this.unitOfWork.withTransaction<void>(async (sql) => {
            const repo = new CartItemRepository(sql);
            await repo.clear(sessionId);
            return Result.Success(undefined);
        });
    }

    async getCartTotal(sessionId: string) {
        return await this.unitOfWork.withTransaction<number>(async (sql) => {
            const repo = new CartItemRepository(sql);
            const total = await repo.cartTotal(sessionId);
            return Result.Success(total);
        });
    }

    async getCartQuantity(sessionId: string) {
        return await this.unitOfWork.withTransaction<number>(async (sql) => {
            const repo = new CartItemRepository(sql);
            const count = await repo.cartCount(sessionId);
            return Result.Success(count);
        });
    }

    async checkoutCart(sessionId: string) {
        return await this.unitOfWork.withTransaction<Order>(async (sql) => {
            const cartRepo = new CartItemRepository(sql);
            const orderRepo = new OrderRepository(sql);
            const productRepo = new ProductRepository(sql);

            const cartItems = await cartRepo.toArrayCart(sessionId);

            if (cartItems.length === 0) {
                return Result.Failure<Order>("Cart is empty");
            }

            const total = await cartRepo.cartTotal(sessionId);
            const order = await orderRepo.add(new Order(undefined, sessionId, total));

            for (const cartItem of cartItems) {
                const product = await productRepo.find(new Product(cartItem.productId));

                if (!product) {
                    return Result.Failure<Order>("Product does not exist");
                }

                if (product.quantity < cartItem.quantity) {
                    return Result.Failure<Order>("Not enough product in stock");
                }

                product.quantity -= cartItem.quantity;
                await productRepo.update(product);
            }

            await orderRepo.orderItems(order);
            await cartRepo.clear(sessionId);

            return Result.Success(order);
        });
    }

}