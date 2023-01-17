export interface JwtDTO {
    token: string;
    type: string;
    user: string;
    role: string;
    authorities: string[];
}