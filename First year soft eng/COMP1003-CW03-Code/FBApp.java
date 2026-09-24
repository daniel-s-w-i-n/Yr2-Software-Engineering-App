import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Scanner;

public class FBApp {

	public static ArrayList<FBTransaction> UserTransactions;
	public static ArrayList<FBCategory> UserCategories;


	public static void main(String[] args) {
		UserCategories = new ArrayList<FBCategory>();
		UserTransactions = new ArrayList<FBTransaction>();



		// SETUP EXAMPLE DATA //
		UserCategories.add(new FBCategory("Unknown"));
		FBCategory BillsCategory = new FBCategory("Bills");
		BillsCategory.setCategoryBudget(new BigDecimal("120.00"));
		UserCategories.add(BillsCategory);
		FBCategory Groceries = new FBCategory("Groceries");
		Groceries.setCategoryBudget(new BigDecimal("75.00"));
		UserCategories.add(Groceries);
		FBCategory SocialSpending = new FBCategory("Social");
		SocialSpending.setCategoryBudget(new BigDecimal("100.00"));
		UserCategories.add(SocialSpending);

		UserTransactions.add(new FBTransaction("Rent",new BigDecimal("850.00"),0));
		UserTransactions.add(new FBTransaction("Phone Bill", new BigDecimal("37.99"),1));
		UserTransactions.add(new FBTransaction("Electricity Bill", new BigDecimal("75.00"),1));
		UserTransactions.add(new FBTransaction("Sainsbury's Checkout", new BigDecimal("23.76"),2));
		UserTransactions.add(new FBTransaction("Tesco's Checkout", new BigDecimal("7.24"),2));
		UserTransactions.add(new FBTransaction("RockCity Drinks", new BigDecimal("8.50"),3));
		UserTransactions.add(new FBTransaction("The Mooch", new BigDecimal("13.99"),3));

		for (int x = 0; x<UserTransactions.size(); x++) {
			FBTransaction temp = UserTransactions.get(x);
			int utCat = temp.transactionCategory();
			FBCategory temp2 = UserCategories.get(utCat);
			temp2.addExpense(temp.transactionValue());
			UserCategories.set(utCat, temp2);
		}






		//MAIN FUNCTION LOOP

		CategoryOverview();
		System.out.println("\nWhat do you want to do?\n T = List All [T]ransactions, [num] = Show Category [num], A = [A]dd Transaction, X = E[x]it");
		Scanner in = new Scanner(System.in);
		while(in.hasNextLine()) {
			String s = in.next();
			try {
				if (s.equals("T")) {
					ListTransactions();
				} else if (s.equals("O")) {
					CategoryOverview();
				} else if (s.equals("C")) {
					ChangeTransactionCategory(in);
				} else if (s.equals("N")) {
					AddCategory(in);
				} else if (s.equals("A")) {
					AddTransaction(in);
				} else if (s.equals("X")) {
					System.out.println("Goodbye!");
                    break;
                } else if (Integer.parseInt(s) != -1 ) {
                    ListTransactionsForCategory((int)Integer.parseInt(s));
                }

				else {
					System.out.println("Command not recognised");
				}
			} catch (Exception e) {
				System.out.println("Something went wrong: "+e.toString() + "\n");
			}

			System.out.println("\nWhat do you want to do?\n O = [O]verview, T = List All [T]ransactions, [num] = Show Category [num], C = [C]hange Transaction Category, A = [A]dd Transaction, N = [N]ew Category, X = E[x]it");
		}
		in.close();


	}

	public static void ListTransactions() {
		for (int x=0; x<UserTransactions.size(); x++) {
			FBTransaction temp = UserTransactions.get(x);
			System.out.println((x+1)+") "+temp.toString());
		}
	}

	public static void CategoryOverview() {
		for (int x = 0; x<UserCategories.size(); x++) {
			FBCategory temp = UserCategories.get(x);
			System.out.println((x+1)+") "+temp.toString());
		}

	}

	public static void ListTransactionsForCategory(int chosenCategory) {
		for (int x=0; x<UserTransactions.size(); x++) {
			FBTransaction temp = UserTransactions.get(x);
			if (temp.transactionCategory() == chosenCategory) {
				System.out.println((x+1)+") "+temp.toString());
			}
		}
	}

    private static void AddTransaction(Scanner in) {
        System.out.println("What is the title of the transaction?");
        in.nextLine(); // to remove read-in bug
        String title = in.nextLine();
        System.out.println("What is the value of the transaction?");
        BigDecimal tvalue = new BigDecimal(in.nextLine());
        UserTransactions.add(new FBTransaction(title,tvalue,0));
        System.out.println("[Transaction added]");
    }

    private static void ChangeTransactionCategory(Scanner in) {
    	System.out.println("Which transaction ID?");
    	in.nextLine();
    	int tID = Integer.parseInt(in.nextLine());
    	System.out.println("\t- "+UserTransactions.get(tID-1).toString());
    	System.out.println("Which category will it move to?");
    	CategoryOverview();
    	int newCat = Integer.parseInt(in.nextLine());
    	FBTransaction temp = UserTransactions.get(tID);
    	temp.setTransactionCategory(newCat);
    	UserTransactions.set(tID, temp);
    	FBCategory temp2 = UserCategories.get(newCat);
    	temp2.addExpense(temp.transactionValue());
    	UserCategories.set(newCat, temp2);
    }


    private static void AddCategory(Scanner in) {
        System.out.println("What is the title of the category?");
        in.nextLine(); // to remove read-in bug
        String title = in.nextLine();
        System.out.println("What is the budget for this category?");
        BigDecimal cbudget = new BigDecimal(in.nextLine());
        FBCategory temp = new FBCategory(title);
        temp.setCategoryBudget(cbudget);
        UserCategories.add(temp);
        System.out.println("[Category added]");
        CategoryOverview();
    }


}
