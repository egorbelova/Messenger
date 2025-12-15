import React, { useState, useEffect, useRef, useCallback } from 'react';
import './LoginPage.css';
import GoogleLoginButton from '../components/GoogleLoginButton/GoogleLoginButton';

interface LoginFormData {
  username: string;
  password: string;
}

interface UserData {
  id?: number;
  username: string;
  email?: string;
}

interface LoginPageProps {
  onLoginSuccess: (user: UserData) => void;
  onShowSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onShowSignup,
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (error) setError('');
    },
    [error]
  );

  const handleLogin = useCallback(async () => {
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password,
        }),
        credentials: 'include', // отправка HttpOnly cookie
      });

      if (!response.ok) {
        let msg = `HTTP error! status: ${response.status}`;
        try {
          const errData = await response.json();
          msg = errData.error || errData.detail || msg;
        } catch {}
        throw new Error(msg);
      }

      const data = await response.json();

      // Сервер устанавливает access и refresh токены в HttpOnly cookie
      onLoginSuccess({
        username: data.username,
        id: data.user_id,
        email: data.email,
      });
    } catch (err: any) {
      console.error('Login error:', err);
      if (err instanceof Error) setError(err.message);
      else setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [formData, onLoginSuccess]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleLogin();
    },
    [handleLogin]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (e.currentTarget === passwordRef.current) handleLogin();
        else if (e.currentTarget === usernameRef.current)
          passwordRef.current?.focus();
      }
    },
    [handleLogin]
  );

  const handleGoogleLogin = useCallback(() => {
    window.location.href = '/accounts/google/login/';
  }, []);

  const handleSignUp = useCallback(() => onShowSignup(), [onShowSignup]);

  return (
    <form className='login-form' id='offset' onSubmit={handleSubmit} noValidate>
      <h4 id='registration_form'>Log In</h4>
      <fieldset className='form'>
        <legend className='form-label'>Username</legend>
        <input
          ref={usernameRef}
          name='username'
          value={formData.username}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          autoComplete='username'
          required
        />
      </fieldset>
      <fieldset className='form'>
        <legend className='form-label'>Password</legend>
        <input
          ref={passwordRef}
          type='password'
          name='password'
          value={formData.password}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          autoComplete='current-password'
          required
        />
      </fieldset>
      {error && <div style={{ color: 'red', margin: '8px 0' }}>{error}</div>}
      <button
        type='submit'
        className='next_button controls'
        disabled={isLoading || !formData.username || !formData.password}
      >
        {isLoading ? 'Logging in...' : 'Next'}
      </button>
      <div id='OR_div'>
        <span id='OR'>OR</span>
      </div>
      <GoogleLoginButton />
      <a
        type='button'
        className='next_button controls google_link'
        onClick={handleGoogleLogin}
      >
        <svg
          id='google_icon'
          viewBox='-0.5 0 48 48'
          version='1.1'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g
            id='Icons'
            stroke='none'
            stroke-width='1'
            fill='none'
            fill-rule='evenodd'
          >
            <g id='Color-' transform='translate(-401.000000, -860.000000)'>
              <g id='Google' transform='translate(401.000000, 860.000000)'>
                <path
                  d='M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24'
                  id='Fill-1'
                  fill='#FBBC05'
                ></path>
                <path
                  d='M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333'
                  id='Fill-2'
                  fill='#EB4335'
                ></path>
                <path
                  d='M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667'
                  id='Fill-3'
                  fill='#34A853'
                ></path>
                <path
                  d='M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24'
                  id='Fill-4'
                  fill='#4285F4'
                ></path>
              </g>
            </g>
          </g>
        </svg>
        Continue with Google
      </a>
      {/* <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '14px' }}> */}
      Need an account?{' '}
      <a id='signup_login' className='controls' onClick={handleSignUp}>
        Sign Up
      </a>
      {/* </div> */}
    </form>
  );
};

export default LoginPage;
