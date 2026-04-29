from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class GameState(BaseModel):
    current_question_id: Optional[int] = None
    status: str = "waiting" # waiting, answering, revealed (答え発表済み)
    started_at: Optional[datetime] = None

# インメモリで全体の進行状態を管理する（必要であればDB化するが、速度上インメモリで十分）
state = GameState()
