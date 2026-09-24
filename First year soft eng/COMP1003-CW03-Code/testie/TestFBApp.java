package testie;


import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Scanner;

@DisplayName("Tests for FBApp")
public class TestFBApp
{
	 /*psyds13*/
	 @Nested
	 @TestInstance(TestInstance.Lifecycle.PER_CLASS)
	 @DisplayName("3.2")
	 class ListTransactions
	 {
		 private final ByteArrayOutputStream outContent = new ByteArrayOutputStream();
		 private final PrintStream originalOut = System.out;

		 @BeforeAll
		 public void set_up_streams()
		 {
			 System.setOut(new PrintStream(outContent));
		 }

		 @AfterAll
		 public void clean_up_streams()
		 {
			 System.setOut(originalOut);
		 }

		 @BeforeEach
		 public void clear_stream() throws IOException
		 {
			 outContent.reset();
		 }
		@Test
		@DisplayName("3.2 - List Transaction")
		void list_transactions()
		{
			/*test if list is output when triggered*/
			/*set up string to compare*/
			String correct = "";

			correct += "1) Rent (Unknown) - £850.00\r\n";
			correct += "2) Phone Bill (Bills) - £37.99\r\n";
			correct += "3) Electricity Bill (Bills) - £75.00\r\n";
			correct += "4) Sainsbury's Checkout (Groceries) - £23.76\r\n";
			correct += "5) Tesco's Checkout (Groceries) - £7.24\r\n";
			correct += "6) RockCity Drinks (Social) - £8.50\r\n";
			correct += "7) The Mooch (Social) - £13.99\r\n";


			FBApp.UserTransactions = new ArrayList<FBTransaction>();
			FBApp.UserCategories = new ArrayList<FBCategory>();
			FBApp.UserCategories.add(new FBCategory("Unknown"));
			FBCategory BillsCategory = new FBCategory("Bills");
			BillsCategory.setCategoryBudget(new BigDecimal("120.00"));
			FBApp.UserCategories.add(BillsCategory);
			FBCategory Groceries = new FBCategory("Groceries");
			Groceries.setCategoryBudget(new BigDecimal("75.00"));
			FBApp.UserCategories.add(Groceries);
			FBCategory SocialSpending = new FBCategory("Social");
			SocialSpending.setCategoryBudget(new BigDecimal("100.00"));
			FBApp.UserCategories.add(SocialSpending);
			FBApp.UserTransactions.add(new FBTransaction("Rent", new BigDecimal("850.00"), 0));
			FBApp.UserTransactions.add(new FBTransaction("Phone Bill", new BigDecimal("37.99"), 1));
			FBApp.UserTransactions.add(new FBTransaction("Electricity Bill", new BigDecimal("75.00"), 1));
			FBApp.UserTransactions.add(new FBTransaction("Sainsbury's Checkout", new BigDecimal("23.76"), 2));
			FBApp.UserTransactions.add(new FBTransaction("Tesco's Checkout", new BigDecimal("7.24"), 2));
			FBApp.UserTransactions.add(new FBTransaction("RockCity Drinks", new BigDecimal("8.50"), 3));
			FBApp.UserTransactions.add(new FBTransaction("The Mooch", new BigDecimal("13.99"), 3));
			FBApp.ListTransactions();

			//comparing
			assertEquals(correct,outContent.toString());
			outContent.reset();

		}
	 }
	
	
	
	/* psymp15
	 * 3.3 - Overview method
	 */
	@Nested
	@TestInstance(TestInstance.Lifecycle.PER_CLASS)
	@DisplayName("3.3 - Category Overview")
	class TestOverview
	{
		private final ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
		private final PrintStream originalOut = System.out;

		@BeforeAll
		public void stream_setup()
		{
			/* System outs will be sent to outputStream */
            System.setOut(new PrintStream(outputStream));
		}

		@AfterAll
		public void stream_cleanup()
		{
			/* Reverts system output stream to original */
			System.setOut(originalOut);
		}
		
		
		@Test
		@DisplayName("3.3.1 - Correct Output")
		public void test()
		{
			/* Expected output */
			String expectedOutput = "1) Unknown(budget: £0.00) - £850.00 (£-850.00 overspent)\r\n" +
					"2) Bills(budget: £120.00) - £112.99 (£7.01 remaining)\r\n" +
					"3) Groceries(budget: £75.00) - £31.00 (£44.00 remaining)\r\n" +
					"4) Social(budget: £100.00) - £22.49 (£77.51 remaining)\r\n";
			
			FBApp app = new FBApp();
			app.UserCategories = new ArrayList<FBCategory>();
			app.UserTransactions = new ArrayList<FBTransaction>();
			
			
			
			/* SETUP EXAMPLE DATA */
			app.UserCategories.add(new FBCategory("Unknown"));
			FBCategory BillsCategory = new FBCategory("Bills");
			BillsCategory.setCategoryBudget(new BigDecimal("120.00"));
			app.UserCategories.add(BillsCategory);
			FBCategory Groceries = new FBCategory("Groceries");
			Groceries.setCategoryBudget(new BigDecimal("75.00"));
			app.UserCategories.add(Groceries);
			FBCategory SocialSpending = new FBCategory("Social");
			SocialSpending.setCategoryBudget(new BigDecimal("100.00"));
			app.UserCategories.add(SocialSpending);

			app.UserTransactions.add(new FBTransaction("Rent", new BigDecimal("850.00"), 0));
			app.UserTransactions.add(new FBTransaction("Phone Bill", new BigDecimal("37.99"), 1));
			app.UserTransactions.add(new FBTransaction("Electricity Bill", new BigDecimal("75.00"), 1));
			app.UserTransactions.add(new FBTransaction("Sainsbury's Checkout", new BigDecimal("23.76"), 2));
			app.UserTransactions.add(new FBTransaction("Tesco's Checkout", new BigDecimal("7.24"), 2));
			app.UserTransactions.add(new FBTransaction("RockCity Drinks", new BigDecimal("8.50"), 3));
			app.UserTransactions.add(new FBTransaction("The Mooch", new BigDecimal("13.99"), 3));
			
			for (int x = 0; x < app.UserTransactions.size(); x++)
			{
				FBTransaction temp = app.UserTransactions.get(x);
				int utCat = temp.transactionCategory();
				FBCategory temp2 = app.UserCategories.get(utCat);
				temp2.addExpense(temp.transactionValue());
				app.UserCategories.set(utCat, temp2);
			}
			
			/* Runs the function we are testing */
			app.CategoryOverview();
			
			
			/* Runs the test */
			assertEquals(expectedOutput.toString(), outputStream.toString());
		}
	}

	/* psyag11 */
	@Nested
	@TestInstance(TestInstance.Lifecycle.PER_CLASS)
	@DisplayName("3.5 - Change Transaction Category")
	class ChangeTransactionCategory
	{
		private final ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
		private final PrintStream originalOut = System.out;
		
		@BeforeAll

		public void set_up_stream() 
		{
			/* redirecting System.out to a separate print stream */
			System.setOut(new PrintStream(outputStream));
		}
		
		@BeforeEach
        public void clear_stream_initialise_arrays()
        {
			/* resetting the print stream  */
            outputStream.reset();
            
            /* setting up category and transaction list from main */
			FBApp.UserCategories = new ArrayList<FBCategory>();
			FBApp.UserTransactions = new ArrayList<FBTransaction>();
			
			FBApp.UserCategories.add(new FBCategory("Unknown"));
			FBCategory BillsCategory = new FBCategory("Bills");
			BillsCategory.setCategoryBudget(new BigDecimal("120.00"));
			FBApp.UserCategories.add(BillsCategory);
			FBCategory Groceries = new FBCategory("Groceries");
			Groceries.setCategoryBudget(new BigDecimal("75.00"));
			FBApp.UserCategories.add(Groceries);
			FBCategory SocialSpending = new FBCategory("Social");
			SocialSpending.setCategoryBudget(new BigDecimal("100.00"));
			FBApp.UserCategories.add(SocialSpending);
			
			FBApp.UserTransactions.add(new FBTransaction("Rent", new BigDecimal("850.00"), 0));
			FBApp.UserTransactions.add(new FBTransaction("Phone Bill", new BigDecimal("37.99"), 1));
			FBApp.UserTransactions.add(new FBTransaction("Electricity Bill", new BigDecimal("75.00"), 1));
			FBApp.UserTransactions.add(new FBTransaction("Sainsbury's Checkout", new BigDecimal("23.76"), 2));
			FBApp.UserTransactions.add(new FBTransaction("Tesco's Checkout", new BigDecimal("7.24"), 2));
			FBApp.UserTransactions.add(new FBTransaction("RockCity Drinks", new BigDecimal("8.50"), 3));
			FBApp.UserTransactions.add(new FBTransaction("The Mooch", new BigDecimal("13.99"), 3));
        }
		
		@AfterAll
		public void clean_up_stream() 
		{
			/* reverting System.out to console output */
			System.setOut(originalOut);
		}
		
		
		@Test
		@DisplayName("3.5.1 - Inputting a valid transaction and category ID")
		void input_valid_ids()
		{
			
			int num = 0;

			/* valid transaction id of 7 and valid category id of 2 */
			InputStream ids = new ByteArrayInputStream("\n7\n2".getBytes());
			System.setIn(ids);
			FBApp.ChangeTransactionCategory(new Scanner(System.in));
			
			/* checking that the new category has the correct number of transactions */
			for (FBTransaction temp : FBApp.UserTransactions) /* foreach loop */
			{
				num = num + (temp.transactionCategory() == 2 ? 1 : 0 ); /* if equal to 2, add 1 to num
				  														   otherwise add 0 */
			}
			
			assertEquals(num, 3);
		}
		
		
		
		@Test
		@DisplayName("3.5.2 - Inputting a valid transaction ID and an invalid category ID")
		void input_invalid_category()
		{
			int num = 0;
			
			/* valid transaction id of 7, invalid category id of 10 */
			InputStream ids = new ByteArrayInputStream("\n7\n10".getBytes());
			System.setIn(ids);
			FBApp.ChangeTransactionCategory(new Scanner(System.in));
			
			/* checking that the transaction was not moved to the new category
			 * by testing that the number of transactions in the tested category has not changed */
			for (FBTransaction temp : FBApp.UserTransactions)
			{
				num = num + (temp.transactionCategory() == 2 ? 1 : 0); 
			}

			assertEquals(num, 2);
		}
		
		
		
		@Test
		@DisplayName("3.5.3 - Inputting an invalid transaction ID")
		void input_invalid_transaction()
		{
			int num = 0;
			
			InputStream transactionID = new ByteArrayInputStream("\n10".getBytes());
			System.setIn(transactionID);
			FBApp.ChangeTransactionCategory(new Scanner(System.in));

			/* checking that the transaction was not moved to the new category
			 * by testing that the number of transactions in the tested category has not changed */
			for (FBTransaction temp : FBApp.UserTransactions)
			{
				num = num + (temp.transactionCategory() == 2 ? 1 : 0); 
			}

			assertEquals(num, 2);
		}
	}
	
	

    /* psyjb23
     * 3.6 
     * */
    @Nested
    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    @DisplayName("Tests for 3.6 - AddTransaction")
    class TestAddTransaction
    {
        private final ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        private final PrintStream originalOut = System.out;

        /**
         * Creates a ByteArrayInputStream with a string
         * @param inputString The string to be added to the stream
         * @return The stream containing the string
         */
        private InputStream create_input_stream(String inputString)
        {
            return new ByteArrayInputStream(inputString.getBytes());
        }

        @BeforeAll
        public void stream_setup()
        {
            /* System outs will be sent to outputStream */
            System.setOut(new PrintStream(outputStream));
        }

        @BeforeEach
        public void clear_stream()
        {
            /* Clear the stream after every test */
            outputStream.reset();
            FBApp.UserTransactions = new ArrayList<FBTransaction>();
            FBApp.UserCategories = new ArrayList<FBCategory>();
        }

        @AfterAll
        public void stream_cleanup()
        {
            /* Reverts system output stream to original */
            System.setOut(originalOut);
        }

        @Test
        @DisplayName("3.6.1 Test valid (no category)")
        void valid_transaction()
        {
            /* Setup */
            String title = "Test transaction title";
            String amount = "123.45";
            String expectedOutput = "What is the title of the transaction?\r\n" +
                    "What is the value of the transaction?\r\n" +
                    "Would you like to add this transaction to a category? (Y/N)\r\n" +
                    "[" + title + "] (" + amount + ") was successfully added\r\n";
            InputStream ips = create_input_stream(
                    "\n" + title + "\n" + amount + "\n\n");

            /* Run AddTransaction */
            System.setIn(ips);
            FBApp.AddTransaction(new Scanner(System.in));

            /* Check a transaction was created */
            if (FBApp.UserTransactions.isEmpty())
                fail("No transaction was created (UserTransactions was empty)");

            /* Check the transaction was created with the right values */
            FBTransaction t = FBApp.UserTransactions.get(0);
            assertEquals(t.transactionName(), title);
            assertEquals(t.transactionValue(), new BigDecimal(amount));

            /* Check the user output was as expected */
            assertEquals(expectedOutput.toString(), outputStream.toString());

        }

        @Test
        @DisplayName("3.6.2 Test valid (with category)")
        void valid_transaction_with_cat()
        {
            /* Setup */
                String title = "Test title";
            String amount = "123.45";
            InputStream ips = create_input_stream(
                    "\n" + title + "\n" + amount + "\nY\n1\n");

            /* Run AddTransaction */
            System.setIn(ips);
            FBApp.UserCategories.add(new FBCategory("Test Category"));
            FBApp.AddTransaction(new Scanner(System.in));

            /* Check a transaction was created */
            if (FBApp.UserTransactions.isEmpty())
                fail("No transaction was created (UserTransactions was empty)");

            /* Check the transaction was created with the right values */
            FBTransaction t = FBApp.UserTransactions.get(0);
            assertEquals(title, t.transactionName());
            assertEquals(new BigDecimal(amount), t.transactionValue());
            assertEquals(0, t.transactionCategory());
        }

        @Test
        @DisplayName("3.6.3 Test invalid trans. name")
        void invalid_transaction()
        {
            /* Setup */
            FBApp app = new FBApp();
            InputStream ips = create_input_stream("\n\n\n");

            /* Run AddTransaction */
            System.setIn(ips);
            app.AddTransaction(new Scanner(System.in));

            /* Check that no transaction was created */
            if (!app.UserTransactions.isEmpty())
                fail("A transaction was created (No transaction should have been created)");

        }

    }
	/*psyds13*/
	/*14/5/2023*/
	@Nested
	@TestInstance(TestInstance.Lifecycle.PER_CLASS)
	@DisplayName("3.7 - CategoryAdd")
	class AddCategory
	{
		private final ByteArrayOutputStream outContent = new ByteArrayOutputStream();
		private final PrintStream originalOut = System.out;

		@BeforeAll
		public void set_up_streams()
		{
			System.setOut(new PrintStream(outContent));
		}

		@AfterAll
		public void clean_up_streams()
		{
			System.setOut(originalOut);
		}

		@BeforeEach
		public void clear_stream() throws IOException
		{
			outContent.reset();
		}

		
		@Test
		@DisplayName("3.7.1 - Adding Category")
		void add_category() {
			
			outContent.reset();
            String title = "New Category";
            int budget = 10;
            BigDecimal newValue = new BigDecimal(budget).setScale(2, RoundingMode.CEILING);
            String expectedOutcome = ("What is the title of the category?\r\n"
            		+ "What is the budget for this category?\r\n"
            		+ "[Category added]\r\n"
            		+ "1) Unknown(£0.00) - Est. £0.00 (£0.00 remaining)\r\n"
            		+ "2) Bills(£120.00) - Est. £0.00 (£120.00 remaining)\r\n"
            		+ "3) Groceries(£75.00) - Est. £0.00 (£75.00 remaining)\r\n"
            		+ "4) Social(£100.00) - Est. £0.00 (£100.00 remaining)\r\n"
            		+ "5) "+title+"(£10.00) - Est. £0.00 (£"+newValue+" remaining)\r\n");
            InputStream sysInBackup = System.in;
            InputStream ips = new ByteArrayInputStream((" \n"+title + "\n" + String.valueOf(budget) + "\n\n").getBytes());
        	ByteArrayInputStream in = new ByteArrayInputStream((" \n"+ title + "\n" + String.valueOf(budget) + "\n\n").getBytes());
        	FBApp.AddCategory(new Scanner(ips));
        	System.setIn(in);

            
            FBApp.UserCategories = new ArrayList<FBCategory>();
            FBApp.UserCategories.add(new FBCategory(title));
            
            
            if (FBApp.UserCategories.isEmpty())
                fail("No Category was created (UserCategories was empty)");

            
            FBCategory category = FBApp.UserCategories.get(0);
            assertEquals(title,category.CategoryName());
            assertEquals(0,category.CategorySpend().compareTo(new BigDecimal(0.00)));
            assertEquals(expectedOutcome,outContent.toString());
        }

			
		
		@Test
		@DisplayName("3.7.2 - Adding invalid Category")
		void invalid_category() {
			
			
			/*test if invalid category throws error*/
			String title = "New Category that is invalid";
            int budget = 0;
            String expectedOutcome = "What is the title of the category?\r\nWhat is the budget for this category?\r\n[Category added]\r\n1) Bills(£0.00) - Est. £0.00 (£0.00 remaining)\r\n2) New Category9(£0.00) - Est. £0.00 (£0.00 remaining)\r\n";
            InputStream input = new ByteArrayInputStream(("\n"+ title + "\n" + budget + "\n\n").getBytes());
            FBApp.AddCategory(new Scanner(input));      
            
            
            FBApp.UserCategories = new ArrayList<FBCategory>();
            FBApp.UserCategories.add(new FBCategory(title));
            
            if (FBApp.UserCategories.isEmpty())
                fail("No Category was created (UserCategory was empty)");

            
            FBCategory category = FBApp.UserCategories.get(0);
            if (category.CategoryName().length() > 15)
            	fail("Didnt correct the name to a shorter name");
            
            assertEquals("New Category10",category.CategoryName());
            assertEquals((expectedOutcome),outContent.toString());
            
		}
		
		@Test
		@DisplayName("3.7.2 - Adding Already there Category")
		void already_used_category() {
			
			
			/*test if duplicate category throws error*/
			String title = "Bills";
            int budget = 0;
            String expectedOutcome = "What is the title of the category?\r\nWhat is the budget for this category?\r\n[Category name already in use]";
            InputStream input = new ByteArrayInputStream(("\n"+ title + "\n" + budget + "\n\n").getBytes());
            FBApp.AddCategory(new Scanner(input));      
            
            
            FBApp.UserCategories = new ArrayList<FBCategory>();
            FBApp.UserCategories.add(new FBCategory(title));
            
            try
            {
            	if(FBApp.UserCategories.isEmpty())
            	{
            		assertEquals((expectedOutcome),outContent.toString());
            	}
            }
			catch(Exception e )
            {
            	fail("duplicate Category was created");
            }
            
            
		}
		
	}

}
