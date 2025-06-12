import torch
import os
import gc
import logging
import sys
import traceback
from transformers import AutoTokenizer, AutoModelForCausalLM

# 로깅 설정
log_dir = "log"
log_file = "chatbot.log"
log_path = os.path.join(log_dir, log_file)

if not os.path.exists(log_dir):
    os.makedirs(log_dir)  # log 디렉토리 생성

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler(log_path, encoding='utf-8'),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

def check_gpu_status():
    logger.info("[시스템] GPU 상태 확인 중...")
    if torch.cuda.is_available():
        logger.info("[시스템] CUDA 사용 가능")
        return True, "cuda"
    elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
        logger.info("[시스템] Apple MPS 사용 가능")
        return True, "mps"
    else:
        logger.info("[시스템] GPU 사용 불가, CPU로 실행")
        return False, "cpu"

class LGExaoneAdvancedChatbot:
    def __init__(self, model_name="Snowfall0601/results_exaone_lora_sleep_dev"):
        logger.info("[초기화] LGExaoneAdvancedChatbot 인스턴스 생성 중...")
        self.model_name = model_name
        self.tokenizer = None
        self.model = None
        self._is_model_loaded = False
        self.chat_history = []

        self.has_gpu, device_str = check_gpu_status()
        self.device = torch.device(device_str)
        logger.info(f"[초기화 완료] 디바이스: {self.device}")

    def load_model(self) -> bool:
        if self._is_model_loaded:
            logger.info("[모델] 이미 로드됨")
            return True
        try:
            logger.info("[모델] 토크나이저 로딩 중...")
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name, trust_remote_code=True)
            if self.tokenizer.pad_token is None:
                logger.info("[모델] pad_token이 없어 eos_token으로 설정")
                self.tokenizer.pad_token = self.tokenizer.eos_token

            logger.info("[모델] 모델 로딩 중...")
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_name,
                torch_dtype=torch.float16 if self.device.type == "cuda" else torch.float32,
                trust_remote_code=True
            ).to(self.device)

            self.model.eval()
            self._is_model_loaded = True

            logger.info("[모델] 모델 로딩 완료. 메모리 정리 중...")
            gc.collect()
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
            return True
        except Exception as e:
            logger.error(f"[오류] 모델 로딩 실패: {e}")
            logger.error(traceback.format_exc())
            return False

    def generate_response(self, user_input: str, max_new_tokens=512, temperature=0.7, top_p=0.9) -> str:
        logger.info("[요청 처리] 사용자 입력 수신 및 응답 생성 중...")
        try:
            system_prompt = "당신은 아이의 발달 및 수면에 조언을 주는 소아과 전문의 AI입니다."
            prompt = f"{system_prompt}\n사용자: {user_input}\nAI:"
            logger.info("[프롬프트] 토크나이즈 시작")
            inputs = self.tokenizer(prompt, return_tensors="pt").to(self.device)

            logger.info("[모델] 응답 생성 중...")
            with torch.no_grad():
                output = self.model.generate(
                    **inputs,
                    max_new_tokens=max_new_tokens,
                    temperature=temperature,
                    top_p=top_p,
                    do_sample=True,
                    pad_token_id=self.tokenizer.pad_token_id,
                    eos_token_id=self.tokenizer.eos_token_id
                )
            logger.info("[모델] 응답 생성 완료")

            decoded = self.tokenizer.decode(output[0], skip_special_tokens=True)
            response = decoded.replace(prompt, "").strip()
            logger.info("[응답 완료] 응답 반환 중...")

            self.chat_history.append({
                "user": user_input,
                "assistant": response
            })

            logger.info(self.chat_history)

            return response
        except Exception as e:
            logger.error(f"[오류] 응답 생성 실패: {e}")
            logger.error(traceback.format_exc())
            return "죄송합니다. 응답 생성 중 오류가 발생했습니다."