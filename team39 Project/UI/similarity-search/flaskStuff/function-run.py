from similarity_search_function import *


# Example usage
def print_user_matches(user_matches):
    if isinstance(user_matches, str):  # Check if the return is a string (error message)
        print(user_matches)
        return

    header = (
        "First Name", "Last Name", "Phone Number", "Email", "Start Lat", "Start Long", "Similarity")
    print("{:<12} {:<15} {:<20} {:<30} {:<10} {:<10} {:<10}".format(*header))
    for user in user_matches:
        print("{:<12} {:<15} {:<20} {:<30} {:<10} {:<10} {:f}".format(*user))


if __name__ == "__main__":
    similar_user_matches = find_close_users(28, 5)
    print_user_matches(similar_user_matches)
