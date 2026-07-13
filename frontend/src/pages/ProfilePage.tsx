import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import AccountLayout from '../components/AccountLayout';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

const passwordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const ProfilePage = () => {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data } = await api.get('/users/profile');
      return data;
    },
  });

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors }, reset: resetProfile } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (profileData) {
      resetProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
      });
    }
  }, [profileData, resetProfile]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const res = await api.put('/users/profile', data);
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: PasswordFormValues) => {
      const res = await api.put('/users/profile', { password: data.password });
      return res.data;
    },
    onSuccess: () => {
      resetPassword();
      toast.success('Password updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update password');
    }
  });

  const onProfileSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordFormValues) => {
    updatePasswordMutation.mutate(data);
  };

  return (
    <AccountLayout title="My Profile">
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-brand-primary" size={32} />
        </div>
      ) : (
        <div className="space-y-10">
          {/* Personal Information */}
          <div className="bg-white p-6 md:p-10 border border-gray-100 shadow-sm rounded-sm">
            <h2 className="text-xl font-heading text-brand-dark mb-6">Personal Information</h2>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-button uppercase tracking-widest text-gray-500 mb-2">First Name</label>
                  <input
                    {...registerProfile('firstName')}
                    className="input-luxury"
                  />
                  {profileErrors.firstName && <p className="text-red-500 text-xs mt-1 font-body">{profileErrors.firstName.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-button uppercase tracking-widest text-gray-500 mb-2">Last Name</label>
                  <input
                    {...registerProfile('lastName')}
                    className="input-luxury"
                  />
                  {profileErrors.lastName && <p className="text-red-500 text-xs mt-1 font-body">{profileErrors.lastName.message}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-button uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                <input
                  type="email"
                  {...registerProfile('email')}
                  className="input-luxury"
                />
                {profileErrors.email && <p className="text-red-500 text-xs mt-1 font-body">{profileErrors.email.message}</p>}
              </div>

              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="btn-primary flex items-center justify-center"
              >
                {updateProfileMutation.isPending ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                Save Changes
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white p-6 md:p-10 border border-gray-100 shadow-sm rounded-sm">
            <h2 className="text-xl font-heading text-brand-dark mb-6">Change Password</h2>
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-button uppercase tracking-widest text-gray-500 mb-2">New Password</label>
                  <input
                    type="password"
                    {...registerPassword('password')}
                    className="input-luxury"
                  />
                  {passwordErrors.password && <p className="text-red-500 text-xs mt-1 font-body">{passwordErrors.password.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-button uppercase tracking-widest text-gray-500 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    {...registerPassword('confirmPassword')}
                    className="input-luxury"
                  />
                  {passwordErrors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-body">{passwordErrors.confirmPassword.message}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={updatePasswordMutation.isPending}
                className="btn-primary flex items-center justify-center"
              >
                {updatePasswordMutation.isPending ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </AccountLayout>
  );
};

export default ProfilePage;
