export interface CartItem {
  name: string;
  price: number;
}

export interface CartSummary {
  total: number;
  discountApplied: boolean;
}

export interface DiscountCode {
  code: string;
}
