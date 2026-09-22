from pymilvus import MilvusClient
import psycopg2
from gitignoreddbdata import *
import math


TARGET_USER_ID = 31  # Adjusted to a user with journey data
METRIC_TYPE = "L2"  # Alter for different similarity metrics

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
def get_data_from_db(query):
    cur.execute(query)
    data = cur.fetchall()
    return data


# Retrieve Journey Data from DB
def get_journey_data():
    search_query = f"""SELECT jt."journeyid", CAST(jt."startLat" AS FLOAT), CAST(jt."startLong" AS FLOAT)
    FROM "journeyTable" jt
    INNER JOIN "employeeTable" et ON et."journeyID" = jt."journeyid"
    WHERE et."employeeID" != {TARGET_USER_ID};
    """
    r = get_data_from_db(search_query)
    # print(r)
    return r


# Set up a Milvus client
client = MilvusClient(
    uri="http://localhost:19530"
)

# Create a collection
client.create_collection(
    collection_name="journey_vectors",
    dimension=2,
    metric_type=METRIC_TYPE,
    primary_field_name="id",
)

# Get the journey data
db_query = get_journey_data()

# Determine the min and max of latitudes and longitudes
min_lat = min(journey[1] for journey in db_query)
max_lat = max(journey[1] for journey in db_query)
min_lon = min(journey[2] for journey in db_query)
max_lon = max(journey[2] for journey in db_query)

search_data = [
    {"id": journey[0], "vector": [
        (float(journey[1]) - min_lat) / (max_lat - min_lat),
        (float(journey[2]) - min_lon) / (max_lon - min_lon)
    ]}
    for journey in db_query
]

# Format the search data
# search_data = [
#     {"id": journey[0], "vector": [(float(journey[1])), float(journey[2])]}
#     for journey in db_query
# ]

# Insert data into the collection
res = client.insert(
    collection_name="journey_vectors",
    data=search_data
)
