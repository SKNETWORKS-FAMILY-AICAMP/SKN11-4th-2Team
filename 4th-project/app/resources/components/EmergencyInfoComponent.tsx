import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Heart } from 'lucide-react';
import { 
  prematureEmergencyConditions, 
  safetyTips, 
  emergencyContacts,
  nicuInfo,
  prematureDefinition,
  EmergencyCondition,
  SafetyTip 
} from '../data/emergencyData';

interface EmergencyInfoComponentProps {
  showPrematureInfo?: boolean;
  showSafetyTips?: boolean;
  showContacts?: boolean;
}

export const EmergencyInfoComponent = ({
  showPrematureInfo = true,
  showSafetyTips = true,
  showContacts = true
}: EmergencyInfoComponentProps) => {

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Shield className="w-4 h-4 text-yellow-500" />;
      case 'low': return <Heart className="w-4 h-4 text-green-500" />;
      default: return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 dark:bg-red-950/20 border-red-200 dark:border-red-800';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800';
      case 'low': return 'bg-green-100 dark:bg-green-950/20 border-green-200 dark:border-green-800';
      default: return 'bg-gray-100 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return <Badge variant="destructive">긴급</Badge>;
      case 'medium': return <Badge variant="outline" className="border-yellow-500 text-yellow-700">주의</Badge>;
      case 'low': return <Badge variant="outline" className="border-green-500 text-green-700">관찰</Badge>;
      default: return <Badge variant="outline">일반</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {showPrematureInfo && (
        <div className="space-y-6">
          {/* 이른둥이 정의 */}
          <Card>
            <CardHeader>
              <CardTitle>{prematureDefinition.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{prematureDefinition.content}</p>
            </CardContent>
          </Card>

          {/* NICU 정보 */}
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200">
                {nicuInfo.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {nicuInfo.description}
              </p>
            </CardContent>
          </Card>

          {/* 이른둥이 응급상황 */}
          <div>
            <h3 className="text-xl font-semibold mb-4">이른둥이가 겪을 수 있는 주요 건강 문제</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prematureEmergencyConditions.map((condition, index) => (
                <Card key={index} className={getSeverityColor(condition.severity)}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(condition.severity)}
                        {condition.category}
                      </div>
                      {getSeverityBadge(condition.severity)}
                    </CardTitle>
                    {condition.description && (
                      <p className="text-xs text-muted-foreground">{condition.description}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {condition.conditions.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-2 text-sm">
                          <span className="w-1.5 h-1.5 bg-current rounded-full opacity-60"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {showSafetyTips && (
        <div>
          <h3 className="text-xl font-semibold mb-4">영유아 안전 수칙</h3>
          <div className="space-y-4">
            {safetyTips.map((tip, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tip.tips.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3 text-sm">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {showContacts && (
        <div>
          <h3 className="text-xl font-semibold mb-4">응급연락처</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyContacts.map((contact, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {contact.name}
                    <Badge variant="outline" className="text-lg font-bold text-red-600 border-red-600">
                      {contact.number}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{contact.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 dark:text-red-200 font-medium">
          <strong>중요:</strong> 이 정보는 응급상황 인지를 위한 참고자료입니다. 
          실제 응급상황 발생시 즉시 119에 신고하고 전문의의 진료를 받으세요.
        </AlertDescription>
      </Alert>
    </div>
  );
};
