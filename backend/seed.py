import asyncio
from prisma import Prisma

async def main():
    prisma = Prisma()
    await prisma.connect()

    print("Cleaning up existing data...")
    await prisma.option.delete_many()
    await prisma.question.delete_many()

    print("Seeding questions...")
    
    # 問題1 (通常問題)
    q1 = await prisma.question.create(
        data={
            "text": "保々中学校の思い出の場所といえば？",
            "type": "normal",
            "timeLimit": 30,
            "correctOption": 1,
            "options": {
                "create": [
                    {"text": "体育館裏", "order": 1},
                    {"text": "図書室", "order": 2},
                    {"text": "中庭", "order": 3},
                    {"text": "屋上", "order": 4},
                ]
            }
        }
    )

    # 問題2 (マジョリティ問題・正解がない)
    q2 = await prisma.question.create(
        data={
            "text": "中学時代、いちばん楽しかった行事は？（みんなと合わせろ！）",
            "type": "majority",
            "timeLimit": 30,
            "options": {
                "create": [
                    {"text": "体育祭", "order": 1},
                    {"text": "文化祭（合唱コン等）", "order": 2},
                    {"text": "修学旅行", "order": 3},
                    {"text": "部活動の大会", "order": 4},
                ]
            }
        }
    )

    # 問題3 (通常問題)
    q3 = await prisma.question.create(
        data={
            "text": "当時の校長先生の名前は？",
            "type": "normal",
            "timeLimit": 20,
            "correctOption": 3,
            "options": {
                "create": [
                    {"text": "田中先生", "order": 1},
                    {"text": "佐藤先生", "order": 2},
                    {"text": "鈴木先生", "order": 3},
                    {"text": "高橋先生", "order": 4},
                ]
            }
        }
    )

    print("Seed data created successfully!")
    await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
