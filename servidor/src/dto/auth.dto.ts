import type { GenericResponseDto } from "./common.dto";

export interface UserDTO {
    id: number;
    email: string;
    role: string;
}
export interface RegisterResponseDto extends GenericResponseDto {
  user?: UserDTO;
}