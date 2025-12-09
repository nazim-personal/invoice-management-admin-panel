import { ApiResponse } from "./api";
import { DeletedResponse } from "./customers";

export interface ProductDataTypes {
  id: string;
  name: string;
  description: string;
  product_code: string;
  stock: number;
  price: number;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export type ProductsApiResponseTypes<T = ProductDataTypes | ProductDataTypes[] | DeletedResponse> = ApiResponse<T>;
export type ProductDetailsApiResponseType = ApiResponse<ProductDataTypes>;
