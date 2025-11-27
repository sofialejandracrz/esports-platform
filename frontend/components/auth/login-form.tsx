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
import { useAuth } from "@/contexts/auth-context";
import { IconLoader2, IconTrophy } from "@tabler/icons-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando el usuario escribe
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (error) {
      clearError();
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.login.trim()) {
      errors.login = "Ingresa tu nickname o correo electrónico";
    }
    
    if (!formData.password) {
      errors.password = "Ingresa tu contraseña";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await login({
        login: formData.login.trim(),
        password: formData.password,
      });
      
      // Redirigir al home después del login exitoso
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
          <CardTitle className="text-xl">Bienvenido de nuevo</CardTitle>
          <CardDescription>
            Inicia sesión con tu cuenta de eSports Platform
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
              
              <Field>
                <FieldLabel htmlFor="login">Nickname o Correo</FieldLabel>
                <Input
                  id="login"
                  name="login"
                  type="text"
                  placeholder="tu_nickname o correo@ejemplo.com"
                  value={formData.login}
                  onChange={handleChange}
                  disabled={isLoading}
                  autoComplete="username"
                  data-invalid={!!formErrors.login}
                />
                {formErrors.login && <FieldError>{formErrors.login}</FieldError>}
              </Field>
              
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <Link
                    href="/auth/recuperar"
                    className="ml-auto text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  autoComplete="current-password"
                  data-invalid={!!formErrors.password}
                />
                {formErrors.password && <FieldError>{formErrors.password}</FieldError>}
              </Field>
              
              <Field>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <IconLoader2 className="mr-2 size-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </Field>
              
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                ¿Eres nuevo?
              </FieldSeparator>
              
              <Field>
                <Button variant="outline" type="button" asChild className="w-full">
                  <Link href="/auth/registro">
                    Crear una cuenta
                  </Link>
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      
      <FieldDescription className="px-6 text-center">
        Al iniciar sesión, aceptas nuestros{" "}
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
