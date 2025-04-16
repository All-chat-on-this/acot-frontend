// Common API Response Type
export interface CommonResult<T> {
    code: number;
    msg: string;
    data: T;
}