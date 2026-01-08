export interface AdminInventoryDTO {
  productId: number;
  onHand: number;
  reserved: number;
  available: number;
}

export type AdjustStockType = 'INCREASE' | 'DECREASE' | 'RESERVE' | 'RELEASE';

export interface AdjustStockDto {
  quantity: number;
  reason: string;
  type: AdjustStockType;
}

export interface AdminInventoryMovementDTO {
  id: string;
  productId: number;
  type: AdjustStockType | 'RESERVATION' | 'RELEASE';
  reason: string;
  quantity: number;
  onHandAfter: number;
  reservedAfter: number;
  createdAt: string;
}
