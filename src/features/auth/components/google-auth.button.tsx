// @/features/auth/components/google-auth.button.tsx
'use client';

import { APP_ROUTES } from '@/config/routes';
import { ACCOUNT_STATUS } from '@/constants/account-status.constant';
import { useGoogleLoginMutation } from '@/features/auth/api/auth.mutations';
import { useAuthStore } from '@/stores';
import { GoogleLogin } from '@react-oauth/google';
import { message } from 'antd';
import { useRouter } from 'next/navigation';

export function GoogleAuthButton() {
    const router = useRouter();
    const { mutate: googleLoginMutation, isPending } = useGoogleLoginMutation();
    const setAuth = useAuthStore((state) => state.setAuth);
    const logout = useAuthStore((state) => state.logout);
    return (
        <div className="w-full flex justify-center" style={{ pointerEvents: isPending ? 'none' : 'auto', opacity: isPending ? 0.7 : 1 }}>
            <GoogleLogin
                onSuccess={(credentialResponse) => {
                    // credentialResponse.credential chính là ID Token (chuỗi JWT) mà Backend đang cần
                    if (credentialResponse.credential) {
                        googleLoginMutation(
                            { token: credentialResponse.credential },
                            {
                                onSuccess: (data) => {
                                    setAuth(data.user, data.accessToken);
                                    message.success('Đăng nhập Google thành công!');

                                    if (data.user.status !== ACCOUNT_STATUS.ACTIVE) {
                                        const status = data.user.status;

                                        logout();

                                        router.replace(
                                            `${APP_ROUTES.ERRORS.ACCOUNT_RESTRICTED}?status=${status}`,
                                        );

                                        return;
                                    }

                                    router.push(APP_ROUTES.USER.DASH_BOARD);
                                },
                            }
                        );
                    }
                }}
                onError={() => {
                    message.error('Đăng nhập Google thất bại. Vui lòng thử lại!');
                }}
                // Các thuộc tính giúp nút Google trông hài hòa với Form hiện tại nhất có thể
                // type="icon" // 👈 Đổi thành dạng icon để vừa với flex-1
                // theme="outline"
                // size="large"
                // shape="rectangular"
                // width="100%"
                // text="signin_with"

                // locale="vi" // 👈 Ép tiếng Việt
                text="continue_with" // 👈 "Tiếp tục với Google"
                theme="outline"
                size="large"
                shape="rectangular"
                width="300"
            />
        </div>
    );
}