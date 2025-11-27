"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { IconLoader2, IconTrophy, IconEye, IconEyeOff } from "@tabler/icons-react";

// Lista de géneros para el select
const GENEROS = [
  { value: "Masculino", label: "Masculino" },
  { value: "Femenino", label: "Femenino" },
  { value: "Otro", label: "Otro" },
  { value: "Prefiero no decir", label: "Prefiero no decir" },
];

// Lista de zonas horarias comunes
const TIMEZONES = [
  { value: "America/Mexico_City", label: "(UTC-6) Ciudad de México" },
  { value: "America/Bogota", label: "(UTC-5) Bogotá, Lima" },
  { value: "America/New_York", label: "(UTC-5) Nueva York" },
  { value: "America/Los_Angeles", label: "(UTC-8) Los Ángeles" },
  { value: "America/Buenos_Aires", label: "(UTC-3) Buenos Aires" },
  { value: "America/Sao_Paulo", label: "(UTC-3) São Paulo" },
  { value: "Europe/Madrid", label: "(UTC+1) Madrid" },
  { value: "Europe/London", label: "(UTC+0) Londres" },
  { value: "UTC", label: "(UTC+0) UTC" },
];

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    nickname: "",
    password: "",
    confirmPassword: "",
    fechaNacimiento: "",
    genero: "",
    timezone: "America/Mexico_City",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (error) {
      clearError();
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es requerido";
    }
    
    if (!formData.apellido.trim()) {
      errors.apellido = "El apellido es requerido";
    }
    
    if (!formData.correo.trim()) {
      errors.correo = "El correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      errors.correo = "Ingresa un correo válido";
    }
    
    if (!formData.nickname.trim()) {
      errors.nickname = "El nickname es requerido";
    } else if (formData.nickname.length < 3) {
      errors.nickname = "El nickname debe tener al menos 3 caracteres";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.nickname)) {
      errors.nickname = "Solo letras, números y guiones bajos";
    }
    
    if (!formData.password) {
      errors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      errors.password = "Mínimo 6 caracteres";
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }
    
    if (!formData.fechaNacimiento) {
      errors.fechaNacimiento = "La fecha de nacimiento es requerida";
    } else {
      const birthDate = new Date(formData.fechaNacimiento);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        errors.fechaNacimiento = "Debes tener al menos 13 años";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // Convertir fecha a formato ISO 8601 (requerido por el backend)
      const fechaISO = new Date(formData.fechaNacimiento).toISOString();
      
      await register({
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        correo: formData.correo.trim().toLowerCase(),
        nickname: formData.nickname.trim(),
        password: formData.password,
        fechaNacimiento: fechaISO,
        genero: formData.genero || undefined,
        timezone: formData.timezone,
      });
      
      // Redirigir al home después del registro exitoso
      router.push("/");
    } catch {
      // El error ya se maneja en el contexto
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-border/50 bg-card/90 backdrop-blur-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25">
            <IconTrophy className="size-8 text-white" />
          </div>
          <CardTitle className="text-xl">Crear cuenta</CardTitle>
          <CardDescription>
            Únete a la comunidad de eSports Platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {/* Error general */}
              {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              
              {/* Nombre y Apellido */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="nombre">Nombre</FieldLabel>
                  <Input
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder="Juan"
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="given-name"
                    data-invalid={!!formErrors.nombre}
                  />
                  {formErrors.nombre && <FieldError>{formErrors.nombre}</FieldError>}
                </Field>
                
                <Field>
                  <FieldLabel htmlFor="apellido">Apellido</FieldLabel>
                  <Input
                    id="apellido"
                    name="apellido"
                    type="text"
                    placeholder="Pérez"
                    value={formData.apellido}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="family-name"
                    data-invalid={!!formErrors.apellido}
                  />
                  {formErrors.apellido && <FieldError>{formErrors.apellido}</FieldError>}
                </Field>
              </div>
              
              {/* Correo */}
              <Field>
                <FieldLabel htmlFor="correo">Correo electrónico</FieldLabel>
                <Input
                  id="correo"
                  name="correo"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.correo}
                  onChange={handleChange}
                  disabled={isLoading}
                  autoComplete="email"
                  data-invalid={!!formErrors.correo}
                />
                {formErrors.correo && <FieldError>{formErrors.correo}</FieldError>}
              </Field>
              
              {/* Nickname */}
              <Field>
                <FieldLabel htmlFor="nickname">Nickname</FieldLabel>
                <Input
                  id="nickname"
                  name="nickname"
                  type="text"
                  placeholder="pro_gamer_123"
                  value={formData.nickname}
                  onChange={handleChange}
                  disabled={isLoading}
                  autoComplete="username"
                  data-invalid={!!formErrors.nickname}
                />
                <FieldDescription>
                  Este será tu nombre público único. No podrás cambiarlo después.
                </FieldDescription>
                {formErrors.nickname && <FieldError>{formErrors.nickname}</FieldError>}
              </Field>
              
              {/* Fecha de nacimiento */}
              <Field>
                <FieldLabel htmlFor="fechaNacimiento">Fecha de nacimiento</FieldLabel>
                <Input
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  disabled={isLoading}
                  autoComplete="bday"
                  data-invalid={!!formErrors.fechaNacimiento}
                />
                {formErrors.fechaNacimiento && <FieldError>{formErrors.fechaNacimiento}</FieldError>}
              </Field>
              
              {/* Género y Zona horaria */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="genero">Género (opcional)</FieldLabel>
                  <Select
                    value={formData.genero}
                    onValueChange={(value) => handleSelectChange("genero", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="genero">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENEROS.map((genero) => (
                        <SelectItem key={genero.value} value={genero.value}>
                          {genero.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                
                <Field>
                  <FieldLabel htmlFor="timezone">Zona horaria</FieldLabel>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => handleSelectChange("timezone", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Contraseña
              </FieldSeparator>
              
              {/* Contraseña */}
              <Field>
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="new-password"
                    className="pr-10"
                    data-invalid={!!formErrors.password}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <IconEyeOff className="size-4 text-muted-foreground" />
                    ) : (
                      <IconEye className="size-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <FieldDescription>Mínimo 6 caracteres</FieldDescription>
                {formErrors.password && <FieldError>{formErrors.password}</FieldError>}
              </Field>
              
              {/* Confirmar contraseña */}
              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirmar contraseña</FieldLabel>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="new-password"
                    className="pr-10"
                    data-invalid={!!formErrors.confirmPassword}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <IconEyeOff className="size-4 text-muted-foreground" />
                    ) : (
                      <IconEye className="size-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {formErrors.confirmPassword && <FieldError>{formErrors.confirmPassword}</FieldError>}
              </Field>
              
              {/* Botón de registro */}
              <Field>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <IconLoader2 className="mr-2 size-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    "Crear cuenta"
                  )}
                </Button>
              </Field>
              
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                ¿Ya tienes cuenta?
              </FieldSeparator>
              
              <Field>
                <Button variant="outline" type="button" asChild className="w-full">
                  <Link href="/auth/login">
                    Iniciar sesión
                  </Link>
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      
      <FieldDescription className="px-6 text-center">
        Al registrarte, aceptas nuestros{" "}
        <Link href="/terminos" className="text-primary hover:underline">
          Términos de Servicio
        </Link>{" "}
        y{" "}
        <Link href="/privacidad" className="text-primary hover:underline">
          Política de Privacidad
        </Link>
        .
      </FieldDescription>
    </div>
  );
}
