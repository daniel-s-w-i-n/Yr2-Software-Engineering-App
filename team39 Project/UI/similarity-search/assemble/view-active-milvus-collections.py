from pymilvus import Milvus, DataType

MILVUS_HOST = "localhost"
MILVUS_PORT = "19530"


def list_milvus_collections():
    # Initialize the Milvus client
    client = Milvus(uri=f"tcp://{MILVUS_HOST}:{MILVUS_PORT}")

    # List all collections
    collections = client.list_collections()

    if collections:
        print("Available collections in Milvus:")
        for collection in collections:
            print(collection)
    else:
        print("No collections found in Milvus.")


if __name__ == "__main__":
    list_milvus_collections()
