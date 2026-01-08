import { adminApi } from "../api/adminApi";
import { mapAdminInventory } from "./mappers";
import type { AdjustStockDto, AdminInventoryMovementDTO } from "../interfaces";
import { requireAdmin } from "../helpers/permissions";

export const getAdminInventoryByProductId = async (productId: number) => {
    requireAdmin();
    const response = await adminApi.getInventoryByProductId(productId);
    return mapAdminInventory(response.data);
};

export const getAdminInventoryMovements = async (productId: number): Promise<AdminInventoryMovementDTO[]> => {
    requireAdmin();
    const response = await adminApi.getInventoryMovements(productId);
    return response.data;
};

const runStockMutation = async (
    productId: number,
    body: AdjustStockDto,
    action: "increase" | "decrease" | "reserve" | "release",
) => {
    requireAdmin();
    switch (action) {
        case "increase":
            return mapAdminInventory((await adminApi.increaseInventory(productId, body)).data);
        case "decrease":
            return mapAdminInventory((await adminApi.decreaseInventory(productId, body)).data);
        case "reserve":
            return mapAdminInventory((await adminApi.reserveInventory(productId, body)).data);
        case "release":
            return mapAdminInventory((await adminApi.releaseInventory(productId, body)).data);
        default:
            throw new Error("Invalid inventory action");
    }
};

export const increaseAdminInventory = (productId: number, body: AdjustStockDto) => runStockMutation(productId, body, "increase");
export const decreaseAdminInventory = (productId: number, body: AdjustStockDto) => runStockMutation(productId, body, "decrease");
export const reserveAdminInventory = (productId: number, body: AdjustStockDto) => runStockMutation(productId, body, "reserve");
export const releaseAdminInventory = (productId: number, body: AdjustStockDto) => runStockMutation(productId, body, "release");
