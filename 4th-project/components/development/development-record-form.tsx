'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { toast } from '@/components/ui/use-toast';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AgeGroup,
  DevelopmentArea,
  RecordType,
  AGE_GROUP_LABELS,
  DEVELOPMENT_AREA_LABELS,
  RECORD_TYPE_LABELS,
} from '@/types/development';
import { ko } from 'date-fns/locale';
import apiClient from '@/services/api-client';

interface DevelopmentRecordFormProps {
  initialAgeGroup?: AgeGroup;
  childId: string;
}

export function DevelopmentRecordForm({
  initialAgeGroup,
  childId,
}: DevelopmentRecordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(
    initialAgeGroup || '0-3months',
  );
  const [developmentArea, setDevelopmentArea] =
    useState<DevelopmentArea>('physical');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [recordType, setRecordType] =
    useState<RecordType>('development_record');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !ageGroup || !title || !description || !childId) {
      toast({
        title: '입력 오류',
        description: '필수 필드를 모두 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // 발달 기록 데이터 준비
      const requestData = {
        child: childId,
        date: format(date, 'yyyy-MM-dd'),
        age_group: ageGroup,
        development_area: developmentArea,
        title: title,
        description: description,
        record_type: recordType,
        image_urls: []
      };

      console.log('🔍 발달 기록 생성 요청 데이터:', requestData);

      // API 요청 (CSRF 토큰은 자동으로 처리됨)
      const response = await apiClient.post('/development/records/', requestData);
      
      console.log('✅ 발달 기록 저장 성공:', response);

      toast({
        title: '발달 기록이 저장되었습니다',
        description: '발달 추적 페이지에서 확인할 수 있습니다.',
      });

      // 폼 초기화
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('❌ 발달 기록 저장 실패:', error);
      toast({
        title: '발달 기록 저장 실패',
        description: error instanceof Error ? error.message : '잠시 후 다시 시도해주세요.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs
          value={recordType}
          onValueChange={(value) => setRecordType(value as RecordType)}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="development_record">발달 기록</TabsTrigger>
            <TabsTrigger value="milestone_achievement">이정표 달성</TabsTrigger>
            <TabsTrigger value="observation">관찰 기록</TabsTrigger>
            <TabsTrigger value="concern">우려사항</TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">날짜</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP', { locale: ko }) : '날짜 선택'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                    locale={ko}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ageGroup">연령 그룹</Label>
              <Select
                value={ageGroup}
                onValueChange={(value) => setAgeGroup(value as AgeGroup)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="연령 그룹 선택" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AGE_GROUP_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="developmentArea">발달 영역</Label>
            <Select
              value={developmentArea}
              onValueChange={(value) =>
                setDevelopmentArea(value as DevelopmentArea)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="발달 영역 선택" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DEVELOPMENT_AREA_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
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
            <Label htmlFor="description">내용</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="발달 상황을 자세히 기록해주세요"
              className="min-h-[200px]"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                저장 중...
              </>
            ) : (
              '저장하기'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
