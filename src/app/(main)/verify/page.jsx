'use client';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Context } from '@/components/context/Context';
import Link from 'next/link';

const VerifyPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  const { siteData } = useContext(Context);
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
    <div className='w-full min-h-screen bg-gray-50 flex items-center justify-center p-6'>
      <div className="absolute top-0 left-0 w-1/3 h-full bg-white -z-10" />
      <div className='w-full max-w-md bg-white p-8 shadow-xl rounded-2xl border border-gray-100 flex flex-col items-center text-center'>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className='inline-block w-fit px-4 py-1 bg-pink-50 text-pink-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-6'>
            {siteData?.name || 'Account Verification'}
          </div>
          {status === 'loading' && (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin mb-4"></div>
              <h2 className="text-2xl font-semibold text-gray-800">Verifying your account...</h2>
            </div>
          )}
          {status === 'success' && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4 text-3xl">✓</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Verification Successful!</h2>
              <p className="text-gray-500">{message}</p>
              <p className="text-sm text-gray-400 mt-4">Redirecting to login...</p>
            </div>
          )}
          {status === 'error' && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4 text-3xl">✗</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Verification Failed</h2>
              <p className="text-gray-500 mb-6">{message}</p>
              <Link href="/login" className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all">
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
