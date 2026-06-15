import { IsInt, IsNotEmpty, IsUUID, Max, Min } from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  rating: number;

  @IsUUID()
  @IsNotEmpty()
  storeId: string;
}
