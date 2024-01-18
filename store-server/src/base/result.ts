export class Result<T> {
    public readonly success: boolean;
    public readonly value: T | undefined
    public readonly error: string | undefined;

    private constructor(success: boolean, value: T | undefined, error: string | undefined) {
        this.success = success;
        this.value = value;
        this.error = error;
    }

    public static Success<T>(value: T | undefined): Result<T> {
        return new Result<T>(true, value, undefined);
    }

    public static Failure<T>(error: string): Result<T> {
        return new Result<T>(false, undefined, error);
    }
}