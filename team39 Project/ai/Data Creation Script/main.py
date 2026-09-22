import random
from faker import Faker
import numpy as np
import pgeocode
from uk_postcodes_parsing import ukpostcode
import psycopg2
from psycopg2.sql import SQL, Identifier

mydb = psycopg2.connect(
    dbname="postgres",
    user="postgres.pldjwejtutgbjfchqmny",
    host="aws-0-eu-west-2.pooler.supabase.com",
    password="N8rwsLG6bqKvqEDp",
    port=5432,
    connect_timeout=3

)

mycursor = mydb.cursor()
fake = Faker('en_GB')
geo = pgeocode.Nominatim('gb')


# function that creates a valid postcode in London and returns it
def postcode(start, num, num2):
    postcodes = 0
    while not ukpostcode.is_in_ons_postcode_directory(postcodes):
        postcodes = start + str(random.randint(0, num)) + " " + str(num2) + chr(
            random.randint(ord("A"), ord("P"))) + chr(random.randint(ord("A"), ord("Z")))
    return postcodes


# creates the SQL statements needed to commit the data to the database

sqlVT = SQL("INSERT INTO {} VALUES (%s, %s, %s, %s, %s)").format(Identifier('vehicleTable'))
sqlJT = SQL("INSERT INTO {} VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
            ).format(Identifier('journeyTable'))
sqlET = SQL("INSERT INTO {} VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)").format(Identifier('employeeTable'))

# allows for a specified amount to be put into the database

for i in range(150):
    # creating the data for the employee table
    postCode = 0
    entryDate = "2024-04-0" + str(random.randint(1, 9))
    firstName = fake.first_name()
    lastName = fake.last_name()
    phoneNumber = fake.phone_number()
    email = firstName + lastName + "@" + fake.free_email_domain()
    password = fake.password(length=64)
    employeeID = 200 + i

    accessTypeID = 2
    departmentID = random.randint(0, 4)

    journeyID = 214 + i
    vehicleID = 176 + i

    # creating extra data needed for the journey table

    address = str(random.randint(1, 150)) + " " + fake.street_name()
    capacity = 4
    endLat = 51.5194
    endLong = -0.1085
    startTime = 8
    estimatedTimeTaken = random.randint(5, 40)
    carbonEmissionResults = random.randint(1, 4)

    code = random.randint(0, 5)
    if code == 0:
        postCode = postcode("W", 14, random.randint(0, 1))
    if code == 1:
        postCode = postcode("SE", 28, 0)
    if code == 2:
        postCode = postcode("N", 22, random.randint(1, 3))
    if code == 3:
        postCode = postcode("E", 20, 0)
    if code == 4:
        postCode = postcode("SW", 20, 1)
    if code == 5:
        postCode = postcode("NW", 10, 0)

    # data that needs the postCode to work out/create

    dataFrame = geo.query_postal_code(postCode)
    startLat = "%0.4f" % dataFrame.latitude
    startLong = "%0.4f" % dataFrame.longitude
    distanceType = pgeocode.GeoDistance('gb')
    distance = distanceType.query_postal_code(postCode, "WC1")

    # has the distribution of real life data from the 2021 census data

    if int(distance) >> 10:
        MOTID = np.random.choice(np.arange(0, 4), p=[0.64, 0.06, 0.03, 0.27])
    else:
        MOTID = np.random.choice(np.arange(0, 4), p=[0.39, 0.12, 0.12, 0.37])

    if MOTID != 3:
        userRoleID = 1
    else:
        userRoleID = random.randint(0, 1)

    # changing the public vehicles into electric petrol and diesel

    if MOTID == 3:
        MOTID = np.random.choice(np.arange(3, 6), p=[0.65, 0.20, 0.15])

    distance = "%0.2f" % distance

    # extra data needed for the vehicle table

    numberPlate = fake.license_plate()
    if MOTID == 3:
        fuelType = 0
    if MOTID == 4:
        fuelType = 2
    else:
        fuelType = 1

    # commits the changes to the database a table at a time
    # stops walking and cycling and public transport from being in the vehicle table

    if MOTID > 2:
        val = (vehicleID, numberPlate, capacity, fuelType, employeeID)
        mycursor.execute(sqlVT, val)
        realVehicleID = vehicleID

    else:
        vehicleID -= 1
        realVehicleID = None

    val = (journeyID, postCode, estimatedTimeTaken, distance, carbonEmissionResults, realVehicleID, address, startLat,
           startLong, endLat, endLong, MOTID.item(), entryDate)
    mycursor.execute(sqlJT, val)
    # executed last so that foreign keys are created
    val = (employeeID, userRoleID, departmentID, password, firstName, lastName, email,
           phoneNumber, journeyID, realVehicleID)
    mycursor.execute(sqlET, val)

mydb.commit()
