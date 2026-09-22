import psycopg2
import numpy as np
from dbdata import *

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

def get_data_from_db_with_params(query, params):
    with psycopg2.connect(database=db_name, user=db_user, password=db_pass, host=db_host, port=db_port) as conn:
        with conn.cursor() as cur:
            cur.execute(query, params)
            return cur.fetchall()

def find_close_users(target_user_id, limit=5):
    vector_query = """
        SELECT ROUND(jt."startLat", 3) AS "startLat", ROUND(jt."startLong", 3) AS "startLong", et."journeyID"
        FROM "employeeTable" et
        INNER JOIN "journeyTable" jt ON et."journeyID" = jt."journeyid"
        WHERE et."employeeID" = %s;
    """
    target_vector = get_data_from_db_with_params(vector_query, (target_user_id,))
    if not target_vector or any(x is None for x in target_vector[0]):
        return "No journey vector found for the specified user."

    target_lat, target_long, target_jid = (float(x) if x is not None else None for x in target_vector[0])

    if target_lat is None or target_long is None:
        return "Invalid latitude or longitude values."

    all_vectors_query = """
        SELECT ROUND("startLat", 3), ROUND("startLong", 3), "journeyid"
        FROM "journeyTable"
        WHERE "journeyid" != %s;
    """
    all_vectors = get_data_from_db_with_params(all_vectors_query, (target_jid,))
    distances = []
    for vec in all_vectors:
        lat, long, jid = (float(x) if x is not None else None for x in vec)
        if lat is not None and long is not None:
            distance = np.linalg.norm(np.array([target_lat, target_long]) - np.array([lat, long]))
            distances.append((distance, jid))

    distances.sort()
    closest_journeys = distances[:limit]
    journey_ids = [jid for _, jid in closest_journeys]

    placeholders = ', '.join(['%s'] * len(journey_ids))
    user_query = """
        SELECT et."firstName", et."lastName", et."phoneNumber", et.email,
               jt."startLat", jt."startLong"
        FROM "employeeTable" et
        JOIN "journeyTable" jt ON et."journeyID" = jt."journeyid"
        WHERE jt."journeyid" IN (%s);
    """ % placeholders
    user_details = get_data_from_db_with_params(user_query, tuple(journey_ids))

    formatted_output = [
        details + (dist,) for details, dist in zip(user_details, closest_journeys)
    ]

    return sorted(formatted_output, key=lambda x: x[-1])
