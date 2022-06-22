export interface OrderInterface {
  name: string,
  price: number
}

export interface OrderResultInterface extends OrderInterface {
  discount?: number
}