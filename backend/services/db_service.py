"""
Multi-Table Database Service for TruthLens AI System.

Expanded Users Table Fields:
- id (INTEGER PRIMARY KEY)
- full_name (TEXT)
- dob (TEXT)
- gender (TEXT)
- email (TEXT UNIQUE)
- phone (TEXT)
- provider (TEXT)
- profile_image (TEXT)
- password_hash (TEXT)
- role (TEXT)
- status (TEXT DEFAULT 'active')
- is_verified (BOOLEAN DEFAULT 1)
- email_verified (BOOLEAN DEFAULT 1)
- phone_verified (BOOLEAN DEFAULT 0)
- created_at (TEXT)
- updated_at (TEXT)
- last_login (TEXT)
- refresh_token (TEXT)
"""

import os
import sqlite3
import time
import datetime
from typing import List, Dict, Any, Tuple
from services.auth_service import hash_password

def get_db_path() -> str:
    """Resolve the SQLite database path, allowing tests to override it."""
    return os.environ.get(
        "TRUTHLENS_DB_PATH",
        os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "fake_news.db"
        )
    )


DB_PATH = get_db_path()


def get_connection():
    """Returns a SQLite database connection configured for concurrent access."""
    db_path = get_db_path()
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path, timeout=30, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def migrate_schema_if_needed(conn):
    """Checks if Users table contains dob and gender columns and migrates if needed."""
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(Users)")
    columns = [row[1] for row in cursor.fetchall()]
    if columns and ("dob" not in columns or "gender" not in columns):
        print("[Database Migration] Updating Users schema to include dob, gender, and status...")
        cursor.execute("DROP TABLE Users")
        conn.commit()


def init_db():
    """Initializes multi-table database schema."""
    with get_connection() as conn:
        migrate_schema_if_needed(conn)
        cursor = conn.cursor()

        # 1. Users Table (18 fields)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                dob TEXT,
                gender TEXT,
                email TEXT UNIQUE NOT NULL,
                phone TEXT,
                provider TEXT DEFAULT 'email',
                profile_image TEXT,
                password_hash TEXT NOT NULL,
                role TEXT DEFAULT 'user',
                status TEXT DEFAULT 'active',
                is_verified BOOLEAN DEFAULT 1,
                email_verified BOOLEAN DEFAULT 1,
                phone_verified BOOLEAN DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                last_login TEXT,
                refresh_token TEXT
            )
        """)
        # Ensure we don't attempt to create a UNIQUE index when duplicate phone
        # values already exist. If duplicates are found, keep the earliest
        # inserted record's phone and clear the phone field on later duplicates
        # so the unique index can be created safely.
        cursor.execute("SELECT phone, COUNT(*) as c FROM Users WHERE phone IS NOT NULL AND phone != '' GROUP BY phone HAVING c>1")
        dup_rows = cursor.fetchall()
        if dup_rows:
            print(f"[Database] Found {len(dup_rows)} duplicated phone(s); deduplicating before creating unique index...")
            for row in dup_rows:
                phone_val = row[0]
                # preserve the oldest entry (lowest id), clear phone for others
                cursor.execute("SELECT id FROM Users WHERE phone = ? ORDER BY id ASC", (phone_val,))
                ids = [r[0] for r in cursor.fetchall()]
                for dup_id in ids[1:]:
                    cursor.execute("UPDATE Users SET phone = NULL WHERE id = ?", (dup_id,))
            conn.commit()

        try:
            cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone_unique ON Users(phone)")
        except sqlite3.IntegrityError:
            # If index creation still fails, warn and continue — application can
            # continue without the index; admin may want to inspect DB.
            print("[Database] Warning: Could not create unique index on Users.phone due to remaining duplicates.")

        # 2. PredictionHistory Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS PredictionHistory (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                news_text TEXT NOT NULL,
                prediction TEXT NOT NULL,
                confidence REAL NOT NULL,
                created_at TEXT NOT NULL
            )
        """)

        # 3. Feedback Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                prediction_id INTEGER,
                user_email TEXT,
                is_accurate BOOLEAN,
                comment TEXT,
                created_at TEXT NOT NULL
            )
        """)

        # 4. Bookmarks Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Bookmarks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_email TEXT NOT NULL,
                news_text TEXT NOT NULL,
                prediction TEXT NOT NULL,
                confidence REAL NOT NULL,
                created_at TEXT NOT NULL
            )
        """)

        conn.commit()

    seed_sample_users()
    seed_sample_history_if_empty()


def seed_sample_users():
    """Seeds default admin and student test user accounts."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM Users")
        if cursor.fetchone()[0] == 0:
            now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
            cursor.execute("""
                INSERT INTO Users (full_name, dob, gender, email, phone, provider, profile_image, password_hash, role, status, is_verified, email_verified, phone_verified, created_at, updated_at, last_login)
                VALUES (?, ?, ?, ?, ?, 'email', ?, ?, 'admin', 'active', 1, 1, 1, ?, ?, ?)
            """, ("System Admin", "1995-01-15", "Other", "admin@truthlens.ai", "+919876543210", "https://api.dicebear.com/7.x/bottts/svg?seed=admin", hash_password("admin123"), now_iso, now_iso, now_iso))

            cursor.execute("""
                INSERT INTO Users (full_name, dob, gender, email, phone, provider, profile_image, password_hash, role, status, is_verified, email_verified, phone_verified, created_at, updated_at, last_login)
                VALUES (?, ?, ?, ?, ?, 'email', ?, ?, 'user', 'active', 1, 1, 1, ?, ?, ?)
            """, ("Student Researcher", "2002-05-20", "Male", "student@truthlens.ai", "+919123456789", "https://api.dicebear.com/7.x/avataaars/svg?seed=student", hash_password("student123"), now_iso, now_iso, now_iso))
            conn.commit()


def seed_sample_history_if_empty():
    """Seeds initial sample predictions."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM PredictionHistory")
        if cursor.fetchone()[0] == 0:
            today_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
            sample_entries = [
                (
                    "WASHINGTON (Reuters) - NASA Curiosity rover discovers organic molecules in Mars crater sedimentary rock.",
                    "Real",
                    98.45,
                    today_iso
                ),
                (
                    "SHOCKING SECRET revealed! Government mind control chips are secretly broadcasting microwaves through satellite dishes!",
                    "Fake",
                    99.12,
                    today_iso
                )
            ]
            cursor.executemany("""
                INSERT INTO PredictionHistory (news_text, prediction, confidence, created_at)
                VALUES (?, ?, ?, ?)
            """, sample_entries)
            conn.commit()


# --- USER AUTH MANAGEMENT ---

def create_user(username: str, email: str, password_raw: str, full_name: str = "", dob: str = "", gender: str = "", phone: str = "", provider: str = "email", profile_image: str = "") -> Dict[str, Any]:
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    pwd_hash = hash_password(password_raw)
    display_name = full_name if full_name else username
    avatar = profile_image if profile_image else f"https://api.dicebear.com/7.x/avataaars/svg?seed={email}"
    phone_verified = 1 if provider == 'phone' else 0

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Users (full_name, dob, gender, email, phone, provider, profile_image, password_hash, role, status, is_verified, email_verified, phone_verified, created_at, updated_at, last_login)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'user', 'active', 1, 1, ?, ?, ?, ?)
        """, (display_name, dob, gender, email, phone, provider, avatar, pwd_hash, phone_verified, now_iso, now_iso, now_iso))
        conn.commit()
        uid = cursor.lastrowid

    return {
        "id": uid,
        "full_name": display_name,
        "dob": dob,
        "gender": gender,
        "email": email,
        "phone": phone,
        "provider": provider,
        "profile_image": avatar,
        "role": "user",
        "status": "active",
        "is_verified": True,
        "email_verified": True,
        "created_at": now_iso
    }


def get_user_by_email(email: str) -> Dict[str, Any]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Users WHERE email = ?", (email,))
        row = cursor.fetchone()
        return dict(row) if row else None


def get_user_by_phone(phone: str) -> Dict[str, Any]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Users WHERE phone = ?", (phone,))
        row = cursor.fetchone()
        return dict(row) if row else None


def update_user_last_login(email: str):
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE Users SET last_login = ?, updated_at = ? WHERE email = ?", (now_iso, now_iso, email))
        conn.commit()


def update_user_profile(email: str, full_name: str = None, dob: str = None, gender: str = None, phone: str = None, profile_image: str = None) -> Dict[str, Any]:
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    user = get_user_by_email(email)
    if not user:
        return None

    new_name = full_name if full_name is not None else user.get("full_name")
    new_dob = dob if dob is not None else user.get("dob")
    new_gender = gender if gender is not None else user.get("gender")
    new_phone = phone if phone is not None else user.get("phone")
    new_image = profile_image if profile_image is not None else user.get("profile_image")

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE Users
            SET full_name = ?, dob = ?, gender = ?, phone = ?, profile_image = ?, updated_at = ?
            WHERE email = ?
        """, (new_name, new_dob, new_gender, new_phone, new_image, now_iso, email))
        conn.commit()

    return get_user_by_email(email)


def update_user_password(email: str, new_password_raw: str) -> bool:
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    new_hash = hash_password(new_password_raw)
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE Users SET password_hash = ?, updated_at = ? WHERE email = ?", (new_hash, now_iso, email))
        conn.commit()
        return cursor.rowcount > 0


def mark_user_email_verified(email: str) -> bool:
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE Users SET email_verified = 1, is_verified = 1, updated_at = ? WHERE email = ?", (now_iso, email))
        conn.commit()
        return cursor.rowcount > 0


def mark_user_phone_verified(email: str, phone: str) -> bool:
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE Users SET phone = ?, phone_verified = 1, updated_at = ? WHERE email = ?", (phone, now_iso, email))
        conn.commit()
        return cursor.rowcount > 0


def delete_user_account(email: str) -> bool:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Users WHERE email = ?", (email,))
        conn.commit()
        return cursor.rowcount > 0


# --- ADMIN USER MANAGEMENT ---

def get_all_users_for_admin(search: str = "") -> List[Dict[str, Any]]:
    search_pattern = f"%{search.strip()}%"
    with get_connection() as conn:
        cursor = conn.cursor()
        if search:
            cursor.execute("""
                SELECT id, full_name, dob, gender, email, phone, provider, profile_image, role, status, is_verified, created_at, last_login
                FROM Users
                WHERE full_name LIKE ? OR email LIKE ? OR phone LIKE ?
                ORDER BY id DESC
            """, (search_pattern, search_pattern, search_pattern))
        else:
            cursor.execute("""
                SELECT id, full_name, dob, gender, email, phone, provider, profile_image, role, status, is_verified, created_at, last_login
                FROM Users
                ORDER BY id DESC
            """)
        return [dict(r) for r in cursor.fetchall()]


def toggle_user_block_status(user_id: int) -> Dict[str, Any]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT status FROM Users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        if not row:
            return None
        current = row["status"]
        new_status = "blocked" if current == "active" else "active"
        cursor.execute("UPDATE Users SET status = ? WHERE id = ?", (new_status, user_id))
        conn.commit()
        return {"id": user_id, "status": new_status}


def admin_delete_user(user_id: int) -> bool:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Users WHERE id = ?", (user_id,))
        conn.commit()
        return cursor.rowcount > 0


# --- PREDICTION HISTORY & DASHBOARD ---

def add_prediction(news_text: str, prediction: str, confidence: float) -> Dict[str, Any]:
    created_at = datetime.datetime.now(datetime.timezone.utc).isoformat()
    attempt = 0
    while True:
        try:
            with get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO PredictionHistory (news_text, prediction, confidence, created_at)
                    VALUES (?, ?, ?, ?)
                """, (news_text, prediction, float(confidence), created_at))
                conn.commit()
                record_id = cursor.lastrowid

            return {
                "id": record_id,
                "news_text": news_text,
                "prediction": prediction,
                "confidence": confidence,
                "created_at": created_at
            }
        except sqlite3.OperationalError as exc:
            if "database is locked" in str(exc).lower() and attempt < 5:
                attempt += 1
                time.sleep(0.1 * attempt)
                continue
            raise


def get_history(page: int = 1, limit: int = 10, search: str = "") -> Tuple[List[Dict[str, Any]], int]:
    offset = (page - 1) * limit
    search_pattern = f"%{search.strip()}%"
    with get_connection() as conn:
        cursor = conn.cursor()

        if search:
            cursor.execute("SELECT COUNT(*) FROM PredictionHistory WHERE news_text LIKE ? OR prediction LIKE ?", (search_pattern, search_pattern))
            total = cursor.fetchone()[0]
            cursor.execute("""
                SELECT id, news_text, prediction, confidence, created_at
                FROM PredictionHistory
                WHERE news_text LIKE ? OR prediction LIKE ?
                ORDER BY id DESC LIMIT ? OFFSET ?
            """, (search_pattern, search_pattern, limit, offset))
        else:
            cursor.execute("SELECT COUNT(*) FROM PredictionHistory")
            total = cursor.fetchone()[0]
            cursor.execute("""
                SELECT id, news_text, prediction, confidence, created_at
                FROM PredictionHistory
                ORDER BY id DESC LIMIT ? OFFSET ?
            """, (limit, offset))

        rows = cursor.fetchall()
        records = [dict(row) for row in rows]

    return records, total


def delete_prediction(record_id: int) -> bool:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM PredictionHistory WHERE id = ?", (record_id,))
        conn.commit()
        return cursor.rowcount > 0


def clear_all_history() -> int:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM PredictionHistory")
        conn.commit()
        return cursor.rowcount


def get_all_history_for_export() -> List[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, news_text, prediction, confidence, created_at FROM PredictionHistory ORDER BY id DESC")
        return [dict(row) for row in cursor.fetchall()]


def get_dashboard_analytics() -> Dict[str, Any]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM PredictionHistory")
        total = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM PredictionHistory WHERE prediction = 'Real'")
        real_count = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM PredictionHistory WHERE prediction = 'Fake'")
        fake_count = cursor.fetchone()[0]

        cursor.execute("SELECT AVG(confidence) FROM PredictionHistory")
        avg_conf = cursor.fetchone()[0] or 95.0

    return {
        "total_predictions": total,
        "real_count": real_count,
        "fake_count": fake_count,
        "avg_confidence": round(avg_conf, 2)
    }


# --- BOOKMARKS & FEEDBACK ---

def add_bookmark(user_email: str, news_text: str, prediction: str, confidence: float) -> Dict[str, Any]:
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Bookmarks (user_email, news_text, prediction, confidence, created_at)
            VALUES (?, ?, ?, ?, ?)
        """, (user_email, news_text, prediction, float(confidence), now_iso))
        conn.commit()
        bid = cursor.lastrowid
    return {"id": bid, "user_email": user_email, "prediction": prediction, "confidence": confidence}


def get_user_bookmarks(user_email: str) -> List[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Bookmarks WHERE user_email = ? ORDER BY id DESC", (user_email,))
        return [dict(r) for r in cursor.fetchall()]


# Note: Do NOT auto-initialize the DB at module import time. The application
# calls `init_db()` from the FastAPI lifespan handler in backend.main so that
# initialization and potential training runs happen during server startup
# (and not simply upon importing this module). Calling `init_db()` here
# caused IntegrityError during import when the DB already contained seeded
# rows (unique constraints). Keep initialization explicit.
