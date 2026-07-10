import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Loader2, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordValues) => {
      const res = await api.put(`/users/reset-password/${token}`, { password: data.password });
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data);
      toast.success('Password reset successfully. You are now logged in.');
      navigate('/profile');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reset password. Token may be invalid or expired.');
    }
  });

  const onSubmit = (data: ResetPasswordValues) => {
    resetPasswordMutation.mutate(data);
  };

  return (
    <div className="pt-[116px] min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 border border-gray-100 shadow-sm max-w-md w-full rounded-sm">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-heading text-brand-dark mb-3">Reset Password</h1>
          <p className="text-sm font-body text-gray-500">
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-[10px] font-button uppercase tracking-widest text-gray-500 mb-1.5">New Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full border border-gray-200 p-3 font-body text-sm focus:outline-none focus:border-brand-primary transition-colors"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1 font-body">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-button uppercase tracking-widest text-gray-500 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              {...register('confirmPassword')}
              className="w-full border border-gray-200 p-3 font-body text-sm focus:outline-none focus:border-brand-primary transition-colors"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-body">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            className="w-full bg-brand-dark text-white px-8 py-3 font-button uppercase tracking-widest text-xs hover:bg-brand-primary transition-colors disabled:opacity-70 flex items-center justify-center"
          >
            {resetPasswordMutation.isPending ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
            Reset Password
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <Link to="/login" className="text-xs font-button uppercase tracking-widest text-gray-500 hover:text-brand-primary transition-colors inline-flex items-center">
            Go to Login <ArrowRight size={14} className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
