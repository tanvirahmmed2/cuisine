'use client';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Context } from '@/components/context/Context';
import Link from 'next/link';

import { name } from '@/lib/database/secret';

const VerifyPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await axios.post('/api/user/verify', { token });
        setStatus('success');
        setMessage(response.data.message);
        setTimeout(() => router.push('/login'), 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. Please try again.');
      }
    };

    verifyToken();
  }, [token, router]);

  return (
    <div className='w-full min-h-screen bg-tertiary-dark/5 flex items-center justify-center p-6'>
      <div className="absolute top-0 left-0 w-1/3 h-full bg-tertiary-light -z-10" />
      <div className='w-full max-w-md bg-tertiary-light p-8 shadow-xl rounded-2xl border border-tertiary-dark/10 flex flex-col items-center text-center'>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className='inline-block w-fit px-4 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full mb-6'>
            {name}
          </div>
          {status === 'loading' && (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-tertiary-dark/10 border-t-primary rounded-full animate-spin mb-4"></div>
              <h2 className="text-2xl font-semibold text-tertiary-dark">Verifying your account...</h2>
            </div>
          )}
          {status === 'success' && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mb-4 text-3xl">✓</div>
              <h2 className="text-2xl font-semibold text-tertiary-dark mb-2">Verification Successful!</h2>
              <p className="text-tertiary-dark/70">{message}</p>
              <p className="text-sm text-tertiary-dark/60 mt-4">Redirecting to login...</p>
            </div>
          )}
          {status === 'error' && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 text-primary-dark rounded-full flex items-center justify-center mb-4 text-3xl">✗</div>
              <h2 className="text-2xl font-semibold text-tertiary-dark mb-2">Verification Failed</h2>
              <p className="text-tertiary-dark/70 mb-6">{message}</p>
              <Link href="/login" className="px-6 py-3 bg-primary text-tertiary-light rounded-lg font-medium hover:bg-primary-dark transition-all">
                Back to Login
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
export default VerifyPage;
