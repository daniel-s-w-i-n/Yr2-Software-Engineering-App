from pymilvus import Milvus, DataType

MILVUS_HOST = "localhost"
MILVUS_PORT = "19530"

def drop_all_milvus_collections():
    # Initialize the Milvus client
    client = Milvus(uri=f"tcp://{MILVUS_HOST}:{MILVUS_PORT}")

    # List all collections
    collections = client.list_collections()

    if collections:
        print("Dropping the following collections in Milvus:")
        for collection in collections:
            print(f"Dropping collection: {collection}")
            # Drop the collection
            client.drop_collection(collection)
        print("All collections have been dropped.")
    else:
        print("No collections found in Milvus to drop.")

if __name__ == "__main__":
    drop_all_milvus_collections()
