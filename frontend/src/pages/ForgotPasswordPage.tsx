import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import api from '../api/axios';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitSuccessful } } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordValues) => {
      const res = await api.post('/users/forgot-password', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Reset link sent to your email');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    }
  });

  const onSubmit = (data: ForgotPasswordValues) => {
    forgotPasswordMutation.mutate(data);
  };

  return (
    <div className="pt-[116px] min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 border border-gray-100 shadow-sm max-w-md w-full rounded-sm">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-heading text-brand-dark mb-3">Forgot Password</h1>
          <p className="text-sm font-body text-gray-500">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {isSubmitSuccessful && !forgotPasswordMutation.isError ? (
          <div className="bg-green-50 border border-green-100 text-green-700 p-6 rounded-sm text-center mb-8">
            <p className="font-body text-sm mb-4">
              We've sent an email with instructions to reset your password. Please check your inbox (and spam folder).
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-[10px] font-button uppercase tracking-widest text-gray-500 mb-1.5">Email Address</label>
              <input
                type="email"
                {...register('email')}
                className="input-luxury"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 font-body">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="btn-primary w-full flex items-center justify-center"
            >
              {forgotPasswordMutation.isPending ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              Send Reset Link
            </button>
          </form>
        )}

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <Link to="/login" className="text-xs font-button uppercase tracking-widest text-gray-500 hover:text-brand-primary transition-colors inline-flex items-center">
            <ArrowLeft size={14} className="mr-2" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
