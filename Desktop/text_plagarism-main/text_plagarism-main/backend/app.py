"""
Universal Plagiarism + AI Detection — FAISS + MiniLM + SerpAPI + in-memory auth.
"""

from __future__ import annotations

import asyncio
import io
import json
import re
import secrets
from typing import Any

import faiss
import numpy as np
from docx import Document
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field, field_validator
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

from serp_engine import search_sources

# --- In-memory auth (plain passwords per product spec) --------------------------------
users_db: dict[str, str] = {}
# Optional opaque tokens for localStorage: token -> email
tokens_db: dict[str, str] = {}


_STRONG_PW = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$")


class UserRegister(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=256)

    @field_validator("password")
    @classmethod
    def strong_password(cls, v: str) -> str:
        if not _STRONG_PW.match(v):
            raise ValueError(
                "Password must be 8+ characters and include upper, lower, digit, and special (@$!%*?&)"
            )
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=256)


class PasswordChange(BaseModel):
    email: EmailStr
    new_password: str = Field(..., min_length=8, max_length=256)
    confirm_password: str = Field(..., min_length=8, max_length=256)

    @field_validator("new_password")
    @classmethod
    def strong_new_password(cls, v: str) -> str:
        if not _STRONG_PW.match(v):
            raise ValueError(
                "Password must be 8+ characters and include upper, lower, digit, and special (@$!%*?&)"
            )
        return v


# --- Internal fallback corpus (similarity only when SerpAPI returns nothing; never exposed as sources) ---
SAMPLE_TEXTS: list[str] = [
    "Artificial Intelligence is transforming industries across the globe, from healthcare diagnostics to autonomous vehicles.",
    "Machine learning enables computers to learn from data without being explicitly programmed for every task.",
    "Sorting algorithms like quicksort and mergesort are efficient ways to order large collections of numbers.",
    "Natural language processing helps machines understand, interpret, and generate human language.",
    "Deep neural networks consist of many layers that learn hierarchical representations of input data.",
    "Climate change poses significant challenges to ecosystems, agriculture, and coastal communities worldwide.",
    "Renewable energy sources such as solar and wind are becoming more cost-effective than fossil fuels in many regions.",
    "The scientific method involves observation, hypothesis formation, experimentation, and peer-reviewed validation.",
    "Cybersecurity best practices include strong passwords, multi-factor authentication, and regular software updates.",
    "Blockchain technology provides decentralized ledgers that can increase transparency in supply chains.",
    "Remote work has reshaped collaboration tools, meeting culture, and expectations around work-life balance.",
    "Education technology platforms enable personalized learning paths and scalable assessment at lower cost.",
    "Quantum computing may eventually solve certain optimization and simulation problems intractable for classical computers.",
    "Ethical AI requires fairness, accountability, transparency, and careful handling of sensitive personal data.",
    "Cloud computing offers elastic infrastructure so startups can scale services without large upfront hardware costs.",
    "Biotechnology advances in gene editing raise both therapeutic promise and ethical debate among policymakers.",
    "Urban planning must balance housing density, public transit, green space, and economic opportunity.",
    "Financial markets react to interest rates, inflation expectations, and geopolitical uncertainty in complex ways.",
    "Sports analytics uses statistical models to evaluate player performance and inform coaching decisions.",
    "Literature reviews synthesize prior research to identify gaps and justify new experimental directions.",
]

_model: SentenceTransformer | None = None
_faiss_index: faiss.Index | None = None
_corpus_embeddings: np.ndarray | None = None


def get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def build_faiss_index() -> tuple[faiss.Index, np.ndarray]:
    model = get_model()
    emb = model.encode(SAMPLE_TEXTS, normalize_embeddings=True, show_progress_bar=False)
    emb = np.asarray(emb, dtype=np.float32)
    dim = emb.shape[1]
    index = faiss.IndexFlatIP(dim)
    index.add(emb)
    return index, emb


def startup_index() -> None:
    global _faiss_index, _corpus_embeddings
    _faiss_index, _corpus_embeddings = build_faiss_index()


app = FastAPI(title="Plagiarism RAG API", version="1.2.0")

# Wildcard CORS: use credentials=False (browsers forbid * with credentials=True)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def _on_startup() -> None:
    startup_index()


def extract_text_from_txt(raw: bytes) -> str:
    return raw.decode("utf-8", errors="replace")


def extract_text_from_pdf(raw: bytes) -> str:
    reader = PdfReader(io.BytesIO(raw))
    parts: list[str] = []
    for page in reader.pages:
        t = page.extract_text()
        if t:
            parts.append(t)
    return "\n".join(parts)


def extract_text_from_docx(raw: bytes) -> str:
    doc = Document(io.BytesIO(raw))
    return "\n".join(p.text for p in doc.paragraphs)


def extract_text_from_upload(filename: str, raw: bytes) -> str:
    lower = filename.lower()
    if lower.endswith(".txt"):
        return extract_text_from_txt(raw)
    if lower.endswith(".pdf"):
        return extract_text_from_pdf(raw)
    if lower.endswith(".docx"):
        return extract_text_from_docx(raw)
    raise HTTPException(status_code=400, detail="Unsupported file type. Use .txt, .pdf, or .docx.")


def normalize_whitespace(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip()


def word_tokens(text: str) -> set[str]:
    return {w for w in re.findall(r"\b\w+\b", text.lower()) if len(w) > 1}


def keyword_overlap_score(user_text: str, reference_blob: str) -> float:
    a = word_tokens(user_text)
    b = word_tokens(reference_blob)
    if not a and not b:
        return 0.0
    inter = len(a & b)
    union = len(a | b) or 1
    return inter / union


def placeholder_grammar_metrics(text: str) -> dict[str, str]:
    t = normalize_whitespace(text)
    n_words = len(t.split()) if t else 0
    n_sents = max(1, len(re.split(r"[.!?]+", t)))

    avg_len = n_words / n_sents if n_sents else 0

    if n_words < 8:
        grammar = spelling = punctuation = readability = word_choice = "Insufficient text"
        return {
            "grammar": grammar,
            "spelling": spelling,
            "punctuation": punctuation,
            "readability": readability,
            "word_choice": word_choice,
        }

    long_sentences = sum(1 for s in re.split(r"[.!?]+", t) if len(s.split()) > 35)
    commas = t.count(",")
    if long_sentences >= 2 or avg_len > 28:
        grammar = "Review suggested"
        readability = "Hard"
    elif avg_len > 18:
        grammar = "Good"
        readability = "Medium"
    else:
        grammar = "Good"
        readability = "Easy"

    suspicious = len(re.findall(r"(.)\1{2,}", t))
    spelling = "Minor Issues" if suspicious >= 3 else "Good"

    if t.endswith((".", "!", "?")) and commas < n_sents:
        punctuation = "Good"
    elif not re.search(r"[.!?]$", t.strip()):
        punctuation = "Review suggested"
    else:
        punctuation = "Good"

    rare_short_words = sum(1 for w in re.findall(r"\b\w+\b", t.lower()) if len(w) <= 2)
    word_choice = "Review suggested" if rare_short_words > n_words * 0.15 else "Good"

    return {
        "grammar": grammar,
        "spelling": spelling,
        "punctuation": punctuation,
        "readability": readability,
        "word_choice": word_choice,
    }


def compute_typing_metrics(body_text: str, elapsed_ms: float) -> tuple[float, int, float]:
    words = body_text.split()
    paste_size = len(words)
    elapsed_sec = max(elapsed_ms / 1000.0, 0.05)
    typing_speed_wps = paste_size / elapsed_sec
    return typing_speed_wps, paste_size, elapsed_sec


def detect_ai(similarity_pct: float, paste_size: int, _typing_speed: float) -> str:
    """
    similarity_pct: 0–100; paste_size: word count (client or server).
    _typing_speed reserved for future heuristics (behavior JSON still logged in metrics).
    """
    if similarity_pct > 70 and paste_size > 50:
        return "Likely Copied / AI Generated"
    if similarity_pct > 50:
        return "Edited Content"
    return "Human Written"


def combined_plagiarism_score(max_sim: float, avg_sim: float, kw_overlap: float) -> float:
    combined = 0.6 * max_sim + 0.2 * avg_sim + 0.2 * kw_overlap
    return round(float(combined) * 100, 1)


@app.post("/api/auth/signup")
def signup(user: UserRegister) -> dict[str, Any]:
    email_norm = user.email.strip().lower()
    if email_norm in users_db:
        return {"error": "User already exists"}
    users_db[email_norm] = user.password
    token = secrets.token_urlsafe(32)
    tokens_db[token] = email_norm
    return {
        "message": "Signup successful",
        "access_token": token,
        "token_type": "bearer",
        "name": user.name.strip(),
        "email": email_norm,
    }


@app.post("/api/auth/login")
def login(user: UserLogin) -> dict[str, Any]:
    email_norm = user.email.strip().lower()
    if users_db.get(email_norm) == user.password:
        token = secrets.token_urlsafe(32)
        tokens_db[token] = email_norm
        return {"message": "Login successful", "access_token": token, "token_type": "bearer", "email": email_norm}
    return {"error": "Invalid credentials"}


@app.post("/api/auth/password")
def change_password(body: PasswordChange) -> dict[str, Any]:
    if body.new_password != body.confirm_password:
        return {"error": "Passwords do not match"}
    email_norm = body.email.strip().lower()
    if email_norm not in users_db:
        return {"error": "User not found"}
    users_db[email_norm] = body.new_password
    return {"message": "Password updated. Please log in again on all devices."}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/check")
async def check_plagiarism(
    text: str = Form(""),
    file: UploadFile | None = File(None),
    elapsed_ms: str = Form("0"),
    behavior: str = Form("{}"),
) -> dict[str, Any]:
    if _faiss_index is None or _corpus_embeddings is None:
        raise HTTPException(status_code=503, detail="Index not ready")

    try:
        elapsed = float(elapsed_ms or "0")
    except ValueError:
        elapsed = 0.0
    if elapsed <= 0:
        elapsed = 3000.0

    body_text = normalize_whitespace(text)

    if file is not None and file.filename:
        raw = await file.read()
        if len(raw) > 5_000_000:
            raise HTTPException(status_code=400, detail="File too large (max ~5MB).")
        extracted = extract_text_from_upload(file.filename, raw)
        body_text = normalize_whitespace(extracted if not body_text else body_text + "\n\n" + extracted)

    if not body_text:
        raise HTTPException(status_code=400, detail="Provide non-empty text or a readable file.")

    # Client behavior: optional JSON { "typing_speed", "paste_size" }
    behavior_parsed: dict[str, Any] = {}
    try:
        behavior_parsed = json.loads(behavior or "{}")
    except json.JSONDecodeError:
        behavior_parsed = {}

    model = get_model()
    q = model.encode([body_text], normalize_embeddings=True, show_progress_bar=False)
    q = np.asarray(q, dtype=np.float32)

    # SerpAPI — real URLs only (no "Local Dataset Source" entries)
    sources: list[dict[str, Any]] = await asyncio.to_thread(search_sources, body_text)
    reference_blob = ""
    per_source_sims: list[float] = []

    if sources:
        texts_for_embed = [f"{s.get('title', '')} {s.get('snippet', '')}" for s in sources]
        reference_blob = " ".join(texts_for_embed)
        ref_emb = model.encode(texts_for_embed, normalize_embeddings=True, show_progress_bar=False)
        ref_emb = np.asarray(ref_emb, dtype=np.float32)
        sims_matrix = cosine_similarity(q, ref_emb)[0]
        per_source_sims = [float(x) for x in sims_matrix]
        max_sim = float(np.max(sims_matrix))
        avg_sim = float(np.mean(sims_matrix))
        # Replace placeholder similarity with semantic match %; omit snippet from API output
        for i in range(len(sources)):
            sim_pct = round(per_source_sims[i] * 100, 1) if i < len(per_source_sims) else float(sources[i].get("similarity", 0))
            sources[i] = {
                "title": sources[i].get("title") or "Untitled",
                "url": sources[i].get("url") or "",
                "similarity": sim_pct,
            }
    else:
        sims_fb = cosine_similarity(q, _corpus_embeddings)[0]
        max_sim = float(np.max(sims_fb))
        avg_sim = float(np.mean(np.sort(sims_fb)[-min(3, len(sims_fb)) :]))
        reference_blob = " ".join(SAMPLE_TEXTS)

    kw = keyword_overlap_score(body_text, reference_blob)
    plagiarism_score = combined_plagiarism_score(max_sim, avg_sim, kw)

    typing_speed_wps, paste_size_words, _ = compute_typing_metrics(body_text, elapsed)
    # Prefer client-sent behavior when present
    client_ts = behavior_parsed.get("typing_speed")
    client_ps = behavior_parsed.get("paste_size")
    if isinstance(client_ts, (int, float)):
        typing_speed_wps = float(client_ts)
    if isinstance(client_ps, int):
        paste_size = client_ps
    elif isinstance(client_ps, float):
        paste_size = int(client_ps)
    else:
        paste_size = paste_size_words

    similarity_pct = max_sim * 100.0
    ai_label = detect_ai(similarity_pct, paste_size, typing_speed_wps)

    grammar_block = placeholder_grammar_metrics(body_text)

    return {
        "plagiarism_score": plagiarism_score,
        "grammar": grammar_block["grammar"],
        "spelling": grammar_block["spelling"],
        "punctuation": grammar_block["punctuation"],
        "readability": grammar_block["readability"],
        "word_choice": grammar_block["word_choice"],
        "ai_detection": ai_label,
        "sources": sources,
        "metrics": {
            "typing_speed": round(typing_speed_wps, 2),
            "paste_size": paste_size,
        },
    }


if __name__ == "__main__":
    import os

    import uvicorn

    # Port 8000 often triggers WinError 10013 on Windows; 8787 is a safer default for local dev.
    port = int(os.environ.get("PORT", "8787"))
    uvicorn.run("app:app", host="127.0.0.1", port=port, reload=True)
