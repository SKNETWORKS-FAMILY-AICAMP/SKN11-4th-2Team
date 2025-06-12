import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: '개인정보처리방침 | 마파덜',
  description:
    '마파덜 서비스의 개인정보처리방침입니다. 개인정보 수집 및 이용에 대한 안내를 확인하세요.',
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">개인정보처리방침</h1>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/terms">이용약관</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">홈으로</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              1. 개인정보의 수집 및 이용 목적
            </h3>
            <p>
              마파덜(이하 "회사")은 다음의 목적을 위하여 개인정보를 처리합니다.
              처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지
              않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에
              따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른
                본인 식별·인증, 회원자격 유지·관리 등
              </li>
              <li>
                서비스 제공: 육아 정보 제공, 커뮤니티 서비스, 전문가 상담, 발달
                모니터링 등 서비스 제공
              </li>
              <li>
                마케팅 및 광고에의 활용: 신규 서비스 개발 및 맞춤 서비스 제공,
                이벤트 및 광고성 정보 제공 등
              </li>
            </ol>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">2. 수집하는 개인정보 항목</h3>
            <p>
              회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은
              개인정보를 수집하고 있습니다.
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>필수항목</strong>: 이메일 주소, 비밀번호, 닉네임
              </li>
              <li>
                <strong>선택항목</strong>: 프로필 이미지, 자녀 정보(생년월일,
                성별), 관심 분야
              </li>
              <li>
                <strong>자동 수집 항목</strong>: IP 주소, 쿠키, 서비스 이용
                기록, 접속 로그, 기기 정보
              </li>
            </ol>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              3. 개인정보의 보유 및 이용기간
            </h3>
            <p>
              회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당
              정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할
              필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간
              동안 회원정보를 보관합니다.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>계약 또는 청약철회 등에 관한 기록</strong>: 5년
                (전자상거래 등에서의 소비자보호에 관한 법률)
              </li>
              <li>
                <strong>대금결제 및 재화 등의 공급에 관한 기록</strong>: 5년
                (전자상거래 등에서의 소비자보호에 관한 법률)
              </li>
              <li>
                <strong>소비자의 불만 또는 분쟁처리에 관한 기록</strong>: 3년
                (전자상거래 등에서의 소비자보호에 관한 법률)
              </li>
              <li>
                <strong>웹사이트 방문기록</strong>: 3개월 (통신비밀보호법)
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              4. 개인정보의 파기절차 및 방법
            </h3>
            <p>
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가
              불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>파기절차</strong>: 이용자가 입력한 정보는 목적 달성 후
                별도의 DB에 옮겨져 내부 방침 및 기타 관련 법령에 따라 일정기간
                저장된 후 혹은 즉시 파기됩니다.
              </li>
              <li>
                <strong>파기방법</strong>: 전자적 파일 형태의 정보는 기록을
                재생할 수 없는 기술적 방법을 사용하여 삭제하며, 종이에 출력된
                개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.
              </li>
            </ol>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">5. 개인정보의 제3자 제공</h3>
            <p>
              회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
              다만, 아래의 경우에는 예외로 합니다.
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>이용자들이 사전에 동의한 경우</li>
              <li>
                법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와
                방법에 따라 수사기관의 요구가 있는 경우
              </li>
            </ol>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              6. 이용자 및 법정대리인의 권리와 그 행사방법
            </h3>
            <p>
              이용자 및 법정 대리인은 언제든지 등록되어 있는 자신 혹은 당해 만
              14세 미만 아동의 개인정보를 조회하거나 수정할 수 있으며, 회사의
              개인정보의 처리에 동의하지 않는 경우 동의를 거부하거나
              가입해지(회원탈퇴)를 요청할 수 있습니다. 다만, 그러한 경우
              서비스의 일부 또는 전부 이용이 어려울 수 있습니다.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              7. 개인정보 자동 수집 장치의 설치/운영 및 거부에 관한 사항
            </h3>
            <p>
              회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를
              저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다. 쿠키는
              웹사이트를 운영하는데 이용되는 서버가 이용자의 브라우저에게 보내는
              소량의 정보이며 이용자들의 PC 컴퓨터내의 하드디스크에 저장되기도
              합니다.
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>쿠키의 사용목적</strong>: 이용자가 방문한 각 서비스와 웹
                사이트들에 대한 방문 및 이용형태, 인기 검색어, 보안접속 여부
                등을 파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다.
              </li>
              <li>
                <strong>쿠키의 설치/운영 및 거부</strong>: 웹브라우저 상단의
                도구 &gt; 인터넷 옵션 &gt; 개인정보 메뉴의 옵션 설정을 통해 쿠키
                저장을 거부할 수 있습니다.
              </li>
              <li>
                <strong>쿠키 저장을 거부할 경우</strong>: 맞춤형 서비스 이용에
                어려움이 발생할 수 있습니다.
              </li>
            </ol>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              8. 개인정보의 안전성 확보 조치
            </h3>
            <p>
              회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에
              필요한 기술적/관리적 및 물리적 조치를 하고 있습니다.
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>개인정보 암호화</strong>: 이용자의 개인정보는 비밀번호는
                암호화되어 저장 및 관리되고 있어, 본인만이 알 수 있으며 중요한
                데이터는 파일 및 전송 데이터를 암호화하거나 파일 잠금 기능을
                사용하는 등의 별도 보안기능을 사용하고 있습니다.
              </li>
              <li>
                <strong>해킹 등에 대비한 기술적 대책</strong>: 회사는 해킹이나
                컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여
                보안프로그램을 설치하고 주기적인 갱신·점검을 하며 외부로부터
                접근이 통제된 구역에 시스템을 설치하고 기술적/물리적으로 감시 및
                차단하고 있습니다.
              </li>
            </ol>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">9. 개인정보 보호책임자</h3>
            <p>
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
              처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와
              같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>개인정보 보호책임자</strong>
                <br />
                성명: 김마파
                <br />
                직책: 개인정보보호팀장
                <br />
                연락처: privacy@mapader.com
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              10. 개인정보 처리방침 변경
            </h3>
            <p>
              이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른
              변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일
              전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </div>

          <div className="pt-4">
            <p>
              <strong>시행일자</strong>: 2025년 5월 16일
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-center">
        <Button asChild>
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    </div>
  );
}
