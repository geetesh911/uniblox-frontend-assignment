// src/api.ts
import { OrderStats } from "@/interfaces/admin.interface";
import { BaseServerResponse } from "@/interfaces/base-server-response.interface";
import {
  CartItem,
  CartSummary,
  DiscountCode,
} from "@/interfaces/cart.interface";
import { Product } from "@/interfaces/product.interface";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const addToCart = async (
  item: CartItem
): Promise<BaseServerResponse<Product[]>> => {
  const response = await apiClient.post("/cart/add", item);

  return response.data;
};

export const checkout = async (payload?: {
  discountCode?: string;
}): Promise<BaseServerResponse<CartSummary>> => {
  const response = await apiClient.post("/checkout", payload);

  return response.data;
};

export const generateDiscount = async (): Promise<
  BaseServerResponse<DiscountCode>
> => {
  const response = await apiClient.post("/admin/generate-discount");
  return response.data;
};

export const getStats = async (): Promise<BaseServerResponse<OrderStats>> => {
  const response = await apiClient.get("/admin/stats");
  return response.data;
};
