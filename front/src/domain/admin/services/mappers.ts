import type { AdminUserDTO } from "../interfaces/AdminUser";
import type { AdminProductDTO } from "../interfaces/AdminProduct";
import type { AdminOrderDTO, AdminOrderItemDTO } from "../interfaces/AdminOrder";
import type { AdminInventoryDTO } from "../interfaces/AdminInventory";
import type { AdminPaymentDTO } from "../interfaces/AdminPayment";
import type { AdminCategoryDTO } from "../interfaces/AdminCategory";

export const mapAdminUser = (dto: AdminUserDTO) => ({
    ...dto,
});

export const mapAdminProduct = (dto: AdminProductDTO) => ({
    ...dto,
    stock: dto.stock ?? 0,
    active: dto.active ?? true,
});

export const mapAdminOrderItem = (dto: AdminOrderItemDTO) => ({
    ...dto,
    lineTotal: dto.lineTotal ?? dto.price * dto.quantity,
});

export const mapAdminOrder = (dto: AdminOrderDTO) => ({
    ...dto,
    items: (dto.items ?? []).map(mapAdminOrderItem),
});

export const mapAdminInventory = (dto: AdminInventoryDTO) => ({
    ...dto,
    available: dto.available ?? Math.max(0, dto.onHand - dto.reserved),
});

export const mapAdminPayment = (dto: AdminPaymentDTO) => ({
    ...dto,
});

export const mapAdminCategory = (dto: AdminCategoryDTO) => ({
    ...dto,
    image: dto.image ?? "",
    description: dto.description ?? "",
    sortOrder: dto.sortOrder ?? 0,
    active: dto.active ?? true,
});
