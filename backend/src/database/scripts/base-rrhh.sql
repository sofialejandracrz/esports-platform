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