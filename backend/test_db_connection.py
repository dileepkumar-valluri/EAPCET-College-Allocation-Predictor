
from backend.config import get_db_connection

connection = None

try:
    connection = get_db_connection()

    with connection.cursor() as cursor:
        cursor.execute("SELECT DATABASE() AS database_name")
        result = cursor.fetchone()

    print("MySQL connection successful!")
    print("Connected database:", result["database_name"])

except Exception as error:
    print("MySQL connection failed.")
    print("Error:", error)

finally:
    if connection:
        connection.close()
