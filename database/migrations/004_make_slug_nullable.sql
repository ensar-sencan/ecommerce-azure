-- Make slug column nullable temporarily
-- This allows products to be created without slug
-- Backend will generate slug automatically

USE [ecommerce-db];
GO

-- Make slug nullable
ALTER TABLE Products
ALTER COLUMN slug NVARCHAR(200) NULL;
GO

-- Add default constraint to generate slug from name if null
-- Note: This is a temporary solution, backend should always provide slug
GO

PRINT 'Slug column is now nullable';
GO
