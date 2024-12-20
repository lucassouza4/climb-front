import type { Type } from "@/enums/user"

export type User = {
    id: string
    name: string
    email: string
    score:number
    type:Type
    rank:number
}

export type UserAuth = {
    id: string
    name: string
    email: string
    score: number
    type:number
    token: string
}