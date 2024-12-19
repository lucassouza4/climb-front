import type { Permissions } from "@/enums/user"

export type TokenPayload = {
    iat:number,
    id:string,
    permissions: Permissions[]
}