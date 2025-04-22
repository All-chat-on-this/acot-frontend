// Main API Service
import {PreferenceService} from "@/api/type/preferenceApi.ts";
import {AuthService} from "@/api/type/authApi.ts";
import {ConversationService, MessageService} from "@/api/type/modelApi.ts";
import {ConfigService} from "@/api/type/configApi.ts";
import {AxiosInstance} from "axios";
import {UserService} from "@/api/type/userApi.ts";

export interface ApiService {
    auth: AuthService;
    conversations: ConversationService;
    messages: MessageService;
    configs: ConfigService;
    preference: PreferenceService;
    user: UserService;
    client: AxiosInstance; // AxiosInstance
    env: {
        isDevelopment: boolean;
        isProduction: boolean;
    };
}

export interface CommonResult<T> {
    code: number;
    msg: string;
    data: T;
}