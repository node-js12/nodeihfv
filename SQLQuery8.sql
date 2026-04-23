USE master;
GO

DROP LOGIN pizza_user;
GO

CREATE LOGIN pizza_user WITH PASSWORD = 'Pizza12345!', CHECK_POLICY = OFF;
GO

USE PizzaHouseDB;
GO

DROP USER pizza_user;
GO

CREATE USER pizza_user FOR LOGIN pizza_user;
GO

ALTER ROLE db_owner ADD MEMBER pizza_user;
GO