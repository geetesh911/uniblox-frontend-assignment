"use client";

import React, { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/interfaces/product.interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToCart, checkout, generateDiscount, getStats } from "@/apis/apis";

const productsList: Product[] = [
  { id: 1, name: "Product 1", price: 10 },
  { id: 2, name: "Product 2", price: 20 },
  { id: 3, name: "Product 3", price: 30 },
];

export function EcommerceStore() {
  const [products, setProducts] = useState<Product[]>(productsList);
  const [cart, setCart] = useState<Product[]>([]);
  const [discountCode, setDiscountCode] = useState<string>("");
  const queryClient = useQueryClient();
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });

  const { mutate: addProductToCart } = useMutation({
    mutationFn: addToCart,
    mutationKey: ["add-to-cart"],
    onSuccess: (data) => {
      setProducts(
        productsList.filter(
          (product) => !data.responseObject.find((p) => p.name === product.name)
        )
      );
      setCart(data.responseObject);
    },
  });

  const { mutate: checkoutCart } = useMutation({
    mutationFn: checkout,
    mutationKey: ["add-to-cart"],
    onSuccess: async (data) => {
      setCart([]);
      setDiscountCode("");
      setProducts(productsList);

      await queryClient.refetchQueries({
        queryKey: ["stats"],
      });

      alert(`Order placed! Total: $${data.responseObject.total.toFixed(2)}`);
    },
  });

  const { mutate: generateDiscountCode } = useMutation({
    mutationFn: generateDiscount,
    mutationKey: ["add-to-cart"],
    onSuccess: (data) => {
      setDiscountCode(data.responseObject.code);
    },
    onError: () => {
      alert("Discount code cannot be generated");

      setDiscountCode("");
    },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Ecommerce Store</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            {products.map((product) => (
              <div
                key={product.id}
                className="flex justify-between items-center mb-2"
              >
                <span>
                  {product.name} - ${product.price}
                </span>
                <Button onClick={() => addProductToCart(product)}>
                  Add to Cart
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cart</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center mb-2"
              >
                <span>
                  {item.name} - ${item.price}
                </span>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex-col items-start">
            <div className="flex w-full mb-2">
              <Input
                type="text"
                value={discountCode}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setDiscountCode(e.target.value)
                }
                placeholder="Enter discount code"
                className="mr-2"
              />
              <Button onClick={() => generateDiscountCode()} className="mx-2">
                Generate
              </Button>
            </div>
            <Button
              onClick={() =>
                checkoutCart(discountCode ? { discountCode } : undefined)
              }
              className="w-full"
            >
              Checkout
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Admin Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Stats</h3>
              <p>
                Items Purchased: {stats?.responseObject.itemsPurchased ?? 0}
              </p>
              <p>
                Total Purchase: $
                {stats?.responseObject.totalPurchaseAmount.toFixed(2) ?? 0}
              </p>
              <p>
                Total Discount: $
                {stats?.responseObject.totalDiscountAmount.toFixed(2) ?? 0}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Discount Codes</h3>
              {stats?.responseObject.discountCodes.map((code, index) => (
                <p key={index}>{code}</p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
