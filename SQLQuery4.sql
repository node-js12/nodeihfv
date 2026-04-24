IF COL_LENGTH('dbo.Pizzas', 'image') IS NULL
BEGIN
    ALTER TABLE dbo.Pizzas
    ADD image NVARCHAR(255) NOT NULL
        CONSTRAINT DF_Pizzas_image DEFAULT 'default.jpg';
END