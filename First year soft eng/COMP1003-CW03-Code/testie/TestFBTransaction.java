package testie;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.util.Date;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

@DisplayName("Tests for FBTransaction")
class TestFBTransaction
{
	/* psymp15 */
	@Nested
	@DisplayName("1.1 - Default Constructor")
	class DefaultConstructor
	{
		@Test
		@DisplayName("1.1.1 - Attributes of default contructors")
		void defaultAttributes()
		{
			FBTransaction transaction = new FBTransaction();
			assertEquals("[Pending transaction]", transaction.transactionName());
			assertEquals(null, transaction.transactionValue());
			assertEquals(0, transaction.transactionCategory());
			assertEquals(null, transaction.transactionTime());
		}
	}
	
	/* psyrb8 */
	@Nested
	@DisplayName("1.2 - Main constructor")
	class MainConstructor
	{
		@Test
		@DisplayName("1.2.1 - valid transaction creation")
		void create_transaction()
		{
			String name = "name";
			BigDecimal value = new BigDecimal("10.00");
			int category = 2;
			FBTransaction transaction = new FBTransaction(name, value, category);
			assertEquals(transaction.transactionName(), name);
			assertEquals(transaction.transactionCategory(), category);
			assertEquals(transaction.transactionValue(), value);
		}
		
		@Test
		@DisplayName("1.2.2 - Invalid name")
		void invalid_name()
		{
			String name = "12345678901234567890123456";
			BigDecimal value = new BigDecimal("10.00");
			int category = 2;
			FBTransaction transaction = new FBTransaction(name, value, category);
			assertFalse(transaction.transactionName() == name);
		}
		
		@Test
		@DisplayName("1.2.3 - Invalid value")
		void invalid_value()
		{
			String name = "test";
			BigDecimal value = new BigDecimal("0.00");
			int category = 2;
			FBTransaction transaction = new FBTransaction(name, value, category);
			assertFalse(transaction.transactionValue() == value);
		}
	}
	
	/* psyag11 */
	@Nested
	@DisplayName("1.3 - Get method for Transaction Name")
	class TestGetMethodForTransactionName
	{
		@Test
		@DisplayName("1.3.1 - Testing getter method for string return type")
		void get_transaction_name()
		{
			FBTransaction transaction = new FBTransaction();
			
			if(transaction.transactionName() instanceof String)
			{
				return;
			}
			else
			{
				fail("Returned name is not a string");
			}
		}
	}

	/* psyjb23 */
	@Nested
	@DisplayName("1.4 - Test transaction value")
	class TestTransactionValue
	{
		@Test
		@DisplayName("1.4.1 - Test returns correct transaction value")
		void test_transaction_value()
		{

			BigDecimal targetValue = new BigDecimal(99.99);
			FBTransaction tr = new FBTransaction("Test Transaction", targetValue, 0);

			assertEquals(targetValue, tr.transactionValue());
		}

	}

	
	/*psyds13*/
	@Test
	@DisplayName("1.5 - Get method for Transaction Category")
	void categoryReturn() {                                             
		//test if category returns a category
		FBTransaction transactionclass = new FBTransaction();
		int answer = transactionclass.transactionCategory();
		try 
		{
			answer =(int)answer;
		}
		catch(Exception e)
		{
			fail("Category not an integer");
		}
		
	}
	
	/* psymp15 */
	@Nested
	@DisplayName("1.6 - Get	method	for	Transaction	Time")
	class GetTransactionTime
	{
		@Test
		@DisplayName("1.6.1 - Get attribute transaction time when null")
		void transactionTimeWhenNull()
		{
			FBTransaction transaction = new FBTransaction();
			assertEquals(null, transaction.transactionTime());
		}
		
		
		@Test
		@DisplayName("1.6.2 - Get attribute transaction time")
		void transactionTimeWithDate()
		{
			FBTransaction transaction = new FBTransaction("Mcdonalds", new BigDecimal("10.48"), 1);
			assertEquals(new Date(), transaction.transactionTime());
		}
	}
	
	/* psyrb8 */
	@Nested
	@DisplayName("1.7 - Set method for Transaction Name")
	class SetMethodForTransactionName
	{
		@Test
		@DisplayName("1.7.1 - Set Transaction name")
		void set_valid_name()
		{
			String name = "Test";
			FBTransaction transaction = new FBTransaction();
			transaction.setTransactionName(name);
			assertEquals(transaction.transactionName(), name);
		}
		
		@Test
		@DisplayName("1.7.2 - Set Long Name")
		void set_long_name()
		{
			String name = "12345678901234567890123456";
			String correctName = "1234567890123456789012345";
			FBTransaction transaction = new FBTransaction();
			transaction.setTransactionName(name);
			assertEquals(transaction.transactionName(), correctName);
		}
		
		@Test
		@DisplayName("1.7.3 - Set Edge Name")
		void set_edge_name()
		{
			String name = "1234567890123456789012345";
			FBTransaction transaction = new FBTransaction();
			transaction.setTransactionName(name);
			assertEquals(transaction.transactionName(), name);
		}
		
		@Test
		@DisplayName("1.7.4 - Multiple Name changes")
		void change_name_again()
		{
			String first = "name1";
			String second = "name2";
			FBTransaction transaction = new FBTransaction();
			transaction.setTransactionName(first);
			transaction.setTransactionName(second);
			assertFalse(transaction.transactionName().equals(second));
		}
	}
	
	/* psyag11 */
	@Nested
	@DisplayName("1.8 - Set method for Transaction Value")
	class SetMethodForTransactionValue
	{
		
		@Test
		@DisplayName("1.8.1 - Setting a valid transaction value")
		void set_transaction_value()
		{
			FBTransaction transaction = new FBTransaction();
			BigDecimal testTransactionValue = new BigDecimal("3.00");
			
			transaction.setTransactionValue(testTransactionValue);
			assertEquals(testTransactionValue, transaction.transactionValue());
		}
		
		@Test
		@DisplayName("1.8.2 - Setting a transaction value multiple times")
		void set_transaction_multiple()
		{
			FBTransaction transaction = new FBTransaction();
			BigDecimal testTransactionValue = new BigDecimal("3.00");
			BigDecimal testTransactionValue2 = new BigDecimal("4.00");
			
			transaction.setTransactionValue(testTransactionValue);
			transaction.setTransactionValue(testTransactionValue2);
			
			if (transaction.transactionValue() != testTransactionValue)
			{
				fail("The transaction value was set multiple times");
			}
		}
		
		@Test
		@DisplayName("1.8.3 - Setting a negative transaction value")
		void set_transaction_negative()
		{
			FBTransaction transaction = new FBTransaction();
			BigDecimal testTransactionValue = new BigDecimal("-3.00");
			
			transaction.setTransactionValue(testTransactionValue);
			
			if (transaction.transactionValue() != null)
			{
				fail("Successfully set a negative transaction value");
			}
		}
		
		@Test
		@DisplayName("1.8.4 - Testing a small, valid transaction value")
		void set_transaction_small()
		{
			FBTransaction transaction = new FBTransaction();
			BigDecimal testTransactionValue = new BigDecimal("0.01");
			
			transaction.setTransactionValue(testTransactionValue);
			assertEquals(testTransactionValue, transaction.transactionValue());
		}
	}

	/* psyjb23 */
	@Nested
	@DisplayName("1.9 - setTransactionCategory")
	class TestSetTransCategory
	{
		@Test
		@DisplayName("1.9.1 - Test valid category value")
		void test_valid_category()
		{
			int testValue = 3;

			FBTransaction transaction = new FBTransaction();
			transaction.setTransactionCategory(testValue);

			assertEquals(testValue, transaction.transactionCategory());
		}

		@Test
		@DisplayName("1.9.2 - Test negative category value")
		void test_negative_category()
		{
			int testValue = -3;
			int originalCategory;

			FBTransaction transaction = new FBTransaction();
			originalCategory = transaction.transactionCategory();
			transaction.setTransactionCategory(testValue);

			assertEquals(originalCategory, transaction.transactionCategory());
		}
	}
	
	/*psyds13*/
	@Nested
	@DisplayName("1.10 - isComplete method")
	class isCompleteReturn {   
		
		FBTransaction transactionClass = new FBTransaction();
		@Test
		@DisplayName("1.10.1 - no variables set")
		void nonSet() {
			
		//if name and value are not empty return 'non can be set'
			if(transactionClass.isComplete() ==("Both can be set"))
			{}
			else
				{
				fail("Did not return both can be set");
				}
		}
		
		
		@Test
		@DisplayName("1.10.2 - value variable set")
		void valueSet() {
		//if name and value are empty return 'one can be set'
			transactionClass.setTransactionValue(new BigDecimal(1.00));
			if(transactionClass.isComplete() ==("Only name can be set"))
			{}
			else
			{
				fail("Did not return one empty");
			}
		}
		
		@Test
		@DisplayName("1.10.3 - name variable set")
		void NameSet() {
		//if name is set and value is empty return 'one can be set'
			transactionClass = new FBTransaction();
			transactionClass.setTransactionName("shopping");
			if(transactionClass.isComplete() ==("Only value can be set"))
			{}
			else
			{
				fail("Did not return value can be set");
			}
		}
		
		@Test
		@DisplayName("1.10.4 - both variables set")
		void bothSet() {
			transactionClass = new FBTransaction();
			transactionClass.setTransactionName("shopping");
			transactionClass.setTransactionValue(new BigDecimal(1.00));
			if(transactionClass.isComplete() ==("Both are set"))
			{}
			else
			{
				fail("Did not return Both are set");
			}
		}
		
	}

	/* psymp15 */
	@Nested
	@DisplayName("1.11 - ToString Override")
	class ToStringOverride
	{
		private static String name;
		private static BigDecimal price;
		private static int category;
		private static Date date;
		
		
		@BeforeAll
		static void setUp()
		{
			name = "McDonalds";
			price = new BigDecimal("10.48");
			category = 1;
			date = new Date();
		}
		
		
		@Test
		@DisplayName("1.11.1 - All 3 Attributes")
		void allAtributes()
		{
			FBTransaction transaction = new FBTransaction(name, price, category);
			transaction.setTransactionTime(date);
			assertEquals(name + " - " + date.toString() + " - £" + price.toString(), transaction.toString());
		}

		
		@Test
		@DisplayName("1.11.2 - Name Only")
		void nameOnly()
		{
			FBTransaction transaction = new FBTransaction();
			transaction.setTransactionName(name);
			assertEquals(name + " - No Date - No Price", transaction.toString());
		}
		
		
		@Test
		@DisplayName("1.11.3 - Name and Date")
		void nameAndDate()
		{
			FBTransaction transaction = new FBTransaction();
			transaction.setTransactionName(name);
			transaction.setTransactionTime(date);
			assertEquals(name + " - " + date.toString() + " - No Price", transaction.toString());
		}
		
		
		@Test
		@DisplayName("1.11.4 - Name and Price")
		void nameAndPrice()
		{
			FBTransaction transaction = new FBTransaction();
			transaction.setTransactionName(name);
			transaction.setTransactionValue(price);
			assertEquals(name + " - No Date - £" + price.toString(), transaction.toString());
		}
	}
}
