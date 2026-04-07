-- Creamos la base de datos
CREATE DATABASE RRHH_Transaccional;
GO

USE RRHH_Transaccional;
GO

-- -----------------------------------------------------
-- Table [Departamento]
-- -----------------------------------------------------
CREATE TABLE [Departamento] (
  [idDepartamento] INT NOT NULL,
  [Nombre] VARCHAR(45) NULL,
  PRIMARY KEY ([idDepartamento])
);
GO

-- -----------------------------------------------------
-- Table [Empleado]
-- -----------------------------------------------------
CREATE TABLE [Empleado] (
  [idEmpleado] INT IDENTITY(1,1) NOT NULL,
  [pnombre] VARCHAR(45) NOT NULL,
  [snombre] VARCHAR(45) NULL,
  [papellido] VARCHAR(45) NOT NULL,
  [direccion] VARCHAR(45) NOT NULL,
  [telefono] VARCHAR(45) NOT NULL,
  [celular] VARCHAR(15) NULL,
  [incrementoSueldo] DECIMAL(18,2) NOT NULL,
  [idEmpleadoJefe] INT NULL,
  [idDepartamento] INT NOT NULL,
  PRIMARY KEY ([idEmpleado]),
  CONSTRAINT [fk_Empleado_Empleado1] FOREIGN KEY ([idEmpleadoJefe]) REFERENCES [Empleado] ([idEmpleado]),
  CONSTRAINT [fk_Empleado_Departamento1] FOREIGN KEY ([idDepartamento]) REFERENCES [Departamento] ([idDepartamento])
);
GO

-- -----------------------------------------------------
-- Table [Cargo]
-- -----------------------------------------------------
CREATE TABLE [Cargo] (
  [idCargo] INT IDENTITY(1,1) NOT NULL,
  [nombre] VARCHAR(45) NULL,
  [sueldoBase] DECIMAL(18,2) NULL,
  PRIMARY KEY ([idCargo])
);
GO

-- -----------------------------------------------------
-- Table [Cargo_empleado]
-- -----------------------------------------------------
CREATE TABLE [Cargo_empleado] (
  [idCargo] INT NOT NULL,
  [idEmpleado] INT NOT NULL,
  [fechaNombramiento] DATE NULL,
  PRIMARY KEY ([idCargo], [idEmpleado]),
  CONSTRAINT [fk_Cargo_has_Empleado_Cargo] FOREIGN KEY ([idCargo]) REFERENCES [Cargo] ([idCargo]),
  CONSTRAINT [fk_Cargo_has_Empleado_Empleado1] FOREIGN KEY ([idEmpleado]) REFERENCES [Empleado] ([idEmpleado])
);
GO

-- -----------------------------------------------------
-- Table [Bono]
-- -----------------------------------------------------
CREATE TABLE [Bono] (
  [idBono] INT NOT NULL,
  [fecha] DATE NULL,
  [monto] DECIMAL(18,2) NULL,
  [descripcion] VARCHAR(45) NULL,
  PRIMARY KEY ([idBono])
);
GO

-- -----------------------------------------------------
-- Table [Planilla]
-- -----------------------------------------------------
CREATE TABLE [Planilla] (
  [idPlanilla] INT NOT NULL,
  [fechaEfectiva] DATE NULL,
  [fechaInicio] DATE NULL,
  [fechaFin] DATE NULL,
  PRIMARY KEY ([idPlanilla])
);
GO

-- -----------------------------------------------------
-- Table [Empleado_bono]
-- -----------------------------------------------------
CREATE TABLE [Empleado_bono] (
  [Empleado_idEmpleado] INT NOT NULL,
  [Bono_idBono] INT NOT NULL,
  [Estado] VARCHAR(1) NULL,
  [Planilla_idPlanilla] INT NOT NULL,
  PRIMARY KEY ([Empleado_idEmpleado], [Bono_idBono]),
  CONSTRAINT [fk_Empleado_has_Bono_Empleado1] FOREIGN KEY ([Empleado_idEmpleado]) REFERENCES [Empleado] ([idEmpleado]),
  CONSTRAINT [fk_Empleado_has_Bono_Bono1] FOREIGN KEY ([Bono_idBono]) REFERENCES [Bono] ([idBono]),
  CONSTRAINT [fk_Empleado_bono_Planilla1] FOREIGN KEY ([Planilla_idPlanilla]) REFERENCES [Planilla] ([idPlanilla])
);
GO

-- -----------------------------------------------------
-- Table [Anticipo]
-- -----------------------------------------------------
CREATE TABLE [Anticipo] (
  [idAnticipo] INT NOT NULL,
  [fecha] DATE NULL,
  [descripcion] VARCHAR(45) NULL,
  [monto] DECIMAL(18,2) NULL,
  [idEmpleado] INT NOT NULL,
  [Estado] VARCHAR(1) NULL,
  [Planilla_idPlanilla] INT NULL,
  PRIMARY KEY ([idAnticipo]),
  CONSTRAINT [fk_Anticipo_Empleado1] FOREIGN KEY ([idEmpleado]) REFERENCES [Empleado] ([idEmpleado]),
  CONSTRAINT [fk_Anticipo_Planilla1] FOREIGN KEY ([Planilla_idPlanilla]) REFERENCES [Planilla] ([idPlanilla])
);
GO

-- -----------------------------------------------------
-- Table [TipoDeduccion]
-- -----------------------------------------------------
CREATE TABLE [TipoDeduccion] (
  [idTipoDeduccion] INT NOT NULL,
  [descripcion] VARCHAR(45) NULL,
  PRIMARY KEY ([idTipoDeduccion])
);
GO

-- -----------------------------------------------------
-- Table [Deduccion]
-- -----------------------------------------------------
CREATE TABLE [Deduccion] (
  [idDeduccion] INT NOT NULL,
  [fechaInicio] DATE NULL,
  [fechaFin] DATE NULL,
  [valor] DECIMAL(18,2) NULL,
  [TipoDeduccion_idTipoDeduccion] INT NOT NULL,
  [tipo] VARCHAR(1) NULL, /* P-Porcentaje, M-Monto */
  PRIMARY KEY ([idDeduccion]),
  CONSTRAINT [fk_Deduccion_TipoDeduccion1] FOREIGN KEY ([TipoDeduccion_idTipoDeduccion]) REFERENCES [TipoDeduccion] ([idTipoDeduccion])
);
GO

-- -----------------------------------------------------
-- Table [Deduccion_has_Empleado]
-- -----------------------------------------------------
CREATE TABLE [Deduccion_has_Empleado] (
  [Deduccion_idDeduccion] INT NOT NULL,
  [Empleado_idEmpleado] INT NOT NULL,
  [Fecha] DATE NULL,
  [Estado] VARCHAR(1) NULL,
  [Planilla_idPlanilla] INT NULL,
  [Deduccion_has_Empleadocol] VARCHAR(45) NULL,
  PRIMARY KEY ([Deduccion_idDeduccion], [Empleado_idEmpleado]),
  CONSTRAINT [fk_Deduccion_has_Empleado_Deduccion1] FOREIGN KEY ([Deduccion_idDeduccion]) REFERENCES [Deduccion] ([idDeduccion]),
  CONSTRAINT [fk_Deduccion_has_Empleado_Empleado1] FOREIGN KEY ([Empleado_idEmpleado]) REFERENCES [Empleado] ([idEmpleado]),
  CONSTRAINT [fk_Deduccion_has_Empleado_Planilla1] FOREIGN KEY ([Planilla_idPlanilla]) REFERENCES [Planilla] ([idPlanilla])
);
GO

-- -----------------------------------------------------
-- Table [Empleado_has_Planilla]
-- -----------------------------------------------------
CREATE TABLE [Empleado_has_Planilla] (
  [Empleado_idEmpleado] INT NOT NULL,
  [Planilla_idPlanilla] INT NOT NULL,
  PRIMARY KEY ([Empleado_idEmpleado], [Planilla_idPlanilla]),
  CONSTRAINT [fk_Empleado_has_Planilla_Empleado1] FOREIGN KEY ([Empleado_idEmpleado]) REFERENCES [Empleado] ([idEmpleado]),
  CONSTRAINT [fk_Empleado_has_Planilla_Planilla1] FOREIGN KEY ([Planilla_idPlanilla]) REFERENCES [Planilla] ([idPlanilla])
);
GO

-- -----------------------------------------------------
-- Datos semilla para Data Warehouse
-- -----------------------------------------------------

INSERT INTO [Departamento] ([idDepartamento], [Nombre]) VALUES
  (1, 'Ventas'),
  (2, 'Operaciones'),
  (3, 'Seguridad'),
  (4, 'Finanzas'),
  (5, 'RRHH');
GO

SET IDENTITY_INSERT [Cargo] ON;
INSERT INTO [Cargo] ([idCargo], [nombre], [sueldoBase]) VALUES
  (1, 'Gerente Comercial', 2800.00),
  (2, 'Ejecutivo Comercial', 1650.00),
  (3, 'Analista de Ventas', 1450.00),
  (4, 'Coordinador Soporte', 1750.00),
  (5, 'Especialista Soporte', 1550.00),
  (6, 'Auditor Seguridad', 2100.00),
  (7, 'Analista Financiero', 1900.00);
SET IDENTITY_INSERT [Cargo] OFF;
GO

SET IDENTITY_INSERT [Empleado] ON;
INSERT INTO [Empleado] (
  [idEmpleado], [pnombre], [snombre], [papellido], [direccion], [telefono], [celular],
  [incrementoSueldo], [idEmpleadoJefe], [idDepartamento]
) VALUES
  (1,  'Andrea',   'Lucia',   'Lopez',    'Col San Miguel',     '2234-1001', '9911-1001', 0.12, NULL, 1),
  (2,  'Bruno',    'Adrian',  'Mejia',    'Col Palmira',        '2234-1002', '9911-1002', 0.08, 1,    1),
  (3,  'Camila',   'Rocio',   'Santos',   'Col Tepeyac',        '2234-1003', '9911-1003', 0.08, 1,    1),
  (4,  'David',    NULL,      'Flores',   'Col Kennedy',        '2234-1004', '9911-1004', 0.06, 1,    1),
  (5,  'Elena',    'Maria',   'Rivera',   'Col Miraflores',     '2234-1005', '9911-1005', 0.07, 1,    1),
  (6,  'Fernanda', 'Isabel',  'Cruz',     'Col Las Colinas',    '2234-1006', '9911-1006', 0.10, NULL, 2),
  (7,  'Gabriel',  'Jose',    'Molina',   'Col Florencia',      '2234-1007', '9911-1007', 0.06, 6,    2),
  (8,  'Helena',   NULL,      'Vargas',   'Col Humuya',         '2234-1008', '9911-1008', 0.06, 6,    2),
  (9,  'Ivan',     'Rene',    'Duarte',   'Col San Carlos',     '2234-1009', '9911-1009', 0.09, NULL, 3),
  (10, 'Julia',    'Beatriz', 'Ochoa',    'Col Alameda',        '2234-1010', '9911-1010', 0.07, 9,    4);
SET IDENTITY_INSERT [Empleado] OFF;
GO

-- Historial de cargos para generar version y version_actual en el ETL
INSERT INTO [Cargo_empleado] ([idCargo], [idEmpleado], [fechaNombramiento]) VALUES
  (1, 1, '2023-01-01'),
  (2, 2, '2023-02-01'),
  (3, 2, '2025-01-10'),
  (2, 3, '2023-03-01'),
  (3, 4, '2024-01-15'),
  (2, 5, '2024-02-20'),
  (3, 5, '2025-06-01'),
  (4, 6, '2022-12-01'),
  (5, 7, '2024-03-01'),
  (5, 8, '2024-04-01'),
  (4, 8, '2025-09-01'),
  (6, 9, '2023-05-01'),
  (7, 10, '2023-06-01');
GO

INSERT INTO [Planilla] ([idPlanilla], [fechaEfectiva], [fechaInicio], [fechaFin]) VALUES
  (1001, '2025-01-31', '2025-01-01', '2025-01-31'),
  (1002, '2025-02-28', '2025-02-01', '2025-02-28'),
  (1003, '2025-03-31', '2025-03-01', '2025-03-31'),
  (1004, '2025-04-30', '2025-04-01', '2025-04-30');
GO

INSERT INTO [Bono] ([idBono], [fecha], [monto], [descripcion]) VALUES
  (1, '2025-01-15', 1200.00, 'Bono productividad Q1'),
  (2, '2025-03-10', 800.00,  'Bono cumplimiento SLA'),
  (3, '2025-04-05', 1000.00, 'Bono cierre auditoria');
GO

INSERT INTO [Empleado_bono] ([Empleado_idEmpleado], [Bono_idBono], [Estado], [Planilla_idPlanilla]) VALUES
  (2, 1, 'A', 1001),
  (5, 1, 'A', 1001),
  (7, 2, 'A', 1003),
  (9, 3, 'A', 1004);
GO

INSERT INTO [Anticipo] ([idAnticipo], [fecha], [descripcion], [monto], [idEmpleado], [Estado], [Planilla_idPlanilla]) VALUES
  (1, '2025-02-05', 'Anticipo viaticos', 250.00, 4, 'A', 1002),
  (2, '2025-03-12', 'Anticipo equipo',   180.00, 8, 'A', 1003),
  (3, '2025-04-18', 'Anticipo emergencia', 300.00, 10, 'P', 1004);
GO

INSERT INTO [TipoDeduccion] ([idTipoDeduccion], [descripcion]) VALUES
  (1, 'ISR'),
  (2, 'Seguro Social'),
  (3, 'Prestamo Interno');
GO

INSERT INTO [Deduccion] ([idDeduccion], [fechaInicio], [fechaFin], [valor], [TipoDeduccion_idTipoDeduccion], [tipo]) VALUES
  (1, '2025-01-01', '2025-12-31', 10.00, 1, 'P'),
  (2, '2025-01-01', '2025-12-31', 5.00,  2, 'P'),
  (3, '2025-03-01', '2025-09-30', 50.00, 3, 'M');
GO

INSERT INTO [Deduccion_has_Empleado] (
  [Deduccion_idDeduccion], [Empleado_idEmpleado], [Fecha], [Estado], [Planilla_idPlanilla], [Deduccion_has_Empleadocol]
) VALUES
  (1, 2, '2025-01-31', 'A', 1001, NULL),
  (2, 2, '2025-01-31', 'A', 1001, NULL),
  (1, 3, '2025-01-31', 'A', 1001, NULL),
  (2, 7, '2025-03-31', 'A', 1003, NULL),
  (3, 8, '2025-03-31', 'A', 1003, NULL),
  (3, 10, '2025-04-30', 'A', 1004, NULL);
GO

INSERT INTO [Empleado_has_Planilla] ([Empleado_idEmpleado], [Planilla_idPlanilla]) VALUES
  (1, 1001),
  (2, 1001),
  (3, 1001),
  (4, 1002),
  (5, 1002),
  (6, 1003),
  (7, 1003),
  (8, 1003),
  (9, 1004),
  (10, 1004);
GO