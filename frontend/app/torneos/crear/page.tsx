'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTournamentForm } from '@/hooks/use-tournament-form';
import { useCatalogosTorneo } from '@/hooks/use-catalogos-torneo';
import { useAuth } from '@/contexts/auth-context';
import { CreateStepsIndicator } from '@/components/torneos/create-steps-indicator';
import { Stage1BasicInfo } from '@/components/torneos/create-stages/stage-1-basic-info';
import { Stage2Details } from '@/components/torneos/create-stages/stage-2-details';
import { Stage3Prizes } from '@/components/torneos/create-stages/stage-3-prizes';
import { Stage4Host } from '@/components/torneos/create-stages/stage-4-host';
import { Stage5Graphics } from '@/components/torneos/create-stages/stage-5-graphics';
import { Stage6Finalize } from '@/components/torneos/create-stages/stage-6-finalize';
import { 
  IconArrowLeft, 
  IconArrowRight, 
  IconSend, 
  IconAlertCircle, 
  IconCircleCheck, 
  IconLoader2,
  IconLock 
} from '@tabler/icons-react';
import { getToken } from '@/lib/auth-storage';
import { useEffect, useState } from 'react';

export default function CreateTournamentPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  const {
    formData,
    currentStage,
    updateField,
    goToStage,
    nextStage,
    prevStage,
    submitTournament,
    submitState,
    validateStage,
  } = useTournamentForm();

  const {
    catalogos,
    loading: catalogosLoading,
    error: catalogosError,
  } = useCatalogosTorneo();

  // Montar componente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Verificar autenticación
  useEffect(() => {
    if (mounted && !authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/torneos/crear');
    }
  }, [mounted, authLoading, isAuthenticated, router]);

  const handleSubmit = async () => {
    const token = getToken();
    if (!token) {
      router.push('/auth/login?redirect=/torneos/crear');
      return;
    }

    const result = await submitTournament();

    if (result.success) {
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }
  };

  // Validación para el botón "Siguiente"
  const currentValidation = validateStage(currentStage);
  const canProceedToNext = currentValidation.valid;

  // Mostrar loader mientras se autentica
  if (!mounted || authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <IconLoader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  // Mostrar mensaje si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <IconLock className="mx-auto size-12 text-orange-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Acceso Restringido</h2>
            <p className="text-muted-foreground mb-4">
              Debes iniciar sesión para crear torneos
            </p>
            <Button
              onClick={() => router.push('/auth/login?redirect=/torneos/crear')}
            >
              Iniciar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-4 pb-24 md:p-6 md:pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Crear Nuevo Torneo</h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Completa los siguientes pasos para crear tu torneo
        </p>
      </div>

      {/* Mensaje de éxito */}
      {submitState.success && (
        <Card className="border-green-500/50 bg-green-500/10">
          <CardContent className="flex items-start gap-3 pt-6">
            <IconCircleCheck className="size-5 shrink-0 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium text-green-500">¡Torneo creado exitosamente!</p>
              <p className="text-sm text-muted-foreground">
                Redirigiendo al dashboard...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mensaje de error */}
      {submitState.error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="flex items-start gap-3 pt-6">
            <IconAlertCircle className="size-5 shrink-0 text-destructive mt-0.5" />
            <div>
              <p className="font-medium text-destructive">Error al crear el torneo</p>
              <p className="text-sm text-muted-foreground">{submitState.error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Steps Indicator - Mobile First */}
      <Card>
        <CardContent className="pt-6">
          <CreateStepsIndicator
            currentStep={currentStage}
            totalSteps={6}
            onStepClick={goToStage}
          />
        </CardContent>
      </Card>

      {/* Contenido Principal */}
      <div className="space-y-6">
        {/* Etapa Actual */}
        {currentStage === 1 && (
          <Stage1BasicInfo 
            data={formData} 
            onUpdate={updateField}
            errors={currentValidation.fieldErrors}
          />
        )}
        {currentStage === 2 && (
          <Stage2Details
            data={formData}
            onUpdate={updateField}
            catalogos={catalogos}
            catalogosLoading={catalogosLoading}
            catalogosError={catalogosError}
            errors={currentValidation.fieldErrors}
          />
        )}
        {currentStage === 3 && (
          <Stage3Prizes 
            data={formData} 
            onUpdate={updateField}
            errors={currentValidation.fieldErrors}
          />
        )}
        {currentStage === 4 && (
          <Stage4Host data={formData} onUpdate={updateField} />
        )}
        {currentStage === 5 && (
          <Stage5Graphics data={formData} onUpdate={updateField} />
        )}
        {currentStage === 6 && (
          <Stage6Finalize 
            data={formData} 
            onUpdate={updateField}
            catalogos={catalogos}
            errors={currentValidation.fieldErrors}
          />
        )}

        {/* Errores de validación */}
        {!currentValidation.valid && currentValidation.errors.length > 0 && (
          <Card className="border-orange-500/50 bg-orange-500/10">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-orange-500 mb-2">Campos pendientes:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {currentValidation.errors.map((error, idx) => (
                  <li key={idx}>• {error}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Botones de Navegación - Fixed en móvil */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background p-4 md:static md:border-0 md:bg-transparent md:p-0">
        <div className="container mx-auto flex max-w-6xl gap-3">
          <Button
            onClick={prevStage}
            disabled={currentStage === 1 || submitState.loading}
            variant="outline"
            className="flex-1 gap-2 md:flex-none"
          >
            <IconArrowLeft className="size-4" />
            <span className="hidden sm:inline">Anterior</span>
          </Button>

          <div className="flex-1 md:flex-none md:ml-auto">
            {currentStage < 6 ? (
              <Button
                onClick={nextStage}
                disabled={!canProceedToNext}
                className="w-full gap-2"
              >
                <span className="hidden sm:inline">Siguiente</span>
                <span className="sm:hidden">Continuar</span>
                <IconArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submitState.loading || !formData.isReady}
                className="w-full gap-2"
                variant="default"
              >
                {submitState.loading ? (
                  <>
                    <IconLoader2 className="size-4 animate-spin" />
                    <span className="hidden sm:inline">Publicando...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <IconSend className="size-4" />
                    <span className="hidden sm:inline">Publicar Torneo</span>
                    <span className="sm:hidden">Publicar</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
