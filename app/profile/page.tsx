import AuthGuard from "../components/AuthGuard/AuthGuard";

export default function ProfilePage() {
  return (
    <AuthGuard>
        <div>
        <h1>Страница "ProfilePage"</h1>
        </div>
    </AuthGuard>
  );
}