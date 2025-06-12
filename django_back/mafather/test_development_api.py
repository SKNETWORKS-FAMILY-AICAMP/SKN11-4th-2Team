"""
발달 모니터링 API 테스트 스크립트
python test_development_api.py
"""

import requests
import json
from datetime import date, timedelta

# API 베이스 URL
BASE_URL = "http://localhost:8000"
DEVELOPMENT_API_URL = f"{BASE_URL}/vectordb/development"

# 테스트 데이터
test_record_data = {
    "date": str(date.today()),
    "age_group": "12-18months",
    "development_area": "physical",
    "title": "첫 걸음마",
    "description": "오늘 아이가 처음으로 혼자서 3걸음을 걸었어요! 정말 감동적이었습니다.",
    "record_type": "milestone_achievement",
    "image_urls": []
}

class DevelopmentAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.access_token = None
        self.child_id = None
        self.record_id = None
        self.milestone_id = None
    
    def print_response(self, response, title="Response"):
        """응답 출력"""
        print(f"\n=== {title} ===")
        print(f"Status Code: {response.status_code}")
        try:
            response_data = response.json()
            print(f"Response: {json.dumps(response_data, ensure_ascii=False, indent=2)}")
        except:
            print(f"Response Text: {response.text}")
    
    def login_or_register(self):
        """로그인 또는 회원가입"""
        print("1. 사용자 인증 테스트")
        # 실제 로그인 로직은 기존 인증 시스템에 맞게 구현
        # 여기서는 테스트용으로 임시 토큰 설정
        self.access_token = "test_token"
        print("✓ 인증 완료 (테스트용)")
        print("⚠️  실제 환경에서는 유효한 JWT 토큰이 필요합니다.")
    
    def get_headers(self):
        """인증 헤더"""
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
    
    def test_milestones_list(self):
        """발달 이정표 목록 조회 테스트"""
        print("\n2. 발달 이정표 목록 조회 테스트")
        
        # 전체 이정표 조회
        response = self.session.get(
            f"{DEVELOPMENT_API_URL}/milestones/",
            headers=self.get_headers()
        )
        self.print_response(response, "전체 이정표 목록")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('data', {}).get('results'):
                self.milestone_id = data['data']['results'][0]['id']
                print(f"✓ 테스트용 이정표 ID 저장: {self.milestone_id}")
        
        # 연령별 필터링
        response = self.session.get(
            f"{DEVELOPMENT_API_URL}/milestones/?age_group=12-18months",
            headers=self.get_headers()
        )
        self.print_response(response, "12-18개월 이정표")
        
        # 발달영역별 필터링
        response = self.session.get(
            f"{DEVELOPMENT_API_URL}/milestones/?development_area=physical",
            headers=self.get_headers()
        )
        self.print_response(response, "신체발달 이정표")
    
    def test_development_records(self):
        """발달 기록 CRUD 테스트"""
        print("\n3. 발달 기록 CRUD 테스트")
        
        # 발달 기록 생성
        print("\n3-1. 발달 기록 생성")
        record_data = test_record_data.copy()
        record_data['child'] = self.child_id
        
        response = self.session.post(
            f"{DEVELOPMENT_API_URL}/records/",
            headers=self.get_headers(),
            json=record_data
        )
        self.print_response(response, "발달 기록 생성")
        
        if response.status_code == 201:
            data = response.json()
            self.record_id = data.get('data', {}).get('id')
            print(f"✓ 발달 기록 생성 성공, ID: {self.record_id}")
        
        # 발달 기록 목록 조회
        print("\n3-2. 발달 기록 목록 조회")
        response = self.session.get(
            f"{DEVELOPMENT_API_URL}/records/",
            headers=self.get_headers()
        )
        self.print_response(response, "발달 기록 목록")
        
        # 발달 기록 상세 조회
        if self.record_id:
            print("\n3-3. 발달 기록 상세 조회")
            response = self.session.get(
                f"{DEVELOPMENT_API_URL}/records/{self.record_id}/",
                headers=self.get_headers()
            )
            self.print_response(response, "발달 기록 상세")
        
        # 발달 기록 수정
        if self.record_id:
            print("\n3-4. 발달 기록 수정")
            update_data = {
                "title": "첫 걸음마 (수정됨)",
                "description": "오늘 아이가 처음으로 혼자서 5걸음을 걸었어요! 정말 대단해요."
            }
            response = self.session.put(
                f"{DEVELOPMENT_API_URL}/records/{self.record_id}/",
                headers=self.get_headers(),
                json=update_data
            )
            self.print_response(response, "발달 기록 수정")
    
    def test_child_milestones(self):
        """자녀 이정표 달성 테스트"""
        print("\n4. 자녀 이정표 달성 테스트")
        
        if not self.milestone_id or not self.child_id:
            print("❌ 이정표 ID 또는 자녀 ID가 없어 테스트를 건너뜁니다.")
            return
        
        # 이정표 달성 기록
        print("\n4-1. 이정표 달성 기록")
        milestone_data = {
            "child": self.child_id,
            "milestone_id": self.milestone_id,
            "achieved_date": str(date.today()),
            "notes": "정말 기뻐요!"
        }
        
        response = self.session.post(
            f"{DEVELOPMENT_API_URL}/child-milestones/",
            headers=self.get_headers(),
            json=milestone_data
        )
        self.print_response(response, "이정표 달성 기록")
        
        # 자녀 이정표 달성 목록 조회
        print("\n4-2. 자녀 이정표 달성 목록 조회")
        response = self.session.get(
            f"{DEVELOPMENT_API_URL}/child-milestones/?child={self.child_id}",
            headers=self.get_headers()
        )
        self.print_response(response, "자녀 이정표 달성 목록")
        
        # 이정표 달성 진도 조회
        print("\n4-3. 이정표 달성 진도 조회")
        response = self.session.get(
            f"{DEVELOPMENT_API_URL}/child-milestones/progress/?child_id={self.child_id}",
            headers=self.get_headers()
        )
        self.print_response(response, "이정표 달성 진도")
    
    def test_statistics(self):
        """발달 통계 테스트"""
        print("\n5. 발달 통계 테스트")
        
        # 전체 통계
        print("\n5-1. 전체 발달 통계")
        response = self.session.get(
            f"{DEVELOPMENT_API_URL}/records/stats/",
            headers=self.get_headers()
        )
        self.print_response(response, "전체 발달 통계")
        
        # 특정 자녀 통계
        if self.child_id:
            print("\n5-2. 특정 자녀 발달 통계")
            response = self.session.get(
                f"{DEVELOPMENT_API_URL}/records/stats/?child_id={self.child_id}",
                headers=self.get_headers()
            )
            self.print_response(response, "특정 자녀 발달 통계")
    
    def test_timeline(self):
        """발달 타임라인 테스트"""
        print("\n6. 발달 타임라인 테스트")
        
        # 전체 타임라인
        print("\n6-1. 전체 발달 타임라인")
        response = self.session.get(
            f"{DEVELOPMENT_API_URL}/timeline/timeline/",
            headers=self.get_headers()
        )
        self.print_response(response, "전체 발달 타임라인")
        
        # 특정 자녀 타임라인
        if self.child_id:
            print("\n6-2. 특정 자녀 발달 타임라인")
            response = self.session.get(
                f"{DEVELOPMENT_API_URL}/timeline/timeline/?child={self.child_id}",
                headers=self.get_headers()
            )
            self.print_response(response, "특정 자녀 발달 타임라인")
        
        # 날짜 범위 필터링
        print("\n6-3. 날짜 범위 필터링 타임라인")
        start_date = date.today() - timedelta(days=30)
        end_date = date.today()
        response = self.session.get(
            f"{DEVELOPMENT_API_URL}/timeline/timeline/?start_date={start_date}&end_date={end_date}",
            headers=self.get_headers()
        )
        self.print_response(response, "최근 30일 타임라인")
    
    def test_filtering_and_search(self):
        """필터링 및 검색 테스트"""
        print("\n7. 필터링 및 검색 테스트")
        
        # 발달 영역별 필터링
        print("\n7-1. 발달 영역별 필터링")
        response = self.session.get(
            f"{DEVELOPMENT_API_URL}/records/?development_area=physical",
            headers=self.get_headers()
        )
        self.print_response(response, "신체발달 기록만")
        
        # 기록 유형별 필터링
        print("\n7-2. 기록 유형별 필터링")
        response = self.session.get(
            f"{DEVELOPMENT_API_URL}/records/?record_type=milestone_achievement",
            headers=self.get_headers()
        )
        self.print_response(response, "이정표 달성 기록만")
        
        # 텍스트 검색
        print("\n7-3. 텍스트 검색")
        response = self.session.get(
            f"{DEVELOPMENT_API_URL}/records/?search=걸음마",
            headers=self.get_headers()
        )
        self.print_response(response, "'걸음마' 검색 결과")
        
        # 날짜 범위 필터링
        print("\n7-4. 날짜 범위 필터링")
        start_date = date.today() - timedelta(days=7)
        response = self.session.get(
            f"{DEVELOPMENT_API_URL}/records/?start_date={start_date}",
            headers=self.get_headers()
        )
        self.print_response(response, "최근 7일 기록")
    
    def test_error_cases(self):
        """에러 케이스 테스트"""
        print("\n8. 에러 케이스 테스트")
        
        # 잘못된 데이터로 발달 기록 생성
        print("\n8-1. 잘못된 데이터로 발달 기록 생성")
        invalid_data = {
            "child": "invalid-uuid",
            "date": "invalid-date",
            "title": "",  # 빈 제목
            "description": "설명"
        }
        response = self.session.post(
            f"{DEVELOPMENT_API_URL}/records/",
            headers=self.get_headers(),
            json=invalid_data
        )
        self.print_response(response, "잘못된 데이터 에러")
        
        # 존재하지 않는 기록 조회
        print("\n8-2. 존재하지 않는 기록 조회")
        response = self.session.get(
            f"{DEVELOPMENT_API_URL}/records/00000000-0000-0000-0000-000000000000/",
            headers=self.get_headers()
        )
        self.print_response(response, "존재하지 않는 기록")
        
        # 중복 이정표 달성 기록
        if self.child_id and self.milestone_id:
            print("\n8-3. 중복 이정표 달성 기록")
            duplicate_data = {
                "child": self.child_id,
                "milestone_id": self.milestone_id,
                "achieved_date": str(date.today())
            }
            response = self.session.post(
                f"{DEVELOPMENT_API_URL}/child-milestones/",
                headers=self.get_headers(),
                json=duplicate_data
            )
            self.print_response(response, "중복 이정표 달성")
    
    def cleanup(self):
        """테스트 데이터 정리"""
        print("\n9. 테스트 데이터 정리")
        
        # 생성한 발달 기록 삭제
        if self.record_id:
            print("\n9-1. 발달 기록 삭제")
            response = self.session.delete(
                f"{DEVELOPMENT_API_URL}/records/{self.record_id}/",
                headers=self.get_headers()
            )
            self.print_response(response, "발달 기록 삭제")
            
            if response.status_code in [204, 200]:
                print("✓ 발달 기록 삭제 완료")
    
    def run_all_tests(self):
        """모든 테스트 실행"""
        print("=" * 50)
        print("발달 모니터링 API 테스트 시작")
        print("=" * 50)
        
        try:
            # 인증 (실제 환경에서는 실제 로그인 구현)
            self.login_or_register()
            
            # 테스트용 자녀 ID 설정 (실제 환경에서는 사용자의 실제 자녀 ID 사용)
            # self.child_id = "test-child-uuid"
            
            # 이정표 목록 조회
            self.test_milestones_list()
            
            # 발달 기록 CRUD (자녀 ID가 있는 경우에만)
            if self.child_id:
                self.test_development_records()
                self.test_child_milestones()
                self.test_statistics()
                self.test_timeline()
                self.test_filtering_and_search()
            else:
                print("\n⚠️  자녀 ID가 없어 일부 테스트를 건너뜁니다.")
                print("실제 환경에서는 사용자의 자녀 데이터가 필요합니다.")
            
            # 에러 케이스
            self.test_error_cases()
            
            # 정리
            self.cleanup()
            
        except Exception as e:
            print(f"\n❌ 테스트 중 오류 발생: {str(e)}")
        
        print("\n" + "=" * 50)
        print("발달 모니터링 API 테스트 완료")
        print("=" * 50)


if __name__ == "__main__":
    print("📋 발달 모니터링 API 테스트 스크립트")
    print("🔗 서버가 http://localhost:8000 에서 실행 중인지 확인하세요.")
    print("🗄️  마이그레이션과 이정표 데이터가 설정되어 있는지 확인하세요.")
    print()
    
    tester = DevelopmentAPITester()
    tester.run_all_tests()
