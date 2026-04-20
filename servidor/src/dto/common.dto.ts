import type { UserDTO } from "./auth.dto";

export interface GenericResponseDto {
  success: boolean;
  error?: string;
  details?: string;
  token?: string;
}
