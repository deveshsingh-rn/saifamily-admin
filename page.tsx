'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
  fetchSanghaGroupsStart,
  sendAnnouncementStart,
} from '@/app/store/features/sangha/sanghaSlice';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export default function SanghaAnnouncementsPage() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { groups, submitting, error } = useSelector(
    (state: RootState) => state.sangha
  );

  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    dispatch(fetchSanghaGroupsStart());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedGroupId || !title || !body) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please select a group and fill in the title and body.',
      });
      return;
    }
    dispatch(sendAnnouncementStart({ groupId: selectedGroupId, title, body }));
    // Reset form on success? Could listen to saga success.
    // For now, we show a toast.
    toast({
      title: 'Announcement Sent',
      description: `Your announcement to group ${selectedGroupId} has been queued.`,
    });
    setTitle('');
    setBody('');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Send Sangha Announcement</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>New Announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="group">Target Group</Label>
              <Select onValueChange={setSelectedGroupId} value={selectedGroupId}>
                <SelectTrigger id="group">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Announcement Title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Body</Label>
              <Textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your announcement message here..." required rows={5} />
            </div>
            {error && <p className="text-red-500">Error: {error}</p>}
            <Button type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Send Announcement'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}