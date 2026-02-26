import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fafafa",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          background: "#fff",
          border: "1px solid #e0e0e0",
          borderRadius: 12,
          padding: "48px 40px",
          textAlign: "center",
          maxWidth: 400,
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: "#1a1a1a",
            marginBottom: 8,
          }}
        >
          Prototype Playground
        </h1>
        <p style={{ fontSize: 15, color: "#666", marginBottom: 32 }}>
          Sign in with your company Google account to continue.
        </p>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 24px",
              background: "#fff",
              border: "1px solid #dadce0",
              borderRadius: 6,
              fontSize: 15,
              fontWeight: 500,
              color: "#3c4043",
              cursor: "pointer",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}
