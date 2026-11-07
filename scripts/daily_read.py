"""每日一读：每天早上让 Claude 上网搜索，写一篇短文，存成 preview/daily/ 下的 JSON。

由 .github/workflows/daily-read.yml 定时运行。密钥只从环境变量 ANTHROPIC_API_KEY
（GitHub 仓库 Secret）读取，绝不写进网页或仓库。没有密钥时直接跳过，不报错。
"""

import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

import anthropic

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "preview" / "daily"
CONTEXT = (Path(__file__).resolve().parent / "daily_context.md").read_text(encoding="utf-8")
TZ = ZoneInfo("Australia/Sydney")
WEEKDAY_ZH = "一二三四五六日"

# 「雅实动态」只能链接到这些站内页面
ALLOWED_LINKS = sorted(set(re.findall(r"页面 (\S+\.html)", CONTEXT)))

SYSTEM = f"""你在为悉尼的华人社区网站「雅实 Grace Rock」写每天一篇的「每日一读」。读者多是带孩子的家庭，中文为主。
语气温暖、简单、像朋友聊天。每段两三句话，不说空话，不夸张，不做医疗承诺。

文章有四段：
1. health：一个日常就能做的健康小知识（不提药物、不诊断、不针对疾病）。
2. outings：今天起 7 天内悉尼的 2 到 3 个好去处，优先免费或适合家庭的。必须用网络搜索核实日期、地点和价格，
   只写你在搜索结果里亲眼看到的信息，每条附上信息来源的网址。拿不准的不要写。
3. grace_rock：雅实动态，只能从下面「背景资料」里选一个商家或活动来写，不能编造优惠或日期。
   link 只能是这些页面之一：{", ".join(ALLOWED_LINKS)}
4. ai_tip：一个普通人马上能用的 AI 小技巧。

同时写一份意思相同的英文版。

背景资料：
<context>
{CONTEXT}
</context>

最后只输出一个 ```json 代码块，格式如下（不要输出其他内容）：
{{
  "zh": {{
    "health": {{"title": "...", "body": "..."}},
    "outings": [{{"title": "...", "when": "...", "where": "...", "price": "...", "note": "...", "url": "https://..."}}],
    "grace_rock": {{"title": "...", "body": "...", "link": "..."}},
    "ai_tip": {{"title": "...", "body": "..."}}
  }},
  "en": {{ 同样的结构，英文 }}
}}"""

WEB_SEARCH = {
    "type": "web_search_20260209",
    "name": "web_search",
    "max_uses": 6,
    "user_location": {
        "type": "approximate",
        "city": "Sydney",
        "region": "New South Wales",
        "country": "AU",
        "timezone": "Australia/Sydney",
    },
}


def ask(client: anthropic.Anthropic, prompt: str):
    messages = [{"role": "user", "content": prompt}]
    for _ in range(5):
        response = client.beta.messages.create(
            model="claude-opus-5-5",
            max_tokens=16000,
            output_config={"effort": "medium"},
            system=SYSTEM,
            tools=[WEB_SEARCH],
            messages=messages,
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
        )
        if response.stop_reason != "pause_turn":
            return response
        # 搜索还没做完：把已有的回答原样送回去，服务器会接着做
        messages = [messages[0], {"role": "assistant", "content": response.content}]
    return response


def extract_json(response) -> dict:
    text = "".join(b.text for b in response.content if b.type == "text")
    m = re.search(r"```json\s*(\{.*\})\s*```", text, re.S) or re.search(r"(\{.*\})", text, re.S)
    if not m:
        raise ValueError("回答里没有 JSON")
    return json.loads(m.group(1))


def check(post: dict) -> None:
    for lang in ("zh", "en"):
        p = post[lang]
        for key in ("health", "ai_tip", "grace_rock"):
            if not p[key]["title"].strip() or not p[key]["body"].strip():
                raise ValueError(f"{lang}.{key} 是空的")
        if p["grace_rock"]["link"] not in ALLOWED_LINKS:
            raise ValueError(f"{lang}.grace_rock.link 不在允许的页面里：{p['grace_rock']['link']}")
        if not 1 <= len(p["outings"]) <= 3:
            raise ValueError(f"{lang}.outings 需要 1 到 3 条")
        for o in p["outings"]:
            if not o.get("title") or not str(o.get("url", "")).startswith("https://"):
                raise ValueError(f"{lang}.outings 缺标题或 https 来源")


def main() -> int:
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("没有设置 ANTHROPIC_API_KEY，今天跳过。")
        return 0

    now = datetime.now(TZ)
    date = now.strftime("%Y-%m-%d")
    prompt = f"今天是悉尼时间 {date}（星期{WEEKDAY_ZH[now.weekday()]}）。请写今天的每日一读。"

    response = ask(anthropic.Anthropic(), prompt)
    if response.stop_reason == "refusal":
        print("模型拒绝了这次请求，今天不更新。", file=sys.stderr)
        return 1
    if response.stop_reason not in ("end_turn", "stop_sequence"):
        print(f"回答没有正常结束（{response.stop_reason}），今天不更新。", file=sys.stderr)
        return 1

    post = extract_json(response)
    check(post)
    post = {
        "date": date,
        "weekday": now.weekday(),
        "generated_at": now.isoformat(timespec="minutes"),
        "zh": post["zh"],
        "en": post["en"],
    }

    OUT.mkdir(parents=True, exist_ok=True)
    data = json.dumps(post, ensure_ascii=False, indent=1) + "\n"
    (OUT / f"{date}.json").write_text(data, encoding="utf-8")
    (OUT / "today.json").write_text(data, encoding="utf-8")
    u = response.usage
    print(f"已写好 {date}，输入 {u.input_tokens} tokens，输出 {u.output_tokens} tokens。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
