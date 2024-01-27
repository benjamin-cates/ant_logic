use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

#[derive(Debug, Deserialize, Serialize)]
pub struct UserListing {
    pub id: u64,
    pub username: String,
    pub email: String,
    pub scores: Vec<usize>,
    pub currency: usize,
    pub owned_vals: Vec<usize>,
}

impl Default for UserListing {
    fn default() -> Self {
        Self {
            id: 0,
            username: "username".to_string(),
            email: "email".to_string(),
            scores: vec![0],
            currency: 0,
            owned_vals: vec![0],
        }
    }
}

fn str_to_list(val: String) -> Result<Vec<usize>, rusqlite::Error> {
    Ok(val
        .split(",")
        .map(|str| {
            str.parse::<usize>()
                .ok()
                .ok_or(rusqlite::Error::SqliteSingleThreadedMode)
        })
        .collect::<Result<Vec<_>, _>>()?)
}

fn vec_to_str(vec: &Vec<usize>) -> String {
    let mut str = vec
        .iter()
        .fold("".to_string(), |a, b| a + b.to_string().as_str() + ",");
    str.pop();
    str
}

impl UserListing {
    pub fn select(username: &str, db: &Mutex<Connection>) -> Option<Self> {
        db.lock()
            .ok()?
            .query_row(
                "SELECT id, email, scores, currency, owned_vals FROM users WHERE username=?1",
                params![username],
                |row| {
                    Ok(Self {
                        id: row.get(0)?,
                        username: username.to_owned(),
                        email: row.get(1)?,
                        scores: str_to_list(row.get(2)?)?,
                        currency: row.get(3)?,
                        owned_vals: str_to_list(row.get(4)?)?,
                    })
                },
            )
            .ok()
    }
    pub fn push_to_db(&self, db: &Mutex<Connection>) -> Result<usize, rusqlite::Error> {
        db.lock()
            .ok()
            .ok_or(rusqlite::Error::InvalidQuery)?
            .execute(
                "INSERT INTO users (username, email, scores, currency, owned_vals) VALUES (?1,?2,?3,?4,?5)",
                params![
                    self.username,
                    self.email,
                    vec_to_str(&self.scores),
                    self.currency,
                    vec_to_str(&self.owned_vals)
                ],
            )
    }
    pub fn update_score(
        username: &str,
        puzzle_id: usize,
        score: usize,
        db: &Mutex<Connection>,
    ) -> Result<usize, rusqlite::Error> {
        let mut user = UserListing::select(username, db).ok_or(rusqlite::Error::InvalidQuery)?;
        user.remove_from_db(db)?;
        if puzzle_id >= user.scores.len() {
            user.scores.resize(puzzle_id + 1, 0);
        }
        user.scores[puzzle_id] = score;
        user.push_to_db(db)
    }

    pub fn remove_from_db(&self, db: &Mutex<Connection>) -> Result<usize, rusqlite::Error> {
        db.lock()
            .ok()
            .ok_or(rusqlite::Error::SqliteSingleThreadedMode)?
            .execute(
                "DELETE from users WHERE username = (?1)",
                params![self.username],
            )
    }
    pub fn update_ownership(
        username: &str,
        currency: usize,
        owned_vals: &Vec<usize>,
        db: &Mutex<Connection>,
    ) -> Result<usize, rusqlite::Error> {
        db.lock()
            .ok()
            .ok_or(rusqlite::Error::InvalidQuery)?
            .execute(
                "UPDATE users SET currency = ?1, owned_vals = ?2 WHERE username=?3",
                params![currency, vec_to_str(owned_vals), username,],
            )
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LeaderboardListing {
    pub username: String,
    pub puzzle_id: usize,
    pub score: usize,
}

impl LeaderboardListing {
    pub fn select(puzzle_id: usize, db: &Mutex<Connection>) -> Result<Vec<Self>, rusqlite::Error> {
        let binding = db.lock().ok().ok_or(rusqlite::Error::InvalidQuery)?;
        let mut stmt =
            binding.prepare("SELECT username, score FROM leaderboard WHERE puzzle_id = ?1")?;
        let mut rows = stmt.query(params![puzzle_id])?;
        let mut out = Vec::new();
        while let Some(row) = rows.next()? {
            out.push(Self {
                username: row.get(0)?,
                puzzle_id,
                score: row.get(1)?,
            });
        }
        Ok(out)
    }
    fn push_to_db(&self, db: &Mutex<Connection>) -> Result<usize, rusqlite::Error> {
        db.lock()
            .ok()
            .ok_or(rusqlite::Error::InvalidQuery)?
            .execute(
                "INSERT INTO leaderboard (username, puzzle_id, score) VALUES (?1,?2,?3)",
                params![self.username, self.puzzle_id, self.score],
            )
    }
    pub fn replace_score(&self, db: &Mutex<Connection>) -> Result<usize, rusqlite::Error> {
        db.lock()
            .ok()
            .ok_or(rusqlite::Error::SqliteSingleThreadedMode)?
            .execute(
                "DELETE from leaderboard WHERE username = ?1 AND puzzle_id = ?2",
                params![self.username, self.puzzle_id],
            )?;
        self.push_to_db(db)
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenListing {
    pub email: String,
    pub token: String,
}

impl TokenListing {
    pub fn select(email: String, db: &Mutex<Connection>) -> Option<Self> {
        db.lock()
            .ok()?
            .query_row(
                "SELECT token FROM tokens WHERE email=?1",
                params![email],
                |row| {
                    Ok(Self {
                        email: email.clone(),
                        token: row.get(0)?,
                    })
                },
            )
            .ok()
    }
    pub fn push_to_db(&self, db: &Mutex<Connection>) -> Result<usize, rusqlite::Error> {
        self.delete(db)?;
        db.lock()
            .ok()
            .ok_or(rusqlite::Error::InvalidQuery)?
            .execute(
                "INSERT INTO tokens (email, token) VALUES (?1,?2)",
                params![self.email, self.token],
            )
    }
    #[allow(dead_code)]
    pub fn delete(&self, db: &Mutex<Connection>) -> Result<usize, rusqlite::Error> {
        db.lock()
            .ok()
            .ok_or(rusqlite::Error::SqliteSingleThreadedMode)?
            .execute("DELETE from tokens WHERE email = ?1", params![self.email])
    }
}
const CREATE_USERS_TABLE: &str = "
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        currency INTEGER,
        scores TEXT NOT NULL,
        owned_vals TEXT NOT NULL
    );";

const CREATE_LEADERBOARD_TABLE: &str = "
    CREATE TABLE IF NOT EXISTS leaderboard (
        username TEXT NOT NULL,
        puzzle_id INTEGER,
        score INTEGER
    );";

const CREATE_TOKEN_TABLE: &str = "
    CREATE TABLE IF NOT EXISTS tokens (
        email TEXT NOT NULL UNIQUE,
        token TEXT NOT NULL UNIQUE
    );";

pub fn open_connection() -> Mutex<Connection> {
    let db = Mutex::new(Connection::open("./site.db").expect("Cannot open db"));
    db.lock().unwrap().execute(CREATE_USERS_TABLE, []).unwrap();
    db.lock()
        .unwrap()
        .execute(CREATE_LEADERBOARD_TABLE, [])
        .unwrap();
    db.lock().unwrap().execute(CREATE_TOKEN_TABLE, []).unwrap();
    return db;
}
