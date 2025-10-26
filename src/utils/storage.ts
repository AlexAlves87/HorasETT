// src/utils/storage.ts

const KEYS = {
  CONFIG: 'horasett_config',
  REGISTROS: 'horasett_registros'
};

// ===== TIPOS =====

export type UILanguage = 'es' | 'en';

export interface Config {
  horaNormal: number;
  horaExtra: number;
  horaNocturna: number;
  horaFestiva: number;
  irpf: number;
  ss: number;

  // Preferencias de idioma
  language?: UILanguage;      // 'es' por defecto
  autoEnglish?: boolean;      // si true y el navegador no es ES, forzar EN
}

// ===== CONFIG POR DEFECTO =====

const DEFAULT_CONFIG: Config = {
  horaNormal: 10.50,
  horaExtra: 15.75,
  horaNocturna: 13.13,
  horaFestiva: 18.38,
  irpf: 15,
  ss: 8.30,

  // nuevos defaults
  language: 'es',
  autoEnglish: true,
};

// ===== HELPERS INTERNOS =====

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}

function mergeWithDefaults(partial: Partial<Config> | null): Config {
  return { ...DEFAULT_CONFIG, ...(partial ?? {}) };
}

function emitConfigUpdated() {
  // Notifica cambios dentro de la misma pestaña/app
  window.dispatchEvent(new Event('configUpdated'));
}

// ===== FUNCIONES PÚBLICAS =====

export function getConfig(): Config {
  const stored = safeParse<Partial<Config>>(localStorage.getItem(KEYS.CONFIG));
  return mergeWithDefaults(stored);
}

export function saveConfig(config: Config): void {
  // guarda siempre merged para mantener futuros defaults
  const merged = mergeWithDefaults(config);
  localStorage.setItem(KEYS.CONFIG, JSON.stringify(merged));
  emitConfigUpdated();
}

/** Actualiza parcialmente la config sin tener que reconstruir todo el objeto */
export function updateConfig(patch: Partial<Config>): Config {
  const merged = { ...getConfig(), ...patch };
  localStorage.setItem(KEYS.CONFIG, JSON.stringify(merged));
  emitConfigUpdated();
  return merged;
}

export function resetConfig(): void {
  localStorage.setItem(KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
  emitConfigUpdated();
}

// ===== API cómoda para idioma (para Preferencias) =====

export function getLanguage(): UILanguage {
  const cfg = getConfig();
  // si autoEnglish está activo y el navegador no es ES, forzar EN
  const navIsEs = navigator.language?.toLowerCase().startsWith('es');
  if (cfg.autoEnglish && !navIsEs) return 'en';
  return (cfg.language ?? 'es');
}

export function setLanguage(lang: UILanguage): void {
  updateConfig({ language: lang });
  // opcional: reflejar en <html lang="">
  document.documentElement.lang = lang;
}

export function toggleAutoEnglish(on: boolean): void {
  const next = updateConfig({ autoEnglish: on });
  const navIsEs = navigator.language?.toLowerCase().startsWith('es');
  if (next.autoEnglish && !navIsEs) {
    document.documentElement.lang = 'en';
  } else {
    document.documentElement.lang = next.language ?? 'es';
  }
}
