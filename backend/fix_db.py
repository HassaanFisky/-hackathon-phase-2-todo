
import psycopg2
import os

# The exact database URL you provided
DATABASE_URL = "postgresql://neondb_owner:npg_3lY0BMVjmixQ@ep-patient-grass-a1dpsicg-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

def fix_database():
    print("Connecting to Neon Database...")
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        # We need to drop the 'user' and 'task' tables because they have the wrong schema (columns)
        # Don't worry, this is a new project so no real data is lost.
        print("Dropping incompatible tables...")
        cur.execute("DROP TABLE IF EXISTS task;")
        cur.execute("DROP TABLE IF EXISTS \"user\";") # "user" is a reserved keyword, needs quotes
        cur.execute("DROP TABLE IF EXISTS session;")
        cur.execute("DROP TABLE IF EXISTS account;")
        cur.execute("DROP TABLE IF EXISTS verification;")
        
        conn.commit()
        print("✅ Tables dropped successfully!")
        print("Now, when you Sign Up on the website, Better-Auth will recreate them correctly.")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    fix_database()
