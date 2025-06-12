import { BusinessCardPreview } from '@/components/brand/business-card';
import { TshirtPreview } from '@/components/brand/tshirt';
import { StickersPreview } from '@/components/brand/stickers';
import { EcoBagPreview } from '@/components/brand/eco-bag';
import { MugPreview } from '@/components/brand/mug';
import { Logo } from '@/components/logo';

export default function BrandPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-4xl font-bold mb-4">마파덜 브랜드 응용 디자인</h1>
          <p className="text-xl text-muted-foreground">
            마파덜의 브랜드 아이덴티티를 다양한 매체에 일관되게 적용한 응용
            디자인입니다.
          </p>
        </div>

        <div className="space-y-16">
          <section>
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">
              명함 디자인
            </h2>
            <BusinessCardPreview />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">
              티셔츠 디자인
            </h2>
            <TshirtPreview />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">
              스티커 디자인
            </h2>
            <StickersPreview />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">
              에코백 디자인
            </h2>
            <EcoBagPreview />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">
              머그컵 디자인
            </h2>
            <MugPreview />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">
              브랜드 가이드라인
            </h2>
            <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg">
              <p className="mb-4">
                마파덜 브랜드 아이덴티티의 일관성을 유지하기 위해 다음
                가이드라인을 준수해주세요:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>로고 주변에 충분한 여백을 확보하여 가독성을 높여주세요.</li>
                <li>로고의 비율과 형태를 임의로 변형하지 마세요.</li>
                <li>
                  지정된 브랜드 컬러를 사용하여 일관된 이미지를 유지해주세요.
                </li>
                <li>
                  배경색에 따라 적절한 로고 버전(기본/화이트)을 선택해주세요.
                </li>
                <li>
                  로고 사용 시 최소 크기를 준수하여 식별성을 유지해주세요.
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
