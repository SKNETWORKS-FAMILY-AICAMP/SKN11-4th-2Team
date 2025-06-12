import os
import json
import shutil
from django.core.management.base import BaseCommand
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.schema import Document


class FaissCommand(BaseCommand):
    help = "Load vector_db_final.json into FAISS using OpenAI embeddings"

    def handle(self, *args, **kwargs):
        load_dotenv()  # .env 파일 로드
        openai_api_key = os.getenv("OPENAI_API_KEY")

        if not openai_api_key:
            print(self.style.ERROR("❌ OPENAI_API_KEY가 올바르게 설정되지 않았습니다."))
            return

        # JSON 파일 경로 (chatbot 앱 폴더 내)
        app_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        json_path = os.path.join(app_dir, "data", "vector_db_final.json")

        if not os.path.exists(json_path):
            print(self.style.ERROR(f"❌ vector_db_final.json 파일을 찾을 수 없습니다: {json_path}"))
            return

        try:
            # 데이터 로딩
            with open(json_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            # Document 변환
            documents = []
            for item in data:
                doc = Document(
                    page_content=item["text"],
                    metadata=item["metadata"]
                )
                documents.append(doc)

            print(f"✅ {len(documents)}개의 문서를 로드했습니다. 임베딩을 생성하는 중...")

            # 임베딩 모델 초기화 (GPT-4o와 호환되는 임베딩 모델)
            embedding_model = OpenAIEmbeddings(
                model="text-embedding-3-small",
                openai_api_key=openai_api_key
            )

            # FAISS 벡터스토어 생성
            print("🔄 FAISS 벡터스토어를 생성하는 중...")
            vectorstore = FAISS.from_documents(
                documents=documents,
                embedding=embedding_model
            )

            # FAISS 인덱스 저장
            faiss_dir = os.path.join(app_dir, "vector_store","faiss_db")
            os.makedirs(faiss_dir, exist_ok=True)

            if os.path.exists(faiss_dir):
                shutil.rmtree(faiss_dir)
                print("🗑️  기존 FAISSDB를 삭제했습니다.")
                
            
            # FAISS 인덱스 저장
            vectorstore.save_local(faiss_dir)
            
            print(self.style.SUCCESS(f"✅ FAISS DB 저장 완료: {faiss_dir}"))
            
        except Exception as e:
            print(self.style.ERROR(f"❌ 오류 발생: {str(e)}"))
            import traceback
            print(traceback.format_exc())
