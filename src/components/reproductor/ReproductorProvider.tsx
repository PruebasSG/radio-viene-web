"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { STREAM_URL } from "@/config/emisora";
import { radio } from "@/content/radio";
import type { AhoraSuena } from "@/lib/ahora-suena";

export type EstadoReproductor = "detenido" | "conectando" | "sonando" | "error";

type Reproductor = {
  estado: EstadoReproductor;
  ahoraSuena: AhoraSuena | null;
  /** El oyente ya pulsó "Escuchar" al menos una vez en esta visita. */
  usado: boolean;
  alternar: () => void;
};

const ReproductorContext = createContext<Reproductor | null>(null);

/** Esperas entre reintentos si se corta la señal: 2 s, 5 s y 10 s. */
const REINTENTOS_MS = [2000, 5000, 10000];
const CONSULTA_MS = 20_000;

/**
 * Reproductor único de la web. Vive en el layout, por eso la radio sigue
 * sonando aunque el oyente navegue entre páginas.
 */
export function ReproductorProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const quiereSonar = useRef(false);
  const intentos = useRef(0);
  const reintento = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [estado, setEstado] = useState<EstadoReproductor>("detenido");
  const [usado, setUsado] = useState(false);
  const [ahoraSuena, setAhoraSuena] = useState<AhoraSuena | null>(null);

  const conectar = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setEstado("conectando");
    // Pedimos la señal desde cero para escuchar el directo y no un trozo guardado.
    audio.src = `${STREAM_URL}?t=${Date.now()}`;
    audio.play().catch(() => {
      // El navegador puede bloquear el audio; el evento "error" decide si reintentar.
    });
  }, []);

  const detener = useCallback(() => {
    quiereSonar.current = false;
    clearTimeout(reintento.current);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    setEstado("detenido");
  }, []);

  const reproducir = useCallback(() => {
    quiereSonar.current = true;
    intentos.current = 0;
    setUsado(true);
    conectar();
  }, [conectar]);

  const alternar = useCallback(() => {
    if (quiereSonar.current) detener();
    else reproducir();
  }, [detener, reproducir]);

  // Crea el elemento de audio y escucha sus cambios.
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audioRef.current = audio;

    const alSonar = () => {
      intentos.current = 0;
      setEstado("sonando");
    };
    const alEsperar = () => {
      if (quiereSonar.current) setEstado("conectando");
    };
    const alFallar = () => {
      if (!quiereSonar.current) return;
      const espera = REINTENTOS_MS[intentos.current];
      if (espera === undefined) {
        quiereSonar.current = false;
        setEstado("error");
        return;
      }
      intentos.current += 1;
      setEstado("conectando");
      reintento.current = setTimeout(conectar, espera);
    };

    audio.addEventListener("playing", alSonar);
    audio.addEventListener("waiting", alEsperar);
    audio.addEventListener("error", alFallar);
    audio.addEventListener("ended", alFallar);

    return () => {
      clearTimeout(reintento.current);
      audio.pause();
      audio.removeEventListener("playing", alSonar);
      audio.removeEventListener("waiting", alEsperar);
      audio.removeEventListener("error", alFallar);
      audio.removeEventListener("ended", alFallar);
      audioRef.current = null;
    };
  }, [conectar]);

  // Consulta "ahora suena" cada 20 segundos mientras la pestaña está visible.
  useEffect(() => {
    let activo = true;

    const consultar = async () => {
      if (document.visibilityState === "hidden") return;
      try {
        const respuesta = await fetch("/api/ahora", { cache: "no-store" });
        if (!respuesta.ok) return;
        const datos = (await respuesta.json()) as AhoraSuena;
        if (activo) setAhoraSuena(datos);
      } catch {
        // Sin conexión: mantenemos el último dato conocido.
      }
    };

    consultar();
    const intervalo = setInterval(consultar, CONSULTA_MS);
    document.addEventListener("visibilitychange", consultar);
    return () => {
      activo = false;
      clearInterval(intervalo);
      document.removeEventListener("visibilitychange", consultar);
    };
  }, []);

  // Controles de la pantalla de bloqueo del móvil y de los auriculares.
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const sesion = navigator.mediaSession;
    const cancion = ahoraSuena?.cancion;

    sesion.metadata = new MediaMetadata({
      title: cancion ? cancion.titulo : `${radio.nombre} en vivo`,
      artist: cancion?.artista ?? `${radio.nombre} ${radio.frecuencia} ${radio.banda}`,
      album: `${radio.nombre} ${radio.frecuencia} ${radio.banda}`,
      artwork: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
    });
    sesion.setActionHandler("play", reproducir);
    sesion.setActionHandler("pause", detener);
    sesion.setActionHandler("stop", detener);
  }, [ahoraSuena, reproducir, detener]);

  const valor = useMemo(
    () => ({ estado, ahoraSuena, usado, alternar }),
    [estado, ahoraSuena, usado, alternar],
  );

  return <ReproductorContext.Provider value={valor}>{children}</ReproductorContext.Provider>;
}

export function useReproductor(): Reproductor {
  const contexto = useContext(ReproductorContext);
  if (!contexto) throw new Error("useReproductor debe usarse dentro de <ReproductorProvider>");
  return contexto;
}
