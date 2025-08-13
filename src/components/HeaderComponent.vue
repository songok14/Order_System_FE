<template>
    <v-app-bar>
        <v-container>
            <v-row>
                <!-- justify-start: 왼쪽기준 정렬 -->
                <v-col class="d-flex justify-start">
                    <div v-if="userRole === 'ADMIN'">
                        <v-btn :to="'/member/list'">회원 관리</v-btn>
                        <v-btn :to="'/product/manage'">상품 관리</v-btn>
                        <v-btn href="/ordering/list">주문 관리 {{ liveOrderCount }}</v-btn>
                        <!-- <v-btn :to="'/practice/store'">스토어테스트</v-btn> -->
                    </div>
                </v-col>
                <v-col class="text-center d-flex justify-center">
                    <v-btn to="/">java shop</v-btn>
                </v-col>
                <v-col class="d-flex justify-end" cols="auto">
                    <v-btn :to="'/ordering/cart'">장바구니 {{ totalQuantity }}</v-btn>
                    <v-btn :to="'/product/list'">상품목록</v-btn>
                    <v-btn v-if="isLogined" :to="'/member/myinfo'">마이페이지</v-btn>
                    <v-btn v-if="!isLogined" :to="'/member/create'">회원가입</v-btn>
                    <v-btn v-if="!isLogined" :to="'/member/dologin'">로그인</v-btn>
                    <v-btn v-if="isLogined" @click="doLogout()">로그아웃</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-app-bar>
</template>

<script>
import { EventSourcePolyfill } from 'event-source-polyfill';
import { jwtDecode } from 'jwt-decode';


export default {
    data() {
        return {
            userRole: null,
            isLogined: false,
            liveOrderCount: 0,
        }
    },
    computed: {
        totalQuantity() {
            return this.$store.getters.getTotalQuantity;
        }
    },
    created() {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const payload = jwtDecode(accessToken);
            this.userRole = payload.roleCode;
            this.isLogined = true;
        }
        // sse 연결 및 메시지 수신
        if (this.userRole === 'ADMIN') {
            // sse 연결을 위한 event-source-polyfill 라이브러리 사용
            let sse = new EventSourcePolyfill(`${process.env.VUE_APP_API_BASE_URL}/sse/connect`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            sse.addEventListener('connect', (event) => {
                console.log(event);
            });
            sse.addEventListener('ordered', (event) => {
                console.log(event);
                this.liveOrderCount++;
            });
        }
    },
    methods: {
        doLogout() {
            localStorage.clear();
            this.isLogined = false;
            this.userRole = null;
            window.location.href = "/";
        }
    }
}
</script>