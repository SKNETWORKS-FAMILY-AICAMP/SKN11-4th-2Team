'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import CommunityService from '@/services/community-service';
import type { Category } from '@/types/community';

export default function NewTipPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 카테고리 로드
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await CommunityService.getCategories({ postType: 'tip' });
        if (response.success) {
          setCategories(response.data);
          if (response.data.length > 0) {
            setCategoryId(response.data[0].id);
          }
        }
      } catch (error) {
        console.error('카테고리 로드 실패:', error);
        toast({
          title: '카테고리 로드 실패',
          description: '카테고리를 불러오는데 실패했습니다.',
          variant: 'destructive',
        });
      }
    };

    loadCategories();
  }, []);

  // 게시글 작성
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: '제목을 입력해주세요',
        variant: 'destructive',
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: '내용을 입력해주세요',
        variant: 'destructive',
      });
      return;
    }

    if (!categoryId) {
      toast({
        title: '카테고리를 선택해주세요',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await CommunityService.createPost({
        post_type: 'tip',
        category_id: categoryId,
        title,
        content,
        status: 'published',
        isAnonymous,
      });

      if (response.success) {
        toast({
          title: '게시글이 작성되었습니다',
        });
        router.push('/community/tips');
      }
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      toast({
        title: '게시글 작성 실패',
        description: '게시글을 작성하는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">육아 팁 작성</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">카테고리</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              className="min-h-[300px]"
              maxLength={10000}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
            <Label htmlFor="anonymous">익명으로 작성</Label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '작성 중...' : '작성하기'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
