'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TermsModalProps {
  title: string;
  triggerText: string;
  children: React.ReactNode;
}

export function TermsModal({ title, triggerText, children }: TermsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="p-0 h-auto underline underline-offset-4 hover:text-primary"
        >
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            마파덜 서비스 이용을 위해 아래 내용을 주의 깊게 읽어주세요.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[50vh] pr-4">
          <div className="text-sm space-y-4">{children}</div>
        </ScrollArea>
        <DialogFooter>
          <Button type="button">확인</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
