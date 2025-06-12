'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import CommunityService from '@/services/community-service';
import type { Category, CreatePostRequest } from '@/types/community';
import { Loader2, ChevronRight } from 'lucide-react';

export default function NewQuestionPage() {
  const router = useRouter();
  const { isAuthenticated, requireAuth } = useAuth();
  
  // 인증 체크
  requireAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 폼 데이터
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    content: '',
    isAnonymous: false,
    status: 'published' as const
  });
  
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 카테고리 로드
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await CommunityService.getCategories({ postType: 'question' });
        if (response.success) {
          setCategories(response.data);
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

  // 폼 데이터 변경 핸들러
  const handleInputChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // 에러 초기화
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // 카테고리 선택 핸들러
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      categoryId: value
    }));
    
    if (errors.categoryId) {
      setErrors(prev => ({
        ...prev,
        categoryId: ''
      }));
    }
  };

  // 태그 추가
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      const newTag = tagInput.trim();
      
      if (!tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
        setTagInput('');
      } else if (tags.length >= 5) {
        toast({
          title: '태그는 최대 5개까지 추가할 수 있습니다',
          variant: 'destructive',
        });
      } else {
        toast({
          title: '이미 추가된 태그입니다',
          variant: 'destructive',
        });
      }
    }
  };

  // 태그 제거
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    } else if (formData.title.length < 5) {
      newErrors.title = '제목은 최소 5자 이상 입력해주세요.';
    } else if (formData.title.length > 200) {
      newErrors.title = '제목은 200자를 초과할 수 없습니다.';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = '카테고리를 선택해주세요.';
    }

    if (!formData.content.trim()) {
      newErrors.content = '질문 내용을 입력해주세요.';
    } else if (formData.content.length < 10) {
      newErrors.content = '질문 내용은 최소 10자 이상 입력해주세요.';
    } else if (formData.content.length > 10000) {
      newErrors.content = '질문 내용은 10,000자를 초과할 수 없습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const postData: CreatePostRequest = {
        post_type: 'question',
        category_id: formData.categoryId,
        title: formData.title.trim(),
        content: formData.content.trim(),
        status: formData.status,
        isAnonymous: formData.isAnonymous,
      };

      const response = await CommunityService.createPost(postData);
      
      if (response.success) {
        toast({
          title: '질문이 등록되었습니다',
          description: '다른 부모님들의 답변을 기다려보세요!',
        });
        
        router.push(`/community/questions/${response.data.id}`);
      }
    } catch (error) {
      console.error('질문 등록 실패:', error);
      toast({
        title: '질문 등록 실패',
        description: '질문 등록 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 임시저장 핸들러
  const handleSaveDraft = async () => {
    if (!formData.title.trim() && !formData.content.trim()) {
      toast({
        title: '임시저장할 내용이 없습니다',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const draftData: CreatePostRequest = {
        post_type: 'question',
        category_id: formData.categoryId || categories[0]?.id || '',
        title: formData.title.trim() || '제목 없음',
        content: formData.content.trim() || '',
        status: 'draft',
        isAnonymous: formData.isAnonymous,
      };

      const response = await CommunityService.createPost(draftData);
      
      if (response.success) {
        toast({
          title: '임시저장 완료',
          description: '나중에 다시 작성할 수 있습니다.',
        });
        
        router.push('/community/questions');
      }
    } catch (error) {
      console.error('임시저장 실패:', error);
      toast({
        title: '임시저장 실패',
        description: '임시저장 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null; // requireAuth가 처리함
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/community" className="hover:underline">
            커뮤니티
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/community/questions" className="hover:underline">
            질문 게시판
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">질문 작성</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>질문 작성</CardTitle>
            <CardDescription>
              다른 부모님들에게 도움을 요청하거나 궁금한 점을 물어보세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
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
                {errors.categoryId && (
                  <p className="text-sm text-destructive">{errors.categoryId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">제목</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange('title')}
                  placeholder="질문 제목을 입력하세요"
                  maxLength={200}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">질문 내용</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={handleInputChange('content')}
                  placeholder="질문 내용을 자세히 설명해주세요"
                  className="min-h-[300px]"
                  maxLength={10000}
                />
                {errors.content && (
                  <p className="text-sm text-destructive">{errors.content}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>태그</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="태그 입력 후 Enter"
                  maxLength={20}
                />
                <p className="text-xs text-muted-foreground">
                  최대 5개의 태그를 추가할 수 있습니다.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isAnonymous: checked as boolean }))
                  }
                />
                <Label htmlFor="anonymous">익명으로 작성</Label>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isLoading || isSubmitting}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  저장 중...
                </>
              ) : (
                '임시저장'
              )}
            </Button>
            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading || isSubmitting}
              >
                취소
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    등록 중...
                  </>
                ) : (
                  '질문 등록'
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
