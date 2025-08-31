export default function GoogleLoginButton() {
  const handleLogin = () => {
    // przekierowanie do backendu
    window.location.href = "http://localhost:5000/auth/google";
  };

  return <button onClick={handleLogin}>Login with Google</button>;
}
