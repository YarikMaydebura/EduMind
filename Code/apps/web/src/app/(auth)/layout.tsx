export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="w-full max-w-md p-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">EduMind AI</h1>
          <p className="mt-2 text-sm text-muted-foreground">Study = Power</p>
        </div>
        {children}
      </div>
    </div>
  );
}
