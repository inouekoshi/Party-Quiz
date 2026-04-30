import sys

def modify_api():
    with open("backend/app/api.py", "r") as f:
        content = f.read()
    
    if "/admin/reset" not in content:
        new_endpoint = """
@router.post("/admin/reset_all")
async def reset_all():
    \"\"\"ゲームの状態、スコア、回答をリセットし、シードデータを再投入する\"\"\"
    import subprocess
    import sys
    
    # 状態の初期化
    state.current_question_id = None
    state.status = "waiting"
    state.started_at = None
    
    # スコアと回答のクリア
    await prisma.answer.delete_many()
    await prisma.team.update_many(data={"score": 0})
    
    # seed.pyを実行して問題を再構築
    subprocess.run([sys.executable, "seed.py"], check=True)
    
    # フロントエンドに更新を通知
    await manager.broadcast({
        "event": "quiz_finished",
        "data": {"leaderboard": []}
    })
    return {"status": "reset_success"}
"""
        content += new_endpoint
        with open("backend/app/api.py", "w") as f:
            f.write(content)
        print("backend/app/api.py updated")

modify_api()
