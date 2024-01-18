import {UnitOfWork} from "@/base/unit_of_work.ts";
import {Product} from "@/model/product.ts";
import {ProductRepository} from "@/data/product_repository.ts";
import {Result} from "@/base/result.ts";

export class ProductService {
    unitOfWork: UnitOfWork

    constructor(unitOfWork: UnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    async getProducts() {
        return await this.unitOfWork.withTransaction<Product[]>(async (sql) => {
           const repo = new ProductRepository(sql);
           const products = await repo.toArray();
           return Result.Success(products);
        });
    }

    async getProductById(id: number) {
        return await this.unitOfWork.withTransaction<Product>(async (sql) => {
            const repo = new ProductRepository(sql);
            const product = await repo.find(new Product(id));

            if (!product) {
                return Result.Failure<Product>("Product does not exist");
            }

            return Result.Success(product);
        });
    }
}