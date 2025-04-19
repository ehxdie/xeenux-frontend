import ResetPasswordForm from './form';

export const metadata = {
    title: 'Reset Password - Xeenux',
    description: 'Reset your password',
};

export default async function ResetPasswordPage({
    params,
}: {
    params: { token: string };
}) {
    const { token } = params;

    return <ResetPasswordForm token={token} />;
}

