'use client';

import { useState, useCallback } from 'react';
import { crearTorneo, CrearTorneoData, TorneoCreado } from '@/lib/api/torneos';

// ============================================================================
// TIPOS DEL FORMULARIO
// ============================================================================

export type StageErrors = Record<string, string>;

export interface TournamentFormData {
  // Stage 1: Basic Info
  title: string;
  description: string;
  registrationStart: string;
  registrationEnd: string;
  tournamentStart: string;

  // Stage 2: Tournament Details
  gameId: string;
  platform: string;
  gameMode: string;
  region: string;
  tournamentType: string;
  bestOf: number;
  format: string;
  isClosed: boolean;
  rulesType: 'basic' | 'custom';
  customRules: string;
  allowPC: boolean;
  requireStream: boolean;
  requireWebcam: boolean;
  inputType: string;
  maxParticipants: number;

  // Stage 3: Prizes
  entryFee: number;
  totalPrizePool: number;
  hostCommissionPercentage: number;
  firstPlacePercentage: number;
  secondPlacePercentage: number;

  // Stage 4: Host Details
  hostContact: string;
  twitchUrl: string;
  discordUrl: string;
  youtubeUrl: string;
  facebookUrl: string;
  xUrl: string;
  discordServer: string;

  // Stage 5: Graphics
  bannerImage: File | null;
  thumbnailImage: File | null;

  // Stage 6: Finalize
  isReady: boolean;
}

const initialFormData: TournamentFormData = {
  title: '',
  description: '',
  registrationStart: '',
  registrationEnd: '',
  tournamentStart: '',
  gameId: '',
  platform: '',
  gameMode: '',
  region: '',
  tournamentType: '',
  bestOf: 1,
  format: '',
  isClosed: false,
  rulesType: 'basic',
  customRules: '',
  allowPC: true,
  requireStream: false,
  requireWebcam: false,
  inputType: '',
  maxParticipants: 16,
  entryFee: 0,
  totalPrizePool: 0,
  hostCommissionPercentage: 10,
  firstPlacePercentage: 60,
  secondPlacePercentage: 40,
  hostContact: '',
  twitchUrl: '',
  discordUrl: '',
  youtubeUrl: '',
  facebookUrl: '',
  xUrl: '',
  discordServer: '',
  bannerImage: null,
  thumbnailImage: null,
  isReady: false,
};

interface SubmitState {
  loading: boolean;
  error: string | null;
  success: boolean;
  torneoCreado?: TorneoCreado;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  fieldErrors: StageErrors;
}

/**
 * Transforma los datos del formulario al formato esperado por la API.
 * Los nombres de campos DEBEN coincidir con CrearTorneoFuncionDto del backend.
 */
function transformFormDataToPayload(formData: TournamentFormData): CrearTorneoData {
  // Construir array de redes sociales
  const redesSociales: Array<{ plataforma: string; url: string }> = [];
  
  if (formData.twitchUrl) redesSociales.push({ plataforma: 'twitch', url: formData.twitchUrl });
  if (formData.discordUrl) redesSociales.push({ plataforma: 'discord', url: formData.discordUrl });
  if (formData.youtubeUrl) redesSociales.push({ plataforma: 'youtube', url: formData.youtubeUrl });
  if (formData.facebookUrl) redesSociales.push({ plataforma: 'facebook', url: formData.facebookUrl });
  if (formData.xUrl) redesSociales.push({ plataforma: 'x', url: formData.xUrl });

  return {
    // Paso 1: Información básica
    titulo: formData.title,
    descripcion: formData.description || undefined,
    fecha_inicio_registro: formData.registrationStart || undefined,
    fecha_fin_registro: formData.registrationEnd || undefined,
    fecha_inicio_torneo: formData.tournamentStart || undefined,

    // Paso 2: Detalles del torneo
    juego_id: formData.gameId || undefined,
    plataforma_id: formData.platform || undefined,
    modo_juego_id: formData.gameMode || undefined,
    region_id: formData.region || undefined,
    tipo_torneo_id: formData.tournamentType || undefined,
    al_mejor_de: formData.bestOf,
    formato: formData.format || undefined,
    cerrado: formData.isClosed,
    reglas: formData.rulesType === 'custom' ? formData.customRules : undefined,
    jugadores_pc_permitidos: formData.allowPC,
    requiere_transmision: formData.requireStream,
    requiere_camara: formData.requireWebcam,
    tipo_entrada_id: formData.inputType || undefined,
    capacidad: formData.maxParticipants,

    // Paso 3: Premios
    cuota: formData.entryFee,
    comision_porcentaje: formData.hostCommissionPercentage,
    ganador1_porcentaje: formData.firstPlacePercentage,
    ganador2_porcentaje: formData.secondPlacePercentage,

    // Paso 4: Detalles del anfitrión
    contacto_anfitrion: formData.hostContact || undefined,
    discord_servidor: formData.discordServer || undefined,
    redes_sociales: redesSociales.length > 0 ? redesSociales : undefined,

    // Paso 5: Gráficos
    banner_url: undefined, // TODO: Subir archivos primero
    miniatura_url: undefined, // TODO: Subir archivos primero
  };
}

export function useTournamentForm() {
  const [formData, setFormData] = useState<TournamentFormData>(initialFormData);
  const [currentStage, setCurrentStage] = useState(1);
  const [submitState, setSubmitState] = useState<SubmitState>({
    loading: false,
    error: null,
    success: false,
  });

  const updateField = useCallback(<K extends keyof TournamentFormData>(
    field: K,
    value: TournamentFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateMultipleFields = useCallback((updates: Partial<TournamentFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const goToStage = useCallback((stage: number) => {
    setCurrentStage(stage);
  }, []);

  const nextStage = useCallback(() => {
    if (currentStage < 6) setCurrentStage((prev) => prev + 1);
  }, [currentStage]);

  const prevStage = useCallback(() => {
    if (currentStage > 1) setCurrentStage((prev) => prev - 1);
  }, [currentStage]);

  const reset = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStage(1);
    setSubmitState({ loading: false, error: null, success: false });
  }, []);

  /**
   * Enviar el formulario a la API para crear el torneo
   */
  const submitTournament = useCallback(async (): Promise<{ success: boolean; data?: TorneoCreado }> => {
    setSubmitState({ loading: true, error: null, success: false });

    try {
      const payload = transformFormDataToPayload(formData);
      const response = await crearTorneo(payload);

      setSubmitState({
        loading: false,
        error: null,
        success: true,
        torneoCreado: response,
      });
      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setSubmitState({ loading: false, error: errorMessage, success: false });
      return { success: false };
    }
  }, [formData]);

  /**
   * Validar los campos obligatorios de cada etapa
   */
  const validateStage = useCallback((stage: number): ValidationResult => {
    const errors: string[] = [];
    const fieldErrors: StageErrors = {};

    switch (stage) {
      case 1:
        if (!formData.title.trim()) {
          errors.push('El título es obligatorio');
          fieldErrors.title = 'El título es obligatorio';
        }
        if (!formData.registrationStart) {
          errors.push('La fecha de inicio de inscripción es obligatoria');
          fieldErrors.registrationStart = 'Requerido';
        }
        if (!formData.registrationEnd) {
          errors.push('La fecha de fin de inscripción es obligatoria');
          fieldErrors.registrationEnd = 'Requerido';
        }
        if (!formData.tournamentStart) {
          errors.push('La fecha de inicio del torneo es obligatoria');
          fieldErrors.tournamentStart = 'Requerido';
        }
        break;

      case 2:
        if (!formData.gameId) {
          errors.push('Debes seleccionar un juego');
          fieldErrors.gameId = 'Selecciona un juego';
        }
        if (!formData.platform) {
          errors.push('Debes seleccionar una plataforma');
          fieldErrors.platform = 'Selecciona una plataforma';
        }
        if (!formData.gameMode) {
          errors.push('Debes seleccionar un modo de juego');
          fieldErrors.gameMode = 'Selecciona un modo';
        }
        if (!formData.region) {
          errors.push('Debes seleccionar una región');
          fieldErrors.region = 'Selecciona una región';
        }
        if (!formData.tournamentType) {
          errors.push('Debes seleccionar un tipo de torneo');
          fieldErrors.tournamentType = 'Selecciona un tipo';
        }
        if (!formData.inputType) {
          errors.push('Debes seleccionar un tipo de entrada');
          fieldErrors.inputType = 'Selecciona tipo de entrada';
        }
        if (formData.maxParticipants < 2) {
          errors.push('Debe haber al menos 2 participantes');
          fieldErrors.maxParticipants = 'Mínimo 2 participantes';
        }
        break;

      case 3:
        if (formData.firstPlacePercentage + formData.secondPlacePercentage !== 100) {
          const msg = 'Los porcentajes de premios deben sumar 100%';
          errors.push(msg);
          fieldErrors.firstPlacePercentage = 'Debe sumar 100%';
          fieldErrors.secondPlacePercentage = 'Debe sumar 100%';
        }
        break;

      case 6:
        if (!formData.isReady) {
          errors.push('Debes confirmar que el torneo está listo');
          fieldErrors.isReady = 'Debes confirmar que la información es correcta';
        }
        break;
    }

    return { valid: errors.length === 0, errors, fieldErrors };
  }, [formData]);

  const validateAll = useCallback((): ValidationResult => {
    const allErrors: string[] = [];
    const allFieldErrors: StageErrors = {};
    for (let stage = 1; stage <= 6; stage++) {
      const { errors, fieldErrors } = validateStage(stage);
      allErrors.push(...errors);
      Object.assign(allFieldErrors, fieldErrors);
    }
    return { valid: allErrors.length === 0, errors: allErrors, fieldErrors: allFieldErrors };
  }, [validateStage]);

  return {
    formData,
    currentStage,
    updateField,
    updateMultipleFields,
    goToStage,
    nextStage,
    prevStage,
    reset,
    submitTournament,
    submitState,
    validateStage,
    validateAll,
  };
}
