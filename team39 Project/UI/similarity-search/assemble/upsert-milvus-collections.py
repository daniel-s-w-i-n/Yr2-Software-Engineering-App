from pymilvus import MilvusClient
import psycopg2
from gitignoreddbdata import *

# Connect to your PostgreSQL database
conn = psycopg2.connect(
    database=db_name,
    user=db_user,
    password=db_pass,
    host=db_host,
    port=db_port,
)
cur = conn.cursor()
print("Successfully connected to the PostgreSQL database")


# Get query result from DB
def get_data_from_db_with_params(query, params):
    cur.execute(query, params)
    data = cur.fetchall()
    return data


# Retrieve New User Journey Data from DB
def get_journey_data(employee_id):
    search_query = f"""SELECT jt."journeyid", CAST(jt."startLat" AS FLOAT), CAST(jt."startLong" AS FLOAT)
    FROM "journeyTable" jt
    INNER JOIN "employeeTable" et ON et."journeyID" = jt."journeyid"
    WHERE et."journeyID" = %s
    """
    r = get_data_from_db_with_params(search_query, employee_id)
    return r


def upsert_milvus_collection(employee_id):
    # Set up a Milvus client
    client = MilvusClient(
        uri="http://localhost:19530"
    )

    # Get the journey data
    db_query = get_journey_data(employee_id)

    upsert_search_data = [
        {"id": journey[0], "vector": [
            round(float(journey[1]), 3),
            round(float(journey[2]), 3)
        ]}
        for journey in db_query
    ]

    # Insert data into the collection
    res = client.upsert(
        collection_name="journey_vectors",
        data=upsert_search_data
    )


if __name__ == "__main__":
    new_user_id = input("Enter new user id: ")
    upsert_milvus_collection(new_user_id)
