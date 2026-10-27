import { Suspense } from 'react';
import AccountRestrictedContent from './account-restricted-content';

export default function AccountRestrictedPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Đang tải...</div>}>
            <AccountRestrictedContent />
        </Suspense>
    );
}