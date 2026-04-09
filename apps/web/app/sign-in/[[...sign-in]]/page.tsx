import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0c0b09] flex items-center justify-center">
      <SignIn />
    </main>
  );
}
