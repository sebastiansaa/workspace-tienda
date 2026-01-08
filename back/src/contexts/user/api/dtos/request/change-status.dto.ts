import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

const allowedStatuses = ['ACTIVE', 'SUSPENDED', 'DELETED'] as const;
export type ChangeStatus = (typeof allowedStatuses)[number];

export class ChangeStatusDto {
    @ApiProperty({ enum: allowedStatuses })
    @IsIn(allowedStatuses)
    status: ChangeStatus;
}
