'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Message } from '@/models/User.model';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import toast from 'react-hot-toast';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState('');

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: {
      acceptMessage: false,
    },
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessage');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/users/accept-messages');
      setValue('acceptMessage', response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? 'Failed to fetch message settings'
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>('/api/users/get-messages');
        setMessages(Array.isArray(response.data.message) ? response.data.message : []);
        if (refresh) {
          toast.success('Messages refreshed successfully');
        }
        console.log(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message ?? 'Failed to fetch messages'
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m._id !== messageId));
  };

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/users/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessage', !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ??
          'Failed to update message settings'
      );
    }
  };

  useEffect(() => {
    if (session?.user) {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      setProfileUrl(`${baseUrl}/u/${(session.user as User).username}`);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user) {
      fetchMessages();
      fetchAcceptMessages();
    }
  }, [session, fetchMessages, fetchAcceptMessages]);

  if (!session?.user) return null;

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button
            onClick={() => {
              navigator.clipboard.writeText(profileUrl);
              toast.success('Profile URL copied to clipboard!');
            }}
          >
            Copy
          </Button>
        </div>
      </div>

      <div className="mb-4 flex items-center">
        <Switch
          {...register('acceptMessage')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>

      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {!isLoading && messages.length === 0 ? (
          <p>No messages to display.</p>
        ) : (
          messages.map((message) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
