import psycopg2
from pymilvus import MilvusClient, DataType
# Local database user, pass, stored in separate file for the sake of security
from gitignoreddbdata import *

MILVUS_HOST = "localhost"
MILVUS_PORT = "19530"
COLLECTION_NAME = "journey_vectors"
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


# Functions
###############################################################################


# Get query result from DB
def get_data_from_db(query):
    cur.execute(query)
    data = cur.fetchall()
    return data


def get_data_from_db_with_params(query, params):
    cur.execute(query, params)
    data = cur.fetchall()
    return data


# Get the search vector based on target user id
def get_search_vector():
    r = get_data_from_db(
        f"""SELECT jt."startLat", jt."startLong"
    FROM "employeeTable" et
    INNER JOIN "journeyTable" jt ON et."journeyID" = jt."journeyid"
    WHERE et."employeeID" = {TARGET_USER_ID};
    """)
    # print(r)
    return [[r[0][0], r[0][1]]]


# Retrieve Journey Data from DB
def get_journey_data():
    search_query = f"""SELECT jt."journeyid", jt."startLat", jt."startLong"
    FROM "journeyTable" jt
    INNER JOIN "employeeTable" et ON et."journeyID" = jt."journeyid"
    WHERE et."employeeID" != {TARGET_USER_ID};
    """
    r = get_data_from_db(search_query)
    # print(r)
    return r


# Start of script
###############################################################################

# Set up a Milvus client
client = MilvusClient(
    uri="http://localhost:19530"
)

# Define parameters for a range search
search_params = {
    "metric_type": METRIC_TYPE,
    "params": {
        # "radius": 0.6,  # Radius of the search circle
        # "range_filter": 0.2  # Range filter to filter out vectors that are not within the search circle
    },
}

# Vector Search
res_search = client.search(
    collection_name="journey_vectors",  # The collection
    data=get_search_vector(),  # The vector we're querying
    limit=5,  # Max. number of search results to return
    search_params=search_params,
    # search_params={"metric_type": METRIC_TYPE, "params": {}},
    output_fields=["id"],  # Output fields to return
    # filter='smoker like "0"'    OR    filter='smoker like "_"'
)

# Store the IDs from the similar journeys
similar_journey_ids = [item['id'] for item in res_search[0]]

if similar_journey_ids:

    # Prepare the placeholders for the query based on the number of items in similar_journey_ids
    placeholders = ', '.join(['%s'] * len(similar_journey_ids))

    # Construct the query with placeholders for parameter substitution
    query = f"""SELECT et."employeeID", et."firstName", jt."address"
        FROM "employeeTable" et
        JOIN "journeyTable" jt ON et."journeyID" = jt."journeyid"
        WHERE jt."journeyid" IN ( {placeholders} );
        """

    # Execute the query with the list of IDs as parameters
    output = get_data_from_db_with_params(query, tuple(similar_journey_ids))

    # Determine the maximum width for each column
    max_user_id_width = max(len(str(user[0])) for user in output)
    max_name_width = max(len(str(user[1])) for user in output)
    max_address_width = max(len(user[2]) for user in output)

    # Get the target user data
    target_user_query = f"""SELECT et."firstName", et."employeeID", jt."address"
        FROM "employeeTable" et
        JOIN "journeyTable" jt ON et."journeyID" = jt."journeyid"
        WHERE et."employeeID" = {TARGET_USER_ID};
        """
    target_user_output = get_data_from_db(target_user_query)

    # Print the target user details
    for target_name, target_id, target_address in target_user_output:
        print(f"\n*Target User*\nUser ID: {target_id}, Name: {target_name}, Address: {target_address}\n")

    print(f"Similar Journeys to Target User: \n")

    # Create a format string with dynamic widths
    format_str = "User ID: {:{name_width}}, Name: {:{uid_width}}, Address: {:{address_width}}"

    # Print each user with the format string
    for user_id, name, address in output:
        print(format_str.format(name, user_id, address, uid_width=max_user_id_width, name_width=max_name_width,
                                address_width=max_address_width))

    # client.drop_collection(collection_name=COLLECTION_NAME)
else:
    print("No similar journeys")
