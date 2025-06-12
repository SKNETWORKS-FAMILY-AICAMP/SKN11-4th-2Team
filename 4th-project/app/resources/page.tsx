import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Baby,
  Heart,
  BookOpen,
  AlertTriangle,
  TrendingUp,
  Utensils,
  Shield,
  Activity,
  Calendar,
  FileText,
  Users,
  HelpCircle,
  ArrowRight,
  Star,
  CheckCircle,
} from 'lucide-react';

export default function ResourcesPage() {
  // 실제 존재하는 페이지들로 매핑
  const mainCategories = [
    {
      id: 'premature-babies',
      name: '이른둥이 가이드',
      icon: Baby,
      description: '이른둥이(미숙아)의 정의, 건강 관리, 발달 지원',
      href: '/resources/premature-babies',
      color: 'bg-pink-500',
      featured: true,
    },
    {
      id: 'development-milestones',
      name: '발달 이정표',
      icon: TrendingUp,
      description: '연령별 발달 단계와 이정표를 확인하세요',
      href: '/resources/development-milestones',
      color: 'bg-blue-500',
      featured: true,
    },
    {
      id: 'nutrition-guide',
      name: '영양 가이드',
      icon: Utensils,
      description: '연령별 영양 정보와 모유수유 가이드',
      href: '/resources/nutrition-guide',
      color: 'bg-green-500',
      featured: true,
    },
    {
      id: 'growth-chart',
      name: '성장 차트',
      icon: Activity,
      description: '월령별 신체 성장 기준표',
      href: '/resources/growth-chart',
      color: 'bg-purple-500',
      featured: true,
    },
    {
      id: 'emergency-guide',
      name: '응급상황 가이드',
      icon: AlertTriangle,
      description: '응급상황 대처법과 안전 수칙',
      href: '/resources/emergency-guide',
      color: 'bg-red-500',
      featured: true,
    },
  ];

  const quickLinks = [
    {
      title: '발달 검사 체크리스트',
      description: '우리 아이 발달 상태 간단 체크',
      href: '/resources/development-milestones',
      icon: CheckCircle,
    },
    {
      title: '응급상황 대처법',
      description: '위급한 상황별 즉시 대응 가이드',
      href: '/resources/emergency-guide',
      icon: AlertTriangle,
    },
    {
      title: '영양소별 필수 정보',
      description: '영유아에게 필요한 영양소 가이드',
      href: '/resources/nutrition-guide',
      icon: Utensils,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 섹션 */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          육아 자료실
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          초보 엄마 아빠를 위한 전문적이고 실용적인 육아 정보를 한 곳에서
          만나보세요
        </p>
        <div className="flex justify-center items-center gap-4 mt-6">
          <Badge variant="outline" className="px-3 py-1">
            <Star className="w-4 h-4 mr-1" />
            전문가 검증
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <FileText className="w-4 h-4 mr-1" />
            실제 데이터 기반
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Users className="w-4 h-4 mr-1" />
            부모 맞춤형
          </Badge>
        </div>
      </div>

      {/* 주요 카테고리 섹션 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          주요 자료 카테고리
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {mainCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card
                key={category.id}
                className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20"
              >
                <Link href={category.href} className="block">
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {category.description}
                    </p>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      자세히 보기
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Link>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 빠른 접근 링크 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Activity className="w-6 h-6" />
          빠른 접근
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:border-primary/30"
              >
                <Link href={link.href} className="block p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-primary transition-colors mb-1">
                        {link.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {link.description}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
