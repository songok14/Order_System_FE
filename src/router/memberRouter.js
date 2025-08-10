import MemberCreate from "@/components/Oauth/MemberCreate.vue";
import MemberLogin from "@/components/Oauth/MemberLogin.vue";

export const practiceRouter = [
    {
        path: "/member/create",
        name: "MemberCreate",
        component: MemberCreate
    },
    {
        path: "/member/login",
        name: "MemberLogin",
        component: MemberLogin
    }
]