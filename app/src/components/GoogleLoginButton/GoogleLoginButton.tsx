import { useEffect } from 'react';

function GoogleLoginButton() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      const g = (window as any).google;

      if (!g) return;

      g.accounts.id.initialize({
        client_id:
          '661213065242-4dt9tro2q8iokcfbnof6m7r2g9th1qcc.apps.googleusercontent.com',
        callback: handleCredentialResponse,
      });

      g.accounts.id.renderButton(document.getElementById('google-button'), {
        theme: 'outline',
        size: 'large',
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = (response) => {
    const id_token = response?.credential;
    if (!id_token) return;

    fetch('/api/auth/google/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id_token }),
    }).then((res) => {
      if (res.ok) {
        console.log('Login successful');
      }
    });
  };

  return <div id='google-button'></div>;
}

export default GoogleLoginButton;
