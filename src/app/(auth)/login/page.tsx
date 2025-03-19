import LoginForm from '@/components/forms/login-form'

export default function LoginPage() {
  return (
    <main className="flex h-full min-h-screen w-full items-center justify-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
      <LoginForm />
    </main>
  )
}
