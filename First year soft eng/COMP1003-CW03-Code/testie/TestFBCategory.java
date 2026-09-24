package testie;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;


@DisplayName("Tests for FBCategory")
public class TestFBCategory 

{
	/* psyrb8 */
	@Nested
	@DisplayName("2.1 - Default Constructor")
	class DefaultConstructor
	{
		@Test
		@DisplayName("2.1.1 - Testing for correct category Budget with default constructor")
		void default_budget()
		{
			FBCategory category = new FBCategory();
			assertEquals(category.CategoryBudget(), new BigDecimal("0.00"));
		}
		
		@Test
		@DisplayName("2.1.2 - Testing for correct category Spend with default constructor")
		void default_spend()
		{
			FBCategory category = new FBCategory();
			assertEquals(category.CategoryBudget(), new BigDecimal("0.00"));
		}
		
		@Test
		@DisplayName("2.1.3 - Testing for uniqueness of new Category Name")
		void default_unique_name()
		{
			FBCategory categoryOne = new FBCategory();
			FBCategory categoryTwo = new FBCategory();
			
			assertFalse(categoryOne.CategoryName() == categoryTwo.CategoryName());
		}
	}
	
	/* psyag11 */
	@Nested
	@DisplayName("2.2 - Main Constructor")
	class MainConstructor
	{
		@Test
		@DisplayName("2.2.1 - Passing a valid category title")
		void pass_valid_title()
		{
			String title = "Business";
			FBCategory category = new FBCategory(title);
			
			assertEquals(title, category.CategoryName());
		}
		
		@Test
		@DisplayName("2.2.2 - Passing a category title of more than 15 characters")
		void pass_long_title()
		{
			String title = "Hippopotomonstrosesquippedaliophobia";
			FBCategory category = new FBCategory(title);
			
			if (category.CategoryName() == title)
			{
				fail("Successfully set a title above 15 characters");
			}
		}
	}

	@Nested
	@DisplayName("2.3 - Get Category Name")
	class GetCategoryName
	{
		@Test
		@DisplayName("2.3.1 - Test returns name")
		void test_returns_correctly()
		{
			String title = "test title";
			FBCategory category = new FBCategory(title);

			assertEquals(title, category.CategoryName());
		}
	}
	
	/* psyrb8 */
	@Nested
	@DisplayName("2.6 - Set Category Name")
	class SetCategoryName
	{
		@Test
		@DisplayName("2.6.1 - Valid Name Change")
		void change_category_name()
		{
			FBCategory category = new FBCategory();
			String oldName = category.CategoryName();
			category.setCategoryName("psyrb8");
			assertFalse(oldName == category.CategoryName());
		}
		
		@Test
		@DisplayName("2.6.2 - Long Name change")
		void long_category_name()
		{
			FBCategory category = new FBCategory();
			String longName = "1234567890123456";
			category.setCategoryName(longName);
			assertFalse(category.CategoryName() == longName);
		}
		
	    /*  Test in 2.6.3 are not performed using JUnit
	    * -> See test report
	    * */
		
		@Test
		@DisplayName("2.6.4 - unknown category name")
		void unknown_category_name()
		{
			FBCategory category = new FBCategory();
			String unknown = "Unknown";
			category.setCategoryName(unknown);
			assertFalse(category.CategoryName() == unknown);
		}
	}
	
	/* psyag11 */
	@Nested
	@DisplayName("2.7 - Set Category Budget")
	class SetCategoryBudget
	{
		@Test
		@DisplayName("2.7.1 - Setting a valid category budget")
		void set_budget_valid()
		{
			FBCategory category = new FBCategory();
			BigDecimal budget = new BigDecimal("15.00");
			
			category.setCategoryBudget(budget);
			assertEquals(budget, category.CategoryBudget());
		}
		
		@Test
		@DisplayName("2.7.2 - Setting a negative category budget")
		void set_budget_negative()
		{
			FBCategory category = new FBCategory();
			BigDecimal budget = new BigDecimal("-15.00");
			BigDecimal defaultValue = category.CategoryBudget(); /* value of CategoryBudget before it is set */
			
			category.setCategoryBudget(budget);
			assertEquals(defaultValue, category.CategoryBudget());
		}
		
		@Test
		@DisplayName("2.7.3 - Setting a small category budget")
		void set_budget_invalid()
		{
			FBCategory category = new FBCategory();
			BigDecimal budget = new BigDecimal("0.01");
			
			category.setCategoryBudget(budget);
			assertEquals(budget, category.CategoryBudget());
		}
		
		@Test
		@DisplayName("2.7.4 - Setting a budget with more than 2 decimal places")
		void set_budget_invalid_format()
		{
			FBCategory category = new FBCategory();
			BigDecimal budget = new BigDecimal("15.434");
			String decimalPlaces;
			
			category.setCategoryBudget(budget);
			
			/* Turning the budget set into a string of only the decimal places */
			decimalPlaces = category.CategoryBudget().toPlainString();
			decimalPlaces = decimalPlaces.substring(decimalPlaces.indexOf(".") + 1);
			
			assertEquals(decimalPlaces.length(), 2);
		}
	}

	@Nested
	@DisplayName("2.8 - Add Expense")
	class TestAddExpense
	{
		@Test
		@DisplayName("2.8.1 - Test valid expense amount")
		void test_valid_amount()
		{
			BigDecimal startingValue;
			BigDecimal expense = new BigDecimal("99.99");
			FBCategory category = new FBCategory();

			startingValue = category.CategorySpend();
			category.addExpense(expense);

			assertEquals(startingValue.add(expense), category.CategorySpend());
		}

		@Test
		@DisplayName("2.8.2 - Test negative expense amount")
		void test_negative_amount()
		{
			BigDecimal startingValue;
			BigDecimal expense = new BigDecimal("-99.99");
			FBCategory category = new FBCategory();

			startingValue = category.CategorySpend();
			category.addExpense(expense);

			assertEquals(startingValue, category.CategorySpend());
		}

		@Test
		@DisplayName("2.8.3 - Test expense amounts with precision more than 1p")
		void test_too_precise_amount()
		{
			BigDecimal startingValue;
			BigDecimal expense = new BigDecimal("0.001");
			FBCategory category = new FBCategory();

			startingValue = category.CategorySpend();
			category.addExpense(expense);

			/* Value should not change, amounts less than 1p to be ignored */
			assertEquals(startingValue, category.CategorySpend());
		}
	}
	
	/* psyrb8 */
	@Nested
	@DisplayName("2.11 - Calculate remaining budget function")
	class GetRemainingBudget
	{
		@Test
		@DisplayName("2.11.1")
		void return_valid_amount() 
		{
			FBCategory category = new FBCategory();
			assertEquals(category.getRemainingBudget(), new BigDecimal("0.00"));
			
			category.setCategoryBudget(new BigDecimal("2.00"));
			assertEquals(category.getRemainingBudget(), new BigDecimal("2.00"));
			
			category.addExpense(new BigDecimal("4.00"));
			assertEquals(category.getRemainingBudget(), new BigDecimal("-2.00"));
		}
		
		@Test
		@DisplayName("2.11.2")
		void return_valid_value()
		{
			FBCategory category = new FBCategory();
			assertEquals(category.getRemainingBudget().getClass(),  new BigDecimal("0.00").getClass());
		}
		
	}
	
	/* psyag11 */
	@Nested
	@DisplayName("2.12 - toString() Override")
	class toStringOverride
	{
		@Test
		@DisplayName("2.12.1 - Testing for correct return format")
		void return_valid_format()
		{
			FBCategory category = new FBCategory();
			String expectedReturn = category.CategoryName() + 
					"(budget: £" + category.CategoryBudget().toPlainString() + ") - £" 
					+ category.CategorySpend().toPlainString() 
					+ " (£" + category.getRemainingBudget().toPlainString() + " remaining)";
			
			String expectedReturnOverspent = category.CategoryName() + 
					"(budget: £" + category.CategoryBudget().toPlainString() + ") - £" 
					+ category.CategorySpend().toPlainString() 
					+ " (£" + category.getRemainingBudget().toPlainString() + " overspent)";
			
			/* in the case that the budget was overspent */
			if(category.CategoryBudget().compareTo(category.CategorySpend()) == 1)
			{
				assertEquals(expectedReturnOverspent, category.toString());
			}
			else
			{
				assertEquals(expectedReturn, category.toString());
			}
		}
	}
	
	
	/*psyds13*/
	@DisplayName("2.4 - Get Category Budget")
	@Nested
	class GetCategoryBudgetReturn {                                     
		
		FBCategory category = new FBCategory();
		@Test
		@DisplayName("2.4.1 - both variables set")
		void noValue() {
			try
			{
				BigDecimal value = category.CategoryBudget();
			}
			catch(Exception e)
			{
				fail("returned value not a bigDecimal");
			}
		}
		
		@Test
		@DisplayName("2.4.2 - big decimal set")
		void valueSet() {
			category.setCategoryBudget(new BigDecimal(8.00));
			try
			{
				BigDecimal value = category.CategoryBudget();
			}
			catch(Exception e)
			{
				fail("returned value not a bigDecimal");
			}
		
		}
	}
	
	
	
	
	
	/* psymp15 */
	@Nested
	@DisplayName("2.5 - Get Category Spend")
	class GetCategorySpend
	{
		
		
		@Test
		@DisplayName("2.5.1 - Null Value")
		void nullValue()
		{
			FBCategory category = new FBCategory();
			assertEquals(new BigDecimal("0.00"), category.CategorySpend());
		}
		
		@Test
		@DisplayName("2.5.2 - BigDecimal")
		void bigDecimal()
		{
			FBCategory category = new FBCategory();
			category.addExpense(new BigDecimal("10.48"));
			
			assertEquals(new BigDecimal("10.48").getClass(), category.CategorySpend().getClass());
		}

	}
	
	@Nested
	@DisplayName("2.9 - Remove Expense function")
	class removeExpense {                                     
		
		FBCategory category = new FBCategory();
		
		@Test
		@DisplayName("2.9.2 - Valid bigDecimal")
		void OkBigDecimal() {
			category.removeExpense(new BigDecimal(1.00));
		}
		
		@Test
		@DisplayName("2.9.2 - Negative bigDecimal")
		void negativeBigDecimal() {
			category.removeExpense(new BigDecimal(-1075));
		}
		
		@Test
		@DisplayName("2.9.3 - Massive bigDecimal")
		void bigBigDecimal() {
			category.removeExpense(new BigDecimal(8000000000000.00));
		}
		@Test
		@DisplayName("2.9.4 - Minimum bigDecimal")
		void smallBigDecimal() {
			category.removeExpense(new BigDecimal(2^-1075));
		}
		
		@Test
		@DisplayName("2.9.5 - Invalid bigDecimal")
		void longBigDecimal() {
			category.removeExpense(new BigDecimal(0.003));
		}
		
		
	}
	
	/* psymp15 */
	@Nested
	@DisplayName("2.10 - Reset category Spent")
	class ResetCategorySpent
	{
		@Test
		@DisplayName("2.10.1 - category spent reset to 0.00")
		void resetSpent()
		{
			FBCategory category = new FBCategory();
			category.addExpense(new BigDecimal("10.48"));
			category.resetBudgetSpend();
			assertEquals(new BigDecimal("0.00"), category.CategorySpend());
		}
	}

}
