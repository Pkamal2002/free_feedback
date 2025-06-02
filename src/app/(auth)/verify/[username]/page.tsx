'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios, { AxiosError } from 'axios';
import * as z from 'zod';

import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>('/api/users/verify-code', {
        username: params.username,
        code: data.code,
      });

      toast.success(response.data.message);
      router.push('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const status = axiosError.response?.status;
      const message = axiosError.response?.data.message;

      if (status === 400) {
        toast.error('Invalid verification code. Please try again.');
      } else if (status === 404) {
        toast.error('User not found. Please sign up first.');
      } else {
        toast.error(message || 'Verification failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-6">
        <Card className="p-8">
          <CardContent>
            <h1 className="text-2xl font-bold text-center mb-4">Verify Account</h1>
            <p className="text-center text-sm text-muted-foreground mb-6">
              Enter the verification code sent to your email.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  maxLength={6}
                  placeholder="XXXXXX"
                  {...register('code')}
                />
                {errors.code && (
                  <p className="text-xs text-red-500">{errors.code.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Verifying...' : 'Verify Account'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
