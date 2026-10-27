'use client';

import { APP_ROUTES } from '@/config';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AccountRestrictedContent() {
    const searchParams = useSearchParams();
    const status = searchParams.get('status');

    const isDeleted = status === 'DELETED';

    const title = isDeleted
        ? 'Tài khoản đã bị xóa'
        : 'Tài khoản đã bị khóa';

    const description = isDeleted
        ? 'Tài khoản của bạn đã bị xóa và hiện không thể sử dụng các chức năng yêu cầu đăng nhập.'
        : 'Tài khoản của bạn đã bị khóa và hiện không thể sử dụng các chức năng yêu cầu đăng nhập. Nếu bạn cho rằng đây là nhầm lẫn, vui lòng liên hệ bộ phận hỗ trợ.';

    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <section className="w-full max-w-md rounded-xl border p-8 text-center shadow-sm">
                <h1 className="mb-4 text-2xl font-semibold">
                    {title}
                </h1>

                <p className="mb-6 text-gray-600">
                    {description}
                </p>

                <Link
                    href={APP_ROUTES.PUBLIC.HOME}
                    className="inline-flex rounded-md bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700"
                >
                    Về trang chủ
                </Link>
            </section>
        </main>
    );
}