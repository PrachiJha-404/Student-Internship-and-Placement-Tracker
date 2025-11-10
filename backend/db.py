import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "Krishu@2008",
        database = "dbms_project"
    )

def query_db(query, args=(), fetchone = False):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    #normally cursor fetches list of tupes, not a dict
    cursor.execute(query, args)
    result = cursor.fetchone() if fetchone else cursor.fetchall()
    cursor.close()
    conn.close()
    return result

def execute_db(query, args=()):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(query, args)
    conn.commit()
    cursor.close()
    conn.close()
